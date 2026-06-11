import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/sdk
 *
 * Serves the Nexus AI SDK JavaScript file for download.
 * Sets proper Content-Type, Content-Disposition, and CORS headers.
 */
export async function GET() {
  try {
    const sdkPath = join(process.cwd(), 'public', 'sdk', 'nexus-ai.js')
    const fileBuffer = await readFile(sdkPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexus-ai.js"',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Failed to serve SDK file:', error)
    return NextResponse.json(
      { error: 'SDK file not found' },
      { status: 404 }
    )
  }
}

/**
 * OPTIONS /api/sdk
 *
 * Handles CORS preflight requests.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
