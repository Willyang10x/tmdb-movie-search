/* ===============================
   Configuração da API do TMDb Banco de dados de filmes.
   =============================== */
const chaveApi = "956e78f05a663cce9d20504ab569e906";

/* ===============================
   Selecionando elementos do HTML
   =============================== */
const botaoPesquisar = document.getElementById("searchBtn");
const inputPesquisa = document.getElementById("searchInput");
const containerFilmes = document.getElementById("movieContainer");

/* ===============================
   Evento do botão de pesquisa
   =============================== */
botaoPesquisar.addEventListener("click", () => {
  const consulta = inputPesquisa.value.trim();
  if (consulta) {
    buscarFilmes(consulta);
  }
});
