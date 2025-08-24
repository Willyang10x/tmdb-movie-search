/* ===============================
   Configuração da API do TMDb
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
  if (consulta) buscarFilmes(consulta);
});

/* ===============================
   Buscar filmes pelo nome
   =============================== */
async function buscarFilmes(consulta) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${chaveApi}&language=pt-BR&query=${encodeURIComponent(consulta)}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
    exibirFilmes(dados.results);
  } catch (erro) {
    console.error("Erro ao buscar filmes:", erro);
    containerFilmes.innerHTML = "<p>Ocorreu um erro ao buscar filmes. Tente novamente.</p>";
  }
}

/* ===============================
   Buscar filmes recentes/populares
   =============================== */
async function buscarFilmesRecentes() {
  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${chaveApi}&language=pt-BR&page=1`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
    exibirFilmes(dados.results);
  } catch (erro) {
    console.error("Erro ao carregar filmes recentes:", erro);
    containerFilmes.innerHTML = "<p>Erro ao carregar filmes recentes.</p>";
  }
}

/* ===============================
   Buscar trailer do filme
   =============================== */
async function buscarTrailer(filmeId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${filmeId}/videos?api_key=${chaveApi}&language=pt-BR`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.results && dados.results.length > 0) {
      const trailer = dados.results.find(video => video.type === "Trailer" && video.site === "YouTube");
      if (trailer) return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
  } catch (erro) {
    console.error("Erro ao buscar trailer:", erro);
  }
  return null;
}

/* ===============================
   Buscar onde assistir (streaming BR)
   =============================== */
async function buscarOndeAssistir(filmeId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${filmeId}/watch/providers?api_key=${chaveApi}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    return dados.results.BR && dados.results.BR.flatrate ? dados.results.BR.flatrate : [];
  } catch (erro) {
    console.error("Erro ao buscar onde assistir:", erro);
    return [];
  }
}

/* ===============================
   Criar modal de filme
   =============================== */
function criarModal(filme, trailerUrl, provedores) {
  const modal = document.createElement("div");
  modal.classList.add("modal", "mostrar"); // Adiciona a classe mostrar para exibir

  const provedoresText = provedores.length > 0 ? provedores.map(p => p.provider_name).join(", ") : "Não disponível";

  modal.innerHTML = `
    <div class="modal-conteudo">
      <span class="fechar">&times;</span>
      <h2>${filme.title}</h2>
      <p><strong>Lançamento:</strong> ${filme.release_date || "Desconhecido"}</p>
      <p><strong>Nota:</strong> ⭐ ${filme.vote_average.toFixed(1)}</p>
      <p>${filme.overview || "Sem sinopse disponível."}</p>
      <p><strong>Disponível em:</strong> ${provedoresText}</p>
      ${trailerUrl ? `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${trailerUrl.split("v=")[1]}?autoplay=1" frameborder="0" allowfullscreen></iframe>` : ""}
    </div>
  `;

  document.body.appendChild(modal);

  // Animação fade-in + slide
  setTimeout(() => modal.classList.add("ativo"), 50);

  // Fechar modal ao clicar no X
  modal.querySelector(".fechar").addEventListener("click", () => modal.remove());

  // Fechar modal ao clicar fora do conteúdo
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
}

/* ===============================
   Exibir filmes nos cartões
   =============================== */
async function exibirFilmes(lista) {
  containerFilmes.innerHTML = "";

  if (!lista || lista.length === 0) {
    containerFilmes.innerHTML = "<p>Nenhum filme encontrado.</p>";
    return;
  }

  for (const filme of lista) {
    const cartaoFilme = document.createElement("div");
    cartaoFilme.classList.add("movie-card");

    const poster = filme.poster_path
      ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
      : "https://via.placeholder.com/500x750?text=Sem+Imagem";

    /* Informações já visíveis no cartão */
    cartaoFilme.innerHTML = `
      <img src="${poster}" alt="${filme.title}">
      <h3>${filme.title}</h3>
      <p>⭐ ${filme.vote_average.toFixed(1)}</p>
      <p><strong>Lançamento:</strong> ${filme.release_date || "Data não disponível"}</p>
      <p>${filme.overview ? filme.overview.slice(0, 100) + "..." : "Sem sinopse disponível."}</p>
    `;

    /* Modal aparece só ao clicar no poster */
    cartaoFilme.querySelector("img").addEventListener("click", async () => {
      const trailerUrl = await buscarTrailer(filme.id);
      const provedores = await buscarOndeAssistir(filme.id);
      criarModal(filme, trailerUrl, provedores);
    });

    containerFilmes.appendChild(cartaoFilme);
  }
}

/* ===============================
    pesquisa ao digitar (input)
   =============================== */
let timeout;
inputPesquisa.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if(inputPesquisa.value.trim()) buscarFilmes(inputPesquisa.value.trim());
  }, 500);
});

/* ===============================
   Ao carregar a página, mostrar filmes recentes
   =============================== */
window.onload = buscarFilmesRecentes;
