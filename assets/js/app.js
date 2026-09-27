(function () {
  const E = window.ESO;
  const page = document.body.dataset.page || "";
  const inTopic = page === "topic";
  const KEY = "eso-math-v1";

  function topicBySlug(slug) {
    return E.topics.find(function (t) { return t.slug === slug; });
  }
  function hrefTopic(slug) {
    return (inTopic ? "" : "temas/") + slug + ".html";
  }
  function hrefRoot(file) {
    return (inTopic ? "../" : "") + file;
  }
  function blockOf(id) {
    return E.blocks.find(function (b) { return b.id === id; });
  }

  const Store = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    },
    write: function (data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },
    topic: function (slug) {
      const all = this.read();
      return all[slug] || { done: [], stars: 0 };
    },
    markLesson: function (slug, index) {
      const all = this.read();
      const t = all[slug] || { done: [], stars: 0 };
      if (t.done.indexOf(index) < 0) t.done.push(index);
      all[slug] = t;
      this.write(all);
    },
    setStars: function (slug, stars) {
      const all = this.read();
      const t = all[slug] || { done: [], stars: 0 };
      t.stars = Math.max(t.stars || 0, stars);
      all[slug] = t;
      this.write(all);
    },
    setDiag: function (weak) {
      const all = this.read();
      all.diag = { weak: weak, at: Date.now() };
      this.write(all);
    }
  };

  function starsHtml(n) {
    let s = "";
    for (let i = 1; i <= 3; i++) s += i <= n ? "★" : "☆";
    return s;
  }

  function buildChrome() {
    const topic = inTopic ? topicBySlug(document.body.dataset.topic) : null;
    if (topic) document.body.dataset.block = topic.block;
    const header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML =
      '<button type="button" class="icon-btn" id="open-menu" aria-label="Все темы">☰</button>' +
      '<div class="brand"><b id="brand-title"></b><span id="brand-sub"></span></div>' +
      (inTopic ? '<div class="bar" aria-hidden="true"><i id="progress-bar"></i></div><nav class="dots" id="dots" aria-label="Уроки"></nav>' : "");
    document.body.prepend(header);
    const title = document.getElementById("brand-title");
    const sub = document.getElementById("brand-sub");
    if (topic) {
      title.textContent = topic.title;
      sub.textContent = topic.es + " / " + topic.val;
    } else {
      title.textContent = "Математика ESO";
      sub.textContent = "1º и 2º · Дения";
    }

    const backdrop = document.createElement("div");
    backdrop.className = "backdrop hidden";
    backdrop.id = "backdrop";
    const sheet = document.createElement("div");
    sheet.className = "sheet hidden";
    sheet.id = "sheet";
    sheet.innerHTML = menuHtml();
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    function close() {
      backdrop.classList.add("hidden");
      sheet.classList.add("hidden");
    }
    document.getElementById("open-menu").addEventListener("click", function () {
      backdrop.classList.remove("hidden");
      sheet.classList.remove("hidden");
    });
    backdrop.addEventListener("click", close);
    sheet.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    if (inTopic) {
      const nav = document.createElement("nav");
      nav.className = "bottombar";
      nav.innerHTML =
        '<button type="button" class="navbtn secondary" id="go-prev">Назад</button>' +
        '<button type="button" class="navbtn" id="go-next">Дальше</button>';
      document.body.appendChild(nav);
      const now = document.createElement("p");
      now.className = "kicker";
      now.style.margin = "0 0 8px";
      if (topic && topic.slug === E.current) {
        now.textContent = "Сейчас эту тему проходят в школе";
        const main = document.getElementById("content");
        if (main) main.prepend(now);
      }
    }
  }

  function menuHtml() {
    const here = document.body.dataset.topic || "";
    let html = '<button type="button" class="ghost" data-close style="float:right">Закрыть</button><h2>Все темы</h2>';
    html += '<a class="row" href="' + hrefRoot("index.html") + '"><b>На главную</b></a>';
    html += '<a class="row" href="' + hrefRoot("diagnostico.html") + '"><span>Входной тест</span></a>';
    html += '<a class="row" href="' + hrefRoot("glosario.html") + '"><span>Словарь</span></a>';
    html += '<a class="row" href="' + hrefRoot("padres.html") + '"><span>Для родителей</span></a>';
    E.blocks.forEach(function (b) {
      html += '<div class="block-label">' + b.title + " · " + b.es + "</div>";
      E.topics.filter(function (t) { return t.block === b.id; }).forEach(function (t) {
        const prog = Store.topic(t.slug);
        const extra = prog.stars ? " " + starsHtml(prog.stars) : (prog.done.length ? " · начато" : "");
        html += '<a class="row' + (t.slug === here ? " here" : "") + '" href="' + hrefTopic(t.slug) + '"><span><b>' + t.title + "</b><br><small>" + t.es + extra + "</small></span></a>";
      });
    });
    return html;
  }

  function renderHome() {
    const root = document.getElementById("home");
    if (!root) return;
    document.body.dataset.block = "geometria";
    const cur = topicBySlug(E.current);
    const first = E.topics[0];
    let doneTopics = 0;
    E.topics.forEach(function (t) {
      const p = Store.topic(t.slug);
      if (p.stars > 0 || (p.done && p.done.length >= t.lessons)) doneTopics += 1;
    });
    let html = "";
    html += '<section class="hero"><p class="kicker">IES Maria Ibars · 2º ESO</p>';
    html += "<h1>Математика без пробелов</h1>";
    html += '<p class="lede">Объясняем с самого начала, по-русски. Рядом — как это называется в школе, на испанском и по-валенсийски. После каждого кусочка есть короткие вопросы.</p>';
    html += '<p class="lede">Пройдено тем: <b>' + doneTopics + "</b> из " + E.topics.length + ".</p></section>";
    html += '<a class="banner" href="' + hrefTopic(cur.slug) + '"><span>Сейчас в школе</span><strong>' + cur.title + "</strong>" + cur.es + " / " + cur.val + "<br><em>Открыть тему →</em></a>";
    html += '<div class="actions">';
    html += '<a class="primary" href="' + hrefTopic(first.slug) + '">Начать с простого</a>';
    html += '<a class="ghost" href="diagnostico.html">Входной тест</a>';
    html += '<a class="ghost" href="glosario.html">Словарь</a>';
    html += '<a class="ghost" href="padres.html">Для родителей</a>';
    html += "</div>";
    html += "<h2>Рекомендуемый путь</h2>";
    html += '<p class="lede">От простого к сложному. Если завтра урок по Пифагору, открой зелёную плашку выше и не жди, пока дойдёшь по порядку.</p>';
    html += '<div class="path">';
    E.topics.forEach(function (t, i) {
      const p = Store.topic(t.slug);
      html += '<a href="' + hrefTopic(t.slug) + '"><span class="n">' + (i + 1) + "</span><span><b>" + t.title + "</b><br><small>" + t.course + " · " + t.es + (p.stars ? " · " + starsHtml(p.stars) : "") + "</small></span></a>";
    });
    html += "</div>";
    E.blocks.forEach(function (b) {
      html += '<h2 class="section-title">' + b.title + "</h2>";
      html += '<p class="lede">' + b.blurb + " <i>" + b.es + (b.val ? " / " + b.val : "") + "</i></p>";
      html += '<div class="cards">';
      E.topics.filter(function (t) { return t.block === b.id; }).forEach(function (t) {
        const p = Store.topic(t.slug);
        const color = getComputedStyle(document.body).getPropertyValue("--accent");
        html += '<a class="card" data-b="' + b.id + '" href="' + hrefTopic(t.slug) + '"><span class="badge">' + t.course + "</span><strong>" + t.title + "</strong><small>" + t.es + " / " + t.val + "</small><span>" + t.blurb + "</span>" + (p.stars ? '<span class="stars">' + starsHtml(p.stars) + "</span>" : "") + "</a>";
        void color;
      });
      html += "</div>";
    });
    root.innerHTML = html;
    root.querySelectorAll(".card").forEach(function (card) {
      const map = { fundamento: "#b45309", numeros: "#1d4ed8", medida: "#0f766e", algebra: "#6d28d9", geometria: "#15803d", datos: "#c2410c" };
      card.style.setProperty("--c", map[card.dataset.b]);
    });
  }

  buildChrome();
  if (page === "home") renderHome();

  window.ESOApp = {
    Store: Store,
    topicBySlug: topicBySlug,
    hrefTopic: hrefTopic,
    hrefRoot: hrefRoot,
    blockOf: blockOf,
    starsHtml: starsHtml,
    inTopic: inTopic
  };
})();
