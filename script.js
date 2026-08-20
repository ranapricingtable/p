/* ======================================================
   RANA DESIGN — real services & prices
   Flexible-priced items (has "flexible:true") show a small
   price input so you type the agreed price before adding.
   ====================================================== */

const DESIGNS = [
  { id: "d1",  icon: "📢", en: "Ads",                          ar: "إعلانات",                 price: 10 },
  { id: "d2",  icon: "💌", en: "Invitations",                  ar: "دعوات",                   price: 10 },
  { id: "d3",  icon: "📄", en: "CV",                            ar: "سيرة ذاتية",              price: 15 },
  { id: "d4",  icon: "🖋️", en: "Logo",                          ar: "لوغو",                    price: 20 },
  { id: "d5",  icon: "🖨️", en: "50 Printed Cards",              ar: "50 كارت مطبوعة",          price: 50 },
  { id: "d6",  icon: "🏅", en: "Certificate",                   ar: "شهادة",                   price: 7 },
  { id: "d7",  icon: "🎠", en: "Carousel",                      ar: "كاروسيل",                 price: 15 },
  { id: "d8",  icon: "🎁", en: "50 Cards + 50 Stickers",        ar: "50 كارت + 50 ستيكر",      price: 70 },
  { id: "d9",  icon: "📱", en: "Insta Feed Layout",             ar: "تنسيق فيد إنستغرام",       price: 20 },
  { id: "d10", icon: "✨", en: "Social Media Branding Kit",     ar: "كيت هوية سوشيال ميديا",   price: 25 },
  { id: "d11", icon: "📋", en: "Menu",                          ar: "منيو",                    price: 15 },
  { id: "d12", icon: "💳", en: "Digital Business Card",         ar: "بزنس كارد رقمية",         price: 15 },
  { id: "d13", icon: "🖼️", en: "Resize",                        ar: "تغيير مقاس",              price: 3 },
  { id: "d14", icon: "🎥", en: "AI Ads Video",                  ar: "فيديو إعلان AI",          price: 20 },
  { id: "d15", icon: "🗂️", en: "Portfolio Design",              ar: "تصميم بورتفوليو",         price: "20/50" },
];

const WEB = [
  { id: "w1",  icon: "🌐", en: "Full Website (Photos → Website)", ar: "موقع كامل من صور لموقع",     price: "20/50" },
  { id: "w2",  icon: "🔗", en: "QR Code (Site Ready)",             ar: "QR كود (الموقع جاهز)",       price: 15 },
  { id: "w3",  icon: "🔗", en: "QR Code (All Ready)",              ar: "QR كود (كل شي جاهز)",        price: 3 },
  { id: "w4",  icon: "💎", en: "Website Design + Content by Us",   ar: "تصميم ومحتوى الموقع منا",     price: 250 },
  { id: "w5",  icon: "🗂️", en: "Portfolio Website",                ar: "موقع بورتفوليو",              price: "50/100" },
  { id: "w6",  icon: "📝", en: "Website (Your Content Ready)",     ar: "موقع (المحتوى جاهز عندك)",    price: "50/100" },
  { id: "w7",  icon: "🪪", en: "Web Brand Identity",                ar: "هوية بصرية للويب",            price: 50 },
  { id: "w8",  icon: "📋", en: "Menu Website",                     ar: "منيو ويب",                    price: 20 },
  { id: "w9",  icon: "🚀", en: "Landing Page",                     ar: "لاندنغ بيج",                  price: 40 },
  { id: "w10", icon: "📊", en: "Dashboard",                        ar: "لوحة تحكم",                   price: "30/100" },
  { id: "w11", icon: "🔄", en: "Design → Website Conversion",      ar: "تحويل تصميم إلى ويب",         price: 30 },
  { id: "w12", icon: "🧭", en: "Multi-step Flow",                  ar: "خطوات متعددة",                price: "30/50" },
  { id: "w13", icon: "✏️", en: "Website Edit",                     ar: "تعديل على الموقع",            price: "10/50" },
];

const PACKAGES = [
  { id: "p1", en: "Quick Start",       ar: "باقة الانطلاقة السريعة", price: 60,  items: ["Landing Page", "Ads"], featured: false },
  { id: "p2", en: "Digital Menu Bundle", ar: "باقة المطعم الرقمي",   price: 75,  items: ["Menu Digital", "Menu Web", "QR Code"], featured: true },
  { id: "p3", en: "The Professional Edit", ar: "باقة الاحتراف",      price: 120, items: ["Portfolio", "Web Brand Identity", "Multi-step"], featured: false },
  { id: "p4", en: "The Grand Affair",  ar: "الباقة الفخمة",          price: 250, items: ["Everything — design + content by us"], featured: false },
];

/* ---------- backend analytics & visitor tracking ---------- */
let currentVisitId = null;

fetch("http://localhost:3000/api/visit", {
  method: "POST",
  headers: { "Content-Type": "application/json" }
})
.then(res => res.json())
.then(data => {
  if (data.success) currentVisitId = data.visitId;
})
.catch(err => console.log("Backend not connected yet for visits"));

/* ---------- cart state ---------- */
let cart = [];
let pendingOtherCategory = null; // "design" or "web" when Other/Plus+ is used

/* ---------- render cards ---------- */
function priceBlock(item) {
  if (item.flexible) {
    return `
      <div class="card-foot">
        <input type="number" class="card-price-input" placeholder="$${item.min}-${item.max}" min="${item.min}" max="${item.max}" id="price-${item.id}">
        <button class="card-add" data-id="${item.id}" data-flexible="1">+</button>
      </div>`;
  }
  return `
    <div class="card-foot">
      <span class="card-price">$${item.price}</span>
      <button class="card-add" data-id="${item.id}">+</button>
    </div>`;
}

function renderCards(list, containerId, category) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const cardsHtml = list.map(item => `
    <div class="card reveal">
      <div class="card-icon">${item.icon}</div>
      <span class="card-name-en">${item.en}</span>
      <span class="card-name-ar">${item.ar}</span>
      ${priceBlock(item)}
    </div>
  `).join("");

  const otherHtml = `
    <div class="card reveal" style="border:2px dashed var(--gold); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
      <div class="card-icon">➕</div>
      <span class="card-name-en">Other / Custom Request</span>
      <span class="card-name-ar">طلب خاص</span>
      <button class="btn btn-outline btn-sm other-btn" data-category="${category}" style="margin-top:12px;">Start · ابدأ</button>
    </div>`;

  el.innerHTML = cardsHtml + otherHtml;
  observeReveals();
}

function renderPackages() {
  const el = document.getElementById("packagesGrid");
  if (!el) return;
  el.innerHTML = PACKAGES.map(p => `
    <div class="package reveal ${p.featured ? "featured" : ""}">
      ${p.featured ? '<span class="badge">Most Popular · الأكثر طلباً</span>' : ""}
      <span class="pkg-name-en">${p.en}</span>
      <span class="pkg-name-ar">${p.ar}</span>
      <div class="price">$${p.price}</div>
      <ul>${p.items.map(i => `<li>${i}</li>`).join("")}</ul>
      <button class="btn btn-primary pkg-add" data-id="${p.id}">Choose · اختاري</button>
    </div>
  `).join("");
  observeReveals();
}

/* ---------- cart logic ---------- */
function findItem(id) {
  return [...DESIGNS, ...WEB, ...PACKAGES].find(i => i.id === id);
}

function addToCart(id, btnEl) {
  const item = findItem(id);
  if (!item) return;

  let finalPrice = item.price;
  if (item.flexible) {
    const input = document.getElementById(`price-${id}`);
    const val = Number(input.value);
    if (!val || val < item.min || val > item.max) {
      input.style.boxShadow = "0 0 0 3px rgba(200,60,60,0.4)";
      input.focus();
      return;
    }
    finalPrice = val;
  }

  cart.push({ id: item.id, en: item.en || item.pkg_en, ar: item.ar, price: finalPrice });
  updateCartUI();

  if (btnEl) {
    btnEl.classList.add("added");
    btnEl.textContent = "✓";
    setTimeout(() => { btnEl.classList.remove("added"); btnEl.textContent = "+"; }, 700);
  }
}

function updateCartUI() {
  const count = cart.length;
  const total = cart.reduce((sum, i) => sum + Number(i.price || 0), 0);
  const countEl = document.getElementById("cartCount");
  const textEl = document.getElementById("cartBarText");
  const barEl = document.getElementById("cartBar");
  
  if (countEl) countEl.textContent = count;
  if (textEl) textEl.textContent = `Services: ${count} | Total: $${total}`;
  if (barEl) barEl.classList.toggle("visible", count > 0);
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".card-add")) addToCart(e.target.dataset.id, e.target);
  if (e.target.matches(".pkg-add")) addToCart(e.target.dataset.id, e.target);
});

/* ---------- quick nav: smooth scroll + flash highlight ---------- */
document.querySelectorAll(".quicknav-card").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("section-flash");
      void target.offsetWidth; // restart animation
      target.classList.add("section-flash");
    }
  });
});

/* ---------- scroll reveal ---------- */
function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => io.observe(item));
}

/* ---------- modal / multi-step ---------- */
const overlay = document.getElementById("modalOverlay");
const openCheckout = () => {
  if (overlay) overlay.classList.add("open");
  goToStep(1);
};
const closeCheckout = () => {
  if (overlay) overlay.classList.remove("open");
  pendingOtherCategory = null;
};

const checkoutOpenBtn = document.getElementById("checkoutOpenBtn");
if (checkoutOpenBtn) checkoutOpenBtn.addEventListener("click", () => { openCheckout(); });

const cartBtn = document.getElementById("cartBtn");
if (cartBtn) cartBtn.addEventListener("click", () => { if (cart.length > 0) openCheckout(); });

const modalClose = document.getElementById("modalClose");
if (modalClose) modalClose.addEventListener("click", closeCheckout);

if (overlay) {
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCheckout(); });
}

// "Other / Custom" buttons open the modal directly at step 1
document.addEventListener("click", (e) => {
  if (e.target.matches(".other-btn")) {
    pendingOtherCategory = e.target.dataset.category;
    const detailsInput = document.getElementById("custDetails");
    if (detailsInput) detailsInput.value = "";
    openCheckout();
  }
});

function goToStep(n) {
  n = Number(n);
  document.querySelectorAll(".step-panel").forEach(p => {
    const isTarget = (p.dataset.panel === String(n)) || (p.dataset.step === String(n));
    p.classList.toggle("active", isTarget);
  });
  
  document.querySelectorAll(".step-dot, .step-num").forEach(d => {
    const stepVal = Number(d.dataset.step || d.textContent);
    d.classList.toggle("active", stepVal <= n);
  });
  
  const progressFill = document.getElementById("progressFill");
  if (progressFill) progressFill.style.width = (n / 4 * 100) + "%";
}

document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => goToStep(btn.dataset.next)));
document.querySelectorAll("[data-prev]").forEach(btn => btn.addEventListener("click", () => goToStep(btn.dataset.prev)));

/* ---------- send to WhatsApp & Save to Database ---------- */
const WHATSAPP_NUMBER = "96181412729"; // update if the number changes

const sendWhatsappBtn = document.getElementById("sendWhatsapp");
if (sendWhatsappBtn) {
  sendWhatsappBtn.addEventListener("click", async () => {
    const name = document.getElementById("custName")?.value || "No name";
    const phone = document.getElementById("custPhone")?.value || "";
    const details = document.getElementById("custDetails")?.value || "";
    const pay = document.querySelector('input[name="pay"]:checked')?.value || "Not selected";

    let itemsText, total;
    if (pendingOtherCategory) {
      itemsText = `Custom request (${pendingOtherCategory === "design" ? "Design" : "Web"}) — see details below`;
      total = "To be agreed";
    } else {
      itemsText = cart.map(i => `- ${i.en} / ${i.ar} ($${i.price})`).join("\n");
      total = "$" + cart.reduce((sum, i) => sum + Number(i.price || 0), 0);
    }

    const orderData = {
      name: name,
      phone: phone,
      details: details,
      paymentMethod: pay,
      totalPrice: total,
      services: pendingOtherCategory ? itemsText : cart,
      visitId: currentVisitId
    };

    let refCode = "";

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      if (result.success) {
        refCode = `\nOrder ID: *${result.referenceId}*`;
      }
    } catch (error) {
      console.error("Failed to save order to database:", error);
    }

    const message =
`Hi, I'd like to confirm a new order ✨${refCode}
Name: ${name}
Phone: ${phone}
Services:
${itemsText}
Total: ${total}
Payment: ${pay}
Details: ${details}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

/* ---------- init ---------- */
renderCards(DESIGNS, "designsGrid", "design");
renderCards(WEB, "webGrid", "web");
renderPackages();
observeReveals();

// remove splash from the flow after its animation finishes
setTimeout(() => { const s = document.getElementById("splash"); if (s) s.style.display = "none"; }, 3500);s