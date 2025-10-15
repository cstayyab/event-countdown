// Generic countdown configuration
// - data-deadline: ISO8601 (recommended) or YYYYMMDDHHmmss (local time)
// - data-title, data-subtitle: optional texts
// - data-done: text to show when countdown completes
// - data-confetti: "true" to celebrate on completion
// - data-accent: CSS color for accent (e.g., #2563eb)
// - data-bg: URL to background image
(function () {
  const root = document.body;
  const cfg = {
    deadline: (root.dataset.deadline || '2024-12-31T23:59:59Z').trim(),
    title: root.dataset.title || 'Event Countdown',
    subtitle: root.dataset.subtitle || 'Counting down to the big moment',
    doneText: root.dataset.done || "It's Time!",
    confetti: (root.dataset.confetti || '').toLowerCase() === 'true',
    accent: root.dataset.accent,
    bg: root.dataset.bg,
  };

  // Apply runtime theming
  if (cfg.accent) {
    document.documentElement.style.setProperty('--accent', cfg.accent);
  }
  if (cfg.bg) {
    const page = document.querySelector('.page');
    if (page) page.style.backgroundImage = `url('${cfg.bg}')`;
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function parseDeadline(str) {
    if (/^\d{14}$/.test(str)) {
      // Treat as local time in the user's current timezone
      const y = +str.slice(0, 4);
      const m = +str.slice(4, 6); // 1-12
      const d = +str.slice(6, 8);
      const H = +str.slice(8, 10);
      const M = +str.slice(10, 12);
      const S = +str.slice(12, 14);
      return new Date(y, m - 1, d, H, M, S);
    }
    // Fallback: ISO8601 or Date-parsable string
    return new Date(str);
  }

  const deadline = parseDeadline(cfg.deadline);

  // Populate UI text
  const titleEl = document.getElementById('title');
  const subtitleEl = document.getElementById('subtitle');
  if (titleEl) titleEl.textContent = cfg.title;
  if (subtitleEl) subtitleEl.textContent = cfg.subtitle;

  const dateTextEl = document.getElementById('date-text');
  try {
    const opts = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const formatted = deadline.toLocaleString(undefined, opts);
    if (dateTextEl) dateTextEl.textContent = formatted;
  } catch (e) {
    if (dateTextEl) dateTextEl.textContent = cfg.deadline;
  }

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const grid = document.getElementById('countdown');
  const done = document.getElementById('done');
  if (done) done.textContent = cfg.doneText;

  let blasted = false;

  function formatDiff(ms) {
    if (isNaN(ms)) {
      return { days: '--', hours: '--', minutes: '--', seconds: '--', positive: false };
    }
    if (ms <= 0) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00', positive: false };
    }
    const total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    const rem1 = total % 86400;
    const hours = Math.floor(rem1 / 3600);
    const rem2 = rem1 % 3600;
    const minutes = Math.floor(rem2 / 60);
    const seconds = rem2 % 60;
    return {
      days: pad2(days),
      hours: pad2(hours),
      minutes: pad2(minutes),
      seconds: pad2(seconds),
      positive: true
    };
  }

  function update() {
    const now = Date.now();
    const ms = deadline.getTime() - now;
    const diff = formatDiff(ms);

    if (daysEl) daysEl.textContent = diff.days;
    if (hoursEl) hoursEl.textContent = diff.hours;
    if (minsEl) minsEl.textContent = diff.minutes;
    if (secsEl) secsEl.textContent = diff.seconds;

    const hasTime = diff.positive && (diff.days !== '00' || diff.hours !== '00' || diff.minutes !== '00' || diff.seconds !== '00');
    if (grid) grid.hidden = !hasTime;
    if (done) done.hidden = hasTime;

    if (!hasTime && !blasted) {
      blasted = true;
      tryBlast();
    }
  }

  function tryBlast() {
    if (!cfg.confetti) return;
    if (typeof window.confetti !== 'function') return;
    const end = Date.now() + 1000; // 1s burst window
    (function frame() {
      window.confetti({ particleCount: 6, startVelocity: 40, spread: 70, ticks: 60, origin: { x: Math.random(), y: Math.random() - 0.2 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    // A few big pops
    window.confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    window.confetti({ particleCount: 200, spread: 120, scalar: 1.2, origin: { y: 0.4 } });
  }

  // Initial paint and tick
  update();
  setInterval(update, 1000);
})();
