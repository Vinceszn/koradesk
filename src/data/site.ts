export const site = {
  name: "Kora Desk",
  tagline: "Your shop. Everywhere. Under control.",
  description:
    "Kora connects inventory, orders, payments and receipts across your online store, WhatsApp and shop counter. Explore the product preview and help shape the founding pilot.",
  url: "https://koradesk.com",
  email: "hello@koradesk.com",
  supportEmail: "support@koradesk.com",
  whatsappE164: "2348005672000",
  whatsappDisplay: "+234 800 567 2000",
  address: "Nigeria · founding pilot in preparation",
  hours: "Pilot conversations by arrangement",
  founderCity: "Lagos",
};

export const nav = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who it's for" },
  { href: "/pricing", label: "Pricing" },
  { href: "/customers", label: "Founding pilot" },
  { href: "/trust", label: "Trust" },
];

export const agents = [
  { slug: "orders", tone: "emerald", art: "/brand/commerce/orders-enamel-v1.webp", name: "Orders", job: "Website checkout, WhatsApp requests and counter sales, connected to one order record.", checkpoint: "Confirm products, variants and prices before committing an order.", href: "/product/orders" },
  { slug: "payments", tone: "gold", art: "/brand/commerce/payments-enamel-v1.webp", name: "Payments & receipts", job: "Match provider-verified payments to orders and prepare receipts with your business branding.", checkpoint: "Screenshots alone never mark an order paid.", href: "/product/payments" },
  { slug: "stock", tone: "rose", art: "/brand/commerce/inventory-enamel-v1.webp", name: "Inventory", job: "Know what’s on the shelf, what’s reserved and what’s available to sell across channels.", checkpoint: "Every delivery, sale, return and correction leaves a stock history.", href: "/product/stock" },
  { slug: "books", tone: "violet", art: "/brand/commerce/reporting-enamel-v1.webp", name: "Sales & reporting", job: "See recorded sales, money received and outstanding balances without piecing together three separate lists.", checkpoint: "Operational reports for review, not automatic tax filing.", href: "/product/books" },
];

export const plans = [
 { id: "starter", name: "Founding pilot", monthly: 5000, annual: 50000, blurb: "Proposed starting point for one business and one stock location.", includes: ["100 orders / month", "Catalogue, variants and stock history", "Payment verification and PDF receipts", "Manual WhatsApp sharing"] },
 { id: "growth", name: "Store", monthly: 10000, annual: 100000, featured: true, blurb: "Proposed next step for merchants handling more orders.", includes: ["300 orders / month", "Reservations and low-stock alerts", "Stock receiving and sales summaries", "Guided catalogue import"] },
 { id: "automation", name: "Connected", monthly: 20000, annual: 200000, perClient: false, blurb: "Planned channel automation, subject to pilot validation.", includes: ["Storefront and WhatsApp automation roadmap", "One shared catalogue and order system", "Messaging allowance to be confirmed", "Voice calling priced separately later"] },
];

export const faqs = [
 { q: "Is Kora a website builder, inventory system or WhatsApp assistant?", a: "The vision brings all three together. One commerce backend holds products, stock and orders; the website, WhatsApp and counter are different ways to sell. The first MVP focuses on inventory, orders, verified payments and receipts." },
 { q: "Can I use Kora without a physical shop?", a: "Yes. Online sellers need the same product, stock, order and payment records. The pilot is being designed for businesses selling countable physical products, whether online, in person or both." },
 { q: "Is the full platform available now?", a: "This site is a product preview. The animated orders, stock changes and payments are simulated. We are planning the founding pilot; the storefront, automatic WhatsApp delivery and voice features will be released in stages." },
 { q: "How does Kora know a customer has paid?", a: "The planned integration checks a connected payment provider’s transaction records against the order reference, amount and currency. An uploaded screenshot can help with matching, but does not establish that money arrived." },
 { q: "What happens when two people want the last item?", a: "The backend is designed to check and reserve stock in one database transaction. An unpaid hold can expire; a paid order keeps its reservation until fulfilment or cancellation is handled." },
 { q: "Can I connect my existing ecommerce store?", a: "Existing-store connectors are on the roadmap. We will start with a focused inventory and order core, then add a Kora storefront and selected integrations. No Shopify, WooCommerce or bank connection is active in this preview." },
 { q: "Will Kora answer phone calls?", a: "Voice ordering is a later feature. We plan to validate text ordering and stock accuracy first, followed by voice notes and a limited inbound calling pilot." },
];

export const foundingPerks = [
 { title: "Start with your actual stock", text: "Help us test catalogue import, variants and opening stock against the way your business sells." },
 { title: "Shape the workflow", text: "Tell us where orders get lost, stock counts disagree or payment checking slows you down." },
 { title: "Agree the scope first", text: "Pilot access, limits, timing and price are confirmed with each merchant before live trading." },
 { title: "Build the useful parts first", text: "Inventory accuracy and order-to-receipt come before extra channels and voice features." },
];
export const pilotSteps = [
 { when: "Set up", title: "Count and catalogue", text: "Choose one location, import products and variants, and confirm opening stock together." },
 { when: "Trade", title: "Follow real orders", text: "Test reservations, payments, receipts and fulfilment on an agreed small set of orders." },
 { when: "Review", title: "Check the difference", text: "Compare records with physical stock, review exceptions and decide what needs to improve." },
];

export const businessTypes = [
  "Retail shop",
  "Ecommerce store",
  "Instagram / WhatsApp seller",
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
