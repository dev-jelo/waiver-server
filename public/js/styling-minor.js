let dateInput = document.querySelector('input[type="date"]');

// Set correct age range for date input (13 to 18)
let eighteenBirthDate = new Date();
eighteenBirthDate.setFullYear(eighteenBirthDate.getFullYear() - 18);
eighteenBirthDate.setDate(eighteenBirthDate.getDate() + 1);
dateInput.min = eighteenBirthDate.toLocaleDateString('en-ca');

let thirteenBirthDate = new Date();
thirteenBirthDate.setFullYear(thirteenBirthDate.getFullYear() - 13);
dateInput.max = thirteenBirthDate.toLocaleDateString('en-ca');

// Gray placeholder until there is input
dateInput.addEventListener('input', () => {
    if (dateInput.value) {
        dateInput.classList.remove('gray-placeholder');
    } else {
        dateInput.classList.add('gray-placeholder');
    };
});