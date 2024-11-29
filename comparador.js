let offset = 0; // Posição inicial para a Pokédex
const limit = 20; // Número de Pokémon por lote
const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMore");
const API_URL = "https://pokeapi.co/api/v2/pokemon/";
// Carregar a equipe no menu
carregarEquipeMenu();


let selectedForComparison = 1; // Controla qual lado será preenchido (1 ou 2)

// Função para carregar Pokémon da Pokédex
async function loadPokemonBatch(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    data.results.forEach(addPokemonCard);
}

// Função para adicionar um card de Pokémon na Pokédex
async function addPokemonCard(pokemon) {
    const response = await fetch(pokemon.url);
    const details = await response.json();

    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.innerHTML = `
        <img src="${details.sprites.front_default}" alt="${details.name}">
        <h3>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
    `;

    // Adiciona evento de clique para adicionar ao comparador
    card.addEventListener("click", () => addToComparator(details));
    pokemonList.appendChild(card);
}

// Função para buscar Pokémon por ID ou nome
async function buscarPokemon() {
    const pokemonInput = document.getElementById("pokemonInput");
    const pokemonNameOrId = pokemonInput.value.trim().toLowerCase();

    if (!pokemonNameOrId) return;

    // Busca o Pokémon quando o botão "Buscar Pokémon" for clicado
    const pokemon = await fetchPokemon(pokemonNameOrId);
    if (pokemon) {
        addToComparator(pokemon);
    }
}

// Função para buscar Pokémon da API
async function fetchPokemon(nameOrId) {
    try {
        const response = await fetch(`${API_URL}${nameOrId}`);
        if (!response.ok) throw new Error("Pokémon não encontrado");
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Função para exibir Pokémon no comparador
function exibirPokemon(pokemon, containerId) {
    const container = document.getElementById(containerId);
    if (!pokemon) {
        container.innerHTML = "<p>Pokémon não disponível.</p>";
        return;
    }

    container.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name.toUpperCase()}</h3>
        <p>Peso: ${pokemon.weight} kg</p>
        <p>Altura: ${pokemon.height} m</p>
    `;
}

// Função para adicionar o Pokémon ao comparador
function addToComparator(pokemon) {
    const containerId = selectedForComparison === 1 ? "pokemon1" : "pokemon2";
    exibirPokemon(pokemon, containerId);

    // Alterna o lado para o próximo clique
    selectedForComparison = selectedForComparison === 1 ? 2 : 1;
}

// Sortear Pokémon aleatórios
async function sortearPokemons() {
    const pokemon1Id = Math.floor(Math.random() * 150) + 1;
    const pokemon2Id = Math.floor(Math.random() * 150) + 1;

    const pokemon1 = await fetchPokemon(pokemon1Id);
    const pokemon2 = await fetchPokemon(pokemon2Id);

    exibirPokemon(pokemon1, "pokemon1");
    exibirPokemon(pokemon2, "pokemon2");
}

// Função para comparar os Pokémon
function compararPokemons() {
    const pokemon1Container = document.getElementById("pokemon1");
    const pokemon2Container = document.getElementById("pokemon2");

    // Verifica se ambos os Pokémon foram selecionados
    if (!pokemon1Container.innerHTML || !pokemon2Container.innerHTML) {
        alert("Por favor, adicione dois Pokémon para comparar.");
        return;
    }

    // Extrai as informações dos Pokémon
    const pokemon1Name = pokemon1Container.querySelector("h3").innerText;
    const pokemon1Weight =
        pokemon1Container.querySelector("p:nth-child(3)").innerText;
    const pokemon1Height =
        pokemon1Container.querySelector("p:nth-child(4)").innerText;

    const pokemon2Name = pokemon2Container.querySelector("h3").innerText;
    const pokemon2Weight =
        pokemon2Container.querySelector("p:nth-child(3)").innerText;
    const pokemon2Height =
        pokemon2Container.querySelector("p:nth-child(4)").innerText;

    // Cria o texto da comparação
    const comparisonText = `
        <strong>Comparação entre:</strong><br>
        <strong>${pokemon1Name}</strong><br>
        Peso: ${pokemon1Weight} | Altura: ${pokemon1Height} <br><br>
        <strong>${pokemon2Name}</strong><br>
        Peso: ${pokemon2Weight} | Altura: ${pokemon2Height}
    `;

    // Exibe o resultado na caixa de comparação
    const comparisonResult = document.getElementById("comparisonResult");
    const comparisonParagraph = document.getElementById("comparisonText");

    comparisonParagraph.innerHTML = comparisonText;
    comparisonResult.style.display = "block"; // Torna a caixa visível
}

// Carregar os primeiros Pokémon ao iniciar
loadPokemonBatch(offset, limit);

// Botão para carregar mais Pokémon
loadMoreButton.addEventListener("click", () => {
    offset += limit;
    loadPokemonBatch(offset, limit);
});

// Adiciona evento de clique ao botão de busca
document
    .getElementById("searchButton")
    .addEventListener("click", buscarPokemon);





    // Carregar e exibir Pokémon da equipe nas imagens do menu
function carregarEquipeMenu() {
    const equipe = JSON.parse(localStorage.getItem('equipe')) || []; // Recupera a equipe do localStorage
    const rightImages = document.querySelectorAll('.right-images img');

    // Atualiza as imagens dos Pokémon no menu
    equipe.forEach((pokemon, index) => {
        if (index < rightImages.length) { // Evita exceder o número de imagens disponíveis
            rightImages[index].src = pokemon.sprites.front_default;
            rightImages[index].alt = pokemon.name;
        }
    });

    // Define imagens padrão para espaços restantes
    for (let i = equipe.length; i < rightImages.length; i++) {
        rightImages[i].src = 'imagens/placeholder.png'; // Imagem padrão (substitua com o caminho desejado)
        rightImages[i].alt = 'Placeholder';
    }
}





