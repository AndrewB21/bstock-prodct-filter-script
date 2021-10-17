// @require      https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/cef621dc9d8a39bb1c6beadbdd96e5957a5b7aac/constants.js

// Helper method declarations
const toggleSettings = () => {
    const footer = document.querySelector("#settings-footer");
    const settingsContainer = document.querySelector('#settings-container');
    const closeButton = document.querySelector('#close-settings-btn');
    if (settingsExpanded) {
        footer.style.height = '30px';
    } else {
        footer.style.height = '325px';
    }
    settingsExpanded = !settingsExpanded;

    let elementDisplay = settingsExpanded ? 'visible' : 'hidden';
    settingsContainer.style.visibility = elementDisplay;
    setTimeout(() => {
        closeButton.style.visibility = elementDisplay;
    }, settingsExpanded ? 750 : 200);
}

const saveSettings = () => {
    window.localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

const createSelectInput = (selectOptions, settingKey) => {
    let selectInput = document.createElement('select');
    for (const value of Object.values(selectOptions)) {
        let option = createSelectOption(value);
        selectInput.appendChild(option);
    }
    selectInput.addEventListener('input', (event) => { userSettings[settingKey] = event.target.value; saveSettings(); });
    return selectInput;
}

const createSelectOption = (optionValue) => {
    let option = document.createElement('option');
    option.value = optionValue;
    option.innerText = convertCamelCaseToSettingName(optionValue.toString());
    return option;
}

let convertCamelCaseToSettingName = (camelCaseString) => {
    const firstCapitalIndex = camelCaseString.search(/[A-Z]/); // Find the first word by finding the index of the first capital letter and creating a substring
    if(firstCapitalIndex === -1) {
        // String contains no capital letters, so we can just capitalize the first character and return
        return camelCaseString[0].toUpperCase() + camelCaseString.substring(1);
    }
    let firstWord = camelCaseString.substring(0, firstCapitalIndex);
    firstWord = firstWord[0].toUpperCase() + firstWord.substring(1); // Capitalize the first word in the string
    let words = [firstWord];
    camelCaseString = camelCaseString.substring(firstCapitalIndex); // Remove the first word from the string
    const capitalWords = camelCaseString.match(/[A-Z][^A-Z]*/g); // Gives an array containing all of the capitalized words
    words = words.concat(capitalWords);
    return words.join(' ');
}

// Load saved user settings from local storage and assign them to userSettings
const savedUserSettings = window.localStorage.getItem('userSettings');
const userSettings = savedUserSettings ? JSON.parse(savedUserSettings) : defaultUserSettings;
if (Object.keys(userSettings).length !== Object.keys(defaultUserSettings)) {
	// New settings were likely added, so we need to update our saved settings with the default values
   	for (const key of Object.keys(defaultUserSettings)) {
    	if (!userSettings[key]) {
    		userSettings[key] = defaultUserSettings[key];
    	}
    }
	saveSettings();
}
// Saving/loading from local storage usually results in bools being converted to strings, but occasionally they don't, so we convert to string then check the value  ¯\_(ツ)_/¯
userSettings.filterOnLoad = userSettings.filterOnLoad.toString() === 'true' ? true : false;

let settingsExpanded = false; // tracks the expanded/collapsed state of the settings window

// Main method to render the user settings
const renderUserSettings = () => {
    // Create & style footer element
    let footer = document.createElement('div');
    footer.id = "settings-footer"
    footer.style = "width: 350px;position: fixed;background-color: rgb(50, 128, 154);height: 30px;bottom: 0;right: 0;transition: all 1s;"
    document.body.appendChild(footer);

    // Create & style footer text
    let footerText = document.createElement('p');
    footerText.innerText = "Product Filter Settings";
    footerText.addEventListener('click', () => { toggleSettings(footer) });
    footerText.style = "font-size:18px;font-weight:bold;margin-left: 10px;cursor:pointer;";
    
    let createdByText = document.createElement('span');
    createdByText.innerText = "created by Moto";
    createdByText.style = "font-size: 10px; position:absolute;right:5px;top:8px;"
    footerText.appendChild(createdByText);
    footer.appendChild(footerText);

    // Create & style the inner settings container
    let settingsContainer = document.createElement('div');
    settingsContainer.id = "settings-container";
    settingsContainer.style = 'width: 95%; height: 82%;background-color: white;margin: 0 auto;margin-top:5px;color: black;padding:5px;visibility:hidden;'
    footer.appendChild(settingsContainer);

    // Loop through the userSettings and create/append inputs for all of them
    for (const [key,value] of Object.entries(userSettings)) {
        // Create elements necessary for the input
        let inputContainer = document.createElement('div');
        let label = document.createElement('label');
        label.innerText = convertCamelCaseToSettingName(key);
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
            case 'priceRangeStart': 
            case 'priceRangeEnd' :
                input = document.createElement('input');
                input.min = 0;
                input.max = 9999;
                input.type = 'number';
                input.addEventListener('input', (event) => { userSettings[key] = event.target.value; saveSettings(); });
                break;
            default:
                break;
        }

        // Set styles for container/input
        inputContainer.style="margin-top: 10px;";
        input.style = "margin-left:30px;background-color: #161415;border: 1px solid #444;color: white;max-width:125px;"

        // Set inputs and append elements
        input.value = value; 
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        settingsContainer.appendChild(inputContainer);
    }

    // Create "changes will be reflected next time you load the page" message
    const settingsUpdateSpan = document.createElement('p');
    settingsUpdateSpan.innerText = "Changes will be reflected next time you load the page";
    settingsUpdateSpan.id = 'settings-update-msg';
    settingsUpdateSpan.style = "font-size:10px";
    settingsContainer.prepend(settingsUpdateSpan);

    // Create a close settings button
    const closeButton = document.createElement('button');
    closeButton.id = "close-settings-btn";
    closeButton.innerText = "Close Settings";
    closeButton.addEventListener('click', () => { toggleSettings(footer) });
    closeButton.style = "position: absolute;bottom: 10%;right: 5%;visibility:hidden";
    settingsContainer.appendChild(closeButton);
}
