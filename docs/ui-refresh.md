# Kora Desk creative refresh

## Visual thesis

A playful, capable shop companion: preserve the original white canvas, Nunito
headlines, colourful dimensional agent artwork, crossed-out paperwork, tilted
cards, and moving benefit strips. The signature interaction turns a WhatsApp
message into an organised draft and an owner-controlled result.

The original Astro/Tailwind architecture, routes, contact configuration, pricing
amounts, and static WhatsApp handoff remain. The original brand artwork is reused
rather than replaced with a second icon language. No renderer or motion library
was added.

## What changes for visitors

- The original expressive homepage leads again. A primary free-pilot action and
  a demo shortcut now sit directly below its explanation.
- Benefit strips have a pause/resume button. They stop off screen, when the tab
  is hidden, on page exit, and under reduced motion.
- The phone demo has three explicit, reversible stages for each agent: message,
  draft, result. The receipt is hidden until requested. No real message, order,
  supplier action, bank connection, or money movement occurs.
- The handset has restrained CSS depth that settles on hover/keyboard focus,
  familiar WhatsApp colours, original agent artwork, and larger text. SVG path
  reveals explain the progression; the completion stamp is tied to completion.
- Annual pricing shows the actual yearly charge and the monthly equivalent.
  The time-value calculator follows billing selection. Its unused inputs and
  misleading recurring-cost payback output were removed.
- Pilot errors are associated with fields, focus moves to the first error, and
  tab storage failure is visible. The review page describes an unsent draft and
  asks the visitor to send it in WhatsApp.
- Mobile navigation closes on Escape with focus return. Cookie choice remains
  a non-modal region. Contrast and shared button typography fixes are retained.

## Motion contract

- Crossing out paperwork: a 450ms SVG stroke reveal on entry; final static line
  under reduced motion; no action waits for the reveal.
- Benefit strips: 48s/60s linear loops, visible only while on screen; user pause
  and hover pause, document visibility and reduced-motion changes supported.
  Intersection/media/visibility listeners stop on page exit.
- Message to receipt: a 280ms opacity/7px translation and 300ms connector reveal
  on user selection. No timer or idle rendering is needed. Switching agent or
  returning to a prior stage immediately replaces the old state.
- Result: a 250ms check-stroke reveal and static approval stamp. Always resettable.
- Handset: 250ms CSS depth transition on hover/focus within a stationary wrapper.
  Flat on mobile and under reduced motion; native scrolling remains intact.

## Verification and limits

`npm test` builds 41 routes and runs ten checks against built HTML/scripts in
jsdom: four-agent progression/reset, instance isolation, annual billing and
calculator reversal, pilot validation, tab storage failure, safe draft review,
navigation/theme/cookie controls, route/label/ID integrity, and ticker pause and
reduced-motion handling. DOM simulation does not verify rendered bounds.

Measured text/control colour pairs were checked with the creative-ui contrast
utility. The active tab now has a dark-green border/underline instead of the
previous 1.73:1 pastel border. Important sample text was enlarged; device labels
are 12px and message text is 14.4px at the default root size.

At 360px the phone section has a 328px container; phone padding and border leave
room for four equal agent buttons. Receipt rows wrap rather than clip. Actual
rendered widths, screenshots, browser keyboard traversal, dark-theme appearance,
and performance still need visual verification. No numerical visual score is
claimed. The private hosted preview showed a sign-in wall in the review browser.

Before release, check 360/768/1280 and wide desktop, either side of the responsive
breakpoints, reduced motion, all agent stages, annual billing reversal, and the
WhatsApp draft handoff. Product capability claims and contact details are
inherited from the repository and remain the owner's factual source of truth.
