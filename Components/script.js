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

/* ===============================
   Função para buscar filmes na API
   =============================== */
async function buscarFilmes(consulta) {
  try {
    /* Monta a URL de pesquisa na API do TMDb */
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${chaveApi}&language=pt-BR&query=${encodeURIComponent(consulta)}`;
    
    /* Faz a requisição */
    const resposta = await fetch(url);
    const dados = await resposta.json();

    /* Limpa o container antes de mostrar novos resultados */
    containerFilmes.innerHTML = "";

    /* Se não encontrar nada, mostra mensagem */
    if (!dados.results || dados.results.length === 0) {
      containerFilmes.innerHTML = "<p>Nenhum filme encontrado.</p>";
      return;
    }

    /* Loop pelos resultados */
    dados.results.forEach(filme => {
      /* Cria um cartão para cada filme */
      const cartaoFilme = document.createElement("div");
      cartaoFilme.classList.add("movie-card");

      /* Define o poster do filme (ou imagem de fallback) */
      const poster = filme.poster_path 
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}` 
        : "https://via.placeholder.com/500x750?text=Sem+Imagem";

      /* Monta o HTML do cartão */
      cartaoFilme.innerHTML = `
        <img src="${poster}" alt="${filme.title}">
        <h3>${filme.title}</h3>
        <p>⭐ ${filme.vote_average.toFixed(1)}</p>
        <p><strong>Lançamento:</strong> ${filme.release_date || "Data não disponível"}</p>
        <p>${filme.overview ? filme.overview.slice(0, 100) + "..." : "Sem sinopse disponível."}</p>
      `;

      /* Adiciona o cartão no container */
      containerFilmes.appendChild(cartaoFilme);
    });

  } catch (erro) {
    console.error("Erro ao buscar filmes:", erro);
    containerFilmes.innerHTML = "<p>Ocorreu um erro ao buscar filmes. Tente novamente.</p>";
  }
}
