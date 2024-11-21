let offset = 0; // Posição inicial para a Pokédex
const limit = 20; // Número de Pokémon por lote
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMore');

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

    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img src="${details.sprites.front_default}" alt="${details.name}">
        <h3>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
    `;
    pokemonList.appendChild(card);
}

// Event Listener para o botão "Carregar Mais"
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonBatch(offset, limit);
});

// Carregar os primeiros Pokémon ao iniciar
loadPokemonBatch(offset, limit);








// Função para buscar a árvore de evolução de um Pokémon
async function fetchEvolutionTree(pokemonNameOrId) {
    const evolutionTreeContainer = document.getElementById('evolutionTree');
    evolutionTreeContainer.innerHTML = '<p>Carregando...</p>'; // Feedback enquanto carrega

    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNameOrId}/`;

    try {
        // Requisição para dados da espécie
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) throw new Error('Pokémon não encontrado.');

        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        // Requisição para a cadeia de evolução
        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();

        // Processa a cadeia de evolução
        const evolutions = [];
        let currentStage = evolutionData.chain;

        while (currentStage) {
            evolutions.push(currentStage.species.name);
            currentStage = currentStage.evolves_to[0]; // Avança para o próximo estágio
        }

        // Renderiza a árvore de evolução
        displayEvolutionTree(evolutions);
    } catch (error) {
        evolutionTreeContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Função para renderizar a árvore de evolução
async function displayEvolutionTree(evolutions) {
    const evolutionTreeContainer = document.getElementById('evolutionTree');
    evolutionTreeContainer.innerHTML = ''; // Limpa conteúdo anterior

    for (const speciesName of evolutions) {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
        const pokemonData = await pokemonResponse.json();

        // Cria um card para cada Pokémon na árvore
        const evolutionCard = document.createElement('div');
        evolutionCard.classList.add('evolution-card');
        evolutionCard.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" alt="${speciesName}">
            <p>${speciesName.charAt(0).toUpperCase() + speciesName.slice(1)}</p>
        `;
        evolutionTreeContainer.appendChild(evolutionCard);
    }
}

// Event Listener para o botão de busca
document.getElementById('searchButton').addEventListener('click', () => {
    const pokemonNameOrId = document.getElementById('evolutionInput').value.trim().toLowerCase();
    if (pokemonNameOrId) {
        fetchEvolutionTree(pokemonNameOrId);
    } else {
        document.getElementById('evolutionTree').innerHTML = '<p class="error">Por favor, insira um nome ou ID.</p>';
    }
});












