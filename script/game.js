async function fetchGame() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const game = urlParams.get('id')    
    
    const response = await fetch("https://api.boardgameatlas.com/api/search?ids="+game+"&client_id=JLBr5npPhV");
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

    // const gameInfo = document.createElement("div");
    // const existingCol= document.getElementById("existingCol");
    // container.insertBefore(gameInfo,existingCol);
    // gameInfo.classList.add("innerWrapper","eenDrie");
    
    const gameInfo = document.getElementById("gameInfo");



    game.forEach((game) => {
		let publisher = false;
		if(game.publisher.name != undefined) {
			publisher = true;
		}
        gameInfo.innerHTML = `
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
        ` + gameInfo.innerHTML;
    });
}

window.addEventListener('DOMContentLoaded', () => {
     build();
});

async function checkIn() {
    const game = await fetchGame();

    const endPoint = await fetch("https://bordspelbackend.azurewebsites.net/newCheckIn/"+localStorage.getItem("ID"), {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bordspel: game[0].name,
            locatie: document.getElementById("locatieText").value,
            win: document.getElementById("gewonnen").checked,
            rating: document.getElementById("slider-step-value").innerText,
            review: document.getElementById("reviewText").value
        })
    });
}