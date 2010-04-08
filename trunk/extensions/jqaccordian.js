/*
 * jqAccordian - Accordian extension for jQuery/jQLite.
 *
 * A simple extension which will convert an UL into an accordian object.
 * The LI elements must contain two elements themselves:
 *
 *		- An element with class "title"
 *		- An element with class "body"
 *
 * The element with class "title" will always show.  If it is clicked upon,
 * it will open the corresponding body.  The plugin takes some options:
 *
 *		openOne - {boolean} If true (default), only one body can be open at a time.
 *				Clicking the title will open the body, and close any other open
 *				bodies.  If false, clicking the title will toggle the body open
 *				and closed.
 *
 */


(function(jQuery) {
	jQuery.fn.extend({
		jqAccordian: function(opts) {

			var o = jQuery.extend({
				openOne: true
			}, opts);

			return this.each(function() {
				var jQ = $(this);
				if (jQ.hasClass("jQ-accordian")) {
					// If it's already an accordian, just exit
					return;
				}

				// Set a class identifying the UL as an accordian
				jQ.addClass("jq-accordian");

				// Collapse the elements with the "body" class.  If openOne is
				// false, collapse all of them.  If true, collapse all but the
				// first one.
				$(".body", jQ).each(function(i) {
					var b = $(this);
					if ((o.openOne && i > 0) || !o.openOne) {
						b.hide();
					}
				});

				// Wire up the elements with the "title" class
				// to open/close the tab's body
				$(".title", jQ).each(function() {
					var t = $(this);
					t.click(function() {
						var tjQ = $(this);
						if (o.openOne) {
							// Find all of the bodies and close them
							$(".body", jQ).hide();
							// Show our own body
							$(".body", tjQ.parent()).show();
						} else {
							var tp = tjQ.parent();
							if (tp.hasClass("jq-accordian-open")) {
								tp.removeClass("jq-accordian-open");
								$(".body", tp).hide();
							} else {
								tp.addClass("jq-accordian-open");
								$(".body", tp).show();
							}
						}
					});
				});
			});
		}
	});
})(jQuery);
