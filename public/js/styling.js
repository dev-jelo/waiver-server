let dateInput = document.querySelector('input[type="date"]');

// Set max date
let eighteenBirthDate = new Date();
eighteenBirthDate.setFullYear(eighteenBirthDate.getFullYear() - 18);
dateInput.max = eighteenBirthDate.toLocaleDateString('en-ca');

// Gray placeholder until there is input
dateInput.addEventListener('input', () => {
    if (dateInput.value) {
        dateInput.classList.remove('gray-placeholder');
    } else {
        dateInput.classList.add('gray-placeholder');
    };
});