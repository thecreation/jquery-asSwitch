/**
* jquery asSwitch v0.2.2
* https://github.com/amazingSurge/jquery-asSwitch
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $ from 'jquery';

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

const NAMESPACE$1 = 'asSwitch';

/**
 * Plugin constructor
 **/
class asSwitch {
  constructor(element, options) {
    this.$element = $(element).wrap('<div></div>');
    this.$wrap = this.$element.parent();

    const meta = {
      disabled: this.$element.prop('disabled'),
      checked: this.$element.prop('checked')
    };

    this.options = $.extend({}, DEFAULTS, options, meta, this.$element.data());
    this.namespace = this.options.namespace;
    this.classes = {
      skin: `${this.namespace}_${this.options.skin}`,
      on: `${this.namespace}_on`,
      off: `${this.namespace}_off`,
      disabled: `${this.namespace}_disabled`
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

  init() {
    const opts = this.options;

    this.$inner = $(`<div class="${this.namespace}-inner"></div>`);
    this.$innerBox = $(`<div class="${this.namespace}-inner-box"></div>`);
    this.$on = $(`<div class="${this.namespace}-on">${opts.onText}</div>`);
    this.$off = $(`<div class="${this.namespace}-off">${opts.offText}</div>`);
    this.$handle = $(`<div class="${this.namespace}-handle"></div>`);

    this.$innerBox.append(this.$on, this.$off);
    this.$inner.append(this.$innerBox);
    this.$wrap.append(this.$inner, this.$handle);

    // get components width
    const w = this.$on.width();
    const h = this.$handle.width();

    this.distance = w - h / 2;

    if (this.options.clickable === true) {
      this.$wrap.on('click.asSwitch touchstart.asSwitch', $.proxy(this.click, this));
    }

    if (this.options.dragable === true) {
      this.$handle.on('mousedown.asSwitch touchstart.asSwitch', $.proxy(this.mousedown, this));
      this.$handle.on('click.asSwitch', () => false);
    }

    this.set(this.checked, false);
    this.initialized = true;

    this._trigger('ready');

    if (this.disabled) {
      this.disable();
    }
  }

  _trigger(eventType, ...params) {
    let data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  animate(pos, callback) {
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

  getDragPos(e) {
    return e.pageX || ((e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : 0);
  }

  move(pos) {
    pos = Math.max(-this.distance, Math.min(pos, 0));

    this.$innerBox.css({
      marginLeft: pos
    });

    this.$handle.css({
      left: this.distance + pos
    });
  }

  click() {
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

  mousedown(e) {
    let dragDistance;
    const that = this;
    const startX = this.getDragPos(e);

    if (this.disabled) {
      return;
    }

    this.mousemove = function(e) {
      const current = this.getDragPos(e);
      if (this.checked) {
        dragDistance = current - startX > 0 ? 0 : (current - startX < -this.distance ? -this.distance : current - startX);
      } else {
        dragDistance = current - startX < 0 ? -this.distance : (current - startX > this.distance ? 0 : -this.distance + current - startX);
      }

      this.move(dragDistance);
      this.$handle.off('mouseup.asSwitch');
      return false;
    };
    this.mouseup = function() {
      const currPos = parseInt(this.$innerBox.css('margin-left'), 10);
      if (Math.abs(currPos) >= this.distance / 2) {
        this.set(false);
      }
      if (Math.abs(currPos) < this.distance / 2) {
        this.set(true);
      }

      $(document).off('.asSwitch');
      this.$handle.off('mouseup.asSwitch');
      return false;
    };

    $(document).on({
      'mousemove.asSwitch': $.proxy(this.mousemove, this),
      'mouseup.asSwitch': $.proxy(this.mouseup, this),
      'touchmove.asSwitch': $.proxy(this.mousemove, this),
      'touchend.asSwitch': $.proxy(this.mouseup, this)
    });

    if (this.options.clickable) {
      this.$handle.one('mouseup.asSwitch touchend.asSwitch', () => {
        if (that.checked) {
          that.set(false);
        } else {
          that.set(true);
        }
        $(document).off('.asSwitch');
      });
    }

    return false;
  }

  check() {
    if (this.checked !== true) {
      this.set(true);
    }

    return this;
  }

  uncheck() {
    if (this.checked !== false) {
      this.set(false);
    }

    return this;
  }

  set(value, update) {
    const that = this;

    this.checked = value;

    if (value === true) {
      this.animate(0, () => {
        that.$wrap.removeClass(that.classes.off).addClass(that.classes.on);
      });
    } else {
      this.animate(-this.distance, () => {
        that.$wrap.removeClass(that.classes.on).addClass(that.classes.off);
      });
    }

    if (update !== false) {
      this.$element.prop('checked', value);
      this.$element.trigger('change');
      this._trigger('change', value);
    }

    return this;
  }

  get() {
    return this.$element.prop('checked');
  }

  val(value) {
    if (value) {
      this.set(value);
    } else {
      return this.get();
    }
  }

  enable() {
    this.disabled = false;
    this.$element.prop('disabled', false);
    this.$wrap.removeClass(this.classes.disabled);
    return this;
  }

  disable() {
    this.disabled = true;
    this.$element.prop('disabled', true);
    this.$wrap.addClass(this.classes.disabled);
    return this;
  }

  destroy() {
    this.$wrap.off('.asSwitch');
    this.$handle.off('.asSwitch');
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

var info = {
  version:'0.2.2'
};

const NAMESPACE = 'asSwitch';
const OtherAsSwitch = $.fn.asSwitch;

const jQueryAsSwitch = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)$/.test(method)) || (method === 'val' && args.length === 0)) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asSwitch(this, options));
    }
  });
};

$.fn.asSwitch = jQueryAsSwitch;

$.asSwitch = $.extend({
  setDefaults: asSwitch.setDefaults,
  noConflict: function() {
    $.fn.asSwitch = OtherAsSwitch;
    return jQueryAsSwitch;
  }
}, info);
