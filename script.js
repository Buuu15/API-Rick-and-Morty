// 
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function render(character) {
    const source = document.getElementById("character").innerHTML;
    const compile = Handlebars.compile(source);
    const context = {
        name: character.name,
        id: character.id,
        image: character.image,
        status: character.status,
        species: character.species,
        gender: character.gender,
        origin: character.origin.name,
        location: character.location.name
    };
    document.getElementById("content").innerHTML = compile(context);
}

async function loadCharacter(index) {
    document.getElementById("loading").style.display = 'block';
    document.getElementById("content").style.display = 'none';
    document.getElementById("nav-buttons").style.display = 'none';
    
    const timer = setTimeout(() => {
        alert("Data tidak ditemukan dalam waktu 10 detik, mengatur ulang ke ID 1.");
        loadCharacter(1);
    }, 10000);

    const url = `https://rickandmortyapi.com/api/character/${index}`;
    let data = await fetchData(url);

    while (!data) {
        index++;
        data = await fetchData(`https://rickandmortyapi.com/api/character/${index}`);
    }

    clearTimeout(timer);

    render(data);
    document.getElementById("nav-buttons").style.display = 'block';
    document.getElementById("loading").style.display = 'none';
    document.getElementById("content").style.display = 'block';

    return index;
}

function getRandomCharacter() {
    return Math.floor(Math.random() * 826) + 1; // Terdapat 826 karakter di Rick and Morty API
}

let currentIndex = 1;

document.getElementById("right").addEventListener('click', async () => {
    currentIndex++;
    currentIndex = await loadCharacter(currentIndex);
});

document.getElementById("left").addEventListener('click', async () => {
    if (currentIndex > 1) {
        currentIndex--;
        currentIndex = await loadCharacter(currentIndex);
    }
});

document.getElementById("random").addEventListener('click', async () => {
    currentIndex = getRandomCharacter();
    currentIndex = await loadCharacter(currentIndex);
});

document.getElementById("goButton").addEventListener('click', async () => {
    const inputId = document.getElementById("inputId").value;
    if (inputId && inputId > 0) {
        currentIndex = parseInt(inputId);
        currentIndex = await loadCharacter(currentIndex);
    }
});

loadCharacter(currentIndex);
