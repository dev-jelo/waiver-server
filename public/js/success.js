// Display customer name in welcome message
let customerName = location.href.split('?name=')[1].replace('%20', ' ');
document.querySelector('#name').innerHTML += customerName + '!';