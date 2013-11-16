(function ($, window, document, undefined) {
    $.fn.zoneslider = function (options) {
        var fullName = "fhem_zoneslider";
        var returnValue, input = arguments;

        function isDef(val) {
            return val !== undefined;
        };

        function isDefAndNotNull(val) {
            return val != null;
        };

        this.each(function () {
            if (!$.data(this, fullName)) {
                if (options) {
                    var instance = Object.create(ZoneSlider);
                    var view = Object.create(ZoneSliderView);
                    view.init($(this));
                    instance.init(options, view);
                    $.data(this, fullName, instance);
                } else {
                    $.error('Plugin jQuery.' + fullName + " has not yet been instantiated.");
                }
            }
            else if (typeof options == "string") {
                var controller = $.data(this, fullName);

                // do actions
                switch (options) {
                    case "value":
                        if (isDef(input[1]))
                            controller.setPointerValues(input[1], input[2], "set");
                        else
                            returnValue = controller.getValue();
                        break;
                    case "prc":
                        if (isDef(input[1]))
                            controller.setPointerValues(input[1], input[2], "setPercent");
                        else
                            returnValue = controller.getPrcValue();
                        break;
                }
            }
           else if (!options) {
               // return actual object
               if (!$.isArray(returnValue))
                   returnValue = [];
               returnValue.push(self);
           }
        });

        // flatten array just with one slider
        if ($.isArray(returnValue) && returnValue.length == 1)
            return returnValue[0];
        else if (returnValue)
            return returnValue;
        else
            return this;
    };

})(jQuery);
