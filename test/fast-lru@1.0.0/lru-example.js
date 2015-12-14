
module.exports = function LRUed(aFunction)
{
    const LRU = new (require("../../"))(64 * 1000 * 1000, length);

    return function()
    {
        const key = JSON.stringify(arguments);

        if (LRU.has(key))
            return LRU.get(key);

        const value = aFunction(arguments[0]);

        LRU.set(key, value);

        return LRU.size;
        //return value;
    }
}

function length(aKey, aValue)
{
    var keyLength = aKey.length;

    if (typeof aValue === "boolean")
        return keyLength;

    if (typeof aValue === "string")
        return keyLength + aValue.length;

    return Object.keys(aValue).reduce(function(aPrevious, aKey) { return aPrevious + aKey.length + aValue[aKey].length }, 0);
}
