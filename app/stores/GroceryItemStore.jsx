var dispatcher = require('./../dispatcher.js');

function GroceryItemStore() {
    var items = [{
        name: 'milk'
    }, {
        name: 'water'
    }, {
        name: 'meat',
        purchased: true
    }, {
        name: 'fish'
    }];
    var listeners = [];

    function getItems() {
        return items;
    }

    function addGroceryItem(item) {
        items.push(item);
        triggerListeners();
    }

    function deleteGroceryItem(item) {
        var index;
        items.find(function(_item, _index) {
            if (_item.name === item.name) {
                index = _index;
                return true;
            }
        });
        items.splice(index, 1);
        triggerListeners();
    }

    function onChange(listener) {
        listeners.push(listener);
    }

    function triggerListeners() {
        listeners.forEach(function(listener) {
            listener(items);
        });
    }

    dispatcher.register(function(event) {
        var split = event.type.split(':');
        if (split[0] === 'grocery-item') {
            switch (split[1]) {
                case 'add':
                    addGroceryItem(event.payload);
                    break;
                case 'delete':
                    deleteGroceryItem(event.payload);
                    break;
            }
        }
    });

    return {
        getItems: getItems,
        onChange: onChange
    };
}

module.exports = new GroceryItemStore();