---
title: "Payment confirmation starts at the provider"
description: "A screenshot can help find a payment; it cannot verify one."
pubDate: 2026-10-15
minutes: 2
---

Tie each payment attempt to a unique order reference. Check the provider’s signed event and transaction record, expected amount, currency and receiving merchant before marking the order paid.

Two customers can owe the same amount. The person who transfers can have a different name from the buyer. Names and amounts alone are weak matching keys.

Keep partial payments, overpayments and unmatched funds in a review workflow. A delayed receipt job should not make a successful payment disappear.
