# fast-lru

A cache module that deletes the least-recently-used items, inspired by [lru-cache](https://github.com/isaacs/node-lru-cache) and implementing [GeeksForGeeks' algorithm](http://www.geeksforgeeks.org/implement-lru-cache/)

## Options

When creating a new fast-LRU cache instance, you can optionally supply three separate options:
- `getSize`: a `function` used to calculate the size of an item in the cache. The function is passed the value and the key as an argument. By default items will have a size of `1`.
- `maximumSize`: a `number` representing the maximum size of the cache.
- `dispose` a `function` which is called when an item is removed from the cache (either due to cache size limits or by setting a different value for a key). This function is passed both the key and value as arguments.

## API
- `has`: Given a key, returns whether or not an item is in the cache.
- `get`: Given a key, returns the item in the cache or `undefined`.
- `set`: Given a key and value, assigns the value to that key in the cache. Returns true if the item was successfully added to the cache, otherwise returns false.
