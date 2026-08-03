# Claude Code Writeup

## What I delegated vs. what I wrote myself

I owned the architectural and product direction throughout:

- **Architecture**: offset-based pagination over cursor-based, LIKE-based search, React Query for
  data state, react-hook-form + Zod for forms, Zustand for UI state.
- **API contract**: endpoint shapes, error codes (400/404/409/500), request/response formats, sort
  parameter design.
- **UX decisions**: responsive table on desktop / cards on mobile, sort tiebreaker rules, focus
  management defaults, the shared modal reuse pattern, the delete confirmation flow.
- **Verification methodology**: a full UX audit, a keyboard-only testing pass, and production
  build verification before every major milestone.
- **Refinement direction**: the mobile card overflow bug, phone column sizing, same-last-name sort
  ordering, adding Registered Date sortability.

Claude Code implemented against that direction — the TypeScript, the Tailwind styling, and the
Playwright verification scripts. I reviewed every diff before it moved forward and made the calls
on tradeoffs as they came up.

## Where Claude Code led me wrong

The recurring pattern: Claude reported "verified, all clean," but the work was incomplete or the
fix missed the actual problem.

1. **Mobile card overflow with long emails.** Claude marked the mobile view complete without
   testing against realistic long email addresses; they broke the layout and pushed Edit/Delete
   outside the card boundary.
2. **Phone number fix solved the wrong problem.** I asked for phone numbers to stop wrapping to
   two lines. Claude's first pass added ellipsis truncation — it cut off information users needed,
   wasn't hoverable to reveal the full number, and applied inconsistently across rows. I pushed
   back and asked for the real fix: widen the column so full numbers always fit.
3. **Tied last names sorted arbitrarily.** "Virginia Abbott" appeared before "Drew Abbott" — sort
   order was technically correct with `id` as the tiebreaker, but that's not how users scan a
   contact list. I asked for `first_name` as the secondary sort within tied last names.
4. **Registered Date wasn't sortable.** The user story called for sorting by column, but only
   First Name, Last Name, and Email were wired up. I flagged the gap and had it added.

Playwright verification passed in every case above — the tests just weren't checking the right
thing. My role was catching what automated verification couldn't: realistic edge cases, visual
polish, and situations where Claude fixed the reported symptom rather than the actual user problem.
