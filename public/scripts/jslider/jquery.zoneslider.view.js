var ZoneSliderView = {
    init: function(node) {
        var self = this;
        self.node = node;
        self.$node = $(node);
    },

    hideInput: function() {
        this.$node.hide();
    },

    getValue: function() {
        return this.$node.attr("value");
    },

    create: function() {
        this.domNode = $(OPTIONS.template({
            className: OPTIONS.className,
            settings: {
                from: this.settings.from,
                to: this.settings.to,
                dimension: this.settings.dimension
            },
            scale: this.generateScale()
        }));

        this.inputNode.after(this.domNode);
        this.drawScale();

        this.sizes = {
            domWidth: this.domNode.width(),
            domOffset: this.domNode.offset()
        };

        // find some objects
        $.extend(this.o, {
            pointers: {},
            labels: {
                0: {
                    o: this.domNode.find(OPTIONS.selector + "value").not(OPTIONS.selector + "value-to")
                },
                1: {
                    o: this.domNode.find(OPTIONS.selector + "value").filter(OPTIONS.selector + "value-to")
                }
            },
            limits: {
                0: this.domNode.find(OPTIONS.selector + "label").not(OPTIONS.selector + "label-to"),
                1: this.domNode.find(OPTIONS.selector + "label").filter(OPTIONS.selector + "label-to")
            }
        });

        $.extend(this.o.labels[0], {
            value: this.o.labels[0].o.find("span")
        });

        $.extend(this.o.labels[1], {
            value: this.o.labels[1].o.find("span")
        });


        if (!$this.settings.value.split(";")[1]) {
            this.settings.single = true;
            this.domNode.addDependClass("single");
        }

        if (!$this.settings.limits)
            this.domNode.addDependClass("limitless");

        this.domNode.find(OPTIONS.selector + "pointer").each(function (i) {
            var value = $this.settings.value.split(";")[i];
            if (value) {
                $this.o.pointers[i] = new jSliderPointer(this, i, $this);

                var prev = $this.settings.value.split(";")[i - 1];
                if (prev && new Number(value) < new Number(prev)) value = prev;

                value = value < $this.settings.from ? $this.settings.from : value;
                value = value > $this.settings.to ? $this.settings.to : value;

                $this.o.pointers[i].set(value, true);
            }
        });

        this.o.value = this.domNode.find(".v");
        this.is.init = true;

        $.each(this.o.pointers, function (i) {
            $this.redraw(this);
        });

        (function (self) {
            $(window).resize(function () {
                self.onresize();
            });
        })(this);
    }
};

