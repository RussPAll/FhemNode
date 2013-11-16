var ZoneSliderPointer = {
    init: function() {
        
    }
}

function jSliderPointer() {
    Draggable.apply(this, arguments);
}
jSliderPointer.prototype = new Draggable();

jSliderPointer.prototype.oninit = function (ptr, id, _constructor) {
    this.uid = id;
    this.parent = _constructor;
    this.value = {};
    this.settings = this.parent.settings;
};

jSliderPointer.prototype.onmousedown = function (evt) {
    this._parent = {
        offset: this.parent.domNode.offset(),
        width: this.parent.domNode.width()
    };
    this.ptr.addDependClass("hover");
    this.setIndexOver();
};

jSliderPointer.prototype.onmousemove = function (evt, x) {
    var coords = this._getPageCoords(evt);
    this.setPercent(this.calc(coords.x));
};

jSliderPointer.prototype.onmouseup = function (evt) {
    if (this.parent.settings.callback && $.isFunction(this.parent.settings.callback))
        this.parent.settings.callback.call(this.parent, this.parent.getValue());

    this.ptr.removeDependClass("hover");
};

jSliderPointer.prototype.setIndexOver = function () {
    this.parent.setPointersIndex(1);
    this.index(2);
};

jSliderPointer.prototype.index = function (i) {
    this.ptr.css({ zIndex: i });
};

jSliderPointer.prototype.limits = function (x) {
    return this.parent.limits(x, this);
};

jSliderPointer.prototype.calc = function (coords) {
    var x = this.limits(((coords - this._parent.offset.left) * 100) / this._parent.width);
    return x;
};

jSliderPointer.prototype.set = function (value, opt_origin) {
    this.value.origin = this.parent.round(value);
    this.setPercent(this.parent.valueToPrc(value, this), opt_origin);
};

jSliderPointer.prototype.setPercent = function (prc, opt_origin) {
    if (!opt_origin)
        this.value.origin = this.parent.prcToValue(prc);

    this.value.prc = prc;
    this.ptr.css({ left: prc + "%" });
    this.parent.redraw(this);
};
