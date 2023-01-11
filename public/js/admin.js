const ip = '192.168.1.113';

document.querySelector('#logout').addEventListener('click', () => {
    // url for protected route
    const url = `http://${ip}:5000/admin`;
    // wrong credentials to remove
    // to trigger a login with wrong credentials
    const username = 'fakeUser';
    const password = 'randomPassword';
    var http = new XMLHttpRequest();
    // xhr request with wrong credentials 
    // so as to flush out the saved correct credentials
    http.open("get", url, false, username, password);
    http.send("");
    // status 401 is for accessing unauthorized route
    // will get this only if attempt to flush out correct credentials was successful
    if (http.status === 401) {
        // alert("You're logged out now");
        window.location.href = "/logout";
    } else {
        alert("Logout failed");
    };
});

function showResults(data) {
    let alternating = true;
    data.forEach((e) => {
        let tableRow = document.createElement('tr');
        if (alternating) {
            tableRow.classList.add('shaded');
        }
        alternating = !alternating;

        // Italicise those who signed up on current day
        let currentDate = new Date().toLocaleDateString('en-ca');
        let signDate = e['Sign Date'].slice(0, 10);
        let sameDate = false;
        if (currentDate == signDate) sameDate = true;

        let tableData = document.createElement('td');
        tableData.innerHTML = e.id;
        tableData.classList.add('hidden');
        tableRow.appendChild(tableData);
        tableData = document.createElement('td');
        tableData.innerHTML = e['First Name'];
        if (sameDate) tableData.classList.add('italic');
        tableRow.appendChild(tableData);
        tableData = document.createElement('td');
        tableData.innerHTML = e['Last Name'];
        if (sameDate) tableData.classList.add('italic');
        tableRow.appendChild(tableData);
        tableData = document.createElement('td');
        tableData.innerHTML = e['Birth Date'];
        if (sameDate) tableData.classList.add('italic');
        tableRow.appendChild(tableData);
        tableData = document.createElement('td');
        tableData.innerHTML = e['Sign Date'];
        if (sameDate) tableData.classList.add('italic');
        tableRow.appendChild(tableData);
        tableData = document.createElement('td');
        tableData.classList.add('center');
        e.Minor == '1' ? tableData.innerHTML = 'Y' : tableData.innerHTML = 'N';
        if (sameDate) tableData.classList.add('italic');
        tableRow.appendChild(tableData);
        
        tableData = document.createElement('td');
        let container = document.createElement('div');
        container.classList.add('waiverIconContainer');
        let viewWaiver = document.createElement('a');
        viewWaiver.onclick = function () {
            window.open(`http://${ip}:5000/admin/${e.id}`);
        };
        viewWaiver.innerHTML = '&#x1F4C4';
        container.appendChild(viewWaiver);
        tableData.appendChild(container);
        // let deleteWaiver = document.createElement('p');
        // deleteWaiver.classList.add('delete-record');
        // deleteWaiver.innerHTML = '&#x274C';
        // tableData.appendChild(deleteWaiver);
        tableRow.appendChild(tableData);

        table.appendChild(tableRow);
    });
};

document.querySelector('#search').addEventListener('click', () => {
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let DOB = document.querySelector('#DOB').value;
    let queryString = `?firstName=${firstName}&lastName=${lastName}&birthDate=${DOB}`;

    if (firstName || lastName || DOB) {
        fetch(`http://${ip}:5000/api${queryString}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data[0]) {
                    document.querySelector('table').classList.add('hidden');
                    document.querySelector('.noneFound').classList.remove('hidden');
                } else {
                    document.querySelector('table').classList.remove('hidden');
                    document.querySelector('.noneFound').classList.add('hidden');

                    // Show results in table
                    let oldTable = document.querySelectorAll('tr');
                    oldTable.forEach((row) => {
                        if (row.firstElementChild.innerHTML !== 'id') row.remove();
                    });
                    showResults(data);
                };
            });
    };
});

document.querySelector('#clear').addEventListener('click', () => {
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.value = '';
    });
});

let table = document.querySelector('table');

function fetchLatest50() {
    fetch(`http://${ip}:5000/api`)
        .then((response) => response.json())
        .then((data) => {
            showResults(data);
        });
};

fetchLatest50();

document.querySelector('#refreshButton').addEventListener('click', () => {
    document.querySelector('#clear').click();
    document.querySelector('table').classList.remove('hidden');
    document.querySelector('.noneFound').classList.add('hidden');
    let oldTable = document.querySelectorAll('tr');
    oldTable.forEach((row) => {
        if (row.firstElementChild.innerHTML !== 'id') row.remove();
    });
    fetchLatest50();
});