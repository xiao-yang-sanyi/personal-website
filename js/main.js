/* ============================================================
   Academic Personal Website — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id], .framework-stage[id], .contact-band[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ============================================================
     Research framework tree — interactive highlight
     ============================================================ */
  const nodes = document.querySelectorAll(".tree .node");
  const links = document.querySelectorAll(".tree .link");
  const legendSwatches = document.querySelectorAll(".tree-legend .legend-key");

  function moduleOf(node) {
    return node.getAttribute("data-module");
  }

  function clearTree() {
    nodes.forEach((n) => n.classList.remove("active", "dim"));
    links.forEach((l) => l.classList.remove("active"));
  }

  function highlight(module) {
    clearTree();
    if (!module) return;
    nodes.forEach((n) => {
      if (n.getAttribute("data-module") === module) n.classList.add("active");
      else if (n.getAttribute("data-root") !== "true") n.classList.add("dim");
    });
    links.forEach((l) => {
      if (l.getAttribute("data-module") === module) l.classList.add("active");
    });
  }

  nodes.forEach((node) => {
    const m = moduleOf(node);
    if (m) {
      node.addEventListener("mouseenter", () => highlight(m));
    }
  });

  const treeWrap = document.querySelector(".tree-wrap");
  if (treeWrap) treeWrap.addEventListener("mouseleave", clearTree);

  legendSwatches.forEach((sw) => {
    sw.addEventListener("mouseenter", () => {
      const m = sw.getAttribute("data-module");
      if (!m) return clearTree();
      highlight(m);
      const first = document.querySelector('.tree .node[data-module="' + m + '"]');
      if (first) first.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    sw.addEventListener("mouseleave", clearTree);
  });

  /* ============================================================
     Gallery — tabs, lightbox
     ============================================================ */
  const tabs = document.querySelectorAll(".g-tab");
  const items = Array.from(document.querySelectorAll(".g-item"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.getAttribute("data-filter");
      items.forEach((it) => {
        it.style.display =
          filter === "all" || it.getAttribute("data-cat") === filter ? "" : "none";
      });
    });
  });

  // Build ordered list of visible gallery items for lightbox navigation
  function visibleItems() {
    return items.filter((it) => it.style.display !== "none");
  }

  const lightbox = document.querySelector(".lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  let lbIndex = 0;

  function openLightbox(idx) {
    const list = visibleItems();
    lbIndex = idx;
    const img = list[idx].querySelector("img");
    const cap = list[idx].querySelector(".cap");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    const list = visibleItems();
    lbIndex = (lbIndex + dir + list.length) % list.length;
    const img = list[lbIndex].querySelector("img");
    const cap = list[lbIndex].querySelector(".cap");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
  }

  items.forEach((it, i) => {
    it.addEventListener("click", () => {
      const list = visibleItems();
      openLightbox(list.indexOf(it));
    });
  });

  document.querySelector(".lb-close").addEventListener("click", closeLightbox);
  document.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  document.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------- Live year in footer ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
