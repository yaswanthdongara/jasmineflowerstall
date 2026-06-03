const products = [
  { image: "images/1.jpeg", name: "Item 01" },
  { image: "images/2.jpeg", name: "Item 02" },
  { image: "images/3.jpeg", name: "Item 03" },
  { image: "images/4.jpeg", name: "Item 04" },
  { image: "images/5.jpeg", name: "Item 05" },
  { image: "images/6.jpeg", name: "Item 06" },
  { image: "images/7.jpeg", name: "Item 07" },
  { image: "images/8.jpeg", name: "Item 08" },
  { image: "images/9.jpeg", name: "Item 09" },
  { image: "images/10.jpeg", name: "Item 10" },
  { image: "images/11.jpeg", name: "Item 11" },
  { image: "images/12.jpeg", name: "Item 12" },
  { image: "images/13.jpeg", name: "Item 13" },
  { image: "images/14.jpeg", name: "Item 14" },
  { image: "images/15.jpeg", name: "Item 15" },
  { image: "images/16.jpeg", name: "Item 16" },
  { image: "images/17.jpeg", name: "Item 17" },
];

const productGrid = document.querySelector("#product-grid");

if (productGrid) {
  productGrid.innerHTML = products
    .map((product, idx) => `
        <article class="product-card">
          <img class="product-image" data-index="${idx}" src="${product.image}" alt="${product.name}" loading="lazy" />
          <div class="product-body">
            <h3 class="product-title">${product.name}</h3>
          </div>
        </article>
      `)
    .join("");

  // Attach click handlers to images: open detail modal
  const modal = document.getElementById("product-modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  document.querySelectorAll(".product-image").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      const idx = Number(img.getAttribute("data-index"));
      const p = products[idx];
      if (!p) return;
      modalImage.src = p.image;
      modalImage.alt = p.name;
      document.body.classList.add("image-only-view");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    document.body.classList.remove("image-only-view");
  }

  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (ev) => {
    if (ev.target === modal) closeModal();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeModal();
  });
}

// --- Entrance orchestration: show a dramatic overlay, then reveal the site ---
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("intro-overlay");
  const enterBtn = document.getElementById("enter-site");
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const shapes = document.querySelectorAll(".float-shape");
  const orderForm = document.getElementById("order-form");
  const orderError = document.getElementById("order-error");
  const orderButton = orderForm?.querySelector('button[type="submit"]');

  if (window.emailjs) {
    window.emailjs.init("adadYm2X7OAr-KVjJ");
  }

  function revealSite() {
    if (!overlay) return;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");

    // staggered reveal of product cards
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add("show"), i * 80 + 120);
    });
  }

  // auto-reveal after a short delay, allow user to click to skip
  const autoTimer = setTimeout(revealSite, 1200);
  enterBtn?.addEventListener("click", () => { clearTimeout(autoTimer); revealSite(); });

  // subtle mouse parallax for floating shapes
  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) / cx;
    const my = (e.clientY - cy) / cy;
    document.documentElement.style.setProperty("--mx", String(mx.toFixed(3)));
    document.documentElement.style.setProperty("--my", String(my.toFixed(3)));
  });

  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(orderForm);
      const name = String(formData.get("name") || "").trim();
      const product = String(formData.get("product") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const price = String(formData.get("price") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!email && !phone) {
        if (orderError) {
          orderError.textContent = "Enter either an email address or a phone number.";
        }
        return;
      }

      if (orderError) {
        orderError.textContent = "";
      }
      let contactField = orderForm.querySelector('input[name="contact_method"]');
      if (!contactField) {
        contactField = document.createElement("input");
        contactField.type = "hidden";
        contactField.name = "contact_method";
        orderForm.appendChild(contactField);
      }
      contactField.value = email || phone;

      if (orderButton) {
        orderButton.disabled = true;
        orderButton.textContent = "Sending...";
      }

      if (!window.emailjs) {
        if (orderError) {
          orderError.textContent = "Email service is unavailable right now. Please try again later.";
        }
        if (orderButton) {
          orderButton.disabled = false;
          orderButton.textContent = "Submit order";
        }
        return;
      }

      window.emailjs
        .sendForm("service_k81u0if", "template_32m53tj", orderForm)
        .then(() => {
          orderForm.reset();
          if (orderError) {
            orderError.textContent = "Order sent successfully.";
          }
        })
        .catch(() => {
          if (orderError) {
            orderError.textContent = "Unable to send order right now. Please try again.";
          }
        })
        .finally(() => {
          if (orderButton) {
            orderButton.disabled = false;
            orderButton.textContent = "Submit order";
          }
        });
    });
  }
});