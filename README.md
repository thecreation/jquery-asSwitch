# [jQuery asSwitch](https://github.com/amazingSurge/jquery-asSwitch) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that create a switchable toggle.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asSwitch.js
├── jquery-asSwitch.es.js
├── jquery-asSwitch.min.js
└── css/
    ├── asSwitch.css
    └── asSwitch.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asSwitch/master/dist/jquery-asSwitch.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asSwitch/master/dist/jquery-asSwitch.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asSwitch --save
```

#### Install From Npm
```sh
npm install jquery-asSwitch --save
```

#### Install From Yarn
```sh
yarn add jquery-asSwitch
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asSwitch.git
cd jquery-asSwitch
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asSwitch` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asSwitch.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asSwitch.js"></script>
```

#### Required HTML structure

```html
<input class="example" type="checkbox" checked="checked" />
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asSwitch(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asSwitch/tree/master/examples).

## Options
`jquery-asSwitch` can accept an options object to alter the way it behaves. You can see the default options by call `$.asSwitch.setDefaults()`. The structure of an options object is as follows:

```
{
  namespace: 'asSwitch',

  skin: null,
  handleSelector: null,
  handleTemplate: '<div class="{{handle}}"></div>',

  barClass: null,
  handleClass: null,

  disabledClass: 'is-disabled',
  draggingClass: 'is-dragging',
  hoveringClass: 'is-hovering',

  direction: 'vertical',

  barLength: null,
  handleLength: null,

  minHandleLength: 30,
  maxHandleLength: null,

  mouseDrag: true,
  touchDrag: true,
  pointerDrag: true,
  clickMove: true,
  clickMoveStep: 0.3, // 0 - 1
  mousewheel: true,
  mousewheelSpeed: 50,

  keyboard: true,

  useCssTransforms3d: true,
  useCssTransforms: true,
  useCssTransitions: true,

  duration: '500',
  easing: 'ease' // linear, ease-in, ease-out, ease-in-out
}
```

## Methods
Methods are called on asSwitch instances through the asSwitch method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asSwitch('destroy');

// or
var api = $().data('asSwitch');
api.destroy();
```

#### val(value)
Set the switch value if value is defined or get the value.
```javascript
// set the val
$().asSwitch('val', true);

// get the val
var value = $().asSwitch('val');
```

#### set(value)
Set the switch value
```javascript
$().asSwitch('set', true);
```

#### get()
Get the switch value.
```javascript
var value = $().asSwitch('get');
```

#### enable()
Enable the scrollbar functions.
```javascript
$().asSwitch('enable');
```

#### disable()
Disable the switch functions.
```javascript
$().asSwitch('disable');
```

#### destroy()
Destroy the switch instance.
```javascript
$().asSwitch('destroy');
```

## Events
`jquery-asSwitch` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asSwitch::ready', function (e) {
  // on instance ready
});

```

Event     | Description
--------- | -----------
init      | Fires when the instance is setup for the first time.
ready     | Fires when the instance is ready for API use.
enable    | Fired when the `enable` instance method has been called.
disable   | Fired when the `disable` instance method has been called.
checked   | Fired when the switch is checked.
unchecked | Fired when the switch is unchecked.
destroy   | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asSwitch.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asSwitch.js"></script>
<script>
  $.asSwitch.noConflict();
  // Code that uses other plugin's "$().asSwitch" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asSwitch` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asSwitch` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asSwitch/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asSwitch.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asSwitch/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asSwitch.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asSwitch
[license]: https://img.shields.io/npm/l/jquery-asSwitch.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asSwitch.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asSwitch