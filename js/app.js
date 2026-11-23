
import {
  demoMatches,
  competitions,
  officialChannels,
  officialStreams
} from "./data.js";

import {
  getFavorites,
  toggleFavorite
} from "./storage.js";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const sidebar = $("#sidebar");
const scrim = $("#scrim");

let currentPage = "inicio";
let currentFilter = "todos";
let searchTerm = "";

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }
    return url.href;
  } catch {
    return "";
  }
}

function safeYoutubeEmbed(value) {
  try {
    const url = new URL(value);

    const validHost = [
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
      "www.youtube.com",
      "youtube.com"
    ].includes(url.hostname);

    if (!validHost) return "";

    if (!/^\/embed\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function openMenu() {
  sidebar.classList.add("open");
  scrim.classList.add("show");
  $("#menuButton").setAttribute("aria-expanded", "true");
}

function closeMenu() {
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
  $("#menuButton").setAttribute("aria-expanded", "false");
}

function heading(title, description) {
  return `
    <h1 class="page-title">${escapeHtml(title)}</h1>
    <p class="page-description">${escapeHtml(description)}</p>
  `;
}

function renderNotice() {
  return `
    <div class="notice">
      <span>ⓘ</span>
      <p>
        As transmissões dependem dos direitos de transmissão
        e da disponibilidade em cada país. Utilizamos apenas
        fontes oficiais.
      </p>
    </div>
  `;
}

function renderChannels() {
  if (!officialChannels.length) {
    return `<div class="empty-state">Nenhum canal configurado.</div>`;
  }

  return officialChannels.map(channel => {
    const url = safeUrl(channel.url);
    if (!url) return "";

    return `
      <article class="channel-card">
        <h3>${escapeHtml(channel.name)}</h3>
        <p>${escapeHtml(channel.description)}</p>
        <a href="${escapeHtml(url)}"
           target="_blank"
           rel="noopener noreferrer">
          Visitar plataforma oficial ↗
        </a>
      </article>
    `;
  }).join("");
}

function renderStreams() {
  if (!officialStreams.length) {
    return `
      <div class="empty-state">
        <div style="font-size:30px;margin-bottom:12px">▶</div>
        <strong>Não existem transmissões confirmadas.</strong>
        <p>
          Quando adicionarmos um vídeo oficial disponível,
          poderás assistir aqui.
        </p>
      </div>
    `;
  }

  return officialStreams.map(stream => {
    const embed = safeYoutubeEmbed(stream.embedUrl);
    const external = safeUrl(stream.url);

    return `
      <article class="channel-card video-section">

        <div class="video-player">
          ${
            embed
              ? `
                <iframe
                  src="${escapeHtml(embed)}"
                  title="${escapeHtml(stream.title)}"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write;
                  encrypted-media; gyroscope; picture-in-picture;
                  web-share"
                  allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin">
                </iframe>
              `
              : `
                <div class="video-placeholder">
                  <div class="play-icon">▶</div>
                  <h3>Transmissão oficial</h3>
                  <p>
                    Este vídeo não permite reprodução incorporada.
                    Utiliza o acesso à fonte oficial.
                  </p>
                </div>
              `
          }
        </div>

        <div class="stream-info">
          <div class="stream-title">
            ${escapeHtml(stream.title)}
          </div>
          <span class="stream-status">
            ${escapeHtml(stream.status || "DISPONÍVEL")}
          </span>
        </div>

        <p class="stream-source">
          ${escapeHtml(stream.competition || "")}
          · ${escapeHtml(stream.channel || "")}
        </p>

        ${
          external
            ? `
              <a class="stream-button"
                 href="${escapeHtml(external)}"
                 target="_blank"
                 rel="noopener noreferrer">
                Assistir na fonte oficial ↗
              </a>
            `
            : ""
        }

      </article>
    `;
  }).join("");
}

function matchCard(match) {
  const favorite = getFavorites().includes(match.id);

  const state = match.status === "live"
    ? "live"
    : match.status === "finished"
      ? "finished"
      : "upcoming";

  const label = state === "live"
    ? "AO VIVO"
    : state === "finished"
      ? "TERMINADO"
      : "PRÓXIMO";

  const score = state === "upcoming"
    ? match.kickoff || "Por confirmar"
    : `${match.homeScore ?? 0} : ${match.awayScore ?? 0}`;

  return `
    <article class="match-card">

      <div class="match-meta">
        <span>${escapeHtml(match.competition)}</span>
        <span class="status ${state}">
          ${state === "live" ? '<i class="live-dot"></i>' : ""}
          ${label}
        </span>
      </div>

      <div class="teams">
        <div class="team">
          <div class="team-crest">
            ${escapeHtml(match.homeIcon || "⚽")}
          </div>
          <div class="team-name">${escapeHtml(match.home)}</div>
        </div>

        <div class="score">${escapeHtml(score)}</div>

        <div class="team">
          <div class="team-crest">
            ${escapeHtml(match.awayIcon || "⚽")}
          </div>
          <div class="team-name">${escapeHtml(match.away)}</div>
        </div>
      </div>

      <div class="match-foot">
        <span>${escapeHtml(match.minute || match.kickoff || "")}</span>

        <button
          class="favorite-btn ${favorite ? "saved" : ""}"
          data-favorite="${escapeHtml(match.id)}">
          ${favorite ? "♥" : "♡"}
        </button>
      </div>

    </article>
  `;
}

function renderMatches(matches) {
  const list = $("#matchList");
  if (!list) return;

  const filtered = matches.filter(match => {
    const filterOk =
      currentFilter === "todos" ||
      match.status === currentFilter;

    const query = searchTerm.toLowerCase();

    const searchOk = !query || [
      match.home,
      match.away,
      match.competition
    ].some(value =>
      String(value ?? "").toLowerCase().includes(query)
    );

    return filterOk && searchOk;
  });

  list.innerHTML = filtered.length
    ? filtered.map(matchCard).join("")
    : `<div class="empty-state">
         Não existem jogos nesta secção.
       </div>`;
}

function renderCompetitions() {
  return `
    <div class="competition-grid">
      ${competitions.map(([name, country]) => `
        <div class="competition">
          🏆 ${escapeHtml(name)}
          <small>${escapeHtml(country)}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPage() {
  const content = $("#pageContent");
  $(".hero").hidden = currentPage !== "inicio";

  if (currentPage === "inicio") {
    content.innerHTML = `
      <div class="section-heading">
        <div>
          <span class="eyebrow">MEDBI FOOTBALL LIVE</span>
          <h2>Transmissões</h2>
        </div>
        <button class="text-btn" data-go="ao-vivo">
          Ver todas →
        </button>
      </div>

      ${renderNotice()}

      <div class="video-section">
        <h2 style="font-size:17px;margin-bottom:14px">
          Jogos para assistir
        </h2>
        ${renderStreams()}
      </div>

      <div class="section-heading">
        <div>
          <span class="eyebrow">ACOMPANHA AGORA</span>
          <h2>Jogos</h2>
        </div>
        <button class="text-btn" data-go="jogos">Ver todos →</button>
      </div>

      <div class="filter-row">
        ${filterButtons()}
      </div>

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(demoMatches);
  }

  else if (currentPage === "ao-vivo") {
    content.innerHTML = `
      ${heading(
        "Assistir ao vivo",
        "Transmissões oficiais disponíveis."
      )}

      ${renderNotice()}

      ${renderStreams()}

      <h2 style="font-size:18px;margin:25px 0 14px">
        Canais oficiais
      </h2>

      ${renderChannels()}
    `;
  }

  else if (currentPage === "jogos") {
    content.innerHTML = `
      ${heading("Todos os jogos", "Jogos e partidas disponíveis.")}

      <div class="filter-row">${filterButtons()}</div>

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(demoMatches);
  }

  else if (currentPage === "favoritos") {
    content.innerHTML = `
      ${heading("Favoritos", "Os teus jogos guardados.")}

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(
      demoMatches.filter(match =>
        getFavorites().includes(match.id)
      )
    );
  }

  else if (currentPage === "competicoes") {
    content.innerHTML = `
      ${heading("Competições", "Campeonatos e torneios.")}

      ${renderCompetitions()}
    `;
  }

  else if (currentPage === "canais") {
    content.innerHTML = `
      ${heading("Canais oficiais", "Plataformas de transmissão.")}

      ${renderChannels()}
    `;
  }

  else {
    content.innerHTML = `
      ${heading(
        "Sobre o MEDBI Football Live",
        "Uma plataforma dedicada ao futebol."
      )}

      <div class="channel-card">
        <h3>O nosso compromisso</h3>
        <p>
          O MEDBI Football Live organiza informações e
          disponibiliza acesso a fontes oficiais.
        </p>
        <p>
          Não retransmitimos sinais televisivos sem autorização.
        </p>
      </div>
    `;
  }
}

function filterButtons() {
  const filters = [
    ["todos", "Todos"],
    ["live", "Ao vivo"],
    ["upcoming", "Próximos"],
    ["finished", "Terminados"]
  ];

  return filters.map(([value, label]) => `
    <button
      class="chip ${currentFilter === value ? "selected" : ""}"
      data-filter="${value}">
      ${label}
    </button>
  `).join("");
}

function setPage(page) {
  currentPage = page;
  closeMenu();

  $$(".nav-link[data-page], .bottom-link[data-page]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });

  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// CLIQUES
document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    setPage(pageButton.dataset.page);
    return;
  }

  const goButton = event.target.closest("[data-go]");

  if (goButton) {
    setPage(goButton.dataset.go);
    return;
  }

  const filterButton = event.target.closest("[data-filter]");

  if (filterButton) {
    currentFilter = filterButton.dataset.filter;
    renderPage();
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    renderPage();
    toast("Favoritos atualizados.");
  }
});

// MENU
$("#menuButton").addEventListener("click", openMenu);
$("#closeMenu").addEventListener("click", closeMenu);
scrim.addEventListener("click", closeMenu);

// PESQUISA
$("#searchToggle").addEventListener("click", () => {
  const panel = $("#searchPanel");
  panel.hidden = !panel.hidden;

  if (!panel.hidden) {
    $("#searchInput").focus();
  }
});

$("#searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderPage();
});

$("#clearSearch").addEventListener("click", () => {
  $("#searchInput").value = "";
  searchTerm = "";
  renderPage();
});

// TECLADO
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

// INICIAR
renderPage();
      
