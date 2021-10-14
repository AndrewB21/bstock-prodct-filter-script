## EVGA B-Stock Product Filter Script
Simple script to filter products by text that the user can change using the input field, or by one of the preset dropdown filters that filter by product family. Also provides button that will open the product page for the various B-Stock 30 series families.

You can set the script to automatically filter on page load by setting the variable filterOnLoad (line 28) to true (is false by default)

You can change the mode to filter by on load (by user input or by a value in the dropdown list) by changing defaultFilterMode (line 29). Use the options in the filterModes variable (line 17).

If filtering on load by user nput, you can change the initial filter text by changing defaultFilterText (line 30) (is "RTX" by default);

If filtering on load by a dropdown value, you can change the initial product family to filter by by changing defaultDropdownValue (line 31) to one of the options in dropdownOptions (line 21);

Script should actually work on any product page on EVGA's website as they follow the same HTML format, but that's untested.

## Installation
Copy/Paste the script (https://raw.githubusercontent.com/AndrewB21/bstock-product-filter-script/master/bstock-product-filter-script.js) as a new script on TamperMonkey.
