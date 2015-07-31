**Documentation is for the current _trunk_ version of jQLite**

# Summary of Supported Features #

jQLite establishes itself as "jQuery" and also exposes the "$" constructor.  You cannot use jQuery and jQLite together on a page.  Since this is intended to be a stand-in for jQuery, it isn't going to support all of the features of jQuery.  This is intended to be a close match to simple functionality needed on a mobile device.  The main focus was element selection, CSS manipulation, AJAX/AHAH, and some event handling.  The [jQuery FX animation engine](http://code.google.com/p/jqlite/wiki/Extensions) is supported as a plug-in, but isn't recommended for heavy use due to limited mobile processor power.

If you develop your web app to use jQuery in its most simplest way, you should be able to upgrade to jQuery when mobile devices can handle it fully.  As it stands, the only mobile browser which this was intended for (BlackBerry) will soon be updated to a WebKit implementation.

## Supported Selectors ##

The following are the types of selectors currently implemented.  The selectors are implemented using straightforward JavaScript since regular expressions across browsers aren't consistent:

| **Selector Type** | **Syntax** |
|:------------------|:-----------|
| Id                | `#foo`     |
| Element           | `div` or `span` or `table` |
| Class             | `.bar` or `div.baz` |
| Multiple class    | `div.button.jq` |
| Descendant        | `div.jq span.hotlink` |
| Multiples         | `"div.button, div.link"` |
| Attribute         | `input[type=hidden]` |


### Supported Attribute Selectors ###

Attribute selectors use regular expressions, so may exhibit inconsistencies across platforms. Three of the attribute selector types is supported.  Additionally, you can have multiple attribute selectors in a single selector.  _The attribute selectors must immediately follow the element name (preceed any class selectors)_:

| `=` | **name equals value** |
|:----|:----------------------|
| `!=` | **name is not equal to value** |
| `*=` | **name contains value** |

```
   var hiddens = $("input[type=hidden]");  // Finds <input type='hidden'/>
   var notHiddens = $("input[type!=hidden]"); // Finds inputs not of type 'hidden'
   var nameHasFoo = $("input[name*=foo]");  // Will find <input name='foobar'/>
```

## Supported Methods ##

Supported object methods:

| `jQuery.noop()`| A no-op function (no action) |
|:---------------|:-----------------------------|
| `jQuery.isFunction(obj)`:boolean | Determine if the input is a Function |
| `jQuery.isArray(obj)`:boolean | Determine if the input is an Array |
| `jQuery.isPlainObject(obj)`:boolean | Determine if the input is a plain Javascript Object |
| `jQuery.merge(obj1, obj2)`:Object | Merges two objects into one. Works on Arrays an Objects |
| `jQuery.param(obj)`:String | Converts a Javascript Object or Array into a query string |
| `jQuery.makeArray(obj[, results])`:Array | Converts the object into an Array. If you provide the second argument (an array), the two will be merged into one. |
| `jQuery.trim(str)`:String | Remove leading and trailing whitespace from string |
| `jQuery.inArray(value, array)`:Number | Return the index of the value in the array, or -1 if not found |
| `jQuery.data(elem, key[, data])`:Object | Add arbitrary data to the given DOM element, or query for the data associated with the key |
| `jQuery.removeData(elem, key)` | Remove arbitrary data from the given DOM element |

Supported instance methods: _(links to jQuery Docs)_

A subset of the operations which jQuery supports are currently implemented.  All of them are implemented using the chained operation syntax of jQuery. e.g:
```
   $("div.foo").each(function() {
      $(this).removeClass("foo").addClass("bar");
   });

   $("div.bar, div.baz").css({ "border": "1px solid red" }).children().addClass("child");
```

  * [.each(function...)](http://api.jquery.com/each/)
  * [.addClass(name)](http://api.jquery.com/addClass/)
  * [.removeClass(name)](http://api.jquery.com/removeClass/)
  * [.toggleClass(name)](http://api.jquery.com/toggleClass/)
  * [.css([name/obj[, value](http://api.jquery.com/css/)])]
  * [.show(callbackFunction...)](http://api.jquery.com/show/)
  * [.hide(callbackFunction...)](http://api.jquery.com/hide/)
  * [.hasClass(name)](http://api.jquery.com/hasClass/)
  * [.html(htmltext)](http://api.jquery.com/html/)
  * [.parent([selector](http://api.jquery.com/parent/))]
  * [.parents([selector](http://api.jquery.com/parents/))]
  * [.prev([selector](http://api.jquery.com/prev/))]
  * [.next([selector](http://api.jquery.com/next/))]
  * [.children([selector](http://api.jquery.com/children/))]
  * [.eq(index)](http://api.jquery.com/eq/)
  * [.first()](http://api.jquery.com/first/)
  * [.last()](http://api.jquery.com/last/)
  * [.index([selector](http://api.jquery.com/index/))]
  * [.append(obj)](http://api.jquery.com/append/)
  * [.remove([filter](http://api.jquery.com/remove/))]
  * [.empty()](http://api.jquery.com/empty/)
  * [.val([value](http://api.jquery.com/val/))]
  * [.attr([name/obj[, value](http://api.jquery.com/attr/)])]
  * [.bind(eventName, function...)](http://api.jquery.com/bind/)
  * [.trigger(eventName[, array](http://api.jquery.com/trigger/)))]
  * [.data(key [, value](http://api.jquery.com/data/)))]
  * [.removeData(key)](http://api.jquery.com/removeData/)
  * [.find(selector)](http://api.jquery.com/find/)
  * [.end()](http://api.jquery.com/end/)


Event Handlers: _(links to jQuery Docs)_

  * [.click(function...)](http://api.jquery.com/click/)
  * [.mouseover(function...)](http://api.jquery.com/mouseover/)
  * [.mouseout(function...)](http://api.jquery.com/mouseout/)
  * [.mouseup(function...)](http://api.jquery.com/mouseup/)
  * [.mousedown(function...)](http://api.jquery.com/mousedown/)
  * [.change(function...)](http://api.jquery.com/change/)
  * [.focus(function...)](http://api.jquery.com/focus/)
  * [.blur(function...)](http://api.jquery.com/blur/)
  * [.submit(function...)](http://api.jquery.com/submit/)

Non-jQuery Events:

  * .touchstart(function...)
  * .touchend(function...)
  * .touchmove(function...)


AJAX:

The Ajax in jQLite isn't a pure match to jQuery.  It is extremely simplified due to limitations on the platform.  There is an `ajax` object which has three methods for handling Ajax requests.

  * **send:** function(url, params, callback)
  * **complete:** function(xhr, callback)
  * **error:** function(xhr, callback)

```
   jQuery.ajax.send("http://www.google.com", function(data, status) {
      alert("Got the data and it's " + data.length + " bytes.");
   });
```

AHAH:

  * [.load(url, params, function...)](http://api.jquery.com/load/)

```
   // Load the contents of my_page.html into the DIV element
   // passing two parameters to the page
   $("div.target").load("my_page.jsp", { foo: 1, bar: "baz" });
```


A function from jQuery has been added to support the [jQAnimation](http://code.google.com/p/jqlite/wiki/Extensions) extension.  It returns the current time in milliseconds:

```
   var time = now();
```


## Element Creation ##

You can create elements on the fly by calling jQuery with some HTML as the argument:

```
   var div = $("<div class='foo'>");
   div.addClass("bar");
   $(document.body).append(div);
```

## Document Ready Functionality ##

In addition to the methods above, you can use the document-ready functionality as either:

  * jQuery(document).ready(function...)
  * jQuery(function...)

```
   $(document).ready(function() {
      alert("The document is now ready!");
   });
```

## Events ##

The event engine is implemented to be as simple as possible.  It isn't a direct match for the jQuery event engine.  Binding of browser events (click, mouseover, mouseout, etc.) is done through `addEventListener()`, but custom events are supported as well.  The difference is that for browser events, the `Event` object is the only argument passed to the event handler.  Any data associated with a `.trigger()` is passed as a "data" field on the `Event` object.  For custom events, the "data" is passed as an array to the handler.

```
   $("div.button").click(function() {
      alert("You clicked the button!");
   });

   $("div.receiver").bind("passthru", function(evt, param1, param2) {
      alert("I've received " + param1 + " and " + param2);
   });

   $("div.clickMe").click(function() {
      $("div.receiver").trigger("passthru", ["apple", "banana"]);
   });
```

## Extending jQLite ##

  * [.extend(obj)](http://api.jquery.com/extend/)

jQLite now supports extensions.  Just like jQuery, you can extend a plain JavaScript object, `jQuery`, or `jQuery.fn`.  This allows you to create extensions to jQLite.  The extensions can still only use the methods available above, but you should be able to implement simple extensions.

There's an example extension on the [Wiki](http://code.google.com/p/jqlite/w/list) for an Accordian group.