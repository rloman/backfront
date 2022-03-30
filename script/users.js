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
    let currentUser = localStorage.getItem("user");
    if (!currentUser) {
        localStorage.setItem("user", JSON.stringify(users[0]));
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
        setUserAvatar(selectedUser);
    });
}
run();

function setUserAvatar(user) {
    document.getElementById("userAvatar").setAttribute("src", user.avatar)
}