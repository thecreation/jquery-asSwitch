/*
 * switcher
 * https://github.com/amazingSurge/switcher
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the GPL license.
 */

(function($, document, window, undefined) {
    "use strict";

    var AsSwitcher = $.asSwitcher = function(element, options) {
        this.$element = $(element).wrap('<div></div>');
        this.$wrap = this.$element.parent();

        var meta = {
            disabled: this.$element.prop('disabled'),
            checked: this.$element.prop('checked')
        };

        if (this.$element.attr('name')) {
            this.name = this.$element.attr('name');
        } else {
            this.name = options.name;
        }

        this.options = $.extend({}, AsSwitcher.defaults, options, meta, this.$element.data());
        this.namespace = this.options.namespace;

        this.classes = {
            skin: this.namespace + '_' + this.options.skin,
            on: this.namespace + '_on',
            off: this.namespace + '_off',
            disabled: this.namespace + '_disabled'
        };

        this.$wrap.addClass(this.namespace);

        if (this.options.skin) {
            this.$wrap.addClass(this.classes.skin);
        }

        this.checked = this.options.checked;
        this.disabled = this.options.disabled;
        this.initialized = false;

        // flag
        this._click = true;
        this._trigger('init');
        this.init();
    };

    AsSwitcher.prototype = {
        constuctor: AsSwitcher,
        init: function() {
            var opts = this.options;

            this.$inner = $('<div class="' + this.namespace + '-inner"></div>');
            this.$innerBox = $('<div class="' + this.namespace + '-inner-box"></div>');
            this.$on = $('<div class="' + this.namespace + '-on">' + opts.onText + '</div>');
            this.$off = $('<div class="' + this.namespace + '-off">' + opts.offText + '</div>');
            this.$handle = $('<div class="' + this.namespace + '-handle"></div>');

            this.$innerBox.append(this.$on, this.$off);
            this.$inner.append(this.$innerBox);
            this.$wrap.append(this.$inner, this.$handle);

            // get components width
            var w = this.$on.width();
            var h = this.$handle.width();

            this.distance = w - h / 2;

            if (this.options.clickable === true) {
                this.$wrap.on('click.asSwitcher touchstart.asSwitcher', $.proxy(this.click, this));

            }

            if (this.options.dragable === true) {
                this.$handle.on('mousedown.asSwitcher touchstart.asSwitcher', $.proxy(this.mousedown, this));
                this.$handle.on('click.asSwitcher', function() {
                    return false;
                });
            }

            this.set(this.checked);
            this.initialized = true;

            this._trigger('ready');
        },
        _trigger: function(eventType) {
            // event
            this.$element.trigger('asSwitcher::' + eventType, this);
            this.$element.trigger(eventType + '.asSwitcher', this);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        animate: function(pos, callback) {
            // prevent animate when first load
            if (this.initialized === false) {
                this.$innerBox.css({
                    marginLeft: pos
                });

                this.$handle.css({
                    left: this.distance + pos
                });

                if (typeof callback === 'function') {
                    callback();
                }
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
            if (!this._click) {
                this._click = true;
                return false;
            }

            if (this.checked) {
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

            if (this.disabled) {
                return;
            }

            this.mousemove = function(e) {
                var current = this.getDragPos(e);
                if (this.checked) {
                    dragDistance = current - startX > 0 ? 0 : (current - startX < -this.distance ? -this.distance : current - startX);
                } else {
                    dragDistance = current - startX < 0 ? -this.distance : (current - startX > this.distance ? 0 : -this.distance + current - startX);
                }

                this.move(dragDistance);
                this.$handle.off('mouseup.asSwitcher');
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

                $(document).off('.asSwitcher');
                this.$handle.off('mouseup.asSwitcher');
                return false;
            };

            $(document).on({
                'mousemove.asSwitcher': $.proxy(this.mousemove, this),
                'mouseup.asSwitcher': $.proxy(this.mouseup, this),
                'touchmove.asSwitcher': $.proxy(this.mousemove, this),
                'touchend.asSwitcher': $.proxy(this.mouseup, this)
            });

            if (this.options.clickable) {
                this.$handle.one('mouseup.asSwitcher touchend.asSwitcher', function() {
                    if (self.checked) {
                        self.set(false);
                    } else {
                        self.set(true);
                    }
                    $(document).off('.asSwitcher');
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
        set: function(value) {
            var self = this;
            if (this.disabled) {
                return;
            }
            switch (value) {
                case true:
                    this.checked = value;
                    this.$element.prop('checked', true);
                    this.animate(0, function() {
                        self.$wrap.removeClass(self.classes.off).addClass(self.classes.on);
                    });
                    break;
                case false:
                    this.checked = value;
                    this.$element.prop('checked', false);
                    this.animate(-this.distance, function() {
                        self.$wrap.removeClass(self.classes.on).addClass(self.classes.off);
                    });
                    break;
            }
            this._trigger('change', this.checked);
            return this;
        },
        get: function() {
            return this.$element.prop('checked');
        },
        val: function(value) {
            if (value) {
                this.set(value);
            } else {
                return this.get();
            }
        },
        enable: function() {
            this.disabled = false;
            this.$element.prop('disabled', false);
            this.$wrap.removeClass(this.classes.disabled);
            return this;
        },
        disable: function() {
            this.disabled = true;
            this.$element.prop('disabled', true);
            this.$wrap.addClass(this.disbaled);
            return this;
        },
        destroy: function() {
            this.$wrap.off('.asSwitcher');
            this.$handle.off('.asSwitcher');
        }
    };

    AsSwitcher.defaults = {
        namespace: 'asSwitcher',
        skin: null,
        name: null,

        dragable: true,
        clickable: true,
        disabled: false,

        onText: 'ON',
        offText: 'OFF',

        checked: true,
        animation: 200
    };

    $.fn.asSwitcher = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments === undefined)) {
                var api = this.first().data('asSwitcher');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'asSwitcher');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, 'asSwitcher')) {
                    $.data(this, 'asSwitcher', new AsSwitcher(this, options));
                }
            });
        }
    };
})(jQuery, document, window);