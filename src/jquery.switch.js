/*
 * switch
 * https://github.com/amazingSurge/switch
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($) {
    var Switch = $.switch = function(input, options) {

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

        this.init();
    };

    Switch.prototype = {
        constuctor: Switch,
        init: function() {
            var self = this,
                opts = this.options;

            this.$inner = $('<div class="' + this.namespace + '-inner"></div>');
            this.$innerBox = $('<div class="' + this.namespace + '-inner-box"></div>');
            this.$on = $('<div class="' + this.namespace + '-on">' + opts.ontext + '</div>');
            this.$off = $('<div class="' + this.namespace + '-off">' + opts.offtext + '</div>');
            this.$handle = $('<div class="' + this.namespace + '-handle"></div>');

            this.$innerBox.append(this.$on,this.$off);
            this.$inner.append(this.$innerBox);
            this.$element.append(this.$inner,this.$handle);

            // get components width
            var w = this.$on.width();
            var h = this.$handle.width();

            this.distance = w - h / 2;

            this.$innerBox.css(this._transitions('margin-left'));
            this.$handle.css(this._transitions('left'));
            
            if (this.options.clickable === true) {
                this.$element.on('click', $.proxy(this.click, this));
            } 

            if (this.options.dragable === true) {
                this.$handle.on('mousedown', $.proxy(this.mousedown, this));
            } 

            // for support mobile touch
            // ...
            // ...
            // ...

            // set initial status and value

            if (this.state === 'disabled') {
                this.$element.off('click');
                this.$handle.off('mousedown');
                this.$element.addClass(this.namespace + '-disabled');
            }

            this.set(this.checked);
            this.initial = true;
        },
        _transitions: function(css) {
            var transitions,
                transition = css + ' ' + this.options.animation/ 1000 + 's ease-in-out';
            return transitions = {
                '-webkit-transition': transition,
                '-moz-transition': transition,
                'transition': transition
            };
        },
        _noTransitions: function() {
            return {
                '-webkit-transition': '',
                '-moz-transition': '',
                'transition': ''
            }
        },
        set: function(value) {

            switch(value) {

                case 'checked':
                    this.checked = value;
                    this.$input.trigger('checked');
                    this.$input.prop('checked',true);
                    this.move(0);
                    // function animateEnd() {
                    //     this.$element.removeClass('is-off');
                    //     this.$element.addClass('is-on');
                    // }
                    // this.animate(0, $.proxy(animateEnd, this));
                    
                break;

                case 'unchecked':
                    this.checked = value;
                    this.$input.trigger('unchecked');
                    this.$input.prop('checked',false);
                    this.move(-this.distance);

                    // function animateEnd() {
                    //     this.$element.removeClass('is-on');
                    //     this.$element.addClass('is-off');
                    // }
                    // this.animate(-this.distance, $.proxy(animateEnd, this));
                break;

            };
        },

        _set: function() {
            switch(value) {
                case 'checked':
                    this.checked = value;
                    this.$input.trigger('checked');
                    this.$input.prop('checked',true);
                break;
                case 'unchecked':
                    this.checked = value;
                    this.$input.trigger('unchecked');
                    this.$input.prop('checked',false);
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

            // if (pos === 0) {
            //     this.set('checked');
            // }

            // if (pos === -this.distance) {
            //     this.set('unchecked');
            // }
        },

        animate: function(pos, callback) {
            this.$innerBox.stop().animate({
                marginLeft: pos
            }, {
                duration: this.options.duration
            });

            this.$handle.stop().animate({
                left: this.distance + pos
            }, {
                duration: this.options.duration,
                complete: callback
            })
        },

        click: function(e) {

            if (this.options.dragable === false && this.options.clickable === true) {

                if (this.checked === 'checked') {
                    this.set('unchecked');
                } else {
                    this.set('checked');
                }
            } else {
                if ($(e.target).hasClass(this.namespace + '-handle') != true) {

                    if (this.checked === 'checked') {
                        this.set('unchecked');
                    } else {
                        this.set('checked');
                    }
                }
            }   
        },
        mousedown: function(e) {
            var dragDistance,
                self = this,
                startX = e.pageX;

               
            this.mousemove = function(e) {
                // dragDistance = e.pageX - startX > 0 ? (this.distance + startX - e.pageX) : (startX - e.pageX);

                if (this.checked === 'checked') {
                    dragDistance = e.pageX - startX > 0 ? 0 : (e.pageX - startX < -this.distance ? -this.distance : e.pageX - startX);
                } else {
                    dragDistance = e.pageX - startX < 0 ? -this.distance : (e.pageX - startX > this.distance ? 0 : -this.distance + e.pageX - startX);
                }

                this.$innerBox.css(this._noTransitions()); 
                this.$handle.css(this._noTransitions()); 


                this.$handle.off('mouseup');
                this.move(dragDistance);

                return false;
            };

            this.mouseup = function(e) {
                var currPos = parseInt(this.$innerBox.css('margin-left'));

                if (Math.abs(currPos) >= this.distance / 2) {
                    this.set('unchecked');
                }

                if (Math.abs(currPos) < this.distance / 2) {
                    this.set('checked');
                } 

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup
                });

                this.$innerBox.css(this._transitions('margin-left'));
                this.$handle.css(this._transitions('left'));
                this.$handle.off('mouseup');

                return false;
            };

            $(document).on({
                mousemove: $.proxy(this.mousemove, this),
                mouseup: $.proxy(this.mouseup, this)
            });

            if (this.options.clickable === true) {

                this.$handle.on('mouseup', function() {

                    if (self.checked === 'checked') {
                        self.set('unchecked');
                    } else {
                        self.set('checked');
                    }

                    $(document).off({
                        mousemove: this.mousemove,
                        mouseup: this.mouseup
                    });

                    self.$handle.off('mouseup');

                    return false;
                });
            }

            return false;
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
    $.fn.switch = function(options) {
        return this.each(function() {
            if (!$.data(this, 'switch')) {
                $.data(this, 'switch', new Switch(this, options));
            }
        });
    };
}(jQuery));


