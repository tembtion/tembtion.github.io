+
function(t) {
    "use strict";
    function e() {
        this._activeZoom = this._initialScrollPosition = this._initialTouchPosition = this._touchMoveListener = null,
        this._$document = t(document),
        this._$window = t(window),
        this._$body = t(document.body),
        this._boundClick = t.proxy(this._clickHandler, this)
    }
    function i(e) {
        this._fullHeight = this._fullWidth = this._overlay = this._targetImageWrap = null,
        this._targetImage = e,
        this._$body = t(document.body)
    }
    e.prototype.listen = function() {
        this._$body.on("click", '[data-action="zoom"]', t.proxy(this._zoom, this))
    },
    e.prototype._zoom = function(e) {
        var o = e.target;
        if (o && "IMG" == o.tagName && !this._$body.hasClass("zoom-overlay-open")) return e.metaKey || e.ctrlKey ? window.open(e.target.getAttribute("data-original") || e.target.src, "_blank") : void(o.width >= t(window).width() - i.OFFSET || (this._activeZoomClose(!0), this._activeZoom = new i(o), this._activeZoom.zoomImage(), this._$window.on("scroll.zoom", t.proxy(this._scrollHandler, this)), this._$document.on("keyup.zoom", t.proxy(this._keyHandler, this)), this._$document.on("touchstart.zoom", t.proxy(this._touchStart, this)), document.addEventListener ? document.addEventListener("click", this._boundClick, !0) : document.attachEvent("onclick", this._boundClick, !0), "bubbles" in e ? e.bubbles && e.stopPropagation() : e.cancelBubble = !0))
    },
    e.prototype._activeZoomClose = function(t) {
        this._activeZoom && (t ? this._activeZoom.dispose() : this._activeZoom.close(), this._$window.off(".zoom"), this._$document.off(".zoom"), document.removeEventListener("click", this._boundClick, !0), this._activeZoom = null)
    },
    e.prototype._scrollHandler = function(e) {
        null === this._initialScrollPosition && (this._initialScrollPosition = t(window).scrollTop());
        var i = this._initialScrollPosition - t(window).scrollTop();
        Math.abs(i) >= 40 && this._activeZoomClose()
    },
    e.prototype._keyHandler = function(t) {
        27 == t.keyCode && this._activeZoomClose()
    },
    e.prototype._clickHandler = function(t) {
        t.preventDefault ? t.preventDefault() : event.returnValue = !1,
        "bubbles" in t ? t.bubbles && t.stopPropagation() : t.cancelBubble = !0,
        this._activeZoomClose()
    },
    e.prototype._touchStart = function(e) {
        this._initialTouchPosition = e.touches[0].pageY,
        t(e.target).on("touchmove.zoom", t.proxy(this._touchMove, this))
    },
    e.prototype._touchMove = function(e) {
        Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10 && (this._activeZoomClose(), t(e.target).off("touchmove.zoom"))
    },
    i.OFFSET = 80,
    i._MAX_WIDTH = 2560,
    i._MAX_HEIGHT = 4096,
    i.prototype.zoomImage = function() {
        var e = document.createElement("img");
        e.onload = t.proxy(function() {
            this._fullHeight = Number(e.height),
            this._fullWidth = Number(e.width),
            this._zoomOriginal()
        },
        this),
        e.src = this._targetImage.src
    },
    i.prototype._zoomOriginal = function() {
        this._targetImageWrap = document.createElement("div"),
        this._targetImageWrap.className = "zoom-img-wrap",
        this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage),
        this._targetImageWrap.appendChild(this._targetImage),
        t(this._targetImage).addClass("zoom-img").attr("data-action", "zoom-out"),
        this._overlay = document.createElement("div"),
        this._overlay.className = "zoom-overlay",
        document.body.appendChild(this._overlay),
        this._calculateZoom(),
        this._triggerAnimation()
    },
    i.prototype._calculateZoom = function() {
        this._targetImage.offsetWidth;
        var e = this._fullWidth,
        o = this._fullHeight,
        s = (t(window).scrollTop(), e / this._targetImage.width),
        n = t(window).height() - i.OFFSET,
        a = t(window).width() - i.OFFSET,
        r = e / o,
        l = a / n;
        this._imgScaleFactor = a > e && n > o ? s: l > r ? n / o * s: a / e * s
    },
    i.prototype._triggerAnimation = function() {
        this._targetImage.offsetWidth;
        var e = t(this._targetImage).offset(),
        i = t(window).scrollTop(),
        o = i + t(window).height() / 2,
        s = t(window).width() / 2,
        n = e.top + this._targetImage.height / 2,
        a = e.left + this._targetImage.width / 2;
        this._translateY = o - n,
        this._translateX = s - a;
        var r = "scale(" + this._imgScaleFactor + ")",
        l = "translate(" + this._translateX + "px, " + this._translateY + "px)";
        t.support.transition && (l += " translateZ(0)"),
        t(this._targetImage).parents('.polaroid').css({
            "-webkit-transform": "",
            "-ms-transform": "",
            transform: "",
            "z-index": "",
        }),
        t(this._targetImage).css({
            "-webkit-transform": r,
            "-ms-transform": r,
            transform: r
        }),
        t(this._targetImageWrap).css({
            "-webkit-transform": l,
            "-ms-transform": l,
            transform: l
        }),
        this._$body.addClass("zoom-overlay-open")
    },
    i.prototype.close = function() {
        return this._$body.removeClass("zoom-overlay-open").addClass("zoom-overlay-transitioning"),
        t(this._targetImage).parents('.polaroid').css(t(this._targetImage).parents('.polaroid').data('css')),
        t(this._targetImage).css({
            "-webkit-transform": "",
            "-ms-transform": "",
            transform: ""
        }),
        t(this._targetImageWrap).css({
            "-webkit-transform": "",
            "-ms-transform": "",
            transform: ""
        }),
        t.support.transition ? void t(this._targetImage).one(t.support.transition.end, t.proxy(this.dispose, this)).emulateTransitionEnd(300) : this.dispose()
    },
    i.prototype.dispose = function() {
        this._targetImageWrap && this._targetImageWrap.parentNode && (t(this._targetImage).removeClass("zoom-img").attr("data-action", "zoom"), this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap), this._overlay.parentNode.removeChild(this._overlay), this._$body.removeClass("zoom-overlay-transitioning"))
    },
    t(function() { (new e).listen()
    })
} (jQuery);