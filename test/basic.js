/*

Tests are modified from https://github.com/isaacs/node-lru-cache/blob/master/test/basic.js

The ISC License

Copyright (c) Isaac Z. Schlueter and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

var test = require("tap").test
  , LRU = require("../")

test("basic", function (t) {
  var cache = new LRU({max: 10})
  cache.set("key", "value")
  t.equal(cache.get("key"), "value")
  t.equal(cache.get("nada"), undefined)
  t.equal(cache.size, 1)
  t.equal(cache.max, 10)
  t.end()
})

test("least recently set", function (t) {
  var cache = new LRU({max: 2})
  cache.set("a", "A")
  cache.set("b", "B")
  cache.set("c", "C")
  t.equal(cache.get("c"), "C")
  t.equal(cache.get("b"), "B")
  t.equal(cache.get("a"), undefined)
  t.end()
})

test("lru recently gotten", function (t) {
  var cache = new LRU({max: 2})
  cache.set("a", "A")
  cache.set("b", "B")
  cache.get("a")
  cache.set("c", "C")
  t.equal(cache.get("c"), "C")
  t.equal(cache.get("b"), undefined)
  t.equal(cache.get("a"), "A")
  t.end()
})
