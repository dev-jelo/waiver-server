let submitButton = document.querySelector('#submit');

let loadingCircle = document.createElement('div');
loadingCircle.classList.add('loader');

submitButton.addEventListener('click', () => {
    // Replace button with loading circle so it can't be clicked multiple times
    submitButton.replaceWith(loadingCircle);

    // Check that all fields have been completed and highlight those missing
    let missingFields = false;

    let firstName = document.querySelector('#first-name');
    let lastName = document.querySelector('#last-name');
    let birthDate = document.querySelector('#DOB');
    
    let fields = [firstName, lastName, birthDate, signaturePad1, signaturePad2];

    for (let i = 0; i < 3; i++) {
        if (!fields[i].value) {
            fields[i].classList.add('unfilled');
            missingFields = true;
            fields[i].addEventListener('focus', () => {
                fields[i].classList.remove('unfilled');
            });
        };
    };

    let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    checkBoxes.forEach((box) => {
        fields.push(box);
        if (!box.checked) {
            box.nextElementSibling.classList.add('unfilled');
            box.addEventListener('click', () => {
                box.nextElementSibling.classList.remove('unfilled');
            });
            missingFields = true;
        }
    });

    if (signaturePad1.isEmpty()) {
        signaturePad1.canvas.parentElement.classList.add('unfilled');
        signaturePad1.canvas.parentElement.previousElementSibling.classList.add('unfilled');
        signaturePad1.canvas.addEventListener('click', () => {
            signaturePad1.canvas.parentElement.classList.remove('unfilled');
            signaturePad1.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        signaturePad1.canvas.addEventListener('touchstart', () => {
            signaturePad1.canvas.parentElement.classList.remove('unfilled');
            signaturePad1.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        missingFields = true;  
    };
    if (signaturePad2.isEmpty()) {
        signaturePad2.canvas.parentElement.classList.add('unfilled');
        signaturePad2.canvas.parentElement.previousElementSibling.classList.add('unfilled');
        signaturePad2.canvas.addEventListener('click', () => {
            signaturePad2.canvas.parentElement.classList.remove('unfilled');
            signaturePad2.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        signaturePad2.canvas.addEventListener('touchstart', () => {
            signaturePad2.canvas.parentElement.classList.remove('unfilled');
            signaturePad2.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        missingFields = true;  
    };
    if (signaturePad3.isEmpty()) {
        signaturePad3.canvas.parentElement.classList.add('unfilled');
        signaturePad3.canvas.parentElement.previousElementSibling.classList.add('unfilled');
        signaturePad3.canvas.addEventListener('click', () => {
            signaturePad3.canvas.parentElement.classList.remove('unfilled');
            signaturePad3.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        signaturePad3.canvas.addEventListener('touchstart', () => {
            signaturePad3.canvas.parentElement.classList.remove('unfilled');
            signaturePad3.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
        });
        missingFields = true;  
    };

    
    fields.push(signaturePad3);
    
    // Scroll to uppermost missing field
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].type == 'text' || fields[i].type == 'date') {
            if (!fields[i].value) {
                document.querySelector('#name-and-DOB').scrollIntoView();
                break;
            };
        } else if (fields[i].type == 'checkbox') {
            if (!fields[i].checked) {
                fields[i].nextElementSibling.scrollIntoView();
                break;
            };
        } else {
            if (fields[i].isEmpty()) {
                fields[i].canvas.parentElement.previousElementSibling.scrollIntoView();
                break;
            };
        };
    };

    // Submit data if all fields completed otherwise replace loader with submit button again
    if (missingFields) {
        loadingCircle.replaceWith(submitButton);
    } else {
        // Aggregate data into a JS object
        let data = {};
        data['First Name'] = firstName.value;
        data['Last Name'] = lastName.value;
        data['Birth Date']= birthDate.value;
        data['Optional Medical']= document.querySelector('#optional1').value;
        data['Optional Other'] = document.querySelector('#optional2').value;
        data['Signature 1'] = signaturePad1.toDataURL();
        data['Signature 2'] = signaturePad2.toDataURL();
        data['Signature 3'] = signaturePad3.toDataURL();
        data['Minor'] = 0;

        // POST to server
        const submitForm = document.createElement('form');
        submitForm.method = 'POST';
        submitForm.action = '/submit';

        Object.entries(data).forEach(([key, val]) => {
            let hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = val;

            submitForm.appendChild(hiddenField);
        });

        document.body.appendChild(submitForm);
        submitForm.submit();
    };
});