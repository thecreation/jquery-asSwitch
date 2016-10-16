import $ from 'jquery';
import asSwitch from './asSwitch';
import info from './info';

const NAMESPACE = 'asSwitch';
const OtherAsSwitch = $.fn.asSwitch;

const jQueryAsSwitch = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments.length === 0)) {
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
