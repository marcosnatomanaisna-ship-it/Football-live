
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
let selectedMatchId = null;

function toast(message) {
  const el = $("#toast");
  if (!el) return;

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

    if (url.protocol !== "https:") return "";

    return url.href;
  } catch {
    return "";
  }
}

// Aceita apenas vídeos incorporados do YouTube.
function safeYoutubeEmbed(value) {
  try {
    const url = new URL(value);

    const hosts = [
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
      "www.youtube.com",
      "youtube.com"
    ];

    if (!hosts.includes(url.hostname)) return "";

    if (!/^\/embed\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function youtubeEmbedFromId(videoId) {
  if (!/^[a-zA-Z0-9_-]{6,20}$/.test(String(videoId || ""))) {
    return "";
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function getStreamEmbed(stream) {
  if (stream.videoId) {
    return youtubeEmbedFromId(stream.videoId);
  }

  return safeYoutubeEmbed(stream.embedUrl);
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
        e da disponibilidade em cada país. O MEDBI utiliza
        apenas fontes oficiais autorizadas.
      </p>
    </div>
  `;
}

// PRIORIDADE DOS CANAIS
function getSortedChannels() {
  return [...officialChannels].sort((a, b) => {
    return (a.priority || 99) - (b.priority || 99);
  });
}

function renderChannels() {
  const channels = getSortedChannels();

  if (!channels.length) {
    return `
      <div class="empty-state">
        Nenhum canal configurado.
      </div>
    `;
  }

  const groups = [
    { priority: 1, title: "Portugal" },
    { priority: 2, title: "Brasil" },
    { priority: 3, title: "África" },
    { priority: 4, title: "Países árabes" },
    { priority: 5, title: "Internacionais" }
  ];

  return groups.map(group => {
    const items = channels.filter(
      channel => (channel.priority || 99) === group.priority
    );

    if (!items.length) return "";

    return `
      <section class="channel-group">
        <h2 style="font-size:17px;margin:22px 0 12px">
          ${escapeHtml(group.title)}
        </h2>

        ${items.map(channel => `
          <article class="channel-card">
            <div class="stream-info">
              <h3>${escapeHtml(channel.name)}</h3>
              <span class="stream-status">
                ${escapeHtml(channel.access || "Acesso variável")}
              </span>
            </div>

            <p>${escapeHtml(channel.description)}</p>

            <div class="stream-source">
              ${escapeHtml(channel.country || "")}
              · ${escapeHtml(channel.language || "")}
            </div>

            <small style="color:var(--muted)">
              A transmissão deste canal depende dos direitos
              da competição e da disponibilidade regional.
            </small>
          </article>
        `).join("")}
      </section>
    `;
  }).join("");
}

// TRANSMISSÕES
function renderStreams(matchId = null) {
  let streams = [...officialStreams];

  if (matchId) {
    streams = streams.filter(stream =>
      String(stream.matchId) === String(matchId)
    );
  }

  if (!streams.length) {
    return `
      <div class="empty-state">
        <div style="font-size:30px;margin-bottom:12px">▶</div>

        <strong>Transmissão não disponível dentro do MEDBI.</strong>

        <p>
          Ainda não existe uma transmissão oficial autorizada
          e confirmada para esta seleção.
        </p>
      </div>
    `;
  }

  return streams.map(stream => {
    const embed = getStreamEmbed(stream);

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

                  <h3>Transmissão não disponível</h3>

                  <p>
                    Não existe um leitor incorporável autorizado
                    para esta transmissão.
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
            ${escapeHtml(stream.status || "CONFIRMADO")}
          </span>
        </div>

        <p class="stream-source">
          ${escapeHtml(stream.competition || "")}
          · ${escapeHtml(stream.channel || "")}
        </p>

        <p class="stream-source">
          ${escapeHtml(stream.language || "")}
          ${stream.access ? " · " + escapeHtml(stream.access) : ""}
        </p>

        ${
          !embed
            ? `<small style="color:var(--muted)">
                 Reprodução dentro da aplicação indisponível.
               </small>`
            : ""
        }

      </article>
    `;
  }).join("");
}

// JOGOS
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

          <div class="team-name">
            ${escapeHtml(match.home)}
          </div>
        </div>

        <div class="score">
          ${escapeHtml(score)}
        </div>

        <div class="team">
          <div class="team-crest">
            ${escapeHtml(match.awayIcon || "⚽")}
          </div>

          <div class="team-name">
            ${escapeHtml(match.away)}
          </div>
        </div>
      </div>

      <div class="match-foot">
        <span>
          ${escapeHtml(match.minute || match.kickoff || "")}
        </span>

        <button
          class="favorite-btn ${favorite ? "saved" : ""}"
          data-favorite="${escapeHtml(match.id)}"
          aria-label="Adicionar aos favoritos">
          ${favorite ? "♥" : "♡"}
        </button>
      </div>

      <button
        class="stream-button"
        data-watch-match="${escapeHtml(match.id)}">
        Procurar transmissões →
      </button>

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
    : `
      <div class="empty-state">
        Não existem jogos nesta secção.
      </div>
    `;
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

// PÁGINAS
function renderPage() {
  const content = $("#pageContent");

  if (!content) return;

  const hero = $(".hero");

  if (hero) {
    hero.hidden = currentPage !== "inicio";
  }

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

        <button class="text-btn" data-go="jogos">
          Ver todos →
        </button>
      </div>

      <div class="filter-row">
        ${filterButtons()}
      </div>

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(demoMatches);
  }

  else if (currentPage === "ao-vivo") {
    const selectedMatch = demoMatches.find(
      match => String(match.id) === String(selectedMatchId)
    );

    content.innerHTML = `
      ${heading(
        selectedMatch
          ? `${selectedMatch.home} × ${selectedMatch.away}`
          : "Assistir ao vivo",
        selectedMatch
          ? "Transmissões associadas a este jogo."
          : "Transmissões oficiais disponíveis."
      )}

      ${renderNotice()}

      ${renderStreams(selectedMatchId)}

      ${
        selectedMatch
          ? `
            <button class="text-btn" data-clear-match>
              ← Ver todas as transmissões
            </button>
          `
          : ""
      }

      <h2 style="font-size:18px;margin:25px 0 14px">
        Canais por prioridade
      </h2>

      ${renderChannels()}
    `;
  }

  else if (currentPage === "jogos") {
    content.innerHTML = `
      ${heading(
        "Todos os jogos",
        "Seleciona uma partida para procurar os canais."
      )}

      <div class="filter-row">
        ${filterButtons()}
      </div>

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
      ${heading(
        "Competições",
        "Campeonatos e torneios."
      )}

      ${renderCompetitions()}
    `;
  }

  else if (currentPage === "canais") {
    content.innerHTML = `
      ${heading(
        "Canais oficiais",
        "Canais organizados por prioridade de idioma."
      )}

      ${renderNotice()}

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
          O MEDBI Football Live organiza informações sobre
          futebol e transmissões oficiais.
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
  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    renderPage();
    toast("Favoritos atualizados.");
    return;
  }

  const watchButton = event.target.closest("[data-watch-match]");

  if (watchButton) {
    selectedMatchId = watchButton.dataset.watchMatch;
    setPage("ao-vivo");
    return;
  }

  if (event.target.closest("[data-clear-match]")) {
    selectedMatchId = null;
    renderPage();
    return;
  }

  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    selectedMatchId = null;
    setPage(pageButton.dataset.page);
    return;
  }

  const goButton = event.target.closest("[data-go]");

  if (goButton) {
    selectedMatchId = null;
    setPage(goButton.dataset.go);
    return;
  }

  const filterButton = event.target.closest("[data-filter]");

  if (filterButton) {
    currentFilter = filterButton.dataset.filter;
    renderPage();
  }
});

// MENU
$("#menuButton")?.addEventListener("click", openMenu);
$("#closeMenu")?.addEventListener("click", closeMenu);
scrim?.addEventListener("click", closeMenu);

// PESQUISA
$("#searchToggle")?.addEventListener("click", () => {
  const panel = $("#searchPanel");

  if (!panel) return;

  panel.hidden = !panel.hidden;

  if (!panel.hidden) {
    $("#searchInput")?.focus();
  }
});

$("#searchInput")?.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderPage();
});

$("#clearSearch")?.addEventListener("click", () => {
  const input = $("#searchInput");

  if (input) input.value = "";

  searchTerm = "";
  renderPage();
});

// TECLADO
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

// INICIAR
renderPage();
    
