async function fetchGame() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const game = urlParams.get('name')    
    
    const response = await fetch("https://api.boardgameatlas.com/api/search?name="+game+"&exact=true&client_id=JLBr5npPhV");
    const result = await response.json();
    
    const mappedData = result.games.map((item) => {
        return {
            name: item.name,
            image: item.thumb_url,
			publisher: item.publisher,
        };
    });
    return mappedData;
}

async function build() {
    const game = await fetchGame();

    const container = document.getElementById("displayGame");
    while (container.firstChild)
        container.removeChild(container.lastChild);
    const gameInfo = document.createElement("div");
    container.appendChild(gameInfo);
    gameInfo.classList.add("col-9");
 
    gameInfo.innerHTML += `
        <p>
            ${game[0].name}
        </p>
    `;
}

window.addEventListener('DOMContentLoaded', () => {
     build();
});