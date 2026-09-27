(function () {
  function parseNum(raw) {
    if (raw == null) return null;
    let s = String(raw).trim().toLowerCase();
    s = s.replace(/\s+/g, "");
    s = s.replace(/[−–—]/g, "-");
    s = s.replace(/,/g, ".");
    s = s.replace(/²/g, "2").replace(/³/g, "3");
    s = s.replace(/(cm²|cm2|m²|m2|mm²|km2|dm²|см²|см2|м²|м2|cm|mm|dm|km|kg|см|мм|дм|км|кг|grados|grado|euros|euro|€|%|º|°|m|g|l|м|г|л)$/i, "");
    s = s.replace(/^\+/, "");
    s = s.replace(/:/g, "/");
    if (!s) return null;
    const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (frac) {
      const d = parseFloat(frac[2]);
      if (!d) return null;
      return parseFloat(frac[1]) / d;
    }
    if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
    return parseFloat(s);
  }

  function norm(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, ".").replace(/[−–—]/g, "-");
  }

  function matches(user, item) {
    const answers = Array.isArray(item.answer) ? item.answer : [item.answer];
    const tol = item.tolerance == null ? 1e-6 : item.tolerance;
    const u = parseNum(user);
    for (let i = 0; i < answers.length; i++) {
      if (norm(user) === norm(answers[i])) return true;
      const n = parseNum(answers[i]);
      if (u != null && n != null && Math.abs(u - n) <= tol + 1e-9) return true;
    }
    return false;
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount(root) {
    const script = root.querySelector('script[type="application/json"]');
    if (!script) return;
    let items;
    try { items = JSON.parse(script.textContent); }
    catch (e) {
      root.appendChild(el("p", "feedback bad", "Не получилось прочитать задания. Обнови страницу."));
      return;
    }
    const step = root.dataset.mode === "step" || root.dataset.mode === "diag";
    const state = items.map(function () {
      return { attempts: 0, resolved: false, firstTry: false, usedHint: false, usedSolution: false };
    });
    const box = el("div", "q-list");
    root.appendChild(box);
    let cursor = 0;

    function draw() {
      box.innerHTML = "";
      const list = step ? [cursor] : items.map(function (_, i) { return i; });
      list.forEach(function (i) {
        if (step && i >= items.length) return;
        box.appendChild(questionView(i));
      });
      if (step && cursor >= items.length) showSummary();
    }

    function questionView(i) {
      const item = items[i];
      const st = state[i];
      const art = el("article", "q");
      art.appendChild(el("div", "q-k", "Вопрос " + (i + 1) + " из " + items.length));
      art.appendChild(el("div", "q-text", item.q));
      if (item.type === "choice" || item.type === "tf") {
        const opts = item.type === "tf" ? ["Верно", "Неверно"] : item.options;
        const correct = item.type === "tf" ? (item.answer ? 0 : 1) : item.answer;
        const wrap = el("div", "options");
        opts.forEach(function (label, idx) {
          const b = el("button", "opt", label);
          b.type = "button";
          if (st.resolved && idx === correct) b.classList.add("good");
          b.addEventListener("click", function () {
            if (st.resolved) return;
            const ok = idx === correct;
            if (ok) {
              st.resolved = true;
              st.firstTry = st.attempts === 0;
              b.classList.add("good");
              feedback(art, "good", "Да, верно.");
              finishMaybe();
              if (step) art.appendChild(nextBtn());
            } else {
              st.attempts += 1;
              b.classList.add("bad");
              feedback(art, "bad", "Пока не то. Попробуй ещё раз.");
              extras(art, i);
            }
          });
          wrap.appendChild(b);
        });
        art.appendChild(wrap);
      } else {
        const row = el("div", "num-row");
        const input = document.createElement("input");
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.setAttribute("aria-label", "Ответ");
        input.placeholder = "Ответ";
        const btn = el("button", "", "Проверить");
        btn.type = "button";
        function check() {
          if (st.resolved) return;
          if (!String(input.value).trim()) {
            feedback(art, "bad", "Сначала напиши ответ.");
            return;
          }
          if (matches(input.value, item)) {
            st.resolved = true;
            st.firstTry = st.attempts === 0;
            feedback(art, "good", "Да, верно.");
            input.disabled = true;
            finishMaybe();
            if (step) art.appendChild(nextBtn());
          } else {
            st.attempts += 1;
            feedback(art, "bad", "Пока не то. Проверь запятую, знак и не забыл ли корень.");
            extras(art, i);
          }
        }
        btn.addEventListener("click", check);
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
        row.appendChild(input);
        row.appendChild(btn);
        art.appendChild(row);
      }
      if (st.resolved && step && cursor < items.length) {
        /* already moved */
      }
      return art;
    }

    function feedback(art, kind, text) {
      let f = art.querySelector(":scope > .feedback");
      if (!f) {
        f = el("div", "feedback");
        art.appendChild(f);
      }
      f.className = "feedback " + kind;
      f.textContent = text;
    }

    function extras(art, i) {
      const st = state[i];
      const item = items[i];
      let actions = art.querySelector(":scope > .q-actions");
      if (!actions) {
        actions = el("div", "q-actions");
        art.appendChild(actions);
      }
      if (st.attempts >= 1 && item.hint && !actions.querySelector(".hint-btn")) {
        const h = el("button", "linkish hint-btn", "Подсказка");
        h.type = "button";
        h.addEventListener("click", function () {
          st.usedHint = true;
          let box = art.querySelector(".hintbox");
          if (!box) {
            box = el("div", "feedback hint hintbox", item.hint);
            art.appendChild(box);
          }
        });
        actions.appendChild(h);
      }
      if (st.attempts >= 2 && item.solution && !actions.querySelector(".sol-btn")) {
        const s = el("button", "linkish sol-btn", "Показать решение");
        s.type = "button";
        s.addEventListener("click", function () {
          st.usedSolution = true;
          st.resolved = true;
          let box = art.querySelector(".solution");
          if (!box) {
            box = el("div", "feedback hint solution", item.solution);
            art.appendChild(box);
          }
          finishMaybe();
          if (step) art.appendChild(nextBtn());
        });
        actions.appendChild(s);
      }
    }

    function nextBtn() {
      if (root.querySelector(".next-q")) return document.createElement("span");
      const b = el("button", "step-next next-q", cursor + 1 >= items.length ? "К итогам" : "Следующий вопрос");
      b.type = "button";
      b.addEventListener("click", function () {
        cursor += 1;
        draw();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return b;
    }

    function stars() {
      if (state.every(function (s) { return s.firstTry; })) return 3;
      if (state.every(function (s) { return !s.usedSolution; })) return 2;
      return 1;
    }

    function finishMaybe() {
      if (!state.every(function (s) { return s.resolved; })) return;
      if (!step) {
        root.classList.add("is-done");
        root.dispatchEvent(new CustomEvent("quizdone", { bubbles: true, detail: { stars: stars(), items: items, state: state } }));
      }
    }

    function showSummary() {
      root.classList.add("is-done");
      const nStars = stars();
      const correctFirst = state.filter(function (s) { return s.firstTry; }).length;
      if (root.dataset.mode === "diag") {
        const weak = {};
        items.forEach(function (item, i) {
          if (!state[i].firstTry) weak[item.topic] = true;
        });
        const slugs = window.ESO.topics.map(function (t) { return t.slug; }).filter(function (s) { return weak[s]; });
        window.ESOApp.Store.setDiag(slugs);
        const box = el("div", "summary");
        if (!slugs.length) {
          box.innerHTML = "<h3>Пробелов по этому тесту не видно</h3><p>Можно идти в тему, которую сейчас проходят в школе, или повторять по порядку с умножения.</p>";
        } else {
          box.innerHTML = "<h3>Вот что стоит пройти спокойно</h3><p>Ошибка — это не приговор. Это список, с чего начать. Не надо закрывать всё за один день: одна тема в день уже много.</p>";
          slugs.forEach(function (slug) {
            const t = window.ESOApp.topicBySlug(slug);
            const a = document.createElement("a");
            a.href = window.ESOApp.hrefTopic(slug);
            a.textContent = t.title + " — " + t.es;
            box.appendChild(a);
          });
        }
        const again = el("p", "", "");
        again.innerHTML = '<a href="' + window.ESOApp.hrefRoot("index.html") + '">На главную</a>';
        box.appendChild(again);
        box.appendChild(el("p", "", "С первого раза: " + correctFirst + " из " + items.length + "."));
        root.appendChild(box);
      } else {
        const slug = document.body.dataset.topic;
        if (slug && root.dataset.save === "final") window.ESOApp.Store.setStars(slug, nStars);
        const box = el("div", "summary");
        box.innerHTML = "<h3>" + window.ESOApp.starsHtml(nStars) + "</h3><p>С первого раза верно: " + correctFirst + " из " + items.length + ".</p><p>Три звезды — ни одной ошибки. Две — дошёл сам, с подсказками. Одна — где-то открыл решение. Это тоже учёба.</p>";
        root.appendChild(box);
        root.dispatchEvent(new CustomEvent("quizdone", { bubbles: true, detail: { stars: nStars } }));
      }
    }

    if (!step) {
      /* stacked: summary fires from finishMaybe */
    }
    draw();
  }

  document.querySelectorAll(".check").forEach(mount);
  window.ESOQuiz = { mount: mount, matches: matches };
})();
