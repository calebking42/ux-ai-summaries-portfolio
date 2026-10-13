// ---------- Results bar chart (inline SVG with hover/focus tooltips) ----------
(function () {
  const DATA = [
    { label: "Rainier", full: "Mount Rainier height", seconds: 14, note: "Quick read of the summary." },
    { label: "Creatine", full: "Creatine safety", seconds: 8, note: "Fastest task — a health question answered in 8 seconds." },
    { label: "Brain freeze", full: "Brain freeze", seconds: 11, note: "Quick read of the summary." },
    { label: "IRA", full: "Roth vs. traditional IRA", seconds: 16, note: "A money question, answered without opening a source." },
    { label: "Parking pass", full: "Commuter parking pass cost", seconds: 28, note: "Longest task — the summary gave two answers and he reported both.", highlight: true },
    { label: "Great Wall", full: "Great Wall visible from space", seconds: 11, note: "Quick read of the summary." }
  ];
  const MEAN = 14.7;

  const chartEl = document.getElementById("chart");
  const tooltip = document.getElementById("chart-tooltip");
  if (!chartEl || !tooltip) return;

  const W = 720, H = 320;
  const M = { top: 28, right: 16, bottom: 44, left: 16 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const maxVal = 30;
  const n = DATA.length;
  const slot = plotW / n;
  const barW = Math.min(72, slot * 0.62);

  const y = (v) => M.top + plotH - (v / maxVal) * plotH;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("aria-hidden", "true");

  function make(tag, attrs, text) {
    const el = document.createElementNS(svgNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    return el;
  }

  // baseline
  svg.appendChild(make("line", {
    class: "axis-line",
    x1: M.left, y1: M.top + plotH, x2: W - M.right, y2: M.top + plotH
  }));

  // mean line
  svg.appendChild(make("line", {
    class: "mean-line",
    x1: M.left, y1: y(MEAN), x2: W - M.right, y2: y(MEAN)
  }));
  svg.appendChild(make("text", {
    class: "mean-label", x: W - M.right, y: y(MEAN) - 5, "text-anchor": "end"
  }, `mean 14.7s`));

  DATA.forEach((d, i) => {
    const cx = M.left + slot * i + slot / 2;
    const barH = (d.seconds / maxVal) * plotH;

    const bar = make("rect", {
      class: "bar" + (d.highlight ? " highlight" : ""),
      x: cx - barW / 2,
      y: y(d.seconds),
      width: barW,
      height: barH,
      rx: 6,
      tabindex: 0,
      role: "img",
      "aria-label": `${d.full}: ${d.seconds} seconds. ${d.note}`
    });

    const showTip = () => {
      tooltip.innerHTML = `<strong>${d.full}</strong><br>${d.seconds} seconds<br>${d.note}`;
      const wrapRect = chartEl.parentElement.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      tooltip.style.left = (barRect.left - wrapRect.left + barRect.width / 2) + "px";
      tooltip.style.top = (barRect.top - wrapRect.top - tooltip.offsetHeight - 10) + "px";
      tooltip.classList.add("visible");
      tooltip.setAttribute("aria-hidden", "false");
    };
    const hideTip = () => {
      tooltip.classList.remove("visible");
      tooltip.setAttribute("aria-hidden", "true");
    };

    bar.addEventListener("mouseenter", showTip);
    bar.addEventListener("mouseleave", hideTip);
    bar.addEventListener("focus", showTip);
    bar.addEventListener("blur", hideTip);
    bar.addEventListener("touchstart", (e) => { showTip(); }, { passive: true });

    svg.appendChild(bar);

    // value above bar
    svg.appendChild(make("text", {
      class: "bar-value", x: cx, y: y(d.seconds) - 8, "text-anchor": "middle"
    }, `${d.seconds}s`));

    // label below axis
    svg.appendChild(make("text", {
      class: "bar-label", x: cx, y: M.top + plotH + 22, "text-anchor": "middle"
    }, d.label));
  });

  document.addEventListener("touchstart", (e) => {
    if (!svg.contains(e.target)) {
      tooltip.classList.remove("visible");
      tooltip.setAttribute("aria-hidden", "true");
    }
  }, { passive: true });

  chartEl.appendChild(svg);
})();

// ---------- Video fallback: show a placeholder box if the file is missing ----------
(function () {
  const video = document.getElementById("session-video");
  const slot = document.getElementById("video-slot");
  if (!video || !slot) return;

  function showPlaceholder() {
    slot.innerHTML =
      '<div class="video-placeholder" role="note">' +
      '<span class="vp-icon" aria-hidden="true">&#127909;</span>' +
      "<strong>Video coming soon</strong>" +
      "<span>A 25-second screen recording of Participant A's session will appear here.</span>" +
      "</div>";
  }

  const source = video.querySelector("source");
  video.addEventListener("error", showPlaceholder);
  if (source) source.addEventListener("error", showPlaceholder);
})();
