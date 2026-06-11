# Task 4+5 — ChatPage & DashboardPage Production Refinement

## Agent
ChatPage & DashboardPage Production Refinement Agent

## Task
Refine ChatPage, DashboardPage, ChatView, MessageBubble, SearchInput, FollowUpQuestions, SourceCard to production grade quality.

## Files Modified
1. `/home/z/my-project/src/components/app/ChatPage.tsx` — 949→948 lines
2. `/home/z/my-project/src/components/app/DashboardPage.tsx` — 516→521 lines
3. `/home/z/my-project/src/components/ChatView.tsx` — 254→238 lines
4. `/home/z/my-project/src/components/MessageBubble.tsx` — 202→261 lines
5. `/home/z/my-project/src/components/SearchInput.tsx` — 183→120 lines
6. `/home/z/my-project/src/components/FollowUpQuestions.tsx` — 47→67 lines
7. `/home/z/my-project/src/components/SourceCard.tsx` — 65→80 lines

## Key Changes

### Consistency
- All 7 components now consistently use `handleSearch`/`handleFollowUp` from `@/lib/search-handler` — eliminated 3 duplicate SSE streaming implementations (~200 lines of duplicate code removed)

### ChatPage.tsx
- Fixed dual textarea ref: `emptyTextareaRef` + `bottomTextareaRef`
- Smooth auto-scroll via `scrollIntoView` with `bottomRef` scroll anchor
- Touch scroll support for source cards on mobile
- Hover effects on suggestion cards
- Improved follow-up hover states

### DashboardPage.tsx
- Search bar focus state (border → var(--ink))
- Keyboard shortcut hint
- Conversation card hover effects
- Trending topics with icons
- Responsive usage stats bar

### ChatView.tsx
- Uses shared `handleFollowUp` from search-handler (removed ~70 lines of duplicate code)
- Proper bouncing dots loading indicator
- Smooth auto-scroll with scroll anchor
- Source cards with hover effects and touch scroll
- Follow-ups in `feature-card-bordered` container

### MessageBubble.tsx
- Added `processCitations` for clickable [1], [2] citations
- Full markdown components matching ChatPage (citation chips, code blocks, tables)
- StreamingCursor and LoadingDots components with design system colors
- Inline citation chips below content
- Consistent user message styling

### SearchInput.tsx
- Uses `handleSearch`/`handleFollowUp` from search-handler (removed ~80 lines of duplicate SSE code)
- Changed to `<textarea>` for multi-line support
- Auto-resize with 120px max height
- Shift+Enter for newline
- Proper border using `var(--hairline-strong)`

### FollowUpQuestions.tsx
- Removed CSS `!important` overrides
- Proper hover effects via inline style manipulation
- Limited to 3 questions
- Uppercase "Follow up" label matching ChatPage

### SourceCard.tsx
- Hover effects on cards
- Touch scroll support
- Uppercase "Sources" label
- Snippet text with proper colors

## Verification
- ESLint: 0 errors
- Dev server: compiles successfully
- All components use consistent Resend design system
