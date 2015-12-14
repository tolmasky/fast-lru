


var private = (function()
{
    var map = new WeakMap();

    return function(anObject, aKey, aValue)
    {
        var variables = map.get(anObject);

        if (arguments.length === 2)
            return variables && variables[aKey];

        if (!variables)
            map.set(anObject, variables = { });

        return variables[aKey] = aValue;
    }
})();

function LRU(options)
{
    if (!(this instanceof LRU))
        return new LRU(options);

    var getSize = (options.lengthCalculator || options.getSize || simpleSize);
    var maximumSize = (options.max || options.maximumSize || Infinity);

    private(this, "map", new Map());
    private(this, "list", { first: null, last: null });
    private(this, "cache", { first: null, last: null });
    private(this, "size", 0);
    private(this, "getSize", getSize);
    private(this, "maximumSize", maximumSize);
}

function simpleSize()
{
    return 1;
}

module.exports = LRU;

Object.defineProperty(LRU.prototype, "size",
{
    get: function() { return private(this, "size"); }
});

LRU.prototype.has = function(aKey)
{
    return private(this, "map").has(aKey);
}

LRU.prototype.get = function(aKey)
{
    if (!this.has(aKey))
        return undefined;

    var element = private(this, "map").get(aKey);
    var list = private(this, "list");

    toFront(element, list);

    return element.value;
}

LRU.prototype.set = function(aKey, aValue)
{
    var getSize = private(this, "getSize");
    var elementSize = getSize(aValue, aKey);
    var maximumSize = private(this, "maximumSize");
    var map = private(this, "map");
    var element = map.get(aKey);

    // Easy case, it won't make it in, and we don't have it.
    if (elementSize > maximumSize && !element)
        return;

    var list = private(this, "list");
    var size = private(this, "size");

    // Won't make it in, but we do have it.
    if (elementSize > maximumSize && !!element)
    {
        private(this, "size", size - element.size);
        remove(list, element);
        unshift(private(this, "cache"), element);

        return;
    }

    var appendedSize = size + elementSize;

    // Second easy case, WILL make it in, and we have it.
    if (elementSize <= maximumSize && !!element)
    {
        var reducedSize = appendedSize - element.size;

        toFront(list, element);
        element.value = aValue;
        element.size = elementSize;

        private(this, "size", reducedSize);

        shrink(this);

        return;
    }

    // Will make it in and we DON'T have it
    private(this, "size", appendedSize);
    shrink(this);

    var element = getElement(this, aKey, aValue, elementSize);

    map.set(aKey, element);
    unshift(list, element);
}

function getElement(anLRU, aKey, aValue, anElementSize)
{
    var cache = private(anLRU, "cache");
    var existing = shift(cache);

    if (existing)
    {
        existing.key = aKey;
        existing.value = aValue;
        existing.size = anElementSize;
    }

    return existing || new Element(aKey, aValue, anElementSize);
}

function shrink(anLRU)
{
    if (size <= maximumSize)
        return;

    var size = private(anLRU, "size");
    var maximumSize = private(anLRU, "maximumSize");
    var list = private(anLRU, "list");
    var map = private(anLRU, "map");
    var cache = private(anLRU, "cache");

    while (size > maximumSize && list.last)
    {
        var last = list.last;

        size -= last.size;
        remove(list, last);
        map.delete(last.key);
        unshift(cache, last);
    }

    private(anLRU, "size", size);
}

function Element(aKey, aValue, aSize)
{
    this.previous = null;
    this.next = null;

    this.key = aKey;
    this.value = aValue;
    this.size = aSize;
}

function toFront(aList, anElement)
{
    if (aList.first === anElement)
        return;

    remove(aList, anElement);
    unshift(aList, anElement);
}

function unshift(aList, anElement)
{
    anElement.next = aList.first;
    anElement.previous = null;

    aList.first = anElement;

    if (!aList.last)
        aList.last = anElement;
}

function shift(aList)
{
    var first = aList.first;

    if (!first)
        return null;

    return remove(aList, first);
}

function remove(aList, anElement)
{
    if (aList.first === anElement)
        aList.first = anElement.next;

    if (aList.last === anElement)
        aList.last = anElement.previous;

    var previous = anElement.previous;
    var next = anElement.next;

    if (previous)
        previous.next = next;

    if (next)
        next.previous = previous;

    return anElement;
}
