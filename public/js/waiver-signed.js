const ip = '192.168.1.113';

// Fill in signed information
let id = location.href.split('/')[4];

fetch(`http://${ip}:5000/api?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
        document.querySelector('#first-name').value = data['First Name'];
        document.querySelector('#last-name').value = data['Last Name'];
        document.querySelector('#DOB').value = data['Birth Date'];
        document.querySelector('#DOB').classList.remove('gray-placeholder');
        signaturePad1.fromDataURL(`${data['Signature 1']}`, { ratio: 1, width: 300, height: 150 });
        signaturePad2.fromDataURL(`${data['Signature 2']}`, { ratio: 1, width: 300, height: 150 });
        signaturePad3.fromDataURL(`${data['Signature 3']}`, { ratio: 1, width: 300, height: 150 });
        document.querySelector('#optional1').value = data['Optional Medical'];
        document.querySelector('#optional2').value = data['Optional Other'];
    });