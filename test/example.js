var inner = "This is Package example!";
var inner2 = require("./exa").inner;

exports.func = function() {
    return inner + inner2;
};
