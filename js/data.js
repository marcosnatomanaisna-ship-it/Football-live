export const competitions = [
  ["Campeonato Nacional","Guiné-Bissau"],
  ["Taça Nacional","Guiné-Bissau"],
  ["CAF Champions League","África"],
  ["CAF Confederation Cup","África"],
  ["FIFA World Cup","Internacional"],
  ["UEFA Champions League","Europa"],
  ["Premier League","Inglaterra"],
  ["La Liga","Espanha"],
  ["Serie A","Itália"],
  ["Bundesliga","Alemanha"],
  ["Ligue 1","França"],
  ["Brasileirão Série A","Brasil"],
  ["Copa Libertadores","América do Sul"]
];

export const officialChannels = [
  {id:"sporttv",name:"Sport TV",description:"Desporto e futebol.",country:"Portugal",language:"Português",access:"Pago",priority:1,type:"TV",url:"https://www.sporttv.pt/"},
  {id:"rtp",name:"RTP Play",description:"Conteúdos da RTP e eventos selecionados.",country:"Portugal",language:"Português",access:"Gratuito",priority:1,type:"Streaming",url:"https://www.rtp.pt/play/"},
  {id:"canal11",name:"Canal 11",description:"Futebol português e programas desportivos.",country:"Portugal",language:"Português",access:"Gratuito/Pago conforme operador",priority:1,type:"TV",url:"https://www.canal11.pt/"},
  {id:"globo",name:"TV Globo",description:"Futebol e programação desportiva.",country:"Brasil",language:"Português",access:"Conforme região e operador",priority:2,type:"TV",url:"https://globoplay.globo.com/"},
  {id:"sportvbr",name:"SporTV",description:"Canal desportivo brasileiro.",country:"Brasil",language:"Português",access:"Pago",priority:2,type:"TV",url:"https://globoplay.globo.com/"},
  {id:"cazetv",name:"CazéTV",description:"Transmissões selecionadas e eventos desportivos.",country:"Brasil",language:"Português",access:"Gratuito em eventos selecionados",priority:2,type:"Streaming",url:"https://www.youtube.com/@CazeTV"},
  {id:"supersport",name:"SuperSport",description:"Desporto internacional em África.",country:"África",language:"Inglês/Português conforme feed",access:"Pago",priority:3,type:"TV",url:"https://www.supersport.com/"},
  {id:"canalplus",name:"Canal+ Afrique",description:"Canais desportivos em países africanos.",country:"África",language:"Francês",access:"Pago",priority:3,type:"TV",url:"https://www.canalplus-afrique.com/"},
  {id:"newworld",name:"New World TV",description:"Desporto e competições selecionadas.",country:"Togo/África",language:"Vários idiomas",access:"Conforme operador",priority:3,type:"TV",url:"https://nwttv.com/"},
  {id:"bein",name:"beIN SPORTS",description:"Futebol e competições internacionais.",country:"Médio Oriente",language:"Árabe/Francês/Inglês",access:"Pago",priority:4,type:"TV",url:"https://www.beinsports.com/"},
  {id:"alkass",name:"Al Kass Sports",description:"Canais desportivos do Qatar.",country:"Qatar",language:"Árabe",access:"Conforme região",priority:4,type:"TV",url:"https://www.alkass.net/"},
  {id:"fifa",name:"FIFA+",description:"Jogos e conteúdos selecionados da FIFA.",country:"Internacional",language:"Vários idiomas",access:"Gratuito em conteúdos selecionados",priority:5,type:"Streaming",url:"https://www.plus.fifa.com/"},
  {id:"uefatv",name:"UEFA.tv",description:"Conteúdos e jogos selecionados da UEFA.",country:"Internacional",language:"Vários idiomas",access:"Gratuito em conteúdos selecionados",priority:5,type:"Streaming",url:"https://www.uefa.tv/"}
];

// Não adicionar streams sem confirmação de direitos e URL oficial incorporável.
export const officialStreams = [];
