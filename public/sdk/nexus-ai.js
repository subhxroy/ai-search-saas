/**
 * Nexus AI Search SDK
 * 
 * AI-powered search with real-time citations.
 * Built for Indian users — understands INR, lakhs, and Indian context.
 * 
 * @example
 * const nexus = new NexusAI({ apiKey: 'your-api-key' });
 * const response = await nexus.search({
 *   query: "Best headphones under 1k",
 *   deepResearch: false,
 * });
 * console.log(response.answer);
 * console.log(response.sources);
 * 
 * @example
 * // Using with a custom base URL (Node.js or self-hosted)
 * const nexus = new NexusAI({
 *   baseUrl: 'https://your-instance.com',
 *   apiKey: 'your-api-key',
 * });
 * const response = await nexus.search({
 *   query: "Best AI startups 2026",
 *   deepResearch: false,
 * });
 * console.log(response.answer);
 * // → "The AI SaaS landscape in 2026 is defined
 * //    by several high-impact opportunities..."
 * 
 * console.log(response.sources);
 * // → [
 * //     { title: "Top AI SaaS Trends 2026",
 * //       url: "techcrunch.com/ai-saas-trends",
 * //       relevance: 0.94 },
 * //     { title: "Autonomous AI Agents",
 * //       url: "forbes.com/ai-agents-enterprise",
 * //       relevance: 0.91 },
 * //     ...6 more
 * //   ]
 * 
 * @license MIT
 * @version 1.0.0
 */

/* ================================================================== */
/*  Type Definitions (JSDoc)                                           */
/* ================================================================== */

/**
 * Configuration options for the NexusAI client.
 * 
 * @typedef {Object} NexusAIOptions
 * @property {string} [baseUrl] - The base URL of the Nexus AI API server.
 *   Defaults to `window.location.origin` in browsers, or
 *   `https://api.nexusai.dev` in Node.js environments.
 * @property {string} [apiKey] - Optional API key for Pro/Enterprise access.
 *   Currently not required; reserved for future use.
 */

/**
 * Options for a search request.
 * 
 * @typedef {Object} SearchOptions
 * @property {string} query - The search query string.
 * @property {boolean} [deepResearch=false] - Enable deep research mode for
 *   more comprehensive, academic-style answers with additional sources.
 */

/**
 * A cited source returned in the search response.
 * 
 * @typedef {Object} Source
 * @property {string} title - The title of the source page.
 * @property {string} url - The URL of the source page.
 * @property {string} snippet - A brief snippet or excerpt from the source.
 * @property {number} relevance - Relevance score from 0 to 1, where 1 is
 *   most relevant to the query.
 */

/**
 * The response from a search request.
 * 
 * @typedef {Object} SearchResponse
 * @property {string} answer - The AI-generated answer with inline citations
 *   in [1], [2] format referencing the sources array.
 * @property {Source[]} sources - An array of cited sources with relevance
 *   scores.
 * @property {string[]} followUps - Suggested follow-up questions for
 *   continued research.
 * @property {string} conversationId - A unique conversation ID that can be
 *   used for follow-up queries in the same context.
 * @property {string} query - The original search query that was submitted.
 */

/**
 * Error codes returned by the Nexus AI API.
 * 
 * @typedef {string} NexusAIErrorCode
 * Possible values:
 *   - `'MISSING_QUERY'` — No query was provided.
 *   - `'INVALID_BODY'` — The request body could not be parsed.
 *   - `'LLM_ERROR'` — The AI service is temporarily unavailable.
 *   - `'EMPTY_RESPONSE'` — The AI failed to generate a response.
 *   - `'NETWORK_ERROR'` — A network error occurred (client-side).
 *   - `'TIMEOUT'` — The request timed out.
 *   - `'INTERNAL_ERROR'` — An unexpected server error occurred.
 */

/* ================================================================== */
/*  Custom Error Class                                                 */
/* ================================================================== */

/**
 * Custom error class for Nexus AI SDK errors.
 * 
 * Provides structured error information with a machine-readable code
 * and the HTTP status code from the API response.
 * 
 * @example
 * try {
 *   await nexus.search({ query: '' });
 * } catch (err) {
 *   if (err instanceof NexusAIError) {
 *     console.error(err.code);    // 'MISSING_QUERY'
 *     console.error(err.status);  // 400
 *     console.error(err.message); // 'Query is required'
 *   }
 * }
 */
class NexusAIError extends Error {
  /**
   * Create a new NexusAIError.
   * 
   * @param {string} message - A human-readable error message.
   * @param {NexusAIErrorCode} code - A machine-readable error code.
   * @param {number} [status=0] - The HTTP status code from the API response,
   *   or 0 for client-side errors (network, timeout).
   */
  constructor(message, code, status) {
    super(message);
    /** @type {string} */
    this.name = 'NexusAIError';
    /** @type {NexusAIErrorCode} */
    this.code = code;
    /** @type {number} */
    this.status = status || 0;
  }
}

/* ================================================================== */
/*  NexusAI Client Class                                               */
/* ================================================================== */

/**
 * Nexus AI Search Client.
 * 
 * Provides a simple interface to the Nexus AI search API with real-time
 * citations and Indian-context awareness (INR, lakhs, crores).
 * 
 * Works in both browsers and Node.js environments. In browsers, the
 * default base URL is the current page origin. In Node.js, you must
 * provide a `baseUrl` or it will default to `https://api.nexusai.dev`.
 * 
 * @example
 * // Browser (auto-detects origin)
 * const nexus = new NexusAI();
 * 
 * @example
 * // Node.js (specify base URL)
 * const { NexusAI } = require('nexus-ai');
 * const nexus = new NexusAI({
 *   baseUrl: 'https://your-instance.com',
 *   apiKey: 'nxai_sk_...',
 * });
 * 
 * @example
 * // ESM import
 * import { NexusAI } from 'nexus-ai';
 * const nexus = new NexusAI();
 */
class NexusAI {
  /**
   * Create a new NexusAI client instance.
   * 
   * @param {NexusAIOptions} [options={}] - Configuration options.
   */
  constructor(options) {
    options = options || {};

    /**
     * The base URL of the Nexus AI API server.
     * 
     * All API requests will be made relative to this URL.
     * Defaults to `window.location.origin` in browsers,
     * or `https://api.nexusai.dev` in Node.js.
     * 
     * @type {string}
     */
    this.baseUrl = options.baseUrl || (
      typeof window !== 'undefined' && window.location && window.location.origin
        ? window.location.origin
        : 'https://api.nexusai.dev'
    );

    /**
     * Optional API key for Pro/Enterprise access.
     * Currently not required; reserved for future use.
     * 
     * @type {string|null}
     */
    this.apiKey = options.apiKey || null;

    /**
     * Default request timeout in milliseconds.
     * Can be overridden per-request via search options.
     * 
     * @type {number}
     * @default 60000
     */
    this.timeout = options.timeout || 60000;
  }

  /**
   * Perform an AI-powered search with real-time citations.
   * 
   * Sends a search query to the Nexus AI API and returns a structured
   * response with an AI-generated answer, cited sources, and suggested
   * follow-up questions.
   * 
   * The API understands Indian context — queries like "best headphones
   * under 1k" are automatically interpreted with INR pricing.
   * 
   * @param {SearchOptions} options - Search options.
   * @param {string} options.query - The search query string.
   * @param {boolean} [options.deepResearch=false] - Enable deep research
   *   mode for more comprehensive, academic-style answers.
   * @returns {Promise<SearchResponse>} A promise that resolves to the
   *   search response with answer, sources, and follow-ups.
   * 
   * @throws {NexusAIError} If the request fails due to network issues,
   *   invalid input, or server errors.
   * 
   * @example
   * const response = await nexus.search({
   *   query: "Best AI startups 2026",
   *   deepResearch: false,
   * });
   * 
   * console.log(response.answer);
   * // → "The AI SaaS landscape in 2026 is defined
   * //    by several high-impact opportunities..."
   * 
   * console.log(response.sources);
   * // → [
   * //     { title: "Top AI SaaS Trends 2026",
   * //       url: "techcrunch.com/ai-saas-trends",
   * //       snippet: "The AI SaaS market...",
   * //       relevance: 0.94 },
   * //     { title: "Autonomous AI Agents",
   * //       url: "forbes.com/ai-agents-enterprise",
   * //       snippet: "Enterprise adoption...",
   * //       relevance: 0.91 },
   * //     ...6 more
   * //   ]
   * 
   * console.log(response.followUps);
   * // → [
   * //     "What are the top AI startups by funding in 2026?",
   * //     "How is AI regulation affecting startups?",
   * //     "Which industries see the most AI startup activity?"
   * //   ]
   * 
   * console.log(response.conversationId);
   * // → "cm3x8k2j10000..."
   */
  async search(options) {
    if (!options || !options.query || typeof options.query !== 'string' || options.query.trim().length === 0) {
      throw new NexusAIError(
        'Query is required and must be a non-empty string.',
        'MISSING_QUERY',
        400
      );
    }

    var query = options.query.trim();
    var deepResearch = options.deepResearch === true;
    var url = this.baseUrl + '/api/search';
    var body = {
      query: query,
      deepResearch: deepResearch,
    };

    // Add API key if configured
    if (this.apiKey) {
      body.apiKey = this.apiKey;
    }

    // Build fetch options
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    // Add Authorization header if API key is set
    if (this.apiKey) {
      fetchOptions.headers['Authorization'] = 'Bearer ' + this.apiKey;
      fetchOptions.headers['X-API-Key'] = this.apiKey;
    }

    // Execute request with timeout
    var response;
    try {
      response = await this._fetchWithTimeout(url, fetchOptions, this.timeout);
    } catch (err) {
      // Distinguish timeout from other network errors
      if (err && err.name === 'AbortError') {
        throw new NexusAIError(
          'Request timed out after ' + this.timeout + 'ms. Try again or increase the timeout.',
          'TIMEOUT',
          0
        );
      }
      throw new NexusAIError(
        'Network error: ' + (err && err.message ? err.message : String(err)),
        'NETWORK_ERROR',
        0
      );
    }

    // Parse the response
    var data;
    try {
      data = await response.json();
    } catch (parseErr) {
      throw new NexusAIError(
        'Failed to parse API response as JSON.',
        'NETWORK_ERROR',
        response.status
      );
    }

    // Handle error responses
    if (!response.ok) {
      var errorCode = (data && data.code) || 'INTERNAL_ERROR';
      var errorMessage = (data && data.error) || 'An unexpected error occurred.';
      throw new NexusAIError(errorMessage, errorCode, response.status);
    }

    // Validate and return the response
    return /** @type {SearchResponse} */ (data);
  }

  /**
   * Internal helper: execute a fetch request with a timeout.
   * 
   * Uses AbortController to cancel the request if it exceeds the
   * specified timeout duration.
   * 
   * @param {string} url - The URL to fetch.
   * @param {RequestInit} options - Fetch options.
   * @param {number} timeoutMs - Timeout in milliseconds.
   * @returns {Promise<Response>} The fetch response.
   * @private
   */
  async _fetchWithTimeout(url, options, timeoutMs) {
    var controller;
    var timeoutId;

    // Use AbortController if available (all modern browsers + Node 15+)
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(function () {
        controller.abort();
      }, timeoutMs);
      options = Object.assign({}, options, { signal: controller.signal });
    }

    try {
      var fetchFn = NexusAI._getFetch();
      var response = await fetchFn(url, options);
      return response;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Internal helper: get the fetch function to use.
   * 
   * Resolves the global `fetch` in browsers and modern Node.js,
   * or throws if fetch is not available.
   * 
   * @returns {Function} The fetch function.
   * @private
   * @static
   */
  static _getFetch() {
    // Browser or Node 18+ global fetch
    if (typeof fetch !== 'undefined') {
      return fetch;
    }

    // If somehow fetch is not available, throw a helpful error
    throw new NexusAIError(
      'No fetch implementation found. The Nexus AI SDK requires a fetch-compatible environment ' +
      '(modern browsers, Node.js 18+, or a global fetch polyfill).',
      'NETWORK_ERROR',
      0
    );
  }
}

/* ================================================================== */
/*  Exports                                                            */
/* ================================================================== */

// ESM export support
if (typeof exports !== 'undefined') {
  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NexusAI, NexusAIError };
  }
}

// Also support ES module default export via a global
// In browsers, both NexusAI and NexusAIError are available as globals
// when loaded via <script> tag.
if (typeof window !== 'undefined') {
  window.NexusAI = NexusAI;
  window.NexusAIError = NexusAIError;
}
