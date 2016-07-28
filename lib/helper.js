// This function strips out all the unwanted entries from our postData

module.exports = {
    validatePost: function(allowedKeys, postData) {
        _temp = {};

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
        console.log(query);
        return collection.distinct( "data.choices" ).exec();
    }
};
