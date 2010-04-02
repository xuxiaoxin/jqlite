/*!
 * jQLite JavaScript Library v1.0.1
 * Copyright (c) 2010 Brett Fattori (bfattori@gmail.com)
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Many thanks to the jQuery team's efforts.  Some code is
 * Copyright (c) 2010, John Resig.  See
 * http://jquery.org/license
 *
 * @author Brett Fattori (bfattori@gmail.com)
 * @author $Author$
 * @version $Revision$
 *
 * Created: 04/29/2010
 * Modified: $Date$
 */
(function() {

   /*
      Simplified DOM selection engine
      START ---------------------------------------------------------
    */
   var parseChunks = function(stringSelector, contextNodes) {

      if (stringSelector === "" && contextNodes) {
         return contextNodes;
      }

      var chunks = stringSelector.split(" ");

      // Revise the context nodes
      var chunk = chunks.shift();
      var ctxNode;

      // Is the chunk an Id selector?
      if (chunk.charAt(0) == "#") {
         ctxNode = [document.getElementById(chunk.substring(1))];
      } else {

         var elName = chunk.charAt(0) !== "." ? chunk.split(".")[0] : "*";
         var classes = chunk.split(".");

         var cFn = function(node) {
            var aC = arguments.callee;
            if (!aC.needClass || hasClasses(node, aC.classes)) {
               return node;
            }
         };

         // If we have an element name, find tags in the context
         // of that type
         if (elName !== "") {
            var cnodes = [];
            for (var cxn = 0; cxn < contextNodes.length; cxn++) {
               var x = contextNodes[cxn].getElementsByTagName(elName);
               for (var a = 0;a < x.length; a++) {
                  cnodes.push(x[a]);
               }
            }
            if (classes) {
               classes.shift();
            }
            ctxNode = [];
            cFn.classes = classes;
            cFn.needClass = (chunk.indexOf(".") != -1 && classes.length > 0);
            for (var j = 0; j < cnodes.length; j++) {
               if (cFn(cnodes[j])) {
                  ctxNode.push(cnodes[j]);
               }
            }
         }
      }

      return parseChunks(chunks.join(" "), ctxNode);
   };

   var parseSelector = function(selector, context) {

      context = context || document.body;

      if (selector.nodeType && selector.nodeType === DOM_DOCUMENT_NODE) {
         selector = document.body;
         if (selector === null) {
            // Body not ready yet, return the document instead
            return [document];
         }
      }

      if (selector.nodeType && selector.nodeType === DOM_ELEMENT_NODE) {
         // Is the selector already a single DOM node?
         return [selector];
      }

      if (selector.jquery && typeof selector.jquery === "string") {
         // Is the selector a jQL object?
         return selector.toArray();
      }

      if (context) {
         if (context.nodeType && context.nodeType == DOM_ELEMENT_NODE) {
            context = [context];
         } else if (typeof context === "string") {
            context = jQL(context).toArray();
         } else if (context.jquery && typeof context.jquery === "string") {
            context = context.toArray();
         }
      }

      if (jQL.isArray(selector)) {
         // This is already an array of nodes
         return selector;
      } else if (typeof selector === "string") {

         // This is the meat and potatoes
         var nodes = [];
         for (var cN = 0; cN < context.length; cN++) {
            // For each context node, look for the
            // specified node within it
            var ctxNode = [context[cN]];
            nodes = nodes.concat(parseChunks(selector, ctxNode));
         }

         //alert(selector + " found " + nodes.length + " nodes");
         return nodes;
      } else {
         // What do you want me to do with this?
         return null;
      }
   };

   var hasClasses = function(node, cArr) {
      if (node.className.length = 0) {
         return false;
      }
      var cn = node.className.split(" ");
      var cC = cArr.length;
      for (var c = 0; c < cArr.length; c++) {
         if (idxOf(cn, cArr[c]) != -1) {
            cC--;
         }
      }
      return (cC == 0);
   };
   /*
      END -----------------------------------------------------------
      Simplified DOM selection engine
    */

   var gSupportScriptEval = false;

    setTimeout(function() {
      var root = document.body;

      if (!root) {
         setTimeout(arguments.callee, 33);
      }

      var script = document.createElement("script"),
       id = "i" + new Date().getTime();

      script.type = "text/javascript";
      try {
         script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
      } catch(e) {}

      root.insertBefore( script, root.firstChild );

      // Make sure that the execution of code works by injecting a script
      // tag with appendChild/createTextNode
      // (IE doesn't support this, fails, and uses .text instead)
      var does = true;
      if ( window[ id ] ) {
         delete window[ id ];
      } else {
         does = false;
      }

      root.removeChild( script );
      gSupportScriptEval = does;
   }, 33);

   var stripScripts = function(data) {
      // Wrap the data in a dom element
      var div = document.createElement("div");
      div.innerHTML = data;
      // Strip out all scripts
      var scripts = div.getElementsByTagName("script");

      return { scripts: scripts, data: data};
   };

   var properCase = function(str, skipFirst) {
      skipFirst = skipFirst || false;
      str = (!str ? "" : str.toString().replace(/^\s*|\s*$/g,""));

      var returnString = "";
      if(str.length <= 0){
         return "";
      }

      var ucaseNextFlag = false;

      if(!skipFirst) {
         returnString += str.charAt(0).toUpperCase();
      } else {
         returnString += str.charAt(0);
      }

      for(var counter=1;counter < str.length;counter++) {
         if(ucaseNextFlag) {
            returnString += str.charAt(counter).toUpperCase();
         } else {
            returnString += str.charAt(counter).toLowerCase();
         }
         var character = str.charCodeAt(counter);
         if(character == 32 || character == 45 || character == 46) {
            ucaseNextFlag = true;
         } else {
            ucaseNextFlag = false;
         }
         if(character == 99 || character == 67) {
            if(str.charCodeAt(counter-1)==77 || str.charCodeAt(counter-1)==109) {
               ucaseNextFlag = true;
            }
         }
      }
      return returnString;
   };


   var fixStyleProp = function(name) {
      var tempName = name.replace(/-/g, " ");
      tempName = properCase(tempName, true);
      return tempName.replace(/ /g, "");
   };

   //------------------ EVENTS

   /**
    * Associative array of events and their types (Mozilla/Firefox only)
    * @private
    */
   var EVENT_TYPES = {onclick:"MouseEvents",ondblclick:"MouseEvents",onmousedown:"MouseEvents",onmouseup:"MouseEvents",
                  onmouseover:"MouseEvents",onmousemove:"MouseEvents",onmouseout:"MouseEvents",oncontextmenu:"MouseEvents",
                  onkeypress:"KeyEvents",onkeydown:"KeyEvents",onkeyup:"KeyEvents",onload:"HTMLEvents",onunload:"HTMLEvents",
                  onabort:"HTMLEvents",onerror:"HTMLEvents",onresize:"HTMLEvents",onscroll:"HTMLEvents",onselect:"HTMLEvents",
                  onchange:"HTMLEvents",onsubmit:"HTMLEvents",onreset:"HTMLEvents",onfocus:"HTMLEvents",onblur:"HTMLEvents"};

   var createEvent = function(eventType) {
      if (typeof eventType === "string") {
         eventType = eventType.toLowerCase();
      }

      var evt = null;
      var eventClass = EVENT_TYPES[eventType] || "Custom";
      if(document.createEvent) {
         evt = document.createEvent(eventClass);
         if(eventType) {
            evt.initEvent(eventType, true, true);
         }
      }

      if(document.createEventObject) {
         evt = document.createEventObject();
         if(eventType) {
            evt.type = eventType;
         }
      }

      return evt;
   };

   var fireEvent = function(node, eventType, data) {
      var evt = createEvent(eventType);
      if (evt.type !== "Custom") {
         evt.data = data;
         return node.dispatchEvent(evt);
      } else {
         var eHandlers = node._handlers || {};
         var handlers = eHandlers[eventType];
         if (handlers) {
            for (var h = 0; h < handlers.length; h++) {
               if (!handlers[h].call(node, evt, data)) {
                  break;
               }
            }
         }
      }
   };

   var setHandler = function(node, eventType, fn) {
      if (!jQL.isFunction(fn)) {
         return;
      }
      
      if (typeof eventType === "string") {
         eventType = eventType.toLowerCase();
      }

      var eventClass = EVENT_TYPES[eventType];
      if (eventClass) {
         // Let the browser handle it
         this.addEventListener(eventType, fn, false);
      } else {
         if (!this._handlers) {
            this._handlers = {};
         }
         var handlers = this._handlers[eventType] || [];
         handlers.push(fn);
         this._handlers[eventType] = handlers;
      }
   };

   /**
    * jQuery "lite" - Fry In-house solution
    *
    * This is a small subset of support for jQuery-like functionality.  It
    * is not intended to be a full replacement, but it will provide some
    * of the functionality which jQuery provides to allow development
    * using jQuery-like syntax.
    *
    * @author Brett Fattori (bfattori@fry.com)
    * @author $Author$
    * @version $Revision$
    */
   var jQL = function(s, e) {
      return new jQLp().init(s, e);
   },
   document = window.document,
   toString = Object.prototype.toString,
   push = Array.prototype.push,
   slice = Array.prototype.slice,
   DOM_ELEMENT_NODE = 1,
   DOM_DOCUMENT_NODE = 9,
   readyStack = [],
   isReady = false,
   setReady = false,
   DOMContentLoaded;

   /**
    * Loop over each object, performing the function for each one
    * @param obj
    * @param fn
    */
   jQL.each = function(obj, fn) {
      var name, i = 0,
         length = obj.length,
         isObj = length === undefined || jQL.isFunction(obj);

      if ( isObj ) {
         for ( name in obj ) {
            if ( fn.call( obj[ name ], name, obj[ name ] ) === false ) {
               break;
            }
         }
      } else {
         for ( var value = obj[0];
            i < length && fn.call( value, i, value ) !== false; value = obj[++i] ) {}
      }

      return obj;
   };

   /**
    * Test if the given object is a function
    * @param obj
    */
   jQL.isFunction = function(obj) {
      return toString.call(obj) === "[object Function]";
   };

   /**
    * Test if the given object is an Array
    * @param obj
    */
   jQL.isArray = function( obj ) {
      return toString.call(obj) === "[object Array]";
   };

   /**
    * Merge two objects into one
    * @param first
    * @param second
    */
   jQL.merge = function( first, second ) {
      var i = first.length, j = 0;

      if ( typeof second.length === "number" ) {
         for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
         }
      } else {
         while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
         }
      }

      first.length = i;

      return first;
   };

   jQL.toPList = function(params) {
      var pList = "";
      if (params) {
         jQL.each(params, function(val, name) {
            pList += (pList.length != 0 ? "&" : "") + name + "=" + encodeURIComponent(val);
         });
      }
      return pList;
   };

   jQL.evalScripts = function(scripts) {
      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      for (var s = 0; s < scripts.length; s++) {

         var script = document.createElement("script");
         script.type = "text/javascript";

         if ( gSupportScriptEval ) {
            script.appendChild( document.createTextNode( scripts[s].text ) );
         } else {
            script.text = scripts[s].text;
         }

         // Use insertBefore instead of appendChild to circumvent an IE6 bug.
         // This arises when a base node is used (#2709).
         head.insertBefore( script, head.firstChild );
         head.removeChild( script );
      }
   };

   jQL.ready = function() {
      isReady = true;
      for (var r = 0; r < readyStack.length; r++) {
         var fn = readyStack.shift();
         fn();
      }
   };

   jQL.ajax = {
      status: -1,
      statusText: "",
      responseText: null,
      responseXML: null,

      send: function(url, params, sendFn) {
         if (jQL.isFunction(params)) {
            sendFn = params;
            params = {};
         }

         if (!url) {
            return;
         }

         var async = true, uName = null, pWord = null;
         if (typeof params.async !== "undefined") {
            async = params.async;
            delete params.async;
         }

         if (typeof params.username !== "undefined") {
            uName = params.username;
            delete params.username;
         }

         if (typeof params.password !== "undefined") {
            pWord = params.password;
            delete params.password;
         }

         // Poll for readyState == 4
         var p = jQL.toPList(params);
         if (p.length != 0) {
            url += (url.indexOf("?") == -1 ? "?" : "&") + p;
         }
         var req = new XMLHttpRequest();
         req.open("GET", url, async, uName, pWord);
         req.send();

         if (async) {
            var xCB = function(xhr) {
               var aC = arguments.callee;
               if (xhr.status == 200) {
                  jQL.ajax.complete(xhr, aC.cb);
               } else {
                  jQL.ajax.error(xhr, aC.cb);
               }
            };
            xCB.cb = sendFn;

            var poll = function() {
               var aC = arguments.callee;
               if (aC.req.readyState != 4) {
                  setTimeout(aC, 250);
               } else {
                  aC.xcb(aC.req);
               }
            };
            poll.req = req;
            poll.xcb = xCB;

            setTimeout(poll, 250);
         } else {
            // synchronous support?
         }
      }
   };

   /**
    * Convert the results into an array
    * @param array
    * @param results
    */
   jQL.makeArray = function( array, results ) {
      var ret = results || [];
      if ( array != null ) {
         // The window, strings (and functions) also have 'length'
         // The extra typeof function check is to prevent crashes
         // in Safari 2 (See: #3039)
         if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
            push.call( ret, array );
         } else {
            jQL.merge( ret, array );
         }
      }

      return ret;
   };

   /**
    * jQLite object
    * @private
    */
   var jQLp = function() {};
   jQLp.prototype = {

      selector: "",
      context: null,
      length: 0,
      jquery: "jqlite-1.0.1",

      init: function(s, e) {

         if (!s) {
            return this;
         }

         if (s.nodeType) {
            this.context = this[0] = s;
            this.length = 1;
         }

         if (typeof s == "function") {
            // Short-form document.ready()
            this.ready(s);
         } else {

            var els = parseSelector(s, e);
            push.apply(this, els);

         }
         return this;
      },

      // CORE
      
      each: function(fn) {
         return jQL.each(this, fn);
      },

      size: function() {
         return this.length;
      },

      toArray: function() {
         return slice.call( this, 0 );
      },

      ready: function(fn) {
         if (isReady) {
            fn();
         } else {
            readyStack.push(fn);
            return this;
         }
      },

      // CSS
      
      addClass: function(cName) {
         return this.each(function() {
            if (this.className.length != 0) {
               var cn = this.className.split(" ");
               if (idxOf(cn, cName) == -1) {
                  cn.push(cName);
                  this.className = cn.join(" ");
               }
            } else {
               this.className = cName;
            }
         });
      },

      removeClass: function(cName) {
         return this.each(function() {
            if (this.className.length != 0) {
               var cn = this.className.split(" ");
               var i = idxOf(cn, cName);
               if (i != -1) {
                  cn.splice(i, 1);
                  this.className = cn.join(" ");
               }
            }
         });
      },

      hasClass: function(cName) {
         if (this[0].className.length == 0) {
            return false;
         }
         var cn = this[0].className.split(" ");
         return idxOf(cn, cName) != -1;
      },

      isElementName: function(eName) {
         return (this[0].nodeName.toLowerCase() === eName.toLowerCase());
      },

      toggleClass: function(cName) {
         return this.each(function() {
            if (this.className.length == 0) {
               this.className = cName;
            } else {
               var cn = this.className.split(" ");
               var i = idxOf(cn, cName);
               if (i != -1) {
                  cn.splice(i, 1);
               } else {
                  cn.push(cName);
               }
               this.className = cn.join(" ");
            }
         });
      },

      hide: function(fn) {
         return this.each(function() {
            this._oldDisplay = this.style["display"];
            this.style["display"] = "none";
            if (jQL.isFunction(fn)) {
               fn(this);
            }
         });
      },

      show: function(fn) {
         return this.each(function() {
            this.style["display"] = (this._oldDisplay || (this.nodeName == "div" ? "block" : "inline"));
            if (jQL.isFunction(fn)) {
               fn(this);
            }
         });
      },

      css: function(sel, val) {
         if (typeof sel === "string" && val == null) {
            return this[0].style[fixStyleProp(sel)];
         } else {
            return this.each(function() {
               if (typeof sel === "string") {
                  var o = {};
                  o[sel] = val;
                  sel = o;
               }

               for (var s in sel) {
                  var v = sel[s];
                  v = (typeof v === "number" ? v + "px" : v);
                  var sn = fixStyleProp(s);
                  if (!this.style[sn]) {
                     sn = s;
                  }
                  this.style[sn] = v;
               }
            });
         }
      },

      // AJAX

      load: function(url, params, fn) {
         if (jQL.isFunction(params)) {
            fn = params;
            params = {};
         }
         return this.each(function() {
            var wrapFn = function(data, status) {
               var aC = arguments.callee;
               if (data) {
                  // Strip out any scripts first
                  var o = stripScripts(data);
                  aC.elem.innerHTML = o.data;
                  jQL.evalScripts(o.scripts);
               }
               if (jQL.isFunction(aC.cback)) {
                  aC.cback(data, status);
               }
            };
            wrapFn.cback = fn;
            wrapFn.elem = this;
            jQL.ajax.send(url, params, wrapFn);
         });
      },

      // HTML

      html: function(h) {
         return this.each(function() {
            var o = stripScripts(h);
            this.innerHTML = o.data;
            jQL.evalScripts(o.scripts);
         });
      },

      // EVENTS

      bind: function(eType, fn) {
         return this.each(function() {
            setHandler(this, eType, fn);
         });
      },

      trigger: function(eType, data) {
         return this.each(function() {
            return fireEvent(this, eType, data);
         });
      },

      click: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "click", fn);
            } else {
               return fireEvent(this, "onclick");
            }
         });
      },

      mouseover: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "mouseover", fn);
            } else {
               return fireEvent(this, "onmouseover");
            }
         });
      },

      mouseout: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "mouseout", fn);
            } else {
               return fireEvent(this, "onmouseout");
            }
         });
      },

      mousedown: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "mousedown", fn);
            } else {
               return fireEvent(this, "onmousedown");
            }
         });
      },

      mouseup: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "mouseover", fn);
            } else {
               return fireEvent(this, "onmouseup");
            }
         });
      },

      focus: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "focus", fn);
            } else {
               return fireEvent(this, "onfocus");
            }
         });
      },

      blur: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "blur", fn);
            } else {
               return fireEvent(this, "onblur");
            }
         });
      },

      change: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "change", fn);
            } else {
               return fireEvent(this, "onchange");
            }
         });
      },

      submit: function(fn) {
         return this.each(function() {
            if (jQL.isFunction(fn)) {
               setHandler(this, "submit", fn);
            } else {
               return fireEvent(this, "onsubmit");
            }
         });
      }

   };

   // Cleanup functions for the document ready method
   if ( document.addEventListener ) {
      DOMContentLoaded = function() {
         document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
         jQL.ready();
      };

   } else if ( document.attachEvent ) {
      DOMContentLoaded = function() {
         // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
         if ( document.readyState === "complete" ) {
            document.detachEvent( "onreadystatechange", DOMContentLoaded );
            jQL.ready();
         }
      };
   }

   // Document Ready
   if (!setReady) {
      setReady = true;
      // Catch cases where $(document).ready() is called after the
      // browser event has already occurred.
      if ( document.readyState === "complete" ) {
         return jQL.ready();
      }

      // Mozilla, Opera and webkit nightlies currently support this event
      if ( document.addEventListener ) {
         // Use the handy event callback
         document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

         // A fallback to window.onload, that will always work
         window.addEventListener( "load", jQL.ready, false );

      // If IE event model is used
      } else if ( document.attachEvent ) {
         // ensure firing before onload,
         // maybe late but safe also for iframes
         document.attachEvent("onreadystatechange", DOMContentLoaded);

         // A fallback to window.onload, that will always work
         window.attachEvent( "onload", jQL.ready );
      }
   }

   var idxOf = function(arr, e) {
      for (var a = 0; a < arr.length; a++) {
         if (arr[a] === e) {
            return a;
         }
      }
      return -1;
   };

   // -=- This happens last, as long as jQuery isn't already defined
   if (typeof window.jQuery == "undefined") {
      // Export
      window.jQuery = jQL;
      window.$ = window.jQuery;
   }
})();
