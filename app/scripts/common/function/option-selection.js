const Shopify = Shopify || {};

Shopify.optionsMap = {};

Shopify.updateOptionsInSelector = function(selectorIndex) {
    let parent = Shopify.productContainer;

    switch (selectorIndex) {
        case 0:
        var key = 'root', selector = parent.querySelector('[data-linked-option-select="0"]');
        break;
        case 1:
        var key = parent.querySelector('[data-linked-option-select="0"]').value, selector = parent.querySelector('[data-linked-option-select="1"]');
        break;
        case 2:
        var key = parent.querySelector('[data-linked-option-select="0"]').value, selector = parent.querySelector('[data-linked-option-select="2"]');
        key += ' / ' + parent.querySelector('[data-linked-option-select="1"]').value;
    }

    if(selector == null) return;

    var initialValue = selector.value
    ,availableOptions = Shopify.optionsMap[key] || []
    ,optionHTML = '';

    availableOptions.length && availableOptions.map(item=>{
        let option = document.createElement('option');
        option.value = item;
        option.innerHTML = item;
        optionHTML += option.outerHTML;
    });

    productSettings.only_available && (selector.innerHTML = optionHTML);

    let swatchItems = parent.querySelectorAll('[data-linked-option="'+ selectorIndex + '"] [data-linked-option-item]');
    swatchItems.length && swatchItems.forEach(function(s) {
        let radio = s.querySelector('[type="radio"]')
        let value = radio.value;
        if (availableOptions.filter(i=>i == value).length) {
            s.setAttribute('data-linked-option-item', '');
            // radio.removeAttribute('disabled');
        }
        else {
            s.setAttribute('data-linked-option-item', 'disabled');
            // radio.setAttribute('disabled', 'disabled');
        }
    });

    if (availableOptions.filter(i=>i == initialValue).length) {
        selector.value = initialValue;
    }
    optionHTML != '' && selector.dispatchEvent(new Event('change'));
};

Shopify.linkOptionSelectors = function(arg) {
    let product = arg.productJSON;
    let container = arg.container;

    Shopify.productContainer = container;
    /*Building our mapping object.*/
    let variantAvailable = productSettings.only_available;

    for (var i=0; i<product.variants.length; i++) {
        var variant = product.variants[i];

        if (variant && variant.available) {
            /*Gathering values for the 1st drop-down.*/
            Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
            Shopify.optionsMap['root'].push(variant.option1);
            Shopify.optionsMap['root'] = [...new Set(Shopify.optionsMap['root'])];
            /*Gathering values for the 2nd drop-down.*/
            if (product.options.length > 1) {
                var key = variant.option1;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option2);
                Shopify.optionsMap[key] = [...new Set(Shopify.optionsMap[key])];
            }
            /*Gathering values for the 3rd drop-down.*/
            if (product.options.length === 3) {
                var key = variant.option1 + ' / ' + variant.option2;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option3);
                Shopify.optionsMap[key] = [...new Set(Shopify.optionsMap[key])];
            }
        }
    }

    Shopify.updateOptionsInSelector(0);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);

    /*When there is an update in the first dropdown.*/
    let select0 = container.querySelector('[data-linked-option-select="0"]');
    select0 != null && select0.addEventListener('change', function(){
        Shopify.updateOptionsInSelector(1);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });

    /*When there is an update in the second dropdown.*/
    let select1 = container.querySelector('[data-linked-option-select="1"]');
    select1 != null && select1.addEventListener('change', function(){
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });
};