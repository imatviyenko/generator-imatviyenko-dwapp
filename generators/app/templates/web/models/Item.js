const appLogger = require('../../logging/appLogger')(module);


const initItems = () => {
    items = [];
    [1,2,3].forEach(
        n => {
            items.push({
                id: n,
                title: 'Item ' + n 
            });
        }
    );
    return items;
}

// some fake method returning promise
const getAll = sessionData => {
    appLogger.debug('getAll invoked');

    if (!sessionData) {
        return Promise.reject('Error getting data from session');
    };

    if (!sessionData.items) {
        sessionData.items = initItems();
    };

    return Promise.resolve(sessionData.items);
}

const add = (sessionData, item) => {
    appLogger.debug('add invoked');

    if (!sessionData) {
        return Promise.reject('Error getting data from session');
    };

    if (!sessionData.items) {
        sessionData.items = initItems();
    };

    const nextId = Math.max(...sessionData.items.map( item => item.id)) + 1;
    const itemToAdd = {
        id: nextId,
        ...item
    };
    sessionData.items.push(itemToAdd);
    return Promise.resolve();
}


const remove = (sessionData, itemId) => {
    appLogger.debug('remove invoked');

    if (!sessionData) {
        return Promise.reject('Error getting data from session');
    };

    if (!sessionData.items) {
        return Promise.reject('No items are saved in the session');
    };

    const index = sessionData.items.findIndex( item => item.id === itemId);
    if (index < 0 ) {
        return Promise.reject('Item with id ' + itemId + ' not found');
    };

    sessionData.items.splice(index, 1); // Remove one element at that index
    return Promise.resolve();
}

module.exports = {
    getAll,
    add,
    remove
}