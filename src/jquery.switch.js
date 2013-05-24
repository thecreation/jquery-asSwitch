/*
 * switch
 * https://github.com/amazingSurge/switch
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($) {
    "use strict";

    var Switch = $.sw = function(input, options) {

        this.$input = $(input).wrap('<div></div>');
        this.$element = this.$input.parent();

        var meta = {
            state: this.$input.prop('disabled') ? 'disabled' : 'enabled',
            checked: this.$input.prop('checked') ? 'checked' : 'unchecked'
        };

        this.options = $.extend({}, Switch.defaults, options, meta);
        this.namespace = this.options.namespace;

        this.$element.addClass(this.namespace).addClass(this.options.skin);
        this.checked = this.options.checked;
        this.state = this.options.state;
        this.initial = false;

        // flag
        this._click = true;

        this.init();
    };

    Switch.prototype = {
        constuctor: Switch,
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
            }

            // for support mobile touch
            // ...
            // ...
            // ...

            // set initial status and value

            if (this.state === 'disabled') {
                this.$element.off('click touchstart');
                this.$handle.off('mousedown touchstart');
                this.$element.addClass(this.namespace + '-disabled');
            }

            this.set(this.checked);
            this.initial = true;
        },
        animate: function(pos, callback) {

            this.$innerBox.stop().animate({marginLeft: pos},{
                duration: this.options.animation,
                complete: callback
            });

            this.$handle.stop().animate({left: this.distance + pos}, {
                duration: this.options.animation
            });
        },

        _getDragPos: function(e) {
            return e.pageX || ((e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : 0);
        },
        set: function(value) {

            switch (value) {

                case 'checked':
                    this.checked = value;
                    this.$input.trigger('checked');
                    this.$input.prop('checked', true);
                    // this.move(0);
                    console.log(value)
                    this.animate(0);
                    break;

                case 'unchecked':
                    this.checked = value;
                    this.$input.trigger('unchecked');
                    this.$input.prop('checked', false);
                    // this.move(-this.distance);
                    this.animate(-this.distance);
                    break;

            }
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
        click: function(e) {

            console.log('click')

            if (this._click === false) {
                this._click = true;
                return false;
            }

            if (this.checked === 'checked') {
                this.set('unchecked');
            } else {
                this.set('checked');
            }

            return false;
        },
        mousedown: function(e) {
            var dragDistance,
                self = this,
                startX = this._getDragPos(e);

            console.log('mousedown')

            this.mousemove = function(e) {
                var current = this._getDragPos(e);

                this._click = false;

                if (this.checked === 'checked') {
                    dragDistance = current - startX > 0 ? 0 : (current - startX < -this.distance ? -this.distance : current - startX);
                } else {
                    dragDistance = current - startX < 0 ? -this.distance : (current - startX > this.distance ? 0 : -this.distance + current - startX);
                }

                this.move(dragDistance);

                return false;
            };

            this.mouseup = function() {
                var currPos = parseInt(this.$innerBox.css('margin-left'), 10);

                if (Math.abs(currPos) >= this.distance / 2) {
                    console.log('unchecked');
                    this.set('unchecked');
                }

                if (Math.abs(currPos) < this.distance / 2) {
                    console.log('checked');
                    this.set('checked');
                }

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup,
                    touchmove: this.mousemove,
                    touchend: this.mouseup
                });


                return false;
            };

            $(document).on({
                mousemove: $.proxy(this.mousemove, this),
                mouseup: $.proxy(this.mouseup, this),
                touchmove: $.proxy(this.mousemove, this),
                touchend: $.proxy(this.mouseup, this)
            });

        },

        check: function() {
            this.set('checked');
        },

        uncheck: function() {
            this.set('unchecked');
        }
    };
    Switch.defaults = {
        skin: 'skin-8',

        dragable: true,
        clickable: true,
        state: 'enabled',

        ontext: 'ON',
        offtext: 'OFF',

        checked: 'checked',
        animation: 200,
        namespace: 'switch'
    };

    $.fn.sw = function(options) {
        return this.each(function() {
            if (!$.data(this, 'switch')) {
                $.data(this, 'switch', new Switch(this, options));
            }
        });
    };
}(jQuery));
