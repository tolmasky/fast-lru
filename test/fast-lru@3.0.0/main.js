var uuid = require("uuid");
var lru = require("../../")(
{
    max: 64 * 1000 * 1000, // 64MB
    length: function(v){ return v.key.length + v.value.length; },
    maxAge: Infinity
});

var total = 0;

console.log("Iters\tAvg\tBytes");
for (x = 0; x < 1000000000; ++x)
{
    var d = new Date();
    var key = uuid.v4();
    lru.set(key, { key: key, value: uuid.v4() });

    total += new Date() - d;
    var length = lru.size;

    if (x % 10000 === 0)
    {
        console.log(x + "\t" + (total / 10000) + "\t" + length);
        total = 0;
    }
}
