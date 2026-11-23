
import { demoMatches, competitions, officialChannels } from "./data.js";
import { getFavorites, toggleFavorite } from "./storage.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function heading(title, description) {
  return `
    <h1 class="page-title">${escapeHtml(title)}</h1>
    <p class="page-description">${escapeHtml(description)}</p>
  `;
}

function getChannels() {
  return Array.isArray(officialChannels) ? officialChannels : [];
}

function renderChannelCards() {
  const channels = getChannels();

  if (!channels.length) {
    return `
      <div class="empty-state">
        Não existem canais oficiais configurados.
      </div>
    `;
  }

  return channels.map(channel => `
    <article class="channel-card">
      <h3>${escapeHtml(channel.name)}</h3>
      <p>${escapeHtml(channel.description)}</p>
      <a
        href="${escapeHtml(channel.url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Aceder à plataforma oficial ↗
      </a>
    </article>
  `).join("");
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
          <div class="team-name">
            ${escapeHtml(match.home)}
          </div>
        </div>

        <div class="score">${escapeHtml(score)}</div>

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
        <span>${escapeHtml(match.minute || match.kickoff || "")}</span>

        <button
          class="favorite-btn ${favorite ? "saved" : ""}"
          data-favorite="${escapeHtml(match.id)}"
          aria-label="Adicionar aos favoritos"
        >
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
        Não foram encontrados jogos nesta secção.
       </div>`;
}

function renderCompetitions() {
  if (!Array.isArray(competitions)) return "";

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
  const hero = $(".hero");

  hero.hidden = currentPage !== "inicio";

  const notice = `
    <div class="notice">
      <span>ⓘ</span>
      <p>
        O MEDBI Football Live apresenta informações e acessos
        a fontes oficiais. A disponibilidade das transmissões
        depende dos direitos de cada competição e da região.
      </p>
    </div>
  `;

  if (currentPage === "inicio") {
    content.innerHTML = `
      <div class="section-heading">
        <div>
          <span class="eyebrow">ACOMPANHA AGORA</span>
          <h2>Em destaque</h2>
        </div>
        <button class="text-btn" data-go="ao-vivo">
          Ver transmissões →
        </button>
      </div>

      ${notice}

      <div class="filter-row">
        <button class="chip ${currentFilter === "todos" ? "selected" : ""}"
          data-filter="todos">Todos</button>

        <button class="chip ${currentFilter === "live" ? "selected" : ""}"
          data-filter="live">Ao vivo</button>

        <button class="chip ${currentFilter === "upcoming" ? "selected" : ""}"
          data-filter="upcoming">Próximos</button>

        <button class="chip ${currentFilter === "finished" ? "selected" : ""}"
          data-filter="finished">Terminados</button>
      </div>

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(demoMatches);
  }

  else if (currentPage === "ao-vivo") {
    content.innerHTML = `
      ${heading(
        "Assistir ao vivo",
        "Encontra plataformas oficiais para acompanhar futebol."
      )}

      ${notice}

      <div class="section-heading">
        <div>
          <span class="eyebrow">FONTES AUTORIZADAS</span>
          <h2>Plataformas disponíveis</h2>
        </div>
      </div>

      ${renderChannelCards()}

      <div class="notice" style="margin-top:16px">
        <span>ⓘ</span>
        <p>
          Estes são acessos às plataformas oficiais, não uma
          confirmação de que estejam a transmitir um jogo neste
          momento. Os vídeos só poderão ser reproduzidos aqui
          quando a fonte disponibilizar incorporação autorizada.
        </p>
      </div>
    `;
  }

  else if (currentPage === "jogos") {
    content.innerHTML = `
      ${heading(
        "Todos os jogos",
        "Consulta os jogos disponíveis nesta aplicação."
      )}

      ${notice}

      <div class="match-list" id="matchList"></div>
    `;

    renderMatches(demoMatches);
  }

  else if (currentPage === "favoritos") {
    content.innerHTML = `
      ${heading(
        "Os teus favoritos",
        "Jogos que guardaste para acompanhar."
      )}

      <div class="match-list" id="matchList"></div>
    `;

    const favorites = demoMatches.filter(match =>
      getFavorites().includes(match.id)
    );

    renderMatches(favorites);
  }

  else if (currentPage === "competicoes") {
    content.innerHTML = `
      ${heading(
        "Competições",
        "Explora campeonatos e torneios."
      )}

      ${renderCompetitions()}
    `;
  }

  else if (currentPage === "canais") {
    content.innerHTML = `
      ${heading(
        "Canais oficiais",
        "Acede às plataformas oficiais de futebol."
      )}

      ${renderChannelCards()}
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
          O MEDBI Football Live procura facilitar o acesso
          a informações futebolísticas e a transmissões
          disponibilizadas por fontes oficiais.
        </p>
        <p>
          Não alojamos nem retransmitimos sinais televisivos
          sem autorização.
        </p>
      </div>
    `;
  }
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

// NAVEGAÇÃO E AÇÕES
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
    toast("Lista de favoritos atualizada.");
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
  if (event.key === "Escape") {
    closeMenu();
  }
});

// INICIALIZAÇÃO
renderPage();
