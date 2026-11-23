/*
  Fonte pública ESPN para resultados/agenda, sem chave API.
  Os endpoints são públicos, mas não constituem uma API comercial
  garantida; disponibilidade e CORS podem mudar.
*/
const LEAGUES = [
  ["eng.1","Premier League"],["esp.1","La Liga"],["ita.1","Serie A"],
  ["ger.1","Bundesliga"],["fra.1","Ligue 1"],["uefa.champions","UEFA Champions League"],
  ["bra.1","Brasileirão Série A"],["usa.1","MLS"]
];
const BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer";

function convert(event, leagueName="Futebol") {
  const comp = event.competitions?.[0] || {};
  const competitors = comp.competitors || [];
  const home = competitors.find(t=>t.homeAway==="home") || competitors[0] || {};
  const away = competitors.find(t=>t.homeAway==="away") || competitors[1] || {};
  const state = comp.status?.type?.state || event.status?.type?.state || "pre";
  const status = state==="in" ? "live" : state==="post" ? "finished" : "upcoming";
  const date = event.date ? new Date(event.date) : null;
  return {
    id:String(event.id),
    competition:event.season?.name || event.name || leagueName,
    home:home.team?.displayName || "Equipa da casa",
    away:away.team?.displayName || "Equipa visitante",
    homeScore:home.score ?? null,
    awayScore:away.score ?? null,
    homeIcon:"⚽",awayIcon:"⚽",
    status,
    minute:comp.status?.displayClock || "",
    kickoff:date && !isNaN(date) ? date.toLocaleString("pt-PT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "Hora por confirmar",
    date:event.date || "",
    country:event.competitions?.[0]?.venue?.address?.country || ""
  };
}

async function loadLeague(league, date) {
  const url = `${BASE}/${league}/scoreboard?dates=${date}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fonte de jogos indisponível (${response.status})`);
  const json = await response.json();
  const leagueName = LEAGUES.find(x=>x[0]===league)?.[1] || "Futebol";
  return (json.events || []).map(event=>convert(event,leagueName));
}

export async function fetchAllFixtures(date) {
  const settled = await Promise.allSettled(LEAGUES.map(([id])=>loadLeague(id,date)));
  const successful = settled.filter(x=>x.status==="fulfilled").flatMap(x=>x.value);
  if (!successful.length) throw new Error("Não foi possível obter jogos da fonte pública.");
  return successful;
}

export async function fetchLiveFixtures() {
  const games = await fetchAllFixtures(localDate());
  return games.filter(game=>game.status==="live");
}

export async function fetchFixturesByDate(date) {
  return fetchAllFixtures(date);
}

function localDate() {
  const d=new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
}
