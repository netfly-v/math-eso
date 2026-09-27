(function () {
  const lessons = Array.prototype.slice.call(document.querySelectorAll("#content .lesson"));
  if (!lessons.length || !window.ESOApp) return;
  const slug = document.body.dataset.topic;
  const topic = window.ESOApp.topicBySlug(slug);
  const topics = window.ESO.topics;
  const pos = topics.findIndex(function (t) { return t.slug === slug; });
  let index = 0;

  function hashIndex() {
    const m = (location.hash || "").match(/leccion-(\d+)/);
    if (!m) return -1;
    const n = parseInt(m[1], 10) - 1;
    if (n >= 0 && n < lessons.length) return n;
    return -1;
  }

  function firstOpen() {
    const saved = window.ESOApp.Store.topic(slug).done || [];
    for (let i = 0; i < lessons.length; i++) {
      if (saved.indexOf(i) < 0) return i;
    }
    return 0;
  }

  function show(i, replace) {
    if (i < 0) {
      location.href = pos > 0 ? topics[pos - 1].slug + ".html" : window.ESOApp.hrefRoot("index.html");
      return;
    }
    if (i >= lessons.length) {
      location.href = pos >= 0 && pos < topics.length - 1 ? topics[pos + 1].slug + ".html" : window.ESOApp.hrefRoot("index.html");
      return;
    }
    lessons.forEach(function (node, k) { node.classList.toggle("is-on", k === i); });
    index = i;
    if (replace !== false) history.replaceState(null, "", "#leccion-" + (i + 1));
    const h = lessons[i].querySelector("h2");
    const sub = document.getElementById("brand-sub");
    if (h && sub && topic) sub.textContent = "Урок " + (i + 1) + " из " + lessons.length + " · " + topic.es;
    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = Math.round(((i + 1) / lessons.length) * 100) + "%";
    const dots = document.getElementById("dots");
    if (dots && !dots.childElementCount) {
      lessons.forEach(function (_, k) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = String(k + 1);
        b.addEventListener("click", function () { show(k); });
        dots.appendChild(b);
      });
    }
    if (dots) {
      const saved = window.ESOApp.Store.topic(slug).done || [];
      Array.prototype.forEach.call(dots.children, function (b, k) {
        b.classList.toggle("on", k === i);
        b.classList.toggle("done", saved.indexOf(k) >= 0);
      });
    }
    const prev = document.getElementById("go-prev");
    const next = document.getElementById("go-next");
    if (prev) prev.textContent = i === 0 ? (pos > 0 ? "Пред. тема" : "На главную") : "Назад";
    if (next) {
      if (i === lessons.length - 1) next.textContent = pos < topics.length - 1 ? "Дальше: " + topics[pos + 1].title : "На главную";
      else next.textContent = "Дальше";
    }
    window.scrollTo(0, 0);
  }

  function gate(lesson) {
    let msg = lesson.querySelector(".gate");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "gate";
      const check = lesson.querySelector(".check");
      (check || lesson).appendChild(msg);
    }
    msg.innerHTML = "Сначала ответь на вопросы ниже. Так ты поймёшь, что уложилось.<br>";
    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "linkish";
    skip.textContent = "Всё равно дальше";
    skip.style.minHeight = "44px";
    skip.style.background = "transparent";
    skip.style.border = "0";
    skip.style.color = "var(--accent)";
    skip.style.fontWeight = "700";
    skip.addEventListener("click", function () {
      window.ESOApp.Store.markLesson(slug, index);
      show(index + 1);
    });
    msg.appendChild(skip);
    const check = lesson.querySelector(".check");
    if (check) check.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function forward() {
    const lesson = lessons[index];
    const check = lesson.querySelector(".check");
    if (check && !check.classList.contains("is-done")) {
      gate(lesson);
      return;
    }
    window.ESOApp.Store.markLesson(slug, index);
    show(index + 1);
  }

  const prevBtn = document.getElementById("go-prev");
  const nextBtn = document.getElementById("go-next");
  if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", forward);
  document.addEventListener("quizdone", function (e) {
    const lesson = e.target.closest ? e.target.closest(".lesson") : null;
    if (!lesson) return;
    const i = lessons.indexOf(lesson);
    if (i >= 0) window.ESOApp.Store.markLesson(slug, i);
    const dots = document.getElementById("dots");
    if (dots && dots.children[i]) dots.children[i].classList.add("done");
  });

  document.querySelectorAll(".steps").forEach(function (box) {
    const steps = Array.prototype.slice.call(box.querySelectorAll(".step"));
    if (steps.length < 2) return;
    let shown = 1;
    steps.forEach(function (s, i) { if (i > 0) s.classList.add("hidden"); });
    let btn = box.querySelector(".step-next");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "step-next";
      box.appendChild(btn);
    }
    btn.textContent = "Следующий шаг";
    btn.addEventListener("click", function () {
      if (shown >= steps.length) return;
      steps[shown].classList.remove("hidden");
      shown += 1;
      if (shown >= steps.length) {
        btn.textContent = "Все шаги открыты";
        btn.disabled = true;
      }
    });
  });

  document.querySelectorAll("[data-times]").forEach(function (host) {
    const n = parseInt(host.dataset.times, 10) || 10;
    let html = "<table><tr><th>·</th>";
    for (let c = 1; c <= n; c++) html += "<th>" + c + "</th>";
    html += "</tr>";
    for (let r = 1; r <= n; r++) {
      html += "<tr><th>" + r + "</th>";
      for (let c = 1; c <= n; c++) html += '<td><button type="button" data-v="' + (r * c) + '">?</button></td>';
      html += "</tr>";
    }
    html += "</table><p class=\"lede\">Нажми клетку — увидишь ответ. Нажми ещё раз — снова спрячется.</p>";
    host.className = "times";
    host.innerHTML = html;
    host.addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.open === "1") {
        b.textContent = "?";
        b.dataset.open = "0";
      } else {
        b.textContent = b.dataset.v;
        b.dataset.open = "1";
      }
    });
  });

  document.querySelectorAll(".pyth-check").forEach(function (host) {
    host.className = "widget pyth-check";
    host.innerHTML =
      "<b>Проверь треугольник сам</b><p>Впиши три стороны. Прямой угол должен быть между сторонами a и b, а c — самая длинная.</p>" +
      '<div class="num-row"><input id="pa" inputmode="decimal" placeholder="a" aria-label="катет a"><input id="pb" inputmode="decimal" placeholder="b" aria-label="катет b"><input id="pc" inputmode="decimal" placeholder="c" aria-label="гипотенуза c"></div>' +
      '<div class="q-actions"><button type="button" class="do">Проверить</button></div><p class="out"></p>';
    host.querySelector(".do").addEventListener("click", function () {
      const nums = ["#pa", "#pb", "#pc"].map(function (sel) {
        return parseFloat(String(host.querySelector(sel).value).trim().replace(/\s/g, "").replace(",", "."));
      });
      const out = host.querySelector(".out");
      if (nums.some(function (n) { return !isFinite(n) || n <= 0; })) {
        out.textContent = "Нужны три положительных числа.";
        return;
      }
      const a2 = nums[0] * nums[0];
      const b2 = nums[1] * nums[1];
      const c2 = nums[2] * nums[2];
      const ok = Math.abs(a2 + b2 - c2) < 0.05;
      out.textContent = a2 + " + " + b2 + " = " + (a2 + b2) + ", а " + nums[2] + "² = " + c2 + ". " + (ok ? "Да, треугольник прямоугольный." : "Нет, это не прямоугольный треугольник.");
    });
  });

  let x0 = 0;
  let y0 = 0;
  const main = document.getElementById("content");
  if (main) {
    main.addEventListener("touchstart", function (e) {
      x0 = e.changedTouches[0].clientX;
      y0 = e.changedTouches[0].clientY;
    }, { passive: true });
    main.addEventListener("touchend", function (e) {
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (dx < 0) forward();
      else show(index - 1);
    }, { passive: true });
  }
  document.addEventListener("keydown", function (e) {
    if (e.target && e.target.matches && e.target.matches("input, textarea")) return;
    if (e.key === "ArrowRight") forward();
    if (e.key === "ArrowLeft") show(index - 1);
  });

  const fromHash = hashIndex();
  show(fromHash >= 0 ? fromHash : firstOpen(), false);
  window.addEventListener("hashchange", function () {
    const h = hashIndex();
    if (h >= 0 && h !== index) show(h, false);
  });
  window.ESOLessons = { show: show };
})();
