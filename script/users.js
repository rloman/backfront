async function fetchUsers() {
    const response = await fetch("https://reqres.in/api/users?page=2");
    const result = await response.json();

    const mappedData = result.data.map((item) => {
        return {
            firstName: item.first_name,
            avatar: item.avatar
        };
    });
    return mappedData;
}

async function run() {
    const users = await fetchUsers();

    for (const user of users) {
        const endPoint = await fetch("http://localhost:8082/new", {
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
        const saveId = async () => {
            const id = await logIn(users[0]);
            localStorage.setItem("ID",id);
            console.log(id);
        }
        saveId();
        window.location.reload();
        return
    }

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
        const saveId = async () => {
            const id = await logIn(selectedUser);
            localStorage.setItem("ID",id);
        }
        saveId();
        setUserAvatar(selectedUser);
    });
}
run();

function setUserAvatar(user) {
    document.getElementById("userAvatar").setAttribute("src", user.avatar)
}

async function logIn(user) {

    const endPoint = await fetch("http://localhost:8082/login/"+user.email, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    });
    const content = await endPoint.json();
    return content;
}