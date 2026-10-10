/* ==========================================================================
   AIRCONE SERVIE — script.js
   --------------------------------------------------------------------------
   BUSINESS CONFIGURATION (edit here to update business details site-wide)
   ========================================================================== */
const BUSINESS = {
    name: "AIRCONE SERVIE",
    phoneDisplay: "03030147723",
    phoneIntl: "+923030147723",          // used for tel: links
    whatsappIntl: "923030147723",        // used for wa.me links (no + sign)
    area: "Qayyumabad, Karachi",
    hours: "Daily, 9:00 AM – 11:00 PM",
    mapsUrl: "https://maps.app.goo.gl/PBD7Wki3gEsAtZcJ6",
    defaultWaMessage: "Hello AIRCONE SERVIE, I need AC service in Qayyumabad, Karachi. Please share the details."
};

/** Build a WhatsApp link with a pre-filled message. */
function waLink(message) {
    return "https://wa.me/" + BUSINESS.whatsappIntl + "?text=" + encodeURIComponent(message);
}

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Mobile navigation ---------- */
    const navToggle = document.getElementById("navToggle");
    const primaryNav = document.getElementById("primaryNav");

    navToggle.addEventListener("click", function () {
        const isOpen = primaryNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    // Close menu when a nav link is clicked
    primaryNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            primaryNav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close menu with Escape key for accessibility
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && primaryNav.classList.contains("open")) {
            primaryNav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.focus();
        }
    });

    /* ---------- 2. Active nav state on scroll ---------- */
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const scrollSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function (l) {
                    l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { scrollSpy.observe(s); });

    /* ---------- 3. Scroll reveal ---------- */
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

    /* ---------- 4. Service WhatsApp buttons (service-specific messages) ---------- */
    document.querySelectorAll(".js-book-service").forEach(function (btn) {
        const service = btn.getAttribute("data-service");
        btn.setAttribute("href", waLink(
            "Hello " + BUSINESS.name + ", I need " + service + " service in " + BUSINESS.area + ". Please contact me."
        ));
    });

    /* ---------- 5. FAQ accordion (accessible) ---------- */
    document.querySelectorAll(".faq-question").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const expanded = btn.getAttribute("aria-expanded") === "true";
            // Close all items
            document.querySelectorAll(".faq-question").forEach(function (b) {
                b.setAttribute("aria-expanded", "false");
                b.nextElementSibling.style.maxHeight = null;
            });
            // Open the clicked item
            if (!expanded) {
                btn.setAttribute("aria-expanded", "true");
                const answer = btn.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ---------- 6. Gallery lightbox (keyboard accessible) ---------- */
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const btnClose = document.getElementById("lightboxClose");
    const btnPrev = document.getElementById("lightboxPrev");
    const btnNext = document.getElementById("lightboxNext");
    let currentIndex = 0;
    let lastFocused = null;

    function openLightbox(index) {
        currentIndex = index;
        lastFocused = document.activeElement;
        updateLightboxImage();
        lightbox.hidden = false;
        document.body.style.overflow = "hidden"; // prevent background scrolling
        btnClose.focus();
    }

    function updateLightboxImage() {
        const img = galleryItems[currentIndex].querySelector("img");
        lightboxImg.src = img.getAttribute("data-full");
        lightboxImg.alt = img.alt;
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    function showPrev() { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; updateLightboxImage(); }
    function showNext() { currentIndex = (currentIndex + 1) % galleryItems.length; updateLightboxImage(); }

    galleryItems.forEach(function (item, index) {
        item.addEventListener("click", function () { openLightbox(index); });
    });
    btnClose.addEventListener("click", closeLightbox);
    btnPrev.addEventListener("click", showPrev);
    btnNext.addEventListener("click", showNext);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
        if (lightbox.hidden) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });

    /* ---------- 7. Contact form validation (no fake backend) ---------- */
    const form = document.getElementById("contactForm");
    const formNotice = document.getElementById("formNotice");

    function setError(id, show) {
        const field = document.getElementById(id);
        const err = document.getElementById("err-" + id.replace("cf-", ""));
        field.setAttribute("aria-invalid", show ? "true" : "false");
        err.hidden = !show;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("cf-name");
        const phone = document.getElementById("cf-phone");
        const service = document.getElementById("cf-service");
        const area = document.getElementById("cf-area");
        const message = document.getElementById("cf-message");

        let valid = true;
        if (!name.value.trim()) { setError("cf-name", true); valid = false; } else setError("cf-name", false);
        if (!/^[0-9+\-\s()]{7,16}$/.test(phone.value.trim())) { setError("cf-phone", true); valid = false; } else setError("cf-phone", false);
        if (!service.value) { setError("cf-service", true); valid = false; } else setError("cf-service", false);
        if (!area.value.trim()) { setError("cf-area", true); valid = false; } else setError("cf-area", false);

        if (!valid) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // No backend connected — be honest, hand off to WhatsApp instead.
        formNotice.hidden = false;
        const text =
            "Hello " + BUSINESS.name + ", I would like to request a service.\n" +
            "Name: " + name.value.trim() + "\n" +
            "Phone: " + phone.value.trim() + "\n" +
            "Service: " + service.value + "\n" +
            "Area: " + area.value.trim() +
            (message.value.trim() ? "\nMessage: " + message.value.trim() : "");
        window.open(waLink(text), "_blank", "noopener");
    });

    /* ---------- 8. Dynamic copyright year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});