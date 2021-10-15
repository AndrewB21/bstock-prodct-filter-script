// Your code here...
// ==UserScript==
// @name         B Stock Product Filter
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Product filter for EVGA B-Stock product pages
// @author       You
// @match        https://www.evga.com/*
// @updateUrl    https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/bstock-product-filter-script.user.js
// @downloadUrl  https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/bstock-product-filter-script.user.js
// @icon         https://www.google.com/s2/favicons?domain=evga.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variable declarations & element creation
    const filterModes = {
        userInput: 'userInput',
        dropdown: 'dropdown'
    }
    const dropdownOptions = {
        b3060: '3060',
        b3060ti: '3060 Ti',
        b3070: '3070',
        b3080: '3080',
        b3070ti: '3070 Ti',
        b3080ti: '3080 Ti',
    }
    const filterOnLoad = false; // Change to true to filter elements by the default filter value
    const defaultFilterMode = filterModes.dropdown; // Change this to "filterModes.dropdown" to filter by the the intial dropdownValue
    const defaultFilterText = "RTX"; // Change this to change the initial filter text
    const defaultDropdownValue = ''; // Change this to one of the dropdown options (i.e "dropdownOptions.b3060ti") to set the dropdown value to filter by on load
    const productContainers = document.querySelectorAll('.list-item');
    const header = document.querySelector('#LFrame_prdList_pnlOptionsSort');
    const container = document.createElement('div');
    const filterButton = document.createElement('button');
    const clearFilterButton = document.createElement('button');
    const button3060ti = document.createElement('button');
    const button3070 = document.createElement('button');
    const button3080 = document.createElement('button');
    const input = document.createElement('input');
    const select =document.createElement('select');

    const chipsetFamilies = {
        b3060ti: 'https://www.evga.com/products/ProductList.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3060+ti',
        b3070: 'https://www.evga.com/products/productlist.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3070',
        b3080: 'https://www.evga.com/products/ProductList.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3080'
    }

    // Function declarations
    const filterElements = (filterMode) => {
        clearFilter();
        let filterText;
        if (filterMode === filterModes.userInput) {
            filterText = document.querySelector('.filter-elements-input').value.toLowerCase();
        } else if (filterMode === filterModes.dropdown) {
            filterText = document.querySelector('.filter-elements-select').value.toLowerCase();
        }

        for (let node of productContainers) {
            const nodeText = node.querySelector('.pl-list-pname').childNodes[1].innerHTML.toLowerCase();
            if (!nodeText.includes(filterText)) {
                node.style.display = 'none';
            }
            if (!filterText.includes('ti') && nodeText.includes('ti')) {
                node.style.display = 'none';
            }
        }
    }

    const clearFilter = () => {
        for (let node of productContainers) {
            node.style.display = 'block';
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
        setButtonStyle(filterButton, 'Filter Products', () => { filterElements(filterModes.userInput) });
        setButtonStyle(clearFilterButton, 'Clear Filter', clearFilter);
        setButtonStyle(button3060ti, 'View B-Stock 3060Ti Family', () => { window.open(chipsetFamilies.b3060ti, '_blank') });
        setButtonStyle(button3070, 'View B-Stock 3070 Family', () => { window.open(chipsetFamilies.b3070, '_blank') });
        setButtonStyle(button3080, 'View B-Stock 3080 Family', () => { window.open(chipsetFamilies.b3080, '_blank') });

        // Set input properties/style
        input.style = 'border-radius:10px;border:none;padding: 5px;width:125px;'
        input.className = "filter-elements-input";
        input.value = defaultFilterText;

        // Set select properties/style
        select.style = "display: block;border: none;margin-top: 10px;border-radius: 8px;color: black;background-color: white;text-transform: capitalize; font-size:12px;transform: translatex(30px)";
        select.className = "filter-elements-select";
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.innerHTML = '(Select a product family to filter by)';
        select.appendChild(defaultOption);
        for (const value of Object.values(dropdownOptions)) {
            let option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            select.appendChild(option);
        }
        select.value = defaultDropdownValue;
        select.addEventListener('change', () => { filterElements(filterModes.dropdown) });


        // Set container properties/style and append elements
        container.className="product-filter-container";
        container.style.width = "1000px";
        container.style.padding = "5px";
        container.appendChild(input);
        container.appendChild(filterButton);
        container.appendChild(clearFilterButton);
        container.appendChild(button3060ti);
        container.appendChild(button3070);
        container.appendChild(button3080);
        container.appendChild(select);

        header.appendChild(container);

        if (filterOnLoad) {
            console.log('filtering on load');
            filterElements(defaultFilterMode);
        }
    }

    if (document.title.toLowerCase().includes('products')) {
        main();
    }


})();
