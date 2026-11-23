
/*
  MEDBI FOOTBALL LIVE
  API de futebol e preparação para pesquisa de transmissões.

  IMPORTANTE:
  - Não inventa canais nem transmissões.
  - A API-Football fornece dados de jogos.
  - Os canais só são apresentados quando existe
    informação de transmissão confirmada.
  - Não publiques chaves privadas em aplicações públicas.
*/

const API_BASE = "https://v3.football.api-sports.io";

// ======================================
// CONFIGURAÇÃO
// ======================================

let apiKey = "";

export function setApiKey(key) {
  apiKey = String(key || "").trim();
}

export function hasApiKey() {
  return apiKey.length > 0;
}

// ======================================
// PEDIDOS À API
// ======================================

async function apiRequest(endpoint, params = {}, key = apiKey) {
  if (!key) {
    throw new Error(
      "Não existe uma chave API configurada."
    );
  }

  const query = new URLSearchParams();

  Object.entries(params).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(name, String(value));
    }
  });

  const response = await fetch(
    `${API_BASE}/${endpoint}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": key
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erro da API-Football: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length) {
    throw new Error(
      JSON.stringify(data.errors)
    );
  }

  return data.response || [];
}

// ======================================
// CONVERTER JOGOS
// ======================================

function convertFixture(item) {
  const fixture = item.fixture || {};
  const league = item.league || {};
  const teams = item.teams || {};
  const goals = item.goals || {};
  const statusCode = fixture.status?.short || "";

  const liveStatuses = [
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "LIVE"
  ];

  const finishedStatuses = [
    "FT",
    "AET",
    "PEN"
  ];

  let status = "upcoming";

  if (liveStatuses.includes(statusCode)) {
    status = "live";
  } else if (finishedStatuses.includes(statusCode)) {
    status = "finished";
  }

  const kickoffDate = fixture.date
    ? new Date(fixture.date)
    : null;

  return {
    id: String(fixture.id || ""),

    competition: league.name || "Competição",

    home: teams.home?.name || "Equipa da casa",
    away: teams.away?.name || "Equipa visitante",

    homeIcon: "⚽",
    awayIcon: "⚽",

    homeScore: goals.home,
    awayScore: goals.away,

    status,

    minute: fixture.status?.elapsed
      ? `${fixture.status.elapsed}'`
      : "",

    kickoff: kickoffDate && !isNaN(kickoffDate)
      ? kickoffDate.toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "Por confirmar",

    date: fixture.date || "",
    country: league.country || "",
    leagueId: league.id || null,
    season: league.season || null,
    venue: fixture.venue?.name || "",
    elapsed: fixture.status?.elapsed || null,

    // Identificador para procurar transmissões.
    fixtureId: String(fixture.id || "")
  };
}

// ======================================
// PROCURAR JOGOS
// ======================================

export async function fetchFixtures({
  date,
  league,
  season,
  team,
  live,
  apiKey: suppliedKey
} = {}) {

  const key = suppliedKey || apiKey;

  if (!key) {
    throw new Error(
      "Configura uma chave API válida."
    );
  }

  const params = {};

  if (date) params.date = date;
  if (league) params.league = league;
  if (season) params.season = season;
  if (team) params.team = team;
  if (live) params.live = live === true ? "all" : live;

  const results = await apiRequest(
    "fixtures",
    params,
    key
  );

  return results.map(convertFixture);
}

// ======================================
// JOGOS AO VIVO
// ======================================

export async function fetchLiveFixtures(options = {}) {
  return fetchFixtures({
    ...options,
    live: true
  });
}

// ======================================
// JOGOS DE UMA DATA
// ======================================

export async function fetchFixturesByDate(date, options = {}) {
  if (!date) {
    throw new Error("Indica uma data válida.");
  }

  return fetchFixtures({
    ...options,
    date
  });
}

// ======================================
// JOGOS DE UMA LIGA
// ======================================

export async function fetchLeagueFixtures(
  league,
  season,
  options = {}
) {
  if (!league || !season) {
    throw new Error(
      "Indica o identificador da competição e a época."
    );
  }

  return fetchFixtures({
    ...options,
    league,
    season
  });
}

// ======================================
// CANAIS E TRANSMISSÕES
// ======================================

/*
  A API-Football não é uma fonte confirmada de
  direitos televisivos ou de URLs de vídeo.

  Esta função associa apenas transmissões que
  já tenham sido verificadas e configuradas
  em officialStreams, dentro de data.js.
*/

export function getAuthorizedStreams(
  fixtureId,
  streams = []
) {
  if (!fixtureId || !Array.isArray(streams)) {
    return [];
  }

  return streams.filter(stream => {
    return (
      String(stream.matchId) === String(fixtureId) &&
      stream.rightsConfirmed === true
    );
  });
}

// ======================================
// CANDIDATOS A CANAIS
// ======================================

/*
  Devolve canais organizados por prioridade.
  Isto NÃO confirma que tenham os direitos
  de transmissão de um jogo específico.
*/

export function getChannelCandidates(channels = []) {
  if (!Array.isArray(channels)) return [];

  return [...channels].sort((a, b) => {
    return (a.priority || 99) - (b.priority || 99);
  });
}

// ======================================
// ESTADO DA API
// ======================================

export function getApiStatus() {
  return {
    configured: hasApiKey(),
    provider: "API-Football",
    providesFixtures: true,
    confirmsBroadcastRights: false,
    providesAuthorizedVideo: false
  };
    }
