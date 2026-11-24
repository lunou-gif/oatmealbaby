/* ============================================================
   SHOP SETTINGS — edit these, everything else updates itself.
   ============================================================ */
const SHOP = {
  price: 59,

  // Stripe Payment Link. The selected color/size/style is sent along
  // as client_reference_id (e.g. "grey_6-18M_split") on each payment.
  checkoutUrl: "https://buy.stripe.com/fZueVe4NrfIAe1N8Hp53O00",
  links: {
    // "grey|6-18M|split": "https://buy.stripe.com/xxxx",
  },

  contactEmail: "",
  instagram: "",   // e.g. "https://instagram.com/oatmealbaby"

  colors: [
    { id: "grey",   name: "Grey Mix",       hex: "#B9B8B6",
      imgs: ["grey-long", "grey-short", "grey-back", "grey-gown", "grey-liner"] },
    { id: "almond", name: "Heather Almond", hex: "#E7DCC8",
      imgs: ["almond-split", "almond-back", "almond-bag", "almond-liner"] },
    { id: "forest", name: "Heather Forest", hex: "#4A5440",
      imgs: ["forest-long", "forest-short", "forest-sleeveless", "forest-back"] },
    { id: "lake",   name: "Heather Lake",   hex: "#3A4766",
      imgs: ["lake-long", "lake-short", "lake-sleeveless", "lake-back"] },
  ],
  sizes: [
    { id: "6-18M",  name: "6–18 months",  age: "6 to 18 months" },
    { id: "18-36M", name: "18–36 months", age: "18 months to 3 years" },
  ],
  styles: [
    { id: "split",   name: "Split-leg" },
    { id: "classic", name: "Classic bag" },
  ],

  // Creator videos (files in videos/). Shown in "Real families".
  videos: [
    { file: "olive",    name: "Olive Ningasca",  note: "Bedtime in Heather Lake" },
    { file: "shayna1",  name: "Shayna Hyman",    note: "Heather Lake at home" },
    { file: "roxanne",  name: "Roxanne Alford",  note: "Heather Forest at playtime" },
    { file: "ashlee",   name: "Ashlee Gonzales", note: "Grey Mix review" },
    { file: "sedla",    name: "Sedla Cayir",     note: "Summer nights, sleeveless" },
    { file: "mahrukh",  name: "Mah Rukh",        note: "First look at Oatmeal" },
    { file: "rebekah",  name: "Rebekah Hedley",  note: "Every way to wear it" },
    { file: "lyanna",   name: "Lyanna Banks",    note: "Close-up on the details" },
    { file: "shayna2",  name: "Shayna Hyman",    note: "A mom's honest review" },
  ],
};

/* ============================================================ */

const $ = (s) => document.querySelector(s);
const img = (n) => `images/${n}.jpg`;
const state = { color: SHOP.colors[0], size: SHOP.sizes[0], style: SHOP.styles[0], img: null };

document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = "$" + SHOP.price));
$("#year").textContent = new Date().getFullYear();
$("#faq-sizes").textContent =
  "Two sizes: " + SHOP.sizes.map((s) => `${s.name}`).join(" and ") +
  ". Between sizes? Size up: the sleeves snap off and the split legs leave room to grow.";
$("#size-rows").innerHTML = SHOP.sizes.map((s) => `<tr><td>${s.name}</td><td>${s.age}</td></tr>`).join("");

const contact = $("#contact");
if (SHOP.contactEmail) contact.innerHTML += `<a href="mailto:${SHOP.contactEmail}">${SHOP.contactEmail}</a>`;
if (SHOP.instagram) contact.innerHTML += `<a href="${SHOP.instagram}" target="_blank" rel="noopener">Instagram</a>`;

document.querySelectorAll("[data-open]").forEach((a) =>
  a.addEventListener("click", () => { const d = document.getElementById(a.dataset.open); if (d) d.open = true; }));

// Hero video: respect reduced motion
const hero = $("#hero-video");
if (hero && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { hero.removeAttribute("autoplay"); hero.pause(); hero.controls = true; }

/* ---------- creator videos ---------- */
const reels = $("#reels");
SHOP.videos.forEach((v) => {
  const fig = document.createElement("figure");
  fig.className = "reel";
  fig.innerHTML = `<button type="button" class="reel-frame" aria-label="Play video by ${v.name}">
      <img src="videos/${v.file}.jpg" alt="" loading="lazy"><span class="play"></span></button>
    <figcaption>${v.name}<span>${v.note}</span></figcaption>`;
  fig.querySelector("button").addEventListener("click", (e) => {
    document.querySelectorAll(".reel video").forEach((x) => x.pause());
    const frame = e.currentTarget;
    const vid = document.createElement("video");
    vid.src = `videos/${v.file}.mp4`;
    vid.poster = `videos/${v.file}.jpg`;
    vid.controls = true; vid.playsInline = true; vid.autoplay = true;
    vid.className = "reel-frame";
    vid.addEventListener("play", () => document.querySelectorAll(".reel video").forEach((x) => x !== vid && x.pause()));
    frame.replaceWith(vid);
  });
  reels.appendChild(fig);
});

/* ---------- product picker ---------- */
function pills(container, items, key) {
  container.innerHTML = "";
  items.forEach((item) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "pill"; b.textContent = item.name;
    b.setAttribute("aria-pressed", state[key] === item);
    b.onclick = () => { state[key] = item; render(); };
    container.appendChild(b);
  });
}

function render() {
  const sw = $("#swatches");
  sw.innerHTML = "";
  SHOP.colors.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "swatch"; b.style.background = c.hex;
    b.title = c.name; b.setAttribute("aria-label", c.name);
    b.setAttribute("aria-pressed", state.color === c);
    b.onclick = () => { state.color = c; state.img = null; render(); };
    sw.appendChild(b);
  });
  $("#color-name").textContent = state.color.name;
  pills($("#sizes"), SHOP.sizes, "size");
  pills($("#styles"), SHOP.styles, "style");

  const imgs = state.color.imgs;
  if (!imgs.includes(state.img)) state.img = imgs[0];
  const main = $("#shop-img");
  main.src = img(state.img);
  main.alt = `OatmealBaby sleep sack in ${state.color.name}`;
  const th = $("#thumbs");
  th.innerHTML = "";
  imgs.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "thumb";
    b.setAttribute("aria-pressed", state.img === n);
    b.setAttribute("aria-label", "Show photo");
    b.innerHTML = `<img src="${img(n)}" alt="">`;
    b.onclick = () => { state.img = n; render(); };
    th.appendChild(b);
  });

  const key = `${state.color.id}|${state.size.id}|${state.style.id}`;
  const summary = `${state.color.name} / ${state.size.name} / ${state.style.name}`;
  const buy = $("#buy"), note = $("#buy-note");
  const link = SHOP.links[key] || SHOP.checkoutUrl;
  if (link) {
    const ref = `${state.color.id}_${state.size.id}_${state.style.id}`;
    buy.href = link + (link.includes("?") ? "&" : "?") + "client_reference_id=" + encodeURIComponent(ref);
    buy.textContent = `Buy now — $${SHOP.price}`;
    buy.target = "_blank"; buy.rel = "noopener";
    note.textContent = `Selected: ${summary}`;
  } else if (SHOP.contactEmail) {
    const body = `Hi OatmealBaby! I'd like to order:\n\n${summary}\nQuantity: 1\n\nName:\nShipping address:\n`;
    buy.href = `mailto:${SHOP.contactEmail}?subject=${encodeURIComponent("Sleep sack order: " + summary)}&body=${encodeURIComponent(body)}`;
    buy.textContent = `Order — $${SHOP.price}`;
    buy.removeAttribute("target");
    note.textContent = `Selected: ${summary}. We'll reply with payment details within 24 hours.`;
  } else {
    buy.href = "#shop"; buy.textContent = "Coming soon"; buy.classList.add("disabled");
    note.textContent = `Selected: ${summary}. Online ordering opens shortly.`;
  }
}

render();
