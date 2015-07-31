# New Performance Upgrade! #

jQLite has been updated to use `querySelectorAll()` if it's available.  This allows for a native implementation of the selector engine used to acquire elements within the DOM.  This speedup, while beneficial, may cause issues if it is implemented differently across platforms.  As such, there is a flag that has been added which will force the usage of the older selector engine.

Setting `jQuery.forceSimpleSelectorEngine` to `true` will force the usage of the older selector engine (jQLite v1.0.0 - v1.1.0).  When this flag is set to `false` the determination is made based on whether the element supports this method or not.  It will automatically downgrade if the method doesn't exist.  _As such, it is important that you don't use selectors which are [unsupported by the older engine](http://code.google.com/p/jqlite/wiki/UsingJQLite)_.  Unless you are absolutely sure that every element will support `querySelectorAll()`, you should keep this in mind.

Current testing shows that the speedup is significant (approximately 10-20% faster for the most complex pages) and that it is functioning well on all current mobile browsers.  If you see issues, you should set the aforementioned flag to `true` to revert to the older selector engine.

For more information about `querySelectorAll()`, refer to [this page](http://www.w3.org/TR/selectors-api/).