export const site = {
  name: "Kora Desk",
  tagline: "Your shop, organized from WhatsApp.",
  description:
    "Kora Desk gives small businesses in Africa a team of AI agents that run their back office on WhatsApp: orders, payments, stock, and invoices, with a human approving anything that moves money.",
  url: "https://koradesk.com",
  email: "hello@koradesk.com",
  supportEmail: "support@koradesk.com",
  whatsappE164: "2348005672000",
  whatsappDisplay: "+234 800 567 2000",
  address: "12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
  hours: "Monday to Saturday, 8:00–18:00 WAT",
  founderCity: "Lagos",
};

export const nav = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who it's for" },
  { href: "/pricing", label: "Pricing" },
  { href: "/customers", label: "Customers" },
  { href: "/trust", label: "Trust" },
];

export const agents = [
  {
    slug: "orders",
    name: "Orders",
    job: "Reads text, voice notes, and photos of handwritten lists; builds the order; confirms with the customer.",
    checkpoint: "You approve orders above a set value.",
    href: "/product/orders",
  },
  {
    slug: "payments",
    name: "Payments",
    job: "Matches bank alerts and transfer screenshots to open invoices; sends polite reminders.",
    checkpoint: "You approve any refund or write-off.",
    href: "/product/payments",
  },
  {
    slug: "stock",
    name: "Stock",
    job: "Updates counts from sales and supplier deliveries; flags low stock and odd variances.",
    checkpoint: "You approve reorder drafts.",
    href: "/product/stock",
  },
  {
    slug: "books",
    name: "Books",
    job: "Produces daily sales summaries, simple P&L, and tax-ready exports.",
    checkpoint: "Your accountant reviews before filing.",
    href: "/product/books",
  },
];

export const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 15000,
    annual: 150000,
    blurb: "For a single shop that needs orders and payments under control.",
    includes: [
      "Orders + Payments agents",
      "1 WhatsApp number",
      "300 conversations / month",
      "14-day free pilot",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 45000,
    annual: 450000,
    featured: true,
    blurb: "All four agents for shops that also need stock and books.",
    includes: [
      "All four agents",
      "3 WhatsApp numbers",
      "1,200 conversations / month",
      "Integrations and accountant sharing",
    ],
  },
  {
    id: "partner",
    name: "Partner",
    monthly: 8000,
    annual: 80000,
    perClient: true,
    blurb: "For accountants who look after many small clients.",
    includes: [
      "Multi-client dashboard",
      "Volume pricing",
      "Tax-ready exports",
      "Named support person",
    ],
  },
];

export const faqs = [
  {
    q: "Do I need to change how customers reach me?",
    a: "No. Customers keep chatting on WhatsApp. You connect the number you already use. The agent reads incoming messages and drafts the paperwork. You stay in the conversation.",
  },
  {
    q: "Can the agent send money or issue refunds on its own?",
    a: "No. Anything that moves money waits for your approval. You set thresholds for large orders. Refunds and write-offs always need a tap from you.",
  },
  {
    q: "What if the agent gets an order wrong?",
    a: "Every action is logged in plain language. You can undo most actions for 24 hours. High-value orders sit in a queue until you approve them.",
  },
  {
    q: "Will this work on a slow phone network?",
    a: "Yes. The website and the assistant are built for weak connections. Messages queue and send when the network returns. You do not need a high-end phone.",
  },
  {
    q: "What counts as a conversation?",
    a: "A conversation is a 24-hour thread with one customer on one number. Ten messages with Mrs Ade in the same day count as one conversation. A new day with Mrs Ade counts as another.",
  },
  {
    q: "Which languages does it understand?",
    a: "Voice and text in English, Pidgin, Yoruba, Hausa, Igbo, and Swahili. This website is in English first. Other site languages will follow.",
  },
];

export const foundingPerks = [
  {
    title: "Named setup person",
    text: "A real human connects your number, confirms your price list, and watches the first week with you.",
  },
  {
    title: "Weekly check-ins",
    text: "Short reviews of the log through the first month. Limits move only when you say so.",
  },
  {
    title: "Founding rate",
    text: "Founding shops hold their pilot rate for 12 months. No surprises while we build.",
  },
  {
    title: "Roadmap vote",
    text: "You tell us which agent, report, or language comes next.",
  },
];

export const pilotSteps = [
  {
    when: "Days 1–2",
    title: "Connect",
    text: "We link the WhatsApp number your customers already use and confirm your price list, units, and approval limits.",
  },
  {
    when: "Days 3–10",
    title: "Approve",
    text: "The agents draft orders, match payments, and update stock. You approve the queue and correct anything that looks off.",
  },
  {
    when: "Days 11–14",
    title: "Decide",
    text: "We review the two weeks together — hours saved, matches made, misses caught. Stay on a plan or walk away with your exports.",
  },
];

export const businessTypes = [
  "Retail shop",
  "Food vendor or caterer",
  "Food distributor",
  "Wholesale distributor",
  "Salon or service business",
  "Accountant / bookkeeper",
  "Other",
];

export function naira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function waLink(message: string, campaign = "site") {
  const text = encodeURIComponent(`${message}\n\n[ref:${campaign}]`);
  return `https://wa.me/${site.whatsappE164}?text=${text}`;
}
