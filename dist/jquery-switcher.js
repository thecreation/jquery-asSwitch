/*! jquery switcher - v0.1.0 - 2013-08-11
* https://github.com/amazingSurge/jquery-switcher
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function($) {
    "use strict";

    var Switcher = $.switcher = function(input, options) {

        this.$input = $(input).wrap('<div></div>');
        this.$element = this.$input.parent();

        var meta = {
            disabled: this.$input.prop('disabled'),
            checked: this.$input.prop('checked')
        };

        this.options = $.extend({}, Switcher.defaults, options, meta);
        this.namespace = this.options.namespace;

        this.classes = {
            skin: this.namespace + '_' + this.options.skin
        };

        this.$element.addClass(this.namespace);

        if (this.options.skin !== null) {
            this.$element.addClass(this.classes.skin);
        }

        this.checked = this.options.checked;
        this.enabled = true;
        this.initial = false;

        // flag
        this._click = true;

        this.init();
    };

    Switcher.prototype = {
        constuctor: Switcher,
        init: function() {
            var opts = this.options;

            this.$inner = $('<div class="' + this.namespace + '-inner"></div>');
            this.$innerBox = $('<div class="' + this.namespace + '-inner-box"></div>');
            this.$on = $('<div class="' + this.namespace + '-on">' + opts.ontext + '</div>');
            this.$off = $('<div class="' + this.namespace + '-off">' + opts.offtext + '</div>');
            this.$handle = $('<div class="' + this.namespace + '-handle"></div>');

            this.$innerBox.append(this.$on, this.$off);
            this.$inner.append(this.$innerBox);
            this.$element.append(this.$inner, this.$handle);

            // get components width
            var w = this.$on.width();
            var h = this.$handle.width();

            this.distance = w - h / 2;

            if (this.options.clickable === true) {
                this.$element.on('click touchstart', $.proxy(this.click, this));
                
            }

            if (this.options.dragable === true) {
                this.$handle.on('mousedown touchstart', $.proxy(this.mousedown, this));
                this.$handle.on('click', function() {
                    return false;
                });
            }

            this.set(this.checked);
            this.initial = true;
        },
        animate: function(pos, callback) {

            // prevent animate when first load
            if (this.initial === false) {
                this.$innerBox.css({
                    marginLeft: pos
                });

                this.$handle.css({
                    left: this.distance + pos
                });
                return false;
            }

            this.$innerBox.stop().animate({
                marginLeft: pos
            }, {
                duration: this.options.animation,
                complete: callback
            });

            this.$handle.stop().animate({
                left: this.distance + pos
            }, {
                duration: this.options.animation
            });
        },
        getDragPos: function(e) {
            return e.pageX || ((e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : 0);
        },
        move: function(pos) {
            pos = Math.max(-this.distance, Math.min(pos, 0));

            this.$innerBox.css({
                marginLeft: pos
            });

            this.$handle.css({
                left: this.distance + pos
            });
        },
        click: function() {

            if (this._click === false) {
                this._click = true;
                return false;
            }

            if (this.checked === true) {
                this.set(false);
            } else {
                this.set(true);
            }

            return false;
        },
        mousedown: function(e) {
            var dragDistance,
                self = this,
                startX = this.getDragPos(e);

            if (this.enabled === false) {
                return;
            }

            this.mousemove = function(e) {
                var current = this.getDragPos(e);

                if (this.checked === true) {
                    dragDistance = current - startX > 0 ? 0 : (current - startX < -this.distance ? -this.distance : current - startX);
                } else {
                    dragDistance = current - startX < 0 ? -this.distance : (current - startX > this.distance ? 0 : -this.distance + current - startX);
                }

                this.move(dragDistance);
                this.$handle.off('mouseup');
                return false;
            };

            this.mouseup = function() {
                var currPos = parseInt(this.$innerBox.css('margin-left'), 10);

                if (Math.abs(currPos) >= this.distance / 2) {
                    this.set(false);
                }

                if (Math.abs(currPos) < this.distance / 2) {
                    this.set(true);
                }

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup,
                    touchmove: this.mousemove,
                    touchend: this.mouseup
                });

                this.$handle.off('mouseup');
                return false;
            };

            $(document).on({
                mousemove: $.proxy(this.mousemove, this),
                mouseup: $.proxy(this.mouseup, this),
                touchmove: $.proxy(this.mousemove, this),
                touchend: $.proxy(this.mouseup, this)
            });

            if (this.options.clickable === true) {
                this.$handle.on('mouseup touchend', function() {
                    if (self.checked === true) {
                        self.set(false);
                    } else {
                        self.set(true);
                    }

                    self.$handle.off('mouseup touchend');

                    $(document).off({
                        mousemove: this.mousemove,
                        mouseup: this.mouseup,
                        touchmove: this.mousemove,
                        touchend: this.mouseup
                    });
                });
            }

            return false;
        },
        check: function() {
            this.set(true);
            return this;
        },
        uncheck: function() {
            this.set(false);
            return this;
        },

        /*
            Public Method
         */  
        
        set: function(value) {
            if (this.enabled === false) {
                return;
            }
            switch (value) {
                case true:
                    this.checked = value;
                    this.$input.trigger('checked');
                    this.$input.prop('checked', true);
                    // this.move(0);
                    this.animate(0);
                    break;
                case false:
                    this.checked = value;
                    this.$input.trigger('unchecked');
                    this.$input.prop('checked', false);
                    // this.move(-this.distance);
                    this.animate(-this.distance);
                    break;
            }
            return this;
        },
        get: function() {
            return this.$input.prop('checked');
        },
        enable: function() {
            this.enabled = true;
            this.$element.addClass(this.namespace + '-enabled');
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.$element.removeClass(this.namespace + '-enabled');
            return this;
        },
        destroy: function() {
            this.$element.off('click touchstart');
            this.$handle.off('mousedown touchstart');
        }
    };
    Switcher.defaults = {
        namespace: 'switcher',
        skin: 'null',

        dragable: true,
        clickable: true,
        disabled: false,

        ontext: 'ON',
        offtext: 'OFF',

        checked: true,
        animation: 200
        
    };

    $.fn.switcher = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^(getTabs|getPanes|getCurrentPane|getCurrentTab|getIndex)$/.test(method)) {
                var api = this.first().data('switcher');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'switcher');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, 'switcher')) {
                    $.data(this, 'switcher', new Switcher(this, options));
                }
            });
        }
    };
}(jQuery));
