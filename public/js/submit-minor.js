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

    let checkBoxes = document.querySelectorAll('.above');
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

    function signaturePadCheck(pad) {
        if (pad.isEmpty()) {
            pad.canvas.parentElement.classList.add('unfilled');
            pad.canvas.parentElement.previousElementSibling.classList.add('unfilled');
            pad.canvas.addEventListener('click', () => {
                pad.canvas.parentElement.classList.remove('unfilled');
                pad.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
            });
            pad.canvas.addEventListener('touchstart', () => {
                pad.canvas.parentElement.classList.remove('unfilled');
                pad.canvas.parentElement.previousElementSibling.classList.remove('unfilled');
            });
            missingFields = true;  
        };
    }

    signaturePadCheck(signaturePad1);
    signaturePadCheck(signaturePad2);
    signaturePadCheck(signaturePad3);
    
    fields.push(signaturePad3);

    let checkBoxesBelow = document.querySelectorAll('.below');
    checkBoxesBelow.forEach((box) => {
        fields.push(box);
        if (!box.checked) {
            box.nextElementSibling.classList.add('unfilled');
            box.addEventListener('click', () => {
                box.nextElementSibling.classList.remove('unfilled');
            });
            missingFields = true;
        }
    });

    let parentFirstName = document.querySelector('#parent-first-name');
    let parentLastName = document.querySelector('#parent-last-name');
    let parentRelation = document.querySelector('#parent-relation');
    fields.push(parentFirstName, parentLastName, parentRelation);

    for (let i = fields.length - 1; i >= fields.length - 3; i--) {
        if (!fields[i].value) {
            fields[i].classList.add('unfilled');
            missingFields = true;
            fields[i].addEventListener('focus', () => {
                fields[i].classList.remove('unfilled');
            });
        };
    };

    signaturePadCheck(signaturePad4);
    fields.push(signaturePad4);

    // Scroll to uppermost missing field
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].type == 'text' || fields[i].type == 'date') {
            if (!fields[i].value) {
                if (fields[i].name == 'name') {
                    document.querySelector('#name-and-DOB').scrollIntoView();
                } else {
                    document.querySelector('#parent-name').scrollIntoView();
                }
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
        data['Parent Signature'] = signaturePad4.toDataURL();
        data['Parent First Name'] = parentFirstName.value;
        data['Parent Last Name'] = parentLastName.value;
        data['Relation'] = parentRelation.value;
        data['Minor'] = 1;

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
    }
});