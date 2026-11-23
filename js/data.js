
export const demoMatches = [];

export const competitions = [
  ["Campeonato Nacional", "Guiné-Bissau"],
  ["Campeonato Nacional Feminino", "Guiné-Bissau"],
  ["Taça Nacional", "Guiné-Bissau"],
  ["CAF Champions League", "África"],
  ["CAF Confederation Cup", "África"],
  ["FIFA World Cup", "Internacional"],
  ["UEFA Champions League", "Europa"],
  ["Premier League", "Inglaterra"],
  ["La Liga", "Espanha"],
  ["Serie A", "Itália"],
  ["Bundesliga", "Alemanha"],
  ["Ligue 1", "França"],
  ["Brasileirão Série A", "Brasil"],
  ["Brasileirão Série B", "Brasil"],
  ["Copa do Brasil", "Brasil"],
  ["Copa Libertadores", "América do Sul"],
  ["Copa Sul-Americana", "América do Sul"]
];

// Prioridade:
// 1. Português de Portugal
// 2. Português do Brasil
// 3. Canais africanos
// 4. Canais árabes
// 5. Outros canais internacionais

export const officialChannels = [

  // PORTUGAL
  {
    id: "sport-tv",
    name: "Sport TV",
    description: "Canal português de desporto. Transmissões sujeitas a assinatura e direitos.",
    country: "Portugal",
    language: "Português",
    access: "Pago",
    priority: 1,
    type: "platform",
    url: "https://www.sporttv.pt/"
  },
  {
    id: "rtp",
    name: "RTP / RTP Play",
    description: "Canal público português. Alguns eventos desportivos são transmitidos em direto.",
    country: "Portugal",
    language: "Português",
    access: "Gratuito",
    priority: 1,
    type: "platform",
    url: "https://www.rtp.pt/play/"
  },
  {
    id: "rtp-africa",
    name: "RTP África",
    description: "Canal público destinado aos países africanos de língua portuguesa.",
    country: "Portugal / África",
    language: "Português",
    access: "Gratuito",
    priority: 1,
    type: "platform",
    url: "https://www.rtp.pt/rtpafrica/"
  },
  {
    id: "canal-11",
    name: "Canal 11",
    description: "Canal português dedicado ao futebol.",
    country: "Portugal",
    language: "Português",
    access: "Gratuito / Pago conforme operador",
    priority: 1,
    type: "platform",
    url: "https://www.canal11.pt/"
  },

  // BRASIL
  {
    id: "globo",
    name: "TV Globo",
    description: "Transmite jogos selecionados e competições com direitos adquiridos.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito / Pago conforme plataforma",
    priority: 2,
    type: "platform",
    url: "https://globoplay.globo.com/"
  },
  {
    id: "sportv",
    name: "SporTV",
    description: "Canal brasileiro de desporto.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Pago",
    priority: 2,
    type: "platform",
    url: "https://globoplay.globo.com/"
  },
  {
    id: "premiere",
    name: "Premiere",
    description: "Plataforma brasileira de futebol por assinatura.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Pago",
    priority: 2,
    type: "platform",
    url: "https://premiere.globo.com/"
  },
  {
    id: "cazetv",
    name: "CazéTV",
    description: "Canal digital com transmissões gratuitas de competições selecionadas.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito",
    priority: 2,
    type: "youtube",
    url: "https://www.youtube.com/@CazeTV"
  },
  {
    id: "ge-tv",
    name: "GE TV",
    description: "Canal digital brasileiro com transmissões de futebol selecionadas.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito",
    priority: 2,
    type: "youtube",
    url: "https://www.youtube.com/@getv"
  },
  {
    id: "record",
    name: "Record",
    description: "Canal brasileiro com direitos de determinadas competições.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito",
    priority: 2,
    type: "platform",
    url: "https://www.playplus.com/"
  },
  {
    id: "sbt",
    name: "SBT",
    description: "Canal brasileiro com transmissões de futebol selecionadas.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito",
    priority: 2,
    type: "platform",
    url: "https://www.sbt.com.br/"
  },
  {
    id: "band",
    name: "Band",
    description: "Canal brasileiro com transmissões desportivas selecionadas.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito",
    priority: 2,
    type: "platform",
    url: "https://www.band.com.br/"
  },
  {
    id: "tnt-brasil",
    name: "TNT Sports Brasil",
    description: "Transmissões de futebol em canais e plataformas oficiais.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Pago / Gratuito em eventos selecionados",
    priority: 2,
    type: "platform",
    url: "https://www.tntsports.com.br/"
  },
  {
    id: "nsports",
    name: "N Sports",
    description: "Canal brasileiro de transmissões desportivas.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Conforme competição",
    priority: 2,
    type: "platform",
    url: "https://www.nsports.com.br/"
  },
  {
    id: "canal-goat",
    name: "Canal GOAT",
    description: "Canal digital brasileiro com futebol ao vivo.",
    country: "Brasil",
    language: "Português do Brasil",
    access: "Gratuito em transmissões selecionadas",
    priority: 2,
    type: "youtube",
    url: "https://www.youtube.com/@canalgoatbr"
  },

  // ÁFRICA
  {
    id: "supersport",
    name: "SuperSport",
    description: "Transmissões de futebol africano e internacional.",
    country: "África",
    language: "Multilíngue",
    access: "Pago",
    priority: 3,
    type: "platform",
    url: "https://www.supersport.com/"
  },
  {
    id: "canal-plus-sport",
    name: "Canal+ Sport Afrique",
    description: "Desporto e futebol para o mercado africano.",
    country: "África",
    language: "Francês",
    access: "Pago",
    priority: 3,
    type: "platform",
    url: "https://www.canalplus-afrique.com/"
  },
  {
    id: "new-world-tv",
    name: "New World TV",
    description: "Transmissões desportivas em vários mercados africanos.",
    country: "África",
    language: "Multilíngue",
    access: "Conforme operador",
    priority: 3,
    type: "platform",
    url: "https://www.newworldtv.com/"
  },
  {
    id: "caf-tv",
    name: "CAF TV",
    description: "Canal oficial da Confederação Africana de Futebol.",
    country: "Internacional",
    language: "Multilíngue",
    access: "Gratuito em conteúdos selecionados",
    priority: 3,
    type: "youtube",
    url: "https://www.youtube.com/@CAF_TV"
  },

  // PAÍSES ÁRABES
  {
    id: "bein",
    name: "beIN SPORTS",
    description: "Canal desportivo com direitos de várias competições internacionais.",
    country: "Médio Oriente / Norte de África",
    language: "Árabe",
    access: "Pago",
    priority: 4,
    type: "platform",
    url: "https://www.beinsports.com/"
  },
  {
    id: "alkass",
    name: "Al Kass Sports",
    description: "Canais desportivos do Qatar.",
    country: "Qatar",
    language: "Árabe",
    access: "Conforme transmissão",
    priority: 4,
    type: "platform",
    url: "https://www.alkass.net/"
  },
  {
    id: "abu-dhabi-sports",
    name: "Abu Dhabi Sports",
    description: "Canais desportivos dos Emirados Árabes Unidos.",
    country: "Emirados Árabes Unidos",
    language: "Árabe",
    access: "Gratuito / Pago conforme serviço",
    priority: 4,
    type: "platform",
    url: "https://www.adsports.ae/"
  },
  {
    id: "dubai-sports",
    name: "Dubai Sports",
    description: "Canal desportivo dos Emirados Árabes Unidos.",
    country: "Emirados Árabes Unidos",
    language: "Árabe",
    access: "Conforme transmissão",
    priority: 4,
    type: "platform",
    url: "https://www.dubaisports.ae/"
  },

  // INTERNACIONAIS
  {
    id: "fifa-plus",
    name: "FIFA+",
    description: "Plataforma oficial da FIFA com jogos e conteúdos selecionados.",
    country: "Internacional",
    language: "Multilíngue",
    access: "Gratuito em conteúdos selecionados",
    priority: 5,
    type: "platform",
    url: "https://www.plus.fifa.com/"
  },
  {
    id: "uefa-tv",
    name: "UEFA.tv",
    description: "Conteúdos oficiais e transmissões selecionadas da UEFA.",
    country: "Internacional",
    language: "Multilíngue",
    access: "Gratuito em conteúdos selecionados",
    priority: 5,
    type: "platform",
    url: "https://www.uefa.tv/"
  }
];

// Apenas transmissões cuja origem e autorização
// tenham sido verificadas podem entrar nesta lista.
export const officialStreams = [];
   
