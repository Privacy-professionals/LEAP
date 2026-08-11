(function () {
  "use strict";

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const assetBase = new URL(".", document.currentScript ? document.currentScript.src : window.location.href).href;
  const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    scroll: 0,
    visible: true,
    active: true
  };
  let appRoot = null;

  function byId(id) {
    return appRoot ? appRoot.querySelector(`#${id}`) : null;
  }

  function ready(fn) {
    let tries = 0;
    const tick = () => {
      appRoot = document.getElementById("dc-root");
      if (appRoot && appRoot.querySelector("#main") && appRoot.querySelector("#hero")) {
        fn();
        return;
      }
      tries += 1;
      if (tries < 120) window.setTimeout(tick, 50);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tick, { once: true });
    } else {
      tick();
    }
  }

  function iconSvg(type) {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const paths = {
      shield: '<path d="M12 3l7 3.2v5.1c0 4.8-2.9 8.3-7 9.7-4.1-1.4-7-4.9-7-9.7V6.2z"/><path d="M9.5 12.4l1.8 1.8 3.7-4"/>',
      nodes: '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M8.3 8.4l2.7 6.2M15.7 8.4L13 14.6M8.5 7h7"/>',
      lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8.5 10V7.8a3.5 3.5 0 017 0V10"/><path d="M12 14v2"/>'
    };
    return `<svg ${common}>${paths[type] || paths.shield}</svg>`;
  }

  function serviceIconSvg(index) {
    const common = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const icons = [
      `<svg ${common}>
        <path d="M32 8l18 8v13c0 12.2-7.2 21.6-18 26-10.8-4.4-18-13.8-18-26V16z"/>
        <rect x="22" y="29" width="20" height="16" rx="3"/>
        <path d="M26 29v-5.2a6 6 0 0112 0V29M32 35v4"/>
        <circle cx="14" cy="18" r="2.8"/><circle cx="50" cy="21" r="2.8"/><path d="M17 19.5l8 5M47 22.5l-8 5"/>
      </svg>`,
      `<svg ${common}>
        <circle cx="32" cy="32" r="7"/>
        <ellipse cx="32" cy="32" rx="22" ry="9"/>
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(60 32 32)"/>
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(120 32 32)"/>
        <path d="M32 10v8M32 46v8M10 32h8M46 32h8"/>
        <circle cx="32" cy="10" r="2.6"/><circle cx="54" cy="32" r="2.6"/><circle cx="32" cy="54" r="2.6"/><circle cx="10" cy="32" r="2.6"/>
      </svg>`,
      `<svg ${common}>
        <path d="M32 7l20 8.5v13.2c0 13-8.2 22.6-20 27.3-11.8-4.7-20-14.3-20-27.3V15.5z"/>
        <path d="M20 25h24M18 33h28M23 41h18"/>
        <path d="M24 19v26M40 19v26"/>
        <path d="M27.5 32.5l3.5 3.5 7-8"/>
      </svg>`,
      `<svg ${common}>
        <path d="M15 14h18c5 0 8 3 8 8v28H22c-4 0-7-3-7-7z"/>
        <path d="M41 22h8v28h-8M22 24h12M22 32h12M22 40h8"/>
        <circle cx="49" cy="16" r="3"/><circle cx="54" cy="33" r="3"/><circle cx="49" cy="50" r="3"/>
        <path d="M50 19l3 11M53 36l-3 11"/>
      </svg>`
    ];
    return icons[index] || icons[0];
  }

  function buildHero() {
    const hero = byId("hero");
    if (!hero) return null;
    const wrap = hero.querySelector(":scope > div");
    const copy = wrap && wrap.querySelector("[data-reveal]");
    if (!wrap || wrap.querySelector(".pp-hero-stage")) return null;

    hero.classList.add("pp-section");
    wrap.classList.add("pp-hero-grid");
    if (copy) copy.classList.add("pp-hero-copy");

    const stage = document.createElement("div");
    stage.className = "pp-hero-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `
      <div class="pp-core-stage"></div>
      <div class="pp-css-core">
        <div class="pp-core-orbit"></div>
        <div class="pp-core-shield"><img src="assets/hero-logo-core.png" alt=""></div>
        <span class="pp-core-node"></span>
        <span class="pp-core-node"></span>
        <span class="pp-core-node"></span>
        <span class="pp-core-node"></span>
        <span class="pp-core-node"></span>
      </div>
      <div class="pp-depth-card">${iconSvg("shield")}</div>
      <div class="pp-depth-card">${iconSvg("nodes")}</div>
      <div class="pp-depth-card">${iconSvg("lock")}</div>
    `;
    wrap.appendChild(stage);
    return stage;
  }

  function enhanceAbout() {
    const about = byId("about");
    if (!about) return;
    about.classList.add("pp-section");
    const grids = about.querySelectorAll(":scope > div > div");
    const head = grids[0];
    const processPanel = grids[1];
    if (head && !head.querySelector(".pp-about-visual")) {
      head.classList.add("pp-about-head");
      const visual = document.createElement("div");
      visual.className = "pp-about-visual";
      visual.setAttribute("aria-hidden", "true");
      visual.innerHTML = `
        <span class="pp-flow-node" style="inset-block-start:18%;inset-inline-start:16%"></span>
        <span class="pp-flow-node" style="inset-block-start:31%;inset-inline-start:48%"></span>
        <span class="pp-flow-node" style="inset-block-start:56%;inset-inline-start:28%"></span>
        <span class="pp-flow-node" style="inset-block-start:70%;inset-inline-start:70%"></span>
        <span class="pp-flow-line" style="width:38%;inset-block-start:24%;inset-inline-start:19%;transform:rotate(18deg)"></span>
        <span class="pp-flow-line" style="width:34%;inset-block-start:43%;inset-inline-start:35%;transform:rotate(122deg)"></span>
        <span class="pp-flow-line" style="width:45%;inset-block-start:63%;inset-inline-start:32%;transform:rotate(17deg)"></span>
        <div class="pp-css-core" style="opacity:.28;transform:scale(.72)">
          <div class="pp-core-orbit"></div>
          <div class="pp-core-shield"><img src="assets/hero-logo-core.png" alt=""></div>
        </div>
      `;
      head.appendChild(visual);
    }
    if (processPanel) {
      processPanel.classList.add("pp-process-panel");
      const list = processPanel.querySelector("ol");
      if (list) {
        list.classList.add("pp-process-list");
        if (!processPanel.querySelector(".pp-flow-light")) {
          const light = document.createElement("span");
          light.className = "pp-flow-light";
          light.setAttribute("aria-hidden", "true");
          processPanel.appendChild(light);
        }
      }
    }
  }

  function enhanceServices() {
    const services = byId("services");
    if (!services) return;
    services.classList.add("pp-section");
    const layout = services.querySelector(":scope > div > div:nth-of-type(2)");
    if (layout) layout.classList.add("pp-services-layout");
    const cards = services.querySelectorAll("article");
    cards.forEach((card, index) => {
      card.classList.add("pp-card");
      card.dataset.ppCard = String(index + 1);
      if (!card.querySelector(".pp-service-icon")) {
        const icon = document.createElement("span");
        icon.className = "pp-service-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = serviceIconSvg(index);
        card.appendChild(icon);
      }
      if (!card.querySelector(".pp-service-symbol")) {
        const symbol = document.createElement("span");
        symbol.className = "pp-service-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.innerHTML = '<span class="pp-symbol-ring"></span><span class="pp-symbol-ring"></span><span class="pp-symbol-dot"></span><span class="pp-symbol-dot"></span><span class="pp-symbol-dot"></span>';
        card.appendChild(symbol);
      }
    });
  }

  function enhanceWhyAndContact() {
    const why = byId("why");
    if (why) {
      why.classList.add("pp-section", "pp-why-section");
    }
    const contact = byId("contact");
    if (contact && !contact.querySelector(".pp-contact-nodes")) {
      contact.classList.add("pp-contact-section");
      const nodes = document.createElement("div");
      nodes.className = "pp-contact-nodes";
      nodes.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 18; i += 1) {
        const node = document.createElement("span");
        const angle = (Math.PI * 2 * i) / 18;
        const radius = 42 + (i % 4) * 11;
        node.style.insetInlineStart = `${50 + Math.cos(angle) * radius}%`;
        node.style.insetBlockStart = `${50 + Math.sin(angle) * radius * .55}%`;
        node.style.setProperty("--tx", `${Math.cos(angle) * -36}px`);
        node.style.setProperty("--ty", `${Math.sin(angle) * -24}px`);
        node.style.animationDelay = `${i * -0.21}s`;
        nodes.appendChild(node);
      }
      contact.prepend(nodes);
    }
  }

  function pointerTilt() {
    if (reduceMotion) return;
    (appRoot || document).querySelectorAll(".pp-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 8;
        const ry = (x - 0.5) * 10;
        card.style.setProperty("--x", `${x * 100}%`);
        card.style.setProperty("--y", `${y * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function scrollState() {
    const root = appRoot || document;
    const allProcess = Array.from(root.querySelectorAll(".pp-process-list li"));
    const whyItems = Array.from(root.querySelectorAll(".pp-why-section li"));
    const processPanel = root.querySelector(".pp-process-panel");

    const update = () => {
      const vh = window.innerHeight || 1;
      const doc = Math.max(1, document.documentElement.scrollHeight - vh);
      state.scroll = Math.max(0, Math.min(1, window.scrollY / doc));

      if (processPanel && allProcess.length) {
        const rect = processPanel.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * .72 - rect.top) / Math.max(1, rect.height)));
        const idx = Math.min(allProcess.length - 1, Math.floor(p * allProcess.length));
        processPanel.style.setProperty("--pp-progress", `calc(${p} * 90%)`);
        allProcess.forEach((item, i) => item.classList.toggle("is-active", i <= idx));
      }

      whyItems.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const active = rect.top < vh * (0.82 - i * 0.035);
        item.classList.toggle("is-active", active);
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function parallax(stage) {
    if (!stage || reduceMotion) return;
    window.addEventListener("pointermove", (event) => {
      state.targetX = (event.clientX / Math.max(1, window.innerWidth) - .5) * 2;
      state.targetY = (event.clientY / Math.max(1, window.innerHeight) - .5) * 2;
    }, { passive: true });

    const cards = stage.querySelectorAll(".pp-depth-card");
    const cssCore = stage.querySelector(".pp-css-core");
    const tick = () => {
      state.mouseX += (state.targetX - state.mouseX) * .055;
      state.mouseY += (state.targetY - state.mouseY) * .055;
      if (cssCore) {
        cssCore.style.transform = `rotateY(${state.mouseX * 5}deg) rotateX(${state.mouseY * -4}deg)`;
      }
      cards.forEach((card, i) => {
        const depth = (i + 1) * 8;
        card.style.translate = `${state.mouseX * depth}px ${state.mouseY * depth * .7}px`;
      });
      window.requestAnimationFrame(tick);
    };
    tick();
  }

  async function initWebgl(stage) {
    if (!stage || reduceMotion || !window.WebGLRenderingContext) return;
    const mount = stage.querySelector(".pp-core-stage");
    if (!mount) return;

    let THREE;
    try {
      THREE = await import(new URL("vendor/three.module.js", assetBase).href);
    } catch (_error) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, .72);
    const key = new THREE.PointLight(0x8fd3b1, 2.1, 18);
    key.position.set(3, 4, 5);
    scene.add(ambient, key);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x08663e,
      metalness: .28,
      roughness: .34,
      transparent: true,
      opacity: .78
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe7f3ed,
      metalness: .05,
      roughness: .08,
      transparent: true,
      opacity: .28,
      transmission: .44,
      thickness: .8
    });
    const lightMat = new THREE.MeshStandardMaterial({ color: 0x8fd3b1, emissive: 0x08663e, emissiveIntensity: .34 });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), glassMat);
    const shield = new THREE.Mesh(new THREE.OctahedronGeometry(.72, 0), darkMat);
    shield.scale.set(.86, 1.12, .26);
    group.add(core, shield);

    const logoTexture = new THREE.TextureLoader().load(new URL("hero-logo-core.png", assetBase).href);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    const logoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 1.26),
      new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        opacity: .82,
        depthWrite: false
      })
    );
    logoPlane.position.set(0, -.03, .68);
    logoPlane.scale.set(.78, .78, .78);
    group.add(logoPlane);

    const ringGeo = new THREE.TorusGeometry(1.9, .012, 12, 180);
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(ringGeo, lightMat);
      ring.rotation.set(i === 0 ? Math.PI / 2.4 : Math.PI / 2, i === 1 ? Math.PI / 2.2 : 0, i === 2 ? Math.PI / 3 : 0);
      group.add(ring);
    }

    const nodeGeo = new THREE.SphereGeometry(.055, 14, 14);
    const nodes = [];
    const positions = [];
    const count = window.innerWidth < 700 ? 28 : 46;
    for (let i = 0; i < count; i += 1) {
      const a = i * 2.39996;
      const r = 1.9 + (i % 5) * .085;
      const y = ((i % 9) - 4) * .18;
      const node = new THREE.Mesh(nodeGeo, lightMat);
      node.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      nodes.push(node);
      positions.push(node.position.clone());
      group.add(node);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x8fd3b1, transparent: true, opacity: .28 });
    const linePositions = [];
    for (let i = 0; i < nodes.length; i += 3) {
      const a = nodes[i].position;
      const b = nodes[(i + 7) % nodes.length].position;
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    function resize() {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const mobile = width < 700;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.65));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: .05 }) : null;
    if (io) io.observe(stage);

    document.addEventListener("visibilitychange", () => {
      state.active = !document.hidden;
    });
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    const animate = () => {
      raf = window.requestAnimationFrame(animate);
      if (!state.visible || !state.active) return;
      const t = performance.now() * .001;
      group.rotation.y += .0035 + state.scroll * .004;
      group.rotation.x += (state.mouseY * .16 - group.rotation.x) * .025;
      group.rotation.z += (state.mouseX * .08 - group.rotation.z) * .025;
      camera.position.x += (state.mouseX * .42 - camera.position.x) * .035;
      camera.position.y += (state.mouseY * -.28 - camera.position.y) * .035;
      camera.position.z += (6.7 - state.scroll * 1.15 - camera.position.z) * .025;
      camera.lookAt(0, 0, 0);
      nodes.forEach((node, i) => {
        const base = positions[i];
        const split = Math.sin(state.scroll * Math.PI);
        node.position.x = base.x * (1 + split * .18) + Math.sin(t + i) * .015;
        node.position.y = base.y + Math.cos(t * .8 + i) * .018;
        node.position.z = base.z * (1 + split * .12);
      });
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("pagehide", () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (io) io.disconnect();
      renderer.dispose();
    }, { once: true });
  }

  function useGsapEnhancements() {
    const boot = () => {
      if (!window.gsap) return;
      try {
        if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
        const root = appRoot || document;
        const depthCards = root.querySelectorAll(".pp-depth-card");
        const coreStage = root.querySelector(".pp-core-stage");
        if (!depthCards.length || !coreStage) return;
        window.gsap.fromTo(depthCards, { y: 18, opacity: .65 }, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          stagger: .14
        });
        if (window.ScrollTrigger) {
          window.gsap.to(".pp-core-stage", {
            scrollTrigger: { trigger: byId("hero"), start: "top top", end: "bottom top", scrub: .7 },
            scale: .92,
            opacity: .78,
            ease: "none"
          });
        }
      } catch (_error) {}
    };
    window.setTimeout(boot, 120);
    window.setTimeout(boot, 600);
  }

  ready(() => {
    document.documentElement.classList.add("pp-enhanced");
    const stage = buildHero();
    enhanceAbout();
    enhanceServices();
    enhanceWhyAndContact();
    pointerTilt();
    scrollState();
    parallax(stage);
    initWebgl(stage);
    useGsapEnhancements();
  });
})();
