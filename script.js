async function fetchGames() {
    const input = document.getElementById("invoer").value;

    const response = await fetch("https://api.boardgameatlas.com/api/search?name="+input+"&limit=100&client_id=JLBr5npPhV");
    const result = await response.json();
    console.log(result);

    const mappedData = result.games.map((item) => {
        return {
            name: item.name,
            image: item.thumb_url,
        };
    });
    //console.log(mappedData);
    return mappedData;
}

async function run() {
    const games = await fetchGames();

    const container = document.getElementById("data-container");
    while (container.firstChild)
        container.removeChild(container.lastChild);
    const unorderedListEl = document.createElement("ul");
    unorderedListEl.classList.add("list");

    games.forEach((game) => {
        unorderedListEl.innerHTML += `
            <li class="list__item">
                <p>${game.name}</p>
                <img src="${game.image}"/>
            </li>
        `;
    });

    container.appendChild(unorderedListEl);
}
//run();