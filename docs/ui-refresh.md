# Kora Desk creative refresh

## Visual thesis

A playful, capable shop companion: preserve the original white canvas, Nunito
headlines, colourful dimensional agent artwork, crossed-out paperwork, tilted
cards, and moving benefit strips. The signature interaction is a WhatsApp conversation: a shop owner sends a
message, Kora types a reply, drafts the paperwork, and asks for approval in chat.

The original Astro/Tailwind architecture, routes, contact configuration, pricing
amounts, and static WhatsApp handoff remain. The original brand artwork is reused
rather than replaced with a second icon language. No renderer or motion library
was added.

## What changes for visitors

- The original expressive homepage leads again. A primary free-pilot action and
  a demo shortcut now sit directly below its explanation.
- Benefit strips have a pause/resume button. They stop off screen, when the tab
  is hidden, on page exit, and under reduced motion.
- The phone demo plays a chronological conversation. Incoming/outgoing bubbles,
  voice-note transcription, typing indicators, timestamps, read ticks, invoice
  previews, and in-chat approval replies communicate the product in its actual
  WhatsApp context. The voice example is explicitly silent; its transcript has
  an accessible expand/collapse control. No audio playback is implied.
- Play/pause/resume, replay, agent switching, and previous/next message controls
  remain outside the handset. Orders and stock pause for suggested or typed
  approvals. The composer is enabled only when a reply is expected. Sample
  replies are validated locally; no external message or bank operation occurs.
- The handset uses familiar WhatsApp colours and message grouping, original
  agent artwork, readable chat text, and a fixed-height keyboard-scrollable
  history. Results are messages within the conversation, rather than external
  cards or completion stamps.
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
- Playback advances a single cancellable timer per conversation: 1,550ms before
  Kora replies and 1,050ms for scripted owner messages. Typing dots appear only
  while a Kora reply is pending. Owner ticks become read when Kora answers.
- Message bubbles enter with a 220ms opacity/7px translation. Under reduced
  motion, effects/timed waits are skipped while the same approval gates remain.
- Reset, replay, pause, agent change, manual stepping, and page exit cancel the
  pending timer. Visibility and off-screen changes pause rather than advancing
  the conversation. No audio or background render loop is used.
- Approval replies stay in the chat. Focus returns from the reply area to the
  playback control once a reply is accepted; hidden reply controls leave tab order.

## Verification and limits

`npm test` builds 41 routes and runs fifteen checks against built HTML/scripts
in jsdom. A virtual clock verifies actual message timing, typing state, approval
gates, timer cancellation on pause/replay/agent change, and background suspension.
Other checks cover typed replies/focus, transcripts, reduced motion, instance
isolation, manual stepping, billing, pilot forms, navigation, and route integrity.
DOM simulation does not verify rendered bounds.

Measured text/control colour pairs were checked with the creative-ui contrast
utility. The active tab now has a dark-green border/underline instead of the
previous 1.73:1 pastel border. Conversation text is 14px and metadata is 12px at the default root size.
The chat text, bubbles, ticks, header, input borders, and disabled send control
were checked against their actual fixed palette backgrounds.

At 360px the phone section has a 328px container; phone padding and border leave
room for four equal agent buttons. Receipt rows wrap rather than clip. Actual
rendered widths, screenshots, browser keyboard traversal, dark-theme appearance,
and performance still need visual verification. No numerical visual score is
claimed. The private hosted preview showed a sign-in wall in the review browser.

Before release, check 360/768/1280 and wide desktop, either side of the responsive
breakpoints, reduced motion, all agent stages, annual billing reversal, and the
WhatsApp draft handoff. Product capability claims and contact details are
inherited from the repository and remain the owner's factual source of truth.
