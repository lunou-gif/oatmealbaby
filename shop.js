/* ============================================================
   SHOP SETTINGS — edit these, everything else updates itself.
   ============================================================ */
const SHOP = {
  price: 59,

  // Paste a Stripe Payment Link (https://buy.stripe.com/...) here.
  // One link for everything is fine: Stripe can collect size/color
  // through a "custom field" on the payment link.
  // Or give each combination its own link in `links` below.
  checkoutUrl: "https://buy.stripe.com/fZueVe4NrfIAe1N8Hp53O00",
  links: {
    // "grey|6-18M|split": "https://buy.stripe.com/xxxx",
  },

  // Used while there is no checkout link: the Buy button opens an
  // email with the order details pre-filled.
  contactEmail: "",
  instagram: "",   // e.g. "https://instagram.com/oatmealbaby"

  colors: [
    { id: "grey",   name: "Grey Mix",       hex: "#B9B8B6", img: "images/grey-long.jpg",
      more: ["images/grey-short.jpg", "images/grey-back.jpg", "images/grey-gown.jpg", "images/grey-liner.jpg", "images/m-hero.jpg"] },
    { id: "almond", name: "Heather Almond", hex: "#E7DCC8", img: "images/almond-split.jpg",
      more: ["images/almond-back.jpg", "images/almond-bag.jpg", "images/almond-liner.jpg", "images/m-cream-stand.jpg"] },
    { id: "forest", name: "Heather Forest", hex: "#3F4A35", img: "images/forest-long.jpg",
      more: ["images/forest-short.jpg", "images/forest-sleeveless.jpg", "images/forest-back.jpg"] },
    { id: "lake",   name: "Heather Lake",   hex: "#2F3B5C", img: "images/lake-long.jpg",
      more: ["images/lake-short.jpg", "images/lake-sleeveless.jpg", "images/lake-back.jpg"] },
  ],
  sizes: [
    { id: "6-18M",  name: "6–18 months" },
    { id: "18-36M", name: "18–36 months" },
  ],
  styles: [
    { id: "split",   name: "Split-leg" },
    { id: "classic", name: "Classic bag" },
  ],
};

/* ============================================================ */

const state = { color: SHOP.colors[0], size: SHOP.sizes[0], style: SHOP.styles[0] };
const $ = (s) => document.querySelector(s);

document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = "$" + SHOP.price));
$("#year").textContent = new Date().getFullYear();
$("#faq-sizes").textContent =
  "We currently offer " + SHOP.sizes.map((s) => s.name).join(" and ") +
  ". If your little one is between sizes, size up — the sleeves and split legs give them room to grow.";

const contact = $("#contact");
if (SHOP.contactEmail || SHOP.instagram) contact.innerHTML = " · ";
if (SHOP.contactEmail) contact.innerHTML += `<a href="mailto:${SHOP.contactEmail}">${SHOP.contactEmail}</a>`;
if (SHOP.instagram) contact.innerHTML += (SHOP.contactEmail ? " · " : "") + `<a href="${SHOP.instagram}" target="_blank" rel="noopener">Instagram</a>`;

function pills(container, items, key) {
  container.innerHTML = "";
  items.forEach((item) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pill";
    b.textContent = item.name;
    b.setAttribute("aria-pressed", state[key] === item);
    b.onclick = () => { state[key] = item; render(); };
    container.appendChild(b);
  });
}

function render() {
  // swatches
  const sw = $("#swatches");
  sw.innerHTML = "";
  SHOP.colors.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.style.background = c.hex;
    b.title = c.name;
    b.setAttribute("aria-label", c.name);
    b.setAttribute("aria-pressed", state.color === c);
    b.onclick = () => { state.color = c; render(); };
    sw.appendChild(b);
  });
  $("#color-name").textContent = state.color.name;
  pills($("#sizes"), SHOP.sizes, "size");
  pills($("#styles"), SHOP.styles, "style");

  // images
  const main = $("#shop-img");
  const imgs = [state.color.img, ...state.color.more];
  if (!imgs.includes(main.getAttribute("src"))) main.src = state.color.img;
  main.alt = `OatmealBaby sleep sack in ${state.color.name}`;
  const th = $("#thumbs");
  th.innerHTML = "";
  imgs.forEach((src) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thumb";
    b.setAttribute("aria-pressed", main.getAttribute("src") === src);
    b.innerHTML = `<img src="${src}" alt="">`;
    b.onclick = () => { main.src = src; render(); };
    th.appendChild(b);
  });

  // buy button
  const key = `${state.color.id}|${state.size.id}|${state.style.id}`;
  const summary = `${state.color.name} / ${state.size.name} / ${state.style.name}`;
  const buy = $("#buy");
  const note = $("#buy-note");
  const link = SHOP.links[key] || SHOP.checkoutUrl;
  if (link) {
    // Stripe shows client_reference_id on each payment, so you can see
    // which color / size / style the customer picked (e.g. "grey_6-18M_split").
    const ref = `${state.color.id}_${state.size.id}_${state.style.id}`;
    buy.href = link + (link.includes("?") ? "&" : "?") + "client_reference_id=" + encodeURIComponent(ref);
    buy.textContent = `Buy now — $${SHOP.price}`;
    buy.target = "_blank";
    note.textContent = `Selected: ${summary}. Secure checkout by Stripe.`;
  } else if (SHOP.contactEmail) {
    const body = `Hi OatmealBaby! I'd like to order:\n\n${summary}\nQuantity: 1\n\nName:\nShipping address (or "local pickup"):\n`;
    buy.href = `mailto:${SHOP.contactEmail}?subject=${encodeURIComponent("Sleep sack order: " + summary)}&body=${encodeURIComponent(body)}`;
    buy.textContent = `Order — $${SHOP.price}`;
    buy.removeAttribute("target");
    note.textContent = `Selected: ${summary}. We'll reply with payment details within 24 hours.`;
  } else {
    buy.href = "#shop";
    buy.textContent = "Coming soon";
    buy.classList.add("disabled");
    note.textContent = `Selected: ${summary}. Online ordering opens shortly.`;
  }
}

render();
