// Your code here...
// ==UserScript==
// @name         B Stock Product Filter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Product filter for EVGA B-Stock product pages
// @author       Moto
// @match        https://www.evga.com/*
// @require      https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/constants.js
// @require      https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/user-settings.js
// @updateUrl    https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/bstock-product-filter-script.user.js
// @downloadUrl  https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/bstock-product-filter-script.user.js
// @icon         https://www.google.com/s2/favicons?domain=evga.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variable declarations
    const viewMode = document.querySelector('#LFrame_prdList_pnlListView') ? 'list' : 'grid';
    const productContainers = document.querySelectorAll(`.${viewMode}-item`);
    const header = document.querySelector('#LFrame_prdList_pnlOptionsSort');
    const groupByHeader = document.querySelector('#LFrame_prdList_spanSort');
    let mostRecentFilterMode = userSettings.defaultFilterMode;

    // Custom HTML element creation
    const mainContainer = document.createElement('div');
    const clearFilterButton = document.createElement('button');
    const button3060ti = document.createElement('button');
    const button3070 = document.createElement('button');
    const button3080 = document.createElement('button');
    const filterTextInput = document.createElement('input');
    const familySelect = document.createElement('select');
    const priceFilterContainer = document.createElement('div');
    const priceStartInput = document.createElement('input');
    const priceEndInput = document.createElement('input');

    // Function declarations
    const filterElements = (filterMode) => {
        const hideNode = (node) => {
            if (viewMode == 'grid') {
                node.parentNode.style.display = 'none';
            } else {
                node.style.display = 'none';
            }
        }
        mostRecentFilterMode = filterMode;
        clearFilter(false);
        const startPrice = priceStartInput.value ? priceStartInput.value : 0;
        const endPrice = priceEndInput.value ? priceEndInput.value : 9999;
        let filterText;
        if (filterMode === filterModes.userInput) {
            filterText = filterTextInput.value.toLowerCase();
        } else if (filterMode === filterModes.dropdown) {
            filterText = familySelect.value.toLowerCase();
        }

        for (let node of productContainers) {
            const nodeText = node.querySelector(`.pl-${viewMode}-pname`).childNodes[1].innerHTML.toLowerCase();
            const nodePrice = parseFloat(node.querySelector('#divPriceFinal').firstElementChild.firstElementChild.innerText.replace('$',''));
            if (nodePrice < startPrice || nodePrice > endPrice) {
                hideNode(node);
            }
            if (!nodeText.includes(filterText)) {
                hideNode(node);
            }
            if (!filterText.includes('ti') && nodeText.includes('ti')) {
                hideNode(node);
            }
        }
    }

    const clearFilter = (eraseValue) => {
        if (eraseValue) {
            filterTextInput.value = '';
            familySelect.value = '';
            priceStartInput.value = '';
            priceEndInput.value = '';
        }
        for (let node of productContainers) {
            if (viewMode == 'grid') {
                node.parentNode.style.display = 'block';
            } else {
                node.style.display = 'block';
            }
        }
    }

    const setButtonStyle = (button, buttonText, callback) => {
        button.addEventListener('click', callback);
        button.innerHTML = buttonText;
        button.setAttribute('type', 'button');
        button.className = "filter-elements-btn"
        button.style = `background-color:#32809A;color:#ffffff;border-radius:10px;border:none;padding:7px;font-weight:bold;margin-left:20px;cursor:pointer`
    }

    const main = () => {
        // Set button properties/style
        setButtonStyle(clearFilterButton, 'Clear Filter', () => { clearFilter(true) });
        setButtonStyle(button3060ti, 'View B-Stock 3060Ti Family', () => { window.open(chipsetFamilies.b3060ti, '_blank') });
        setButtonStyle(button3070, 'View B-Stock 3070 Family', () => { window.open(chipsetFamilies.b3070, '_blank') });
        setButtonStyle(button3080, 'View B-Stock 3080 Family', () => { window.open(chipsetFamilies.b3080, '_blank') });

        // Set input properties/style
        filterTextInput.style = 'border-radius:10px;border:none;padding:5px;width:150px;'
        filterTextInput.className = "filter-elements-input";
        filterTextInput.value = userSettings.defaultFilterText;
        filterTextInput.addEventListener('input', () => { filterElements(filterModes.userInput) });

        // Set select properties/style
        familySelect.style = "display: block;border: none;margin-top: 10px;border-radius: 8px;color: black;background-color: white;text-transform: capitalize; font-size:12px;";
        familySelect.className = "filter-elements-select";

        // Create a default option with blank value
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.innerHTML = '(Select a product family to filter by)';
        familySelect.appendChild(defaultOption);

        // Create options from dropdownValues and append them
        for (const value of Object.values(dropdownOptions)) {
            let option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            familySelect.appendChild(option);
        }
        familySelect.value = userSettings.defaultDropdownValue;
        familySelect.addEventListener('change', () => { filterElements(filterModes.dropdown) });

        // Set up price filter inputs
        let priceInputSeparator = document.createElement('span');
        priceInputSeparator.innerText = '-';
        priceInputSeparator.style = "margin:0 5px;"
        for (const input of [priceStartInput, priceEndInput]) {
            input.style = 'border-radius:10px;border:none;padding:5px;width:90px;background-color:white;color:black;'
            input.type = "number";
            input.addEventListener('input', () => { filterElements(mostRecentFilterMode) });
        }
        priceStartInput.placeholder = "Price Low";
        priceEndInput.placeholder = "Price High";
        priceStartInput.value = userSettings.priceRangeStart;
        priceEndInput.value = userSettings.priceRangeEnd;

        // Style price filter container and append inputs
        priceFilterContainer.style = 'margin: 10px 0 0 20px';
        priceFilterContainer.appendChild(priceStartInput);
        priceFilterContainer.appendChild(priceInputSeparator);
        priceFilterContainer.appendChild(priceEndInput);


        // Set container properties/style and append elements
        mainContainer.className="product-filter-container";
        mainContainer.style="width:900;padding:5px;display:flex;flex-wrap:wrap"
        const containerElements = [filterTextInput, clearFilterButton, button3060ti, button3070, button3080, familySelect, priceFilterContainer];
        containerElements.forEach((element) => { mainContainer.appendChild(element) });

        header.appendChild(mainContainer);

        // Hide the "group by" header to make space for the product filter
        if (groupByHeader) {
             groupByHeader.style.display = 'none';
        }

        if (userSettings.filterOnLoad) {
            filterElements(userSettings.defaultFilterMode);
        }
    }

    if (document.title.toLowerCase().includes('products')) {
        renderUserSettings();
        main();
    }
})();
