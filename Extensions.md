# A List of Extensions to jQLite #

The following extensions work with jQLite and jQuery.

## jQAnimation ##

This is a near-direct port of the jQuery FX engine as an extension.  With this extension, you can perform animations on elements within the DOM.  This extension isn't intended to support IE (support checks have been removed) and it doesn't include the 'toggle' type for show/hide (due to the ':hidden' selector not being available).

For more information, see: [jQuery FX Documentation](http://api.jquery.com/category/effects/)

```
   <script type="text/javascript">
      $(document).ready(function() {
         $("div.clickMe").click(function() {
            $("div.hidden").show(450);
         });
      }):
   </script>

   <style type="text/css">
      div.hidden {
         display: none;
         border: 2px solid #aaf;
         background: #00f;
         color: #fff;
         font-weight: bold;
         width: 120px;
         height: 120px;
      }
   </style>

   <div class="clickMe">Click here to see a trick</div><br/>
   <div class="hidden">
      Are you surprised?
   </div>
```

## jQAccordian ##

A group of tabs which expand/collapse, either like a radio group, or individually.  You can convert any `UL` element into an accordion by specifying a format like the following.  Each `LI` must contain two elements, one with the class "title" and another with the class "body":

```
   <ul class="tabs">
      <li>
         <div class="title">Tab One</div>
         <div class="body">
            This is the body of tab one.
         </div>
      </li>
      <li>
         <div class="title">Tab Two</div>
         <div class="body">
            This is the body of tab two.
         </div>
      </li>
      <li>
         <div class="title">Tab Three</div>
         <div class="body">
            This is the body of tab three.
         </div>
      </li>
   </ul> 

   <script type="text/javascript">
      $(document).ready(function() {
         $("ul.tabs").jqAccordian({ openOne: false });
      });
   </script>
```