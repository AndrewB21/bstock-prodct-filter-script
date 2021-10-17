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

const defaultUserSettings = {
    filterOnLoad: false,
    defaultFilterMode: filterModes.userInput,
    defaultFilterText: '',
    defaultDropdownValue: '',
}

const chipsetFamilies = {
    b3060ti: 'https://www.evga.com/products/ProductList.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3060+ti',
    b3070: 'https://www.evga.com/products/productlist.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3070',
    b3080: 'https://www.evga.com/products/ProductList.aspx?type=8&family=GeForce+30+Series+Family&chipset=RTX+3080'
}
