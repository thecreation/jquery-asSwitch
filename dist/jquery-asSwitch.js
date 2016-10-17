/**
* jquery asSwitch v0.2.2
* https://github.com/amazingSurge/jquery-asSwitch
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsSwitchEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var DEFAULTS = {
      namespace: 'asSwitch',
      skin: 'default',

      dragable: true,
      clickable: true,
      disabled: false,

      onText: 'ON',
      offText: 'OFF',

      checked: true,
      animation: 200
    };

    var NAMESPACE$1 = 'asSwitch';

    /**
     * Plugin constructor
     **/

    var asSwitch = function() {
      function asSwitch(element, options) {
        _classCallCheck(this, asSwitch);

        this.$element = (0, _jquery2.default)(element).wrap('<div></div>');
        this.$wrap = this.$element.parent();

        var meta = {
          disabled: this.$element.prop('disabled'),
          checked: this.$element.prop('checked')
        };

        this.options = _jquery2.default.extend({}, DEFAULTS, options, meta, this.$element.data());
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
      }

      _createClass(asSwitch, [{
        key: 'init',
        value: function init() {
          var opts = this.options;

          this.$inner = (0, _jquery2.default)('<div class="' + this.namespace + '-inner"></div>');
          this.$innerBox = (0, _jquery2.default)('<div class="' + this.namespace + '-inner-box"></div>');
          this.$on = (0, _jquery2.default)('<div class="' + this.namespace + '-on">' + opts.onText + '</div>');
          this.$off = (0, _jquery2.default)('<div class="' + this.namespace + '-off">' + opts.offText + '</div>');
          this.$handle = (0, _jquery2.default)('<div class="' + this.namespace + '-handle"></div>');

          this.$innerBox.append(this.$on, this.$off);
          this.$inner.append(this.$innerBox);
          this.$wrap.append(this.$inner, this.$handle);

          // get components width
          var w = this.$on.width();
          var h = this.$handle.width();

          this.distance = w - h / 2;

          if (this.options.clickable === true) {
            this.$wrap.on('click.asSwitch touchstart.asSwitch', _jquery2.default.proxy(this.click, this));
          }

          if (this.options.dragable === true) {
            this.$handle.on('mousedown.asSwitch touchstart.asSwitch', _jquery2.default.proxy(this.mousedown, this));
            this.$handle.on('click.asSwitch',

              function() {
                return false;
              }
            );
          }

          this.set(this.checked, false);
          this.initialized = true;

          this._trigger('ready');

          if (this.disabled) {
            this.disable();
          }
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
          }

          var data = [this].concat(params);

          // event
          this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            this.options[onFunction].apply(this, params);
          }
        }
      }, {
        key: 'animate',
        value: function animate(pos, callback) {
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
        }
      }, {
        key: 'getDragPos',
        value: function getDragPos(e) {
          return e.pageX || (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : 0);
        }
      }, {
        key: 'move',
        value: function move(pos) {
          pos = Math.max(-this.distance, Math.min(pos, 0));

          this.$innerBox.css({
            marginLeft: pos
          });

          this.$handle.css({
            left: this.distance + pos
          });
        }
      }, {
        key: 'click',
        value: function click() {
          if (!this._click) {
            this._click = true;

            return false;
          }

          if (this.disabled) {

            return;
          }

          if (this.checked) {
            this.set(false);
          } else {
            this.set(true);
          }

          return false;
        }
      }, {
        key: 'mousedown',
        value: function mousedown(e) {
          var dragDistance = void 0;
          var that = this;
          var startX = this.getDragPos(e);

          if (this.disabled) {

            return;
          }

          this.mousemove = function(e) {
            var current = this.getDragPos(e);

            if (this.checked) {
              dragDistance = current - startX > 0 ? 0 : current - startX < -this.distance ? -this.distance : current - startX;
            } else {
              dragDistance = current - startX < 0 ? -this.distance : current - startX > this.distance ? 0 : -this.distance + current - startX;
            }

            this.move(dragDistance);
            this.$handle.off('mouseup.asSwitch');

            return false;
          }
          ;
          this.mouseup = function() {
            var currPos = parseInt(this.$innerBox.css('margin-left'), 10);

            if (Math.abs(currPos) >= this.distance / 2) {
              this.set(false);
            }

            if (Math.abs(currPos) < this.distance / 2) {
              this.set(true);
            }

            (0, _jquery2.default)(document).off('.asSwitch');
            this.$handle.off('mouseup.asSwitch');

            return false;
          }
          ;

          (0, _jquery2.default)(document).on({
            'mousemove.asSwitch': _jquery2.default.proxy(this.mousemove, this),
            'mouseup.asSwitch': _jquery2.default.proxy(this.mouseup, this),
            'touchmove.asSwitch': _jquery2.default.proxy(this.mousemove, this),
            'touchend.asSwitch': _jquery2.default.proxy(this.mouseup, this)
          });

          if (this.options.clickable) {
            this.$handle.one('mouseup.asSwitch touchend.asSwitch',

              function() {
                if (that.checked) {
                  that.set(false);
                } else {
                  that.set(true);
                }
                (0, _jquery2.default)(document).off('.asSwitch');
              }
            );
          }

          return false;
        }
      }, {
        key: 'check',
        value: function check() {
          if (this.checked !== true) {
            this.set(true);
          }

          return this;
        }
      }, {
        key: 'uncheck',
        value: function uncheck() {
          if (this.checked !== false) {
            this.set(false);
          }

          return this;
        }
      }, {
        key: 'set',
        value: function set(value, update) {
          var that = this;

          this.checked = value;

          if (value === true) {
            this.animate(0,

              function() {
                that.$wrap.removeClass(that.classes.off).addClass(that.classes.on);
              }
            );
          } else {
            this.animate(-this.distance,

              function() {
                that.$wrap.removeClass(that.classes.on).addClass(that.classes.off);
              }
            );
          }

          if (update !== false) {
            this.$element.prop('checked', value);
            this.$element.trigger('change');
            this._trigger('change', value);
          }

          return this;
        }
      }, {
        key: 'get',
        value: function get() {
          return this.$element.prop('checked');
        }
      }, {
        key: 'val',
        value: function val(value) {
          if (value) {
            this.set(value);
          } else {

            return this.get();
          }
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.disabled = false;
          this.$element.prop('disabled', false);
          this.$wrap.removeClass(this.classes.disabled);

          return this;
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$element.prop('disabled', true);
          this.$wrap.addClass(this.classes.disabled);

          return this;
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this.$wrap.off('.asSwitch');
          this.$handle.off('.asSwitch');
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return asSwitch;
    }();

    var info = {
      version: '0.2.2'
    };

    var NAMESPACE = 'asSwitch';
    var OtherAsSwitch = _jquery2.default.fn.asSwitch;

    var jQueryAsSwitch = function jQueryAsSwitch(options) {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)$/.test(method) || method === 'val' && args.length === 0) {
            var instance = _this.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

          return _ret.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new asSwitch(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.asSwitch = jQueryAsSwitch;

    _jquery2.default.asSwitch = _jquery2.default.extend({
      setDefaults: asSwitch.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asSwitch = OtherAsSwitch;

        return jQueryAsSwitch;
      }
    }, info);
  }
);