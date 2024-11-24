let offset = 0; // Posição inicial para a Pokédex
const limit = 20; // Número de Pokémon por lote
const team = []; // Array para armazenar a equipe
const maxTeamSize = 3; // Tamanho máximo da equipe
const teamMembers = document.getElementById('teamMembers');
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

    // Adicionar evento de clique no card para adicionar à equipe
    card.addEventListener('click', () => {
        addToTeam(details);
    });

    pokemonList.appendChild(card);
}


// Função para atualizar a exibição da equipe
function updateTeamDisplay() {
    teamMembers.innerHTML = '';
    team.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('team-member');
        card.innerHTML = `
            <img src="${member.sprites.front_default}" alt="${member.name}">
            <h3>${member.name.charAt(0).toUpperCase() + member.name.slice(1)}</h3>
        `;
        teamMembers.appendChild(card);
    });
}

// Função para buscar um Pokémon pelo nome ou ID e adicionar à equipe
async function fetchPokemon() {
    const pokemonInput = document.getElementById('pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }
        const pokemon = await response.json();
        addToTeam(pokemon);
    } catch (error) {
        alert(error.message);
    }
}

// Event Listener para o botão "Carregar Mais"
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonBatch(offset, limit);
});

// Carregar os primeiros Pokémon ao iniciar
loadPokemonBatch(offset, limit);



// Função para adicionar um Pokémon à equipe
function addToTeam(pokemon) {
    if (team.length >= maxTeamSize) {
        alert('A equipe já está completa com 3 Pokémon!');
        return;
    }

    /*if (team.find(member => member.id === pokemon.id)) {
        alert('Este Pokémon já está na equipe!');
        return;
    } */

    team.push(pokemon);
    updateTeamDisplay();
}

// Função para remover um Pokémon da equipe
function removeFromTeam(pokemonId) {
    const index = team.findIndex(member => member.id === pokemonId);
    if (index !== -1) {
        team.splice(index, 1); // Remove o Pokémon pelo índice
        updateTeamDisplay();
    }
}

// Função para atualizar a exibição da equipe
function updateTeamDisplay() {
    teamMembers.innerHTML = ''; // Limpa o conteúdo atual

    // Adiciona um card para cada Pokémon na equipe
    team.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('team-member');
        card.innerHTML = `
            <img src="${member.sprites.front_default}" alt="${member.name}">
            <h3>${member.name.charAt(0).toUpperCase() + member.name.slice(1)}</h3>
            <button onclick="removeFromTeam(${member.id})">Remover</button>
        `;
        teamMembers.appendChild(card);
    });

    // Preenche os espaços vazios se a equipe tiver menos de 3 Pokémon
    for (let i = team.length; i < maxTeamSize; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('team-member');
        emptySlot.style.backgroundColor = '#f0f0f0'; // Fundo cinza claro
        teamMembers.appendChild(emptySlot);
    }
}