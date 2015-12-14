
var uuid = require("uuid");
var lru = require("./lru-example")(function(x)
{
    return uuid.v4();
});


var total = 0;

console.log("Iters\tAvg\tBytes");
for (x = 0; x < 1000000000; ++x)
{
    var d = new Date();
    var length = lru(uuid.v4());
    total += new Date() - d;

    if (x % 1000 === 0)
    {
        console.log(x + "\t" + (total / 1000) + "\t" + length);
        total = 0;
    }
}
