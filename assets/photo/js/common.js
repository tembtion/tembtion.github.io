+function($) {
    $.fn.showPhotos = function(configs) {
        var settings = $.extend({
            rotate: 20,
            time: 6000,
            header: 0,
            zindex: 1000,
            moveSpeed: 600,
        },
        configs || {});
        var $slef = $(this);
//        $slef.imagesLoaded(function() {
            changePhotos();
//            var photosTime = window.setInterval(function() {
//                changePhotos();
//            },
//            settings.time)
//        });
        function changePhotos() {
            var photoBoxHeight = $slef.height();
            var photoBoxWidth = $slef.width();
            $slef.find(".polaroid").each(function() {
                var rotate = "rotate(" + random( - settings.rotate, settings.rotate) + "deg)";
                var index = random(settings.zindex);
                var css = {
                    "-webkit-transform": rotate,
                    "-ms-transform": rotate,
                    "transform": rotate,
                    "z-index": index
                };
                $(this).css(css).data('css', css); 
                var photoWidth = $(this).outerWidth();
                var photoHeight = $(this).outerHeight();
                var ratio = photoWidth / photoHeight;
                var photoMaxWidth = Math.floor(photoBoxHeight * ratio) > 400 ? 400 : Math.floor(photoBoxHeight * ratio);
                var sizeRandom = random(150, photoMaxWidth);
//                var widthRatio = Math.floor(sizeRandom / photoMaxWidth * 100);

                $(this).css("width", sizeRandom + "px");
                $(this).css("height", "auto");

                photoWidth = $(this).outerWidth();
                photoHeight = $(this).outerHeight();
                var heightDiff = Math.floor(photoBoxHeight - photoHeight);
                var widthDiff = Math.floor(photoBoxWidth - photoWidth);

                var maxTop = Math.floor(heightDiff / photoBoxHeight * 100);
                var maxLeft = Math.floor(widthDiff / photoBoxWidth * 100);
                var top = random(maxTop);
                var left = random(maxLeft);
                var rotate = "rotate(" + random( - settings.rotate, settings.rotate) + "deg)";
                $(this).animate({
                    "top": top + "%",
                    "left": left + "%"
                },
                settings.moveSpeed)
            })
            $slef.css({opacity: 1});
        }
        function random(max, min) {
            if (!min) {
                min = 0
            }
            var range = max - min;
            return (min + Math.floor(Math.random() * range))
        }
    }
} (jQuery);