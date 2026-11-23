# MEDBI Football Live

Aplicação web/PWA em HTML, CSS e JavaScript puro.

## Estrutura
- `index.html`
- `css/style.css`
- `js/app.js`
- `js/api.js`
- `js/data.js`
- `js/storage.js`
- `manifest.json`
- `assets/icons/icon.svg`

## Como testar
Abra `index.html` num servidor local ou publique os ficheiros num alojamento HTTPS. Alguns navegadores bloqueiam módulos JavaScript quando o HTML é aberto diretamente como `file://`.

## Dados de jogos
A aplicação tenta consultar o scoreboard público da ESPN para algumas competições internacionais. É um endpoint público não comercial e sem garantia de disponibilidade; não é uma API oficial garantida para terceiros. A cobertura não inclui todas as ligas, nomeadamente o campeonato da Guiné-Bissau.

## Transmissões
A aplicação não inclui listas IPTV não autorizadas. `officialStreams` começa vazio. Só devem ser adicionadas transmissões cuja autorização e compatibilidade de incorporação estejam confirmadas para a partida em causa.

## Segurança
Não guardar chaves privadas no JavaScript público, no GitHub ou no APK.
