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

    documentExists: function(collection, pId, callback) {
        collection.count( {project_id: pId}, function(err, doc) {

            if (err) {
                throw err;
            }
            callback(doc);
        })
    }
};
