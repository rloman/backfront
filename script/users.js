async function fetchUsers() {
    const response = await fetch("https://reqres.in/api/users?page=2");
    const result = await response.json();

    const mappedData = result.data.map((item) => {
        return {
            firstName: item.first_name,
            password: item.last_name,
            email: item.email,
            avatar: item.avatar
        };
    });
    return mappedData;
}

async function run() {
    const users = await fetchUsers();

    for (const user of users) {
        const endPoint = await fetch("https://bordspelbackend.azurewebsites.net/new", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gebruikersNaam: user.email,
                wachtwoord: user.password,
                displayNaam: user.firstName,
                beschrijving: "",
                profilePicture: user.avatar
            })
        });
    };

    let currentUser = localStorage.getItem("user");
    if (!currentUser) {
        localStorage.setItem("user", JSON.stringify(users[0]));
        logIn(users[0], (id) => {
            localStorage.setItem("ID",id);

            window.location.reload();
        });
    } else {
        currentUser = JSON.parse(currentUser);

        setUserAvatar(currentUser);
        let temp = `<select id="userSelect">`;
        users.forEach((user) => {
            let selected = false;
            if (currentUser.firstName === user.firstName) {
                selected = true;
            }
            temp += `
            <option ${selected ? "selected" : ""} value="${user.firstName}">${user.firstName}</option>
          `;
        });
        temp += `</select>`;
        document.body.innerHTML += temp;
        const userSelect = document.getElementById("userSelect");
        userSelect.addEventListener("change", (ev) => {
            const selectedUser = users.find((user) => {
                return user.firstName === ev.target.value
            });
            localStorage.setItem("user", JSON.stringify(selectedUser));
            logIn(selectedUser, (id) => {
                localStorage.setItem("ID",id);
    
                window.location.reload();
            });
            setUserAvatar(selectedUser);
        });
    }
}
run();

function setUserAvatar(user) {
    document.getElementById("userAvatar").setAttribute("src", user.avatar)
}

function logIn(user, afterLogin) {
    fetch("https://bordspelbackend.azurewebsites.net/login/"+user.email, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })
    .then(response => response.json())
    .then(data => afterLogin(data));
}