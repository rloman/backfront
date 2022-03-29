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
			publisher: item.primary_publisher,
            description: item.description_preview,
        };
    });
    return mappedData;
}

async function build() {
    const game = await fetchGame();

    const container = document.getElementById("displayGame");
    const gameInfo = document.createElement("div");
    const existingCol= document.getElementById("existingCol");
    container.insertBefore(gameInfo,existingCol);
    gameInfo.classList.add("innerWrapper","eenDrie");


    game.forEach((game) => {
        console.log(game.publisher.name);
		let publisher = false;
		if(game.publisher.name != undefined) {
			publisher = true;
		}
        gameInfo.innerHTML += `
            <img src="${game.image}"/>
            <div>
                <h3>
                    ${game.name}
                </h3>
                ${publisher ? "<a href=" + game.publisher.url + ">" + game.publisher.name + "</a>" : ""}
            </div>    
            <p class="totDrie">
                ${game.description}
            </p>
            <button onclick="checkIn()">
                Check in
            </button>
        `;
    });
}

window.addEventListener('DOMContentLoaded', () => {
     build();
});

async function checkIn() {
    const game = await fetchGame();

    const endPoint = await fetch("../newCheckIn/{id}", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bordspel: game[0].name,
            locatie: "",
            win: true,
            float: 0.0,
            review: ""
        })
    });
    const content = await endPoint.json();

    console.log(content);
}