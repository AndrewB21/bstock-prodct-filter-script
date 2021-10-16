// @require      https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/cef621dc9d8a39bb1c6beadbdd96e5957a5b7aac/constants.js

// Load saved user settings from local storage and assign them to userSettings
const savedUserSettings = window.localStorage.getItem('userSettings');
const userSettings = savedUserSettings ? JSON.parse(savedUserSettings) : defaultUserSettings; 
userSettings.filterOnLoad = userSettings.filterOnLoad === 'true' ? true : false; // Convert into a bool because pulling from local storage converts everything to a string

let settingsExpanded = false; // tracks the expanded/collapsed state of the settings window

// Helper method declarations
const toggleSettings = () => {
    if (settingsExpanded) {
        footer.style.height = '30px';
    } else {
        footer.style.height = '250px';
    }
    settingsExpanded = !settingsExpanded;
}

const saveSettings = () => {
    window.localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

const createSelectInput = (selectOptions, settingKey) => {
    let select = document.createElement('select');
    for (const value of Object.values(selectOptions)) {
        let option = createSelectOption(value);
        input.appendChild(option);
    }
    select.addEventListener('input', (event) => { userSettings[settingKey] = event.target.value; saveSettings(); });
    return select;
}

const createSelectOption = (optionValue) => {
    let option = document.createElement('option');
    option.value = optionValue;
    option.innerText = optionValue;
    return option;
}

// Main method to render the user settings
const renderUserSettings = () => {
    // Create & style footer element
    let footer = document.createElement('div');
    footer.style = "width: 350px;position: fixed;background-color: green;height: 30px;bottom: 0;right: 0;transition: all 1s;"
    document.body.appendChild(footer);

    // Create & style footer text
    let footerText = document.createElement('p');
    footerText.innerText = "B Stock Filter Settings";
    footerText.addEventListener('click', toggleSettings);
    footerText.style = "font-size:18px;font-weight:bold;text-align:center;cursor:pointer;";
    footer.appendChild(footerText);

    // Create & style the inner settings container
    let settingsContainer = document.createElement('div');
    settingsContainer.style = 'width: 95%; height: 82%;background-color: white;margin: 0 auto;margin-top:5px;color: black;padding:5px;'
    footer.appendChild(settingsContainer);

    // Loop through the userSettings and create/append inputs for all of them
    for (const [key,value] of Object.entries(userSettings)) {
        // Create elements necessary for the input
        let inputContainer = document.createElement('div');
        let label = document.createElement('label');
        label.innerText = key;
        let input;
        switch (key) {
            case 'filterOnLoad':
                input = createSelectInput({ true: true, false: false }, key);
                break;
            case 'defaultFilterMode':
                input = createSelectInput(filterModes, key);
                break;
            case 'defaultFilterText':
                input = document.createElement('input');
                input.addEventListener('input', (event) => { userSettings.defaultFilterText = event.target.value; saveSettings(); });
                break;
            case 'defaultDropdownValue':
                input = createSelectInput(dropdownOptions, key);
                // Create a default option with blank value
                let defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.innerText = '(none)';
                input.prepend(defaultOption);
                break;
            default:
                break;
        }

        // Set styles for container/input
        inputContainer.style="margin-top: 10px;";
        input.style = "margin-left:30px;"

        // Set inputs and append elements
        input.value = value; 
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        settingsContainer.appendChild(inputContainer);
    }
}