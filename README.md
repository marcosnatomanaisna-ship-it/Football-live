# MEDBI Football Live

Primeira versão da interface do aplicativo, em HTML, CSS e JavaScript puro.

## Como testar
1. Descarrega e extrai o ZIP.
2. Abre `index.html` num navegador moderno.
3. Para publicar, envia o conteúdo da pasta para um repositório GitHub e ativa GitHub Pages.

## O que já funciona
- Interface escura responsiva.
- Menu lateral e navegação inferior.
- Páginas Início, Ao vivo, Jogos, Competições, Canais oficiais, Favoritos e Sobre.
- Pesquisa local por equipa e competição.
- Filtros por estado.
- Favoritos guardados no dispositivo.

## Importante
Os jogos atuais no ficheiro `js/data.js` são dados demonstrativos. Não são resultados reais. A aplicação ainda não possui uma fonte de dados ligada nem transmissões integradas.

O módulo `js/api.js` contém um adaptador inicial para API-Football. Uma chave de API privada não deve ser colocada num site público. Para produção, será necessário um backend/proxy para proteger a chave e verificar os limites e condições do plano utilizado.

As páginas de canais são ligações para plataformas oficiais. A disponibilidade de transmissões depende dos direitos e da região. Não inserir streams não autorizados.

## Próximas etapas
1. Ligar uma API de resultados e calendário.
2. Criar backend seguro para chaves de API, se necessário.
3. Integrar apenas fontes de transmissão oficiais/autorizadas.
4. Testar instalação e conversão para APK.
