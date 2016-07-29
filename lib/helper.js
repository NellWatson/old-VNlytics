// This function strips out all the unwanted entries from our postData

module.exports = {
    validatePost: function(allowedKeys, postData) {
        var _temp = {};

        for (var i = 0; i < allowedKeys.length; i++) {
            var key = allowedKeys[i];

            if (key in postData) {
                _temp[key] = postData[key];
            }
        }

        return _temp
    },

    // Checks if an object is empty
    isEmpty: function(obj) {
        return Object.keys(obj).length === 0;
    },

    isObject: function(obj) {
        return obj === Object(obj);
    },

    documentExists: function(collection, query) {
        return collection.count( query ).exec();
    },

    getDistinct: function(collection, query) {
        return collection.distinct( query ).exec();
    },

    getKey: function(obj) {
        var _temp = [];

        for (var i = 0; i < obj.length; i++) {
            _temp.push(Object.keys(i));
        }

        return _temp
    }
};
