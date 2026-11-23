/*
  Integração futura com uma API de futebol.
  Segurança: não publiques uma chave privada diretamente num site público.
  Para produção, usa um backend/proxy para proteger a chave.
*/
const API_BASE = "https://v3.football.api-sports.io";
export async function fetchFixtures({date, league, season, apiKey} = {}) {
  if(!apiKey) throw new Error("Configura uma chave API válida antes de pedir dados reais.");
  const params = new URLSearchParams();
  if(date) params.set("date", date);
  if(league) params.set("league", league);
  if(season) params.set("season", season);
  const response = await fetch(`${API_BASE}/fixtures?${params}`, {
    headers: {"x-apisports-key": apiKey}
  });
  if(!response.ok) throw new Error(`Erro da API: ${response.status}`);
  const data = await response.json();
  return (data.response || []).map(item => ({
    id:String(item.fixture.id),
    competition:item.league.name,
    home:item.teams.home.name,
    away:item.teams.away.name,
    homeIcon:"⚽", awayIcon:"⚽",
    homeScore:item.goals.home, awayScore:item.goals.away,
    status:item.fixture.status.short === "LIVE" || item.fixture.status.short === "1H" || item.fixture.status.short === "2H" ? "live" :
      ["FT","AET","PEN"].includes(item.fixture.status.short) ? "finished" : "upcoming",
    minute:item.fixture.status.elapsed ? `${item.fixture.status.elapsed}'` : "",
    kickoff:new Date(item.fixture.date).toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit"})
  }));
}
