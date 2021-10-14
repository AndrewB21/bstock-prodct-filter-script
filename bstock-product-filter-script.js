// Your code here...
// ==UserScript==
// @name         B Stock Element Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match      https://www.evga.com/*
// @icon         https://www.google.com/s2/favicons?domain=evga.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variable declarations & element creation
    const defaultFilterText = "RTX"; // Change this to change the initial filter text
    const filterOnLoad = false; // Change to true to filter elements by the default filter value
    const productContainers = document.querySelectorAll('.list-item');
    const header = document.querySelector('#LFrame_prdList_pnlOptionsSort');
    const container = document.createElement('div');
    const filterButton = document.createElement('button');
    const clearFilterButton = document.createElement('button');
    const input = document.createElement('input');

    // Function declarations
    const filterElements = () => {
        clearFilter();
        const inputText = document.querySelector('.filter-elements-input').value.toLowerCase();
        for (let node of productContainers) {
            const nodeText = node.querySelector('.pl-list-pname').childNodes[1].innerHTML.toLowerCase();
            if (!nodeText.includes(inputText)) {
                node.style.display = 'none'
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
        setButtonStyle(filterButton, 'Filter Products', filterElements);
        setButtonStyle(clearFilterButton, 'Clear Filter', clearFilter);

        // Set input properties/style
        input.style = 'border-radius:10px;border:none;padding: 5px;width:125px;'
        input.className = "filter-elements-input";
        input.value = defaultFilterText;

        // Set container properties/style and append elements
        container.className="product-filter-container";
        container.style.width = "375px";
        container.style.padding = "5px";
        container.appendChild(input);
        container.appendChild(filterButton);
        container.appendChild(clearFilterButton);

        header.appendChild(container);

        if (filterOnLoad) {
            filterElements();
        }
    }

    if (document.title.toLowerCase().includes('products')) {
        main();
    }


})();