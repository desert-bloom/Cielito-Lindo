// JavaScript for Hidden Page Interaction

// Track the state of footer boxes and password
const centerBoxIds = ['footer-box-center-current', 'footer-box-center-past', 'footer-box-center-future'];
let boxesClicked = {
    'footer-box-center-current': false,
    'footer-box-center-past': false,
    'footer-box-center-future': false
};

// Load boxesClicked state from localStorage
function loadBoxesClickedState() {
    const savedState = localStorage.getItem('boxesClicked');
    if (savedState) {
        boxesClicked = JSON.parse(savedState);
        console.log('Loaded boxesClicked state from localStorage:', boxesClicked);
    }
}

// Save boxesClicked state to localStorage
function saveBoxesClickedState() {
    localStorage.setItem('boxesClicked', JSON.stringify(boxesClicked));
    console.log('Saved boxesClicked state to localStorage:', boxesClicked);
}

// Clear specific states from localStorage
function clearLocalStorageForCurrent() {
    localStorage.removeItem('boxesClicked');
    localStorage.removeItem('passwordVerified');
    boxesClicked = {
        'footer-box-center-current': false,
        'footer-box-center-past': false,
        'footer-box-center-future': false
    };
    console.log('Cleared boxesClicked state and password from localStorage.');
}

// Check if the hidden page link should be unlocked
function checkUnlockCondition() {
    console.log('Checking unlock condition...');
    const allBoxesClicked = Object.values(boxesClicked).every(clicked => clicked);
    console.log('All boxes clicked:', allBoxesClicked);
    console.log('Orientation is landscape:', window.matchMedia("(orientation: landscape)").matches);
    if (allBoxesClicked && window.matchMedia("(orientation: landscape)").matches) {
        // Check if the password has been set in localStorage
        if (!localStorage.getItem('passwordVerified')) {
            console.log('Password not verified. Showing password input field in center box.');
            showPasswordInputInCenterBox();
        } else {
            console.log('Password verified. Unlocking hidden page link.');
            unlockHiddenPageLink();
        }
    }
}

// Function to handle box click events
function handleBoxClick(event) {
    const targetBox = event.target;
    console.log('Box clicked:', targetBox.id);
    if (centerBoxIds.includes(targetBox.id)) {
        if (boxesClicked[targetBox.id]) {
            // If already clicked, deselect it
            targetBox.classList.remove('selected');
            targetBox.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary');
            boxesClicked[targetBox.id] = false;
            targetBox.innerHTML = ''; // Remove input field if it exists
        } else {
            // If not clicked, select it
            targetBox.classList.add('selected');
            targetBox.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
            boxesClicked[targetBox.id] = true;
        }
        console.log('Updated boxesClicked state:', boxesClicked);
        saveBoxesClickedState();
        checkUnlockCondition();
    }
}

// Show the password input field in the center box
function showPasswordInputInCenterBox() {
    centerBoxIds.forEach(id => {
        const box = document.getElementById(id);
        if (boxesClicked[id] && box) {
            box.innerHTML = `
                <input type="password" id="password-input-${id}" placeholder="Enter Password">
                <button id="submit-password-${id}">Submit</button>
            `;
            const passwordInput = document.getElementById(`password-input-${id}`);
            const passwordSubmitButton = document.getElementById(`submit-password-${id}`);

            if (passwordSubmitButton) {
                passwordSubmitButton.addEventListener('click', () => handlePasswordSubmit(passwordInput));
                console.log('Password input and submit button added to:', id);
            }
        }
    });
}

// Function to handle password submission
function handlePasswordSubmit(passwordInput) {
    console.log('Password submitted:', passwordInput.value);
    if (passwordInput.value === 'Sw33tLov3r') {
        localStorage.setItem('passwordVerified', true);
        unlockHiddenPageLink();
        passwordInput.parentElement.innerHTML = ''; // Clear the input field and button after successful submission
        console.log('Password correct. Hidden page link added.');
    } else {
        alert('Incorrect password. Please try again.');
        console.log('Incorrect password entered.');
    }
}

// Function to unlock the hidden page link in the nav bar
function unlockHiddenPageLink() {
    if (!document.querySelector('nav ul li a[href="hidden.html"]')) { // Ensure only one link is added
        const nav = document.querySelector('nav ul');
        const hiddenLink = document.createElement('li');
        hiddenLink.innerHTML = '<a href="hidden.html">Hidden Page</a>';
        nav.appendChild(hiddenLink);
        console.log('Hidden page link unlocked.');
    }
}

// Event listeners for footer boxes
window.addEventListener('DOMContentLoaded', () => {
    // Load the boxesClicked state from localStorage
    loadBoxesClickedState();

    // Add click event listeners to all center footer boxes
    centerBoxIds.forEach(id => {
        const box = document.getElementById(id);
        if (box) {
            box.addEventListener('click', handleBoxClick);
            console.log('Event listener added for center box:', id);
        }
    });

    // Check device orientation change
    window.addEventListener('orientationchange', checkUnlockCondition);
    console.log('Event listener added for orientation change.');

    // Add click event listener to the 'current' link to clear localStorage
    const currentLink = document.querySelector('nav ul li a[href="index.html"]');
    if (currentLink) {
        currentLink.addEventListener('click', clearLocalStorageForCurrent);
        console.log('Event listener added for current link to clear localStorage.');
    }
});
