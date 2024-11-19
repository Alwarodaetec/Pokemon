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

// Funções existentes
async function fetchPokemon() {
    const pokemonInput = document.getElementById('pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }
        const pokemon = await response.json();
        displayPokemon(pokemon);
    } catch (error) {
        displayError(error.message);
    }
}

function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
    `;
}

function displayError(message) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `<p style="color: red;">${message}</p>`;
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

    // Adicionar evento de clique no card para mostrar detalhes
    card.addEventListener('click', () => {
        displayPokemon(details); // Passa os detalhes do Pokémon clicado
    });

    pokemonList.appendChild(card);
}

// Função para exibir as informações detalhadas de um Pokémon
function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
    `;
}


async function fetchPokemonn() {
    const pokemonNameOrId = document.getElementById('pokemonInput').value.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNameOrId}/`;

    try {
        // Primeira requisição para dados básicos
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Atualiza o nome, imagem e informações básicas
        document.getElementById('pokemon-name').textContent = data.name.toUpperCase();
        document.getElementById('pokemon-image').src = data.sprites.front_default;
        document.getElementById('pokemon-info').textContent = `
            Tipo: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}
            Altura: ${data.height / 10} m
            Peso: ${data.weight / 10} kg
        `;

        // Segunda requisição para pegar a descrição
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        // Filtra a descrição em português (pt) ou inglês (en)
        const descriptionEntry = speciesData.flavor_text_entries.find(entry => 
            entry.language.name === 'pt' || entry.language.name === 'en'
        );

        // Exibe a descrição (ou uma mensagem se não for encontrada)
        if (descriptionEntry) {
            document.getElementById('pokemon-info').textContent += `\n\nDescrição: ${descriptionEntry.flavor_text.replace(/\n|\f/g, ' ')}`;
        } else {
            document.getElementById('pokemon-info').textContent += `\n\nDescrição: Descrição não disponível para este Pokémon.`;
        }
    } catch (error) {
        document.getElementById('pokemon-info').textContent = "Pokémon não encontrado. Tente outro nome ou ID.";
        document.getElementById('pokemon-name').textContent = "";
        document.getElementById('pokemon-image').src = "";
    }
}