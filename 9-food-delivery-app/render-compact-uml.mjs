import fs from "node:fs";

const out = [];
const W = 2400;
const H = 1400;

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function panel(x, y, w, h, title, accent, fill, note = "") {
  out.push(`
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${accent}" stroke-opacity="0.42" stroke-width="1.5"/>
      <rect x="${x + 20}" y="${y + 18}" width="4" height="22" rx="2" fill="${accent}"/>
      <text x="${x + 36}" y="${y + 35}" class="panel-title" fill="${accent}">${esc(title)}</text>
      ${note ? `<text x="${x + w - 22}" y="${y + 34}" text-anchor="end" class="panel-note">${esc(note)}</text>` : ""}
    </g>`);
}

function textLines(x, y, lines, className, lineHeight = 18, fill = "") {
  if (!lines.length) return;
  out.push(`<text x="${x}" y="${y}" class="${className}"${fill ? ` fill="${fill}"` : ""}>`);
  lines.forEach((line, index) => {
    out.push(`<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`);
  });
  out.push(`</text>`);
}

function card({ x, y, w, h, title, tag = "", accent, header, fields = [], methods = [], compact = false }) {
  const headerHeight = tag ? 48 : 38;
  const lineHeight = compact ? 16 : 18;
  const bodyClass = compact ? "body compact" : "body";
  const methodClass = compact ? "method compact" : "method";
  const fieldY = y + headerHeight + 24;
  const fieldBlock = fields.length ? fields.length * lineHeight : 0;
  const separatorY = fields.length ? fieldY + fieldBlock + 8 : y + headerHeight;
  const methodY = separatorY + 24;

  out.push(`
    <g filter="url(#cardShadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#101827" stroke="${accent}" stroke-opacity="0.55"/>
      <path d="M${x + 12} ${y} H${x + w - 12} Q${x + w} ${y} ${x + w} ${y + 12} V${y + headerHeight} H${x} V${y + 12} Q${x} ${y} ${x + 12} ${y}Z" fill="${header}"/>
      <text x="${x + w / 2}" y="${y + (tag ? 20 : 24)}" text-anchor="middle" class="card-title">${esc(title)}</text>
      ${tag ? `<text x="${x + w / 2}" y="${y + 37}" text-anchor="middle" class="tag">${esc(tag)}</text>` : ""}
      ${fields.length && methods.length ? `<line x1="${x}" y1="${separatorY}" x2="${x + w}" y2="${separatorY}" stroke="${accent}" stroke-opacity="0.22"/>` : ""}
    </g>`);

  textLines(x + 14, fieldY, fields, bodyClass, lineHeight);
  textLines(x + 14, methodY, methods, methodClass, lineHeight);
}

function path(d, color, options = {}) {
  const { dash = false, end = "", start = "", width = 2 } = options;
  out.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="7 6"` : ""}${end ? ` marker-end="url(#${end})"` : ""}${start ? ` marker-start="url(#${start})"` : ""}/>`);
}

out.push(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050812"/>
      <stop offset="0.48" stop-color="#080C17"/>
      <stop offset="1" stop-color="#05070D"/>
    </linearGradient>
    <radialGradient id="ambient" cx="51%" cy="36%" r="72%">
      <stop offset="0" stop-color="#1E3A5F" stop-opacity="0.18"/>
      <stop offset="0.58" stop-color="#111827" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#05070D" stop-opacity="0"/>
    </radialGradient>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.28"/>
    </filter>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <marker id="trianglePurple" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">
      <path d="M1,1 L9,5.5 L1,10 Z" fill="#0B101B" stroke="#A78BFA" stroke-width="1.5"/>
    </marker>
    <marker id="triangleAmber" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">
      <path d="M1,1 L9,5.5 L1,10 Z" fill="#171207" stroke="#FBBF24" stroke-width="1.5"/>
    </marker>
    <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M1,1 L8,5 L1,9 Z" fill="#60A5FA"/>
    </marker>
    <marker id="arrowAmber" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M1,1 L8,5 L1,9 Z" fill="#FBBF24"/>
    </marker>
    <marker id="diamondGreen" markerWidth="13" markerHeight="13" refX="3" refY="6.5" orient="auto">
      <path d="M2,6.5 L6.5,2 L11,6.5 L6.5,11 Z" fill="#091510" stroke="#34D399" stroke-width="1.4"/>
    </marker>
    <marker id="diamondPink" markerWidth="13" markerHeight="13" refX="3" refY="6.5" orient="auto">
      <path d="M2,6.5 L6.5,2 L11,6.5 L6.5,11 Z" fill="#160B13" stroke="#F472B6" stroke-width="1.4"/>
    </marker>
    <style>
      text { font-family: Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .title { fill:#F8FAFC; font-size:30px; font-weight:750; letter-spacing:-0.5px; }
      .subtitle { fill:#7E8DA3; font-size:12px; font-weight:600; letter-spacing:1.9px; }
      .panel-title { font-size:13px; font-weight:750; letter-spacing:1.4px; }
      .panel-note { fill:#596A81; font-size:10px; font-weight:550; letter-spacing:0.4px; }
      .card-title { fill:#F8FAFC; font-size:15px; font-weight:720; }
      .tag { fill:#CFD8E7; font-size:10px; font-weight:550; }
      .body { fill:#9AA8BA; font-size:11.5px; font-weight:480; }
      .method { fill:#DCE5F2; font-size:11.5px; font-weight:520; }
      .compact { font-size:10.5px; }
      .legend { font-size:11px; font-weight:620; }
      .tiny { fill:#66758A; font-size:10px; font-weight:500; }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#background)"/>
  <rect width="${W}" height="${H}" fill="url(#ambient)"/>
  <circle cx="1000" cy="330" r="220" fill="#22D3EE" opacity="0.025" filter="url(#softGlow)"/>
  <text x="38" y="49" class="title">Food Delivery Application</text>
  <text x="40" y="75" class="subtitle">COMPACT UML  ·  DARK EDITION  ·  TYPESCRIPT</text>
  <text x="2358" y="48" text-anchor="end" class="tiny">21 TYPES  ·  5 DOMAIN GROUPS  ·  3 DESIGN PATTERNS</text>`);

panel(30, 100, 570, 1260, "ACTORS & RESTAURANT", "#A78BFA", "#0D0B18", "inheritance + observers");
panel(620, 100, 560, 290, "APPLICATION CORE", "#60A5FA", "#09111E", "singleton orchestration");
panel(620, 410, 560, 950, "ORDER DOMAIN", "#22D3EE", "#07151B", "subject + cart");
panel(1200, 100, 1170, 650, "PLUGGABLE STRATEGIES", "#FBBF24", "#151006", "runtime-swappable algorithms");
panel(1200, 770, 750, 590, "CATALOG & LOCATION", "#34D399", "#07140D", "menu composition");
panel(1970, 770, 400, 370, "STATES", "#FB7185", "#170A0E", "enumerations");
panel(1970, 1160, 400, 200, "RELATIONSHIP KEY", "#64748B", "#0A101B", "essential arrows only");

// Connectors are deliberately drawn before cards so they never obscure content.
path("M145 380 V355 H315 V335", "#A78BFA", { end: "trianglePurple", width: 1.8 });
path("M335 380 V355 H315", "#A78BFA", { width: 1.8 });
path("M510 380 V355 H315", "#A78BFA", { width: 1.8 });

path("M900 360 V430", "#60A5FA", { end: "arrowBlue", width: 2.2 });
path("M760 850 V890", "#34D399", { start: "diamondGreen", width: 2 });
path("M1005 850 V890", "#F472B6", { start: "diamondPink", width: 2 });

path("M1155 520 H1180 V255 H1240", "#FBBF24", { end: "arrowAmber", width: 2.1 });
path("M1155 575 H1185 V510 H1240", "#FBBF24", { end: "arrowAmber", width: 2.1 });

path("M1680 195 V150 H2160", "#FBBF24", { dash: true, width: 1.7 });
path("M1920 195 V150", "#FBBF24", { dash: true, width: 1.7 });
path("M2160 195 V150", "#FBBF24", { dash: true, width: 1.7 });
path("M1680 150 H1370 V190", "#FBBF24", { dash: true, end: "triangleAmber", width: 1.7 });

path("M1935 440 V380 H2210", "#FBBF24", { dash: true, width: 1.7 });
path("M2210 440 V380", "#FBBF24", { dash: true, width: 1.7 });
path("M1935 380 H1390 V450", "#FBBF24", { dash: true, end: "triangleAmber", width: 1.7 });

path("M1710 1010 V1080", "#34D399", { start: "diamondGreen", width: 2 });

card({
  x: 55, y: 155, w: 520, h: 180,
  title: "User", tag: "<<abstract · OrderObserver>>", accent: "#A78BFA", header: "#4C3583",
  fields: ["- userId: string", "- name: string", "- phone: string", "- email: string | null"],
  methods: ["+ getId() · getName() · getPhone() · getEmail()", "+ onOrderStatusChange(order): void"]
});

card({
  x: 55, y: 380, w: 165, h: 305,
  title: "Customer", tag: "extends User", accent: "#8B73C7", header: "#30234F", compact: true,
  fields: ["- addresses: Address[]", "- current: Address?", "- history: Order[]", "- cart: CartItem[]"],
  methods: ["+ addAddress()", "+ setCurrentAddress()", "+ addToCart()", "+ addorderHistory()", "+ onStatusChange()"]
});

card({
  x: 235, y: 380, w: 195, h: 330,
  title: "DeliveryAgent", tag: "extends User", accent: "#8B73C7", header: "#30234F", compact: true,
  fields: ["- isAvailable: boolean", "- history: Order[]", "- location: Address?"],
  methods: ["+ makeOnline()", "+ makeOffline()", "+ isAgentAvailable()", "+ addOrderToHistory()", "+ setCurrentAddress()", "+ changeOrderStatus()", "+ onStatusChange()"]
});

card({
  x: 445, y: 380, w: 130, h: 165,
  title: "RestroAdmin", tag: "extends User", accent: "#8B73C7", header: "#30234F", compact: true,
  fields: ["+ restaurantId: string"],
  methods: ["+ onStatusChange()"]
});

card({
  x: 55, y: 760, w: 520, h: 385,
  title: "Restro", tag: "<<OrderObserver>>", accent: "#A78BFA", header: "#4C3583",
  fields: ["- id: string", "- name: string", "- adresss: Address", "- menu: Menu | null", "- isAvaialble: boolean", "- orderHistory: Order[]"],
  methods: ["+ getId() · getName() · getMenu()", "+ setMenu(menu): void", "+ toggleAvailability(): void", "+ addOrderToHistory(order): void", "+ changeOrderStatus(orderId, status): void", "+ onOrderStatusChange(order): void"]
});

card({
  x: 645, y: 150, w: 510, h: 210,
  title: "SwiggyService", tag: "<<Singleton>>", accent: "#60A5FA", header: "#174A78", compact: true,
  fields: ["+ instance: SwiggyService", "- customers · deliveryAgents · restros · orders: Map"],
  methods: ["+ getInstance(): SwiggyService", "+ createCustomers() · createDeliveryAgents() · createRestro()", "+ makeOrder(..., payment, discount?): Order", "+ cancelOrder() · assignOrderToDeliveryAgent() · updateStatus()"]
});

card({
  x: 645, y: 450, w: 510, h: 400,
  title: "Order", tag: "<<Observer Subject>>", accent: "#22D3EE", header: "#0E6374",
  fields: ["- id: string", "- customer: Customer", "- restaurant: Restro", "- grossAmount / netAmount: number", "- items: CartItem[]", "- paymentStrategy: IPayment", "- discountStrategy: IDiscount | null", "- deliveryAgent: DeliveryAgent | null", "- orderStatus: OrderStatus", "- observers: OrderObserver[]"],
  methods: ["+ changeOrderStatus(status): void", "+ getNetAmountAfterDiscount(): number", "+ getPaymentStrategy(): IPayment", "+ assignDeliverAgent(agent): void", "+ addObservers() · notifyObservers()"]
});

card({
  x: 645, y: 900, w: 230, h: 235,
  title: "CartItem", accent: "#22D3EE", header: "#123C48",
  fields: ["- item: MenuItem", "- quantity: number", "- instructions: string | null"],
  methods: ["+ getItem(): MenuItem", "+ getQuantity(): number", "+ getInstructions(): string"]
});

card({
  x: 900, y: 900, w: 255, h: 165,
  title: "OrderObserver", tag: "<<interface>>", accent: "#F472B6", header: "#62304F",
  methods: ["+ onOrderStatusChange(order): void"]
});

card({
  x: 1240, y: 190, w: 260, h: 130,
  title: "IPayment", tag: "<<interface · Strategy>>", accent: "#FBBF24", header: "#72520A",
  methods: ["+ pay(amount): PaymentStatus", "+ refund(amount): PaymentStatus"]
});

card({ x: 1580, y: 195, w: 200, h: 100, title: "CreditCard", tag: "implements IPayment", accent: "#C89B2B", header: "#3B300F", compact: true, methods: ["+ pay() · refund()"] });
card({ x: 1820, y: 195, w: 200, h: 100, title: "DebitCard", tag: "implements IPayment", accent: "#C89B2B", header: "#3B300F", compact: true, methods: ["+ pay() · refund()"] });
card({ x: 2060, y: 195, w: 200, h: 100, title: "UPI", tag: "implements IPayment", accent: "#C89B2B", header: "#3B300F", compact: true, methods: ["+ pay() · refund()"] });

card({
  x: 1240, y: 450, w: 300, h: 120,
  title: "IDiscount", tag: "<<interface · Strategy>>", accent: "#FBBF24", header: "#72520A",
  methods: ["+ applyDiscount(baseAmount): number"]
});

card({ x: 1815, y: 440, w: 240, h: 120, title: "FlatDiscount", tag: "implements IDiscount", accent: "#C89B2B", header: "#3B300F", compact: true, fields: ["- flatAmount: number"], methods: ["+ applyDiscount(): number"] });
card({ x: 2080, y: 440, w: 260, h: 120, title: "PercentageDiscount", tag: "implements IDiscount", accent: "#C89B2B", header: "#3B300F", compact: true, fields: ["- percentageDiscount: number"], methods: ["+ applyDiscount(): number"] });

card({
  x: 1230, y: 830, w: 250, h: 165,
  title: "Address", accent: "#34D399", header: "#174C2D",
  fields: ["- street: string", "- city: string", "- lat / long: string | null"],
  methods: ["+ getAddress(): string"]
});

card({
  x: 1510, y: 830, w: 400, h: 180,
  title: "Menu", accent: "#34D399", header: "#174C2D",
  fields: ["- items: Map<string, MenuItem>"],
  methods: ["+ addMenuItem(item): void", "+ remmoveItem(itemId): void", "+ getMenuItem(itemId): MenuItem", "+ getAllMenuItems(): MenuItem[]"]
});

card({
  x: 1510, y: 1090, w: 400, h: 245,
  title: "MenuItem", accent: "#34D399", header: "#174C2D",
  fields: ["- id: string", "- name: string", "- price: number", "- available: boolean", "- description / category: string | null"],
  methods: ["+ getId() · getName() · getPrice()", "+ getDescription() · getCategory()", "+ isAvailable(): boolean", "+ toggleAvailability(): void"]
});

card({
  x: 1995, y: 830, w: 350, h: 185,
  title: "OrderStatus", tag: "<<enum>>", accent: "#FB7185", header: "#76253D", compact: true,
  methods: ["PENDING · CONFIRMED · PREPARED", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY · DELIVERED", "CANCELLED"]
});

card({
  x: 1995, y: 1035, w: 350, h: 80,
  title: "PaymentStatus", tag: "<<enum>>", accent: "#FB7185", header: "#76253D", compact: true,
  methods: ["PENDING · COMPLETED · FAILED"]
});

out.push(`
  <g>
    <text x="1995" y="1215" class="legend" fill="#A78BFA">△  inheritance / implementation</text>
    <text x="1995" y="1243" class="legend" fill="#60A5FA">→  application flow</text>
    <text x="1995" y="1271" class="legend" fill="#34D399">◇  aggregation / composition</text>
    <text x="1995" y="1299" class="legend" fill="#FBBF24">→  Strategy Pattern</text>
    <text x="1995" y="1327" class="legend" fill="#F472B6">◇  Observer Pattern</text>
    <text x="1995" y="1348" class="tiny">Typed members replace redundant cross-panel arrows.</text>
  </g>
</svg>`);

fs.writeFileSync(new URL("./food-delivery-uml.svg", import.meta.url), out.join("\n"));
