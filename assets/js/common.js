! function(o) {
	"use strict";
		o(document)
		.on("ready", (function() {
			! function() {
				var t = o(".js-go-to");
				t.on("click", (function(t) {
					t.preventDefault(), o("html, body")
						.animate({
							scrollTop: 0
						}, 600)
				}));
				var e = function() {
					o(window)
						.scrollTop() > 400 ? t.addClass("show") : t.removeClass("show")
				};
				e(), o(window)
					.scroll((function() {
						e()
					}))
			}()
		}))
}(jQuery);