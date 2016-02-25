var dispatcher = require('./../dispatcher.js');
var helper = require('./../helpers/RestHelper.js')

function GroceryItemStore() {
    var items = [];

    helper.get('api/items')
        .then(function(data) {
            items = data;
            triggerListeners();
        });

    var listeners = [];

    function getItems() {
        return items;
    }

    function addGroceryItem(item) {
        items.push(item);
        triggerListeners();

        helper.post('api/items', item);
    }

    function deleteGroceryItem(item) {
        var index;
        items.some(function(_item, _index) {
            if (_item.name === item.name) {
                index = _index;
                return true;
            }
        });
        items.splice(index, 1);
        triggerListeners();

        helper.del('api/items/' + item._id);
    }

    function setGroceryItemBought(item, isBought) {
        var groceryItem;
        items.some(function(_item, _index) {
            if (item.name === _item.name) {
                groceryItem = _item;
                return true;
            }
        });
        groceryItem.purchased = isBought;
        triggerListeners();

        helper.patch('api/items/' + item._id, item);
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
                case 'buy':
                    setGroceryItemBought(event.payload, true);
                    break;
                case 'unbuy':
                    setGroceryItemBought(event.payload, false);
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