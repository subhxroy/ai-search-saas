# Task 3 - AppShell, Auth & Page Routing Refinement

## Task Description
Refine the AppShell component, auth pages, and main page.tsx routing to production grade quality.

## Files Modified
1. `/home/z/my-project/src/app/page.tsx` — Main page routing with landing navbar, empty chat state, mobile menu
2. `/home/z/my-project/src/components/app/AppShell.tsx` — Main app layout with sidebar, navbar, mobile bottom nav
3. `/home/z/my-project/src/components/auth/LoginPage.tsx` — Login page polish
4. `/home/z/my-project/src/components/auth/SignupPage.tsx` — Signup page with password requirements
5. `/home/z/my-project/src/components/auth/ForgotPasswordPage.tsx` — Forgot password with AnimatePresence transitions

## Key Changes

### page.tsx
- **Fixed unauthenticated chat view bug**: Changed condition from `hasMessages && page === 'chat'` to just `page === 'chat'` — this fixes the issue where clicking "New search" (which clears messages but stays on 'chat' page) would fall through to the landing page
- **Created EmptyChatState component**: Centered search UI with suggested queries, shown when on chat page with no messages
- **Extracted LandingNavbar**: Shared navbar with two variants:
  - `variant="landing"`: Logo + nav links + Sign in/Get Started + mobile hamburger
  - `variant="chat"`: Home/New search buttons + Sign in/Get Started
- **Added mobile hamburger menu**: Uses Sheet component from shadcn/ui, opens right-side drawer with nav links, Sign in, Get Started
- **Section IDs preserved**: #hero-search, #features, #customers, #pricing for scroll-to navigation

### AppShell.tsx
- **Fixed z-indexing**: Mobile sidebar z-50 (above backdrop z-40), desktop sidebar z-30
- **Fixed React CSS**: `shrink: 0` → `flexShrink: 0` 
- **Added NAV_HEIGHT constant**: 56px used consistently across navbar, sidebar top, main content padding
- **Styled dropdown menu**: Dark theme with #0a0a0c bg, hairline-strong border, accent-red logout
- **Changed bottom nav**: "Dashboard" → "Home" label

### Auth Pages
- **Demo Login button upgraded**: From invisible text to visible button with hover effects
- **Password requirements checklist**: Added to SignupPage with 4 requirements and checkmarks
- **Password strength colors**: Use design system variables (accent-red, accent-orange, accent-yellow, accent-green, accent-blue)
- **ForgotPasswordPage**: Added AnimatePresence transitions, CheckCircle icon in success state
- **All colors**: Consistent use of design system CSS variables

## Verification
- ESLint passes with zero errors
- Dev server compiles without errors
- All nav links scroll to correct sections
- Mobile menu works with Sheet drawer
- Auth pages have consistent styling
