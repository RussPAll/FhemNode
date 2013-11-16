var ZoneSlider = {
    init: function (settings, view) {
        var self = this;
        self.settings = $.extend(OPTIONS.settings, settings);
        view.hideInput();
        
        this.settings.interval = this.settings.to - this.settings.from;
        this.settings.value = view.getValue();

        if (this.settings.onstatechange && $.isFunction(this.settings.onstatechange))
            this.onstatechange = this.settings.onstatechange;

        this.is = {
            init: false
        };
        this.Pointers = [];

        for (var c = 0; c < 1; c++) {
            var pointer = Object.create(ZoneSliderPointer);
            pointer.init();
            this.Pointers.push(pointer);
        }

        this.Labels = {};
        view.create();
    },

    // setPointerValues: function (args1, args2, setMethod) {
    //     if (this.Pointers[0] != null && args1 != null) {
    //         this.Pointers[0][setMethod](args1);
    //         this.Pointers[0].setIndexOver();
    //     }
    // },


    setPointersIndex: function (i) {
        $.each(this.getPointers(), function (i) {
            this.index(i);
        });
    },

    generateScale: function () {
        if (this.settings.scale && this.settings.scale.length > 0) {
            var str = "";
            var s = this.settings.scale;
            var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
            for (var i = 0; i < s.length; i++) {
                str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '') + '</span>';
            };
            return str;
        } else return "";

        return "";
    },

    drawScale: function () {
        this.domNode.find(OPTIONS.selector + "scale span ins").each(function () {
            $(this).css({ marginLeft: -$(this).outerWidth() / 2 });
        });
    },

    onresize: function () {
        var self = this;
        this.sizes = {
            domWidth: this.domNode.width(),
            domOffset: this.domNode.offset()
        };

        $.each(this.o.pointers, function (i) {
            self.redraw(this);
        });
    },

    update: function () {
        this.onresize();
        this.drawScale();
    },

    limits: function (x, pointer) {
        // smooth
        if (!this.settings.smooth) {
            var step = this.settings.step * 100 / (this.settings.interval);
            x = Math.round(x / step) * step;
        }

        var another = this.o.pointers[1 - pointer.uid];
        if (another && pointer.uid && x < another.value.prc) x = another.value.prc;
        if (another && !pointer.uid && x > another.value.prc) x = another.value.prc;

        // base limit
        if (x < 0) x = 0;
        if (x > 100) x = 100;

        return Math.round(x * 10) / 10;
    },

    redraw: function (pointer) {
        if (!this.is.init) return false;

        this.setValue();

        // redraw range line
        if (this.o.pointers[0] && this.o.pointers[1])
            this.o.value.css({ left: this.o.pointers[0].value.prc + "%", width: (this.o.pointers[1].value.prc - this.o.pointers[0].value.prc) + "%" });

        this.o.labels[pointer.uid].value.html(
            pointer.value.origin
        );

        // redraw position of labels
        this.redrawLabels(pointer);

    },

    redrawLabels: function (pointer) {

        function setPosition(label, sizes, prc) {
            sizes.margin = -sizes.label / 2;

            // left limit
            label_left = sizes.border + sizes.margin;
            if (label_left < 0)
                sizes.margin -= label_left;

            // right limit
            if (sizes.border + sizes.label / 2 > self.sizes.domWidth) {
                sizes.margin = 0;
                sizes.right = true;
            } else
                sizes.right = false;

            label.o.css({ left: prc + "%", marginLeft: sizes.margin, right: "auto" });
            if (sizes.right) label.o.css({ left: "auto", right: 0 });
            return sizes;
        }

        var self = this;
        var label = this.o.labels[pointer.uid];
        var prc = pointer.value.prc;

        var sizes = {
            label: label.o.outerWidth(),
            right: false,
            border: (prc * this.sizes.domWidth) / 100
        };

        if (!this.settings.single) {
            // glue if near;
            var another = this.o.pointers[1 - pointer.uid];
            var another_label = this.o.labels[another.uid];

            switch (pointer.uid) {
                case 0:
                    if (sizes.border + sizes.label / 2 > another_label.o.offset().left - this.sizes.domOffset.left) {
                        another_label.o.css({ visibility: "hidden" });
                        another_label.value.html(another.value.origin);

                        label.o.css({ visibility: "visible" });

                        prc = (another.value.prc - prc) / 2 + prc;
                        if (another.value.prc != pointer.value.prc) {
                            label.value.html(pointer.value.origin + "&nbsp;&ndash;&nbsp;" + another.value.origin);
                            sizes.label = label.o.outerWidth();
                            sizes.border = (prc * this.sizes.domWidth) / 100;
                        }
                    } else {
                        another_label.o.css({ visibility: "visible" });
                    }
                    break;

                case 1:
                    if (sizes.border - sizes.label / 2 < another_label.o.offset().left - this.sizes.domOffset.left + another_label.o.outerWidth()) {
                        another_label.o.css({ visibility: "hidden" });
                        another_label.value.html(another.value.origin);

                        label.o.css({ visibility: "visible" });

                        prc = (prc - another.value.prc) / 2 + another.value.prc;
                        if (another.value.prc != pointer.value.prc) {
                            label.value.html(another.value.origin + "&nbsp;&ndash;&nbsp;" + pointer.value.origin);
                            sizes.label = label.o.outerWidth();
                            sizes.border = (prc * this.sizes.domWidth) / 100;
                        }
                    } else {
                        another_label.o.css({ visibility: "visible" });
                    }
                    break;
            }
        }

        sizes = setPosition(label, sizes, prc);

        /* draw second label */
        if (another_label) {
            var sizes = {
                label: another_label.o.outerWidth(),
                right: false,
                border: (another.value.prc * this.sizes.domWidth) / 100
            };
            sizes = setPosition(another_label, sizes, another.value.prc);
        }

        this.redrawLimits();
    },

    redrawLimits: function () {
        if (this.settings.limits) {

            var limits = [true, true];

            for (key in this.o.pointers) {

                if (!this.settings.single || key == 0) {

                    var pointer = this.o.pointers[key];
                    var label = this.o.labels[pointer.uid];
                    var label_left = label.o.offset().left - this.sizes.domOffset.left;

                    var limit = this.o.limits[0];
                    if (label_left < limit.outerWidth())
                        limits[0] = false;

                    var limit = this.o.limits[1];
                    if (label_left + label.o.outerWidth() > this.sizes.domWidth - limit.outerWidth())
                        limits[1] = false;
                }

            };

            for (var i = 0; i < limits.length; i++) {
                if (limits[i])
                    this.o.limits[i].fadeIn("fast");
                else
                    this.o.limits[i].fadeOut("fast");
            };

        }
    },

    setValue: function () {
        var value = this.getValue();
        this.inputNode.attr("value", value);
        this.onstatechange.call(this, value);
    },

    getValue: function () {
        if (!this.is.init) return false;
        var $this = this;

        var value = "";
        $.each(this.o.pointers, function (i) {
            if (this.value.prc != undefined && !isNaN(this.value.prc)) value += (i > 0 ? ";" : "") + $this.prcToValue(this.value.prc);
        });
        return value;
    },

    getPrcValue: function () {
        if (!this.is.init) return false;
        var $this = this;

        var value = "";
        $.each(this.o.pointers, function (i) {
            if (this.value.prc != undefined && !isNaN(this.value.prc)) value += (i > 0 ? ";" : "") + this.value.prc;
        });
        return value;
    },

    prcToValue: function (prc) {
        if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
            var h = this.settings.heterogeneity;

            var _start = 0;
            var _from = this.settings.from;

            for (var i = 0; i <= h.length; i++) {
                if (h[i]) var v = h[i].split("/");
                else var v = [100, this.settings.to];

                v[0] = new Number(v[0]);
                v[1] = new Number(v[1]);

                if (prc >= _start && prc <= v[0]) {
                    var value = _from + ((prc - _start) * (v[1] - _from)) / (v[0] - _start);
                }

                _start = v[0];
                _from = v[1];
            };

        } else {
            var value = this.settings.from + (prc * this.settings.interval) / 100;
        }

        return this.round(value);
    },

    valueToPrc: function (value, pointer) {
        if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
            var h = this.settings.heterogeneity;

            var _start = 0;
            var _from = this.settings.from;

            for (var i = 0; i <= h.length; i++) {
                if (h[i]) var v = h[i].split("/");
                else var v = [100, this.settings.to];
                v[0] = new Number(v[0]); v[1] = new Number(v[1]);

                if (value >= _from && value <= v[1]) {
                    var prc = pointer.limits(_start + (value - _from) * (v[0] - _start) / (v[1] - _from));
                }

                _start = v[0]; _from = v[1];
            };

        } else {
            var prc = pointer.limits((value - this.settings.from) * 100 / this.settings.interval);
        }

        return prc;
    },

    round: function (value) {
        value = Math.round(value / this.settings.step) * this.settings.step;
        if (this.settings.round) value = Math.round(value * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round);
        else value = Math.round(value);
        return value;
    }
};