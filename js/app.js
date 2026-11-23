
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

import {
  fetchFixturesByDate,
  fetchLiveFixtures,
  getApiStatus,
  setApiKey
} from "./api.js";

// ======================================
// ESTADO DA APLICAÇÃO
// ======================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let currentPage = "inicio";
let currentFilter = "todos";
let searchTerm = "";
let selectedMatchId = null;
let matches = [...demoMatches];
let fixturesLoading = false;

// ======================================
// FUNÇÕES GERAIS
// ======================================

function toast(message) {
  const element = $("#toast");

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    element.classList.remove("show");
  }, 3000);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function openMenu() {
  $("#sidebar")?.classList.add("open");
  $("#scrim")?.classList.add("show");
}

function closeMenu() {
  $("#sidebar")?.classList.remove("open");
  $("#scrim")?.classList.remove("show");
}

function localDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function heading(title, subtitle = "") {
  return `
    <div class="section-heading">
      <div>
        <h2>${escapeHtml(title)}</h2>
        ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
      </div>
      <button class="text-btn" data-refresh>
        ↻ Atualizar jogos
      </button>
    </div>
  `;
}

// ======================================
// JOGOS
// ======================================

function matchCard(match) {
  const favoriteIds = getFavorites();
  const favorite = favoriteIds.includes(String(match.id));

  const score = match.status === "upcoming"
    ? "VS"
    : `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;

  const statusLabel = {
    live: "AO VIVO",
    upcoming: "PRÓXIMO",
    finished: "TERMINADO"
  }[match.status] || "JOGO";

  return `
    <article class="match-card">
      <div class="match-top">
        <span>${escapeHtml(match.competition || "Futebol")}</span>
        <span class="${match.status === "live" ? "live-label" : "match-status"}">
          ${statusLabel}
          ${match.status === "live" && match.minute
            ? ` · ${escapeHtml(match.minute)}`
            : ""}
        </span>
      </div>

      <div class="match-teams">
        <div class="team">
          <span class="team-icon">${escapeHtml(match.homeIcon || "⚽")}</span>
          <strong>${escapeHtml(match.home)}</strong>
        </div>

        <div class="match-score">${score}</div>

        <div class="team">
          <span class="team-icon">${escapeHtml(match.awayIcon || "⚽")}</span>
          <strong>${escapeHtml(match.away)}</strong>
        </div>
      </div>

      <div class="match-bottom">
        <span>${escapeHtml(match.kickoff || "Hora por confirmar")}</span>

        <div class="match-actions">
          <button class="icon-btn"
            data-favorite="${escapeHtml(String(match.id))}"
            aria-label="Adicionar aos favoritos">
            ${favorite ? "★" : "☆"}
          </button>

          <button class="text-btn"
            data-watch-match="${escapeHtml(String(match.id))}">
            Transmissões
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMatches(list, target = "#matchList") {
  const container = $(target);

  if (!container) return;

  let filtered = [...list];

  if (currentFilter === "live") {
    filtered = filtered.filter(match => match.status === "live");
  } else if (currentFilter === "upcoming") {
    filtered = filtered.filter(match => match.status === "upcoming");
  } else if (currentFilter === "finished") {
    filtered = filtered.filter(match => match.status === "finished");
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();

    filtered = filtered.filter(match =>
      `${match.home} ${match.away} ${match.competition}`
        .toLowerCase()
        .includes(term)
    );
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚽</div>
        <h3>Nenhum jogo encontrado</h3>
        <p>Não existem jogos para apresentar nesta secção.</p>
        <button class="text-btn" data-refresh>
          Atualizar jogos
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(matchCard).join("");
}

// ======================================
// CANAIS
// ======================================

function renderChannels() {
  const container = $("#pageContent");
  if (!container) return;

  const groups = [
    { priority: 1, title: "Portugal" },
    { priority: 2, title: "Brasil" },
    { priority: 3, title: "África" },
    { priority: 4, title: "Canais árabes" },
    { priority: 5, title: "Internacionais" }
  ];

  container.innerHTML = `
    ${heading("Canais de televisão", "Canais candidatos a transmitir futebol")}

    <div class="channel-notice">
      A presença de um canal nesta lista não confirma que transmite
      uma partida específica. A programação e os direitos devem ser
      confirmados para cada jogo.
    </div>

    ${groups.map(group => {
      const channels = officialChannels.filter(
        channel => channel.priority === group.priority
      );

      if (!channels.length) return "";

      return `
        <section class="channel-group">
          <h3>${group.title}</h3>

          <div class="channel-list">
            ${channels.map(channel => `
              <article class="channel-card">
                <div>
                  <h4>${escapeHtml(channel.name)}</h4>
                  <p>${escapeHtml(channel.description || "")}</p>
                  <small>
                    ${escapeHtml(channel.country || "")}
                    · ${escapeHtml(channel.language || "")}
                    · ${escapeHtml(channel.access || "")}
                  </small>
                </div>
                <span class="channel-type">
                  ${escapeHtml(channel.type || "Canal")}
                </span>
              </article>
            `).join("")}
          </div>
        </section>
      `;
    }).join("")}
  `;
}

// ======================================
// TRANSMISSÕES DE UMA PARTIDA
// ======================================

function safeEmbedUrl(stream) {
  if (stream.videoId) {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(stream.videoId)}`;
  }

  if (!stream.embedUrl) return "";

  try {
    const url = new URL(stream.embedUrl);

    const allowedHosts = [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "youtube-nocookie.com"
    ];

    if (
      url.protocol !== "https:" ||
      !allowedHosts.includes(url.hostname) ||
      !url.pathname.startsWith("/embed/")
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function renderStreams(matchId) {
  const container = $("#pageContent");
  if (!container) return;

  const match = matches.find(
    item => String(item.id) === String(matchId)
  );

  if (!match) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Partida não encontrada</h3>
        <button class="text-btn" data-page="jogos">Voltar aos jogos</button>
      </div>
    `;
    return;
  }

  const authorized = officialStreams.filter(stream =>
    String(stream.matchId) === String(matchId) &&
    stream.rightsConfirmed === true
  );

  const playable = authorized
    .map(stream => ({
      stream,
      embed: safeEmbedUrl(stream)
    }))
    .filter(item => item.embed);

  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h2>Transmissões</h2>
        <p>${escapeHtml(match.home)} vs ${escapeHtml(match.away)}</p>
      </div>
      <button class="text-btn" data-clear-match>← Voltar</button>
    </div>

    ${playable.length ? playable.map(item => `
      <article class="stream-card">
        <h3>${escapeHtml(item.stream.channelName || "Transmissão oficial")}</h3>
        <div class="video-player">
          <iframe
            src="${escapeHtml(item.embed)}"
            title="Transmissão oficial"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      </article>
    `).join("") : `
      <div class="empty-state">
        <div class="empty-icon">📺</div>
        <h3>Transmissão não disponível dentro do MEDBI</h3>
        <p>
          Ainda não existe uma transmissão oficial autorizada e
          compatível com o leitor do aplicativo para esta partida.
        </p>
      </div>
    `}
  `;
}

// ======================================
// COMPETIÇÕES
// ======================================

function renderCompetitions() {
  const container = $("#pageContent");
  if (!container) return;

  container.innerHTML = `
    ${heading("Competições", "Futebol nacional e internacional")}

    <div class="competition-list">
      ${competitions.map(item => `
        <article class="competition-card">
          <div>
            <h3>${escapeHtml(item[0])}</h3>
            <p>${escapeHtml(item[1])}</p>
          </div>
          <span>›</span>
        </article>
      `).join("")}
    </div>
  `;
}

// ======================================
// ATUALIZAR JOGOS REAIS
// ======================================

async function refreshFixtures() {
  if (fixturesLoading) return;

  let status = getApiStatus();

  if (!status.configured) {
    const key = prompt(
      "Introduz a tua chave API-Football para carregar jogos reais:"
    );

    if (!key || !key.trim()) {
      toast("Não foi configurada nenhuma chave API.");
      return;
    }

    setApiKey(key.trim());
    status = getApiStatus();
  }

  fixturesLoading = true;
  toast("A carregar jogos...");

  try {
    const [live, todayMatches] = await Promise.all([
      fetchLiveFixtures(),
      fetchFixturesByDate(localDate())
    ]);

    const combined = [...live, ...todayMatches];

    matches = [
      ...new Map(
        combined.map(match => [String(match.id), match])
      ).values()
    ];

    renderPage();
    toast(`${matches.length} jogos encontrados.`);
  } catch (error) {
    console.error(error);
    toast("Não foi possível carregar os jogos. Verifica a API.");
  } finally {
    fixturesLoading = false;
  }
}

// ======================================
// PÁGINAS
// ======================================

function renderPage() {
  const container = $("#pageContent");
  if (!container) return;

  if (selectedMatchId !== null) {
    renderStreams(selectedMatchId);
    return;
  }

  switch (currentPage) {
    case "inicio":
      container.innerHTML = `
        ${heading("Jogos", "Acompanha o futebol no MEDBI")}
        <div id="matchList"></div>
      `;
      renderMatches(matches);
      break;

    case "ao-vivo":
      container.innerHTML = `
        ${heading("Jogos ao vivo", "Partidas em andamento")}
        <div id="matchList"></div>
      `;
      renderMatches(
        matches.filter(match => match.status === "live")
      );
      break;

    case "jogos":
      container.innerHTML = `
        ${heading("Todos os jogos", "Calendário de partidas")}
        <div class="quick-filters" id="quickFilters">
          <button data-filter="todos">Todos</button>
          <button data-filter="live">Ao vivo</button>
          <button data-filter="upcoming">Próximos</button>
          <button data-filter="finished">Terminados</button>
        </div>
        <div id="matchList"></div>
      `;
      renderMatches(matches);
      break;

    case "favoritos": {
      const favorites = getFavorites().map(String);
      const favoriteMatches = matches.filter(
        match => favorites.includes(String(match.id))
      );

      container.innerHTML = `
        ${heading("Os meus favoritos", "As tuas partidas guardadas")}
        <div id="matchList"></div>
      `;
      renderMatches(favoriteMatches);
      break;
    }

    case "competicoes":
      renderCompetitions();
      break;

    case "canais":
      renderChannels();
      break;

    case "sobre":
      container.innerHTML = `
        <div class="section-heading">
          <div>
            <h2>Sobre o MEDBI Football Live</h2>
            <p>O futebol da Guiné-Bissau e do mundo.</p>
          </div>
        </div>

        <article class="about-card">
          <h3>MEDBI Football Live</h3>
          <p>
            Plataforma dedicada ao acompanhamento do futebol,
            com especial atenção às equipas e aos jogadores
            da Guiné-Bissau.
          </p>
          <p>
            As transmissões só serão reproduzidas quando existir
            uma fonte oficial autorizada e compatível.
          </p>
        </article>
      `;
      break;

    default:
      currentPage = "inicio";
      renderPage();
  }

  $$(".sidebar [data-page], .bottom-nav [data-page]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === currentPage
    );
  });
}

// ======================================
// NAVEGAÇÃO
// ======================================

function setPage(page) {
  selectedMatchId = null;
  currentPage = page;
  currentFilter = "todos";

  closeMenu();
  renderPage();
}

// ======================================
// EVENTOS
// ======================================

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

  const refreshButton = event.target.closest("[data-refresh]");

  if (refreshButton) {
    refreshFixtures();
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
    toggleFavorite(String(favoriteButton.dataset.favorite));
    renderPage();
    toast("Favoritos atualizados.");
    return;
  }

  const watchButton = event.target.closest("[data-watch-match]");

  if (watchButton) {
    selectedMatchId = String(watchButton.dataset.watchMatch);
    renderPage();
    return;
  }

  const clearButton = event.target.closest("[data-clear-match]");

  if (clearButton) {
    selectedMatchId = null;
    renderPage();
    return;
  }
});

// ======================================
// MENU E PESQUISA
// ======================================

$("#menuButton")?.addEventListener("click", openMenu);
$("#closeMenu")?.addEventListener("click", closeMenu);
$("#scrim")?.addEventListener("click", closeMenu);

$("#searchToggle")?.addEventListener("click", () => {
  $("#searchPanel")?.classList.toggle("open");
  $("#searchInput")?.focus();
});

$("#searchInput")?.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderPage();
});

$("#clearSearch")?.addEventListener("click", () => {
  searchTerm = "";

  const input = $("#searchInput");
  if (input) input.value = "";

  renderPage();
});

// ======================================
// INICIALIZAÇÃO
// ======================================

renderPage();
