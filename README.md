# jQuery switcher

The powerful jQuery plugin that creates a switcher. <a href="http://amazingsurge.github.io/jquery-switcher/">Project page and demos</a><br />
Download: <a href="https://github.com/amazingSurge/jquery-switcher/archive/master.zip">jquery-switcher-master.zip</a>

***

## Features

* **Different styles support** — The plugin provides different styles of switcher
* **Different devices support** — switcher can be used on the PC and touch device
* **Lightweight size** — 1 kb gzipped

## Dependencies
* <a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>

## Usage

Import this libraries:
* jQuery
* jquery-switcher.js

And CSS:
* switcher.css - desirable if you have not yet connected one


Create base html element:
```html
    <div class="example">
        <input class="sw-3" type="checkbox" checked="checked" />
    </div>
```

Initialize tabs:
```javascript
$(".sw-3").switcher({skin: 'skin-3'});
```

Or initialize tabs with custom settings:
```javascript
$(".sw-3").switcher({
    skin: 'skin-8',
    dragable: true,
    clickable: true,
    disabled: false,
    ontext: 'ON',
    offtext: 'OFF',
    checked: true,
    animation: 200,
    namespace: 'switch'
});
```

the most important thing is you should set skin value to let plugin find his shin content




## Settings

```javascript
{   

    // Compulsory property,it works after you load  the specified skin file
    skin: 'skin-8',
    
    //Optional property, if false the function of dragable will be stop
    dragable: true,

    //Optional property, if false the function of click will be stop
    clickable: true,

    //Optional property, if true the switcher can't be used
    disabled: false,

    //Optional property, the text display when switcher is opened
    ontext: 'ON',

    //Optional property, the text display when switcher is closed
    offtext: 'OFF',

    //Optional property, if true, the switcher will be open when initialize
    checked: true,

    //Optional property, set the duration time when the switcher from one state to anther
    animation: 200,

    //Optional property, set a namespace for css class
    namespace: 'switch'
```

## Public methods

jquery switcher has different methods , we can use it as below :
```javascript

// set the state of switch
$(".sw-3").switcher("set");

// get the current state of switch
$(".sw-3").switcher("get");

// add a enable class to switcher elment
$(".sw-3").switcher("enable");

// remove the enable class
$(".sw-3").switcher("disable");

// remove switcher Dom emement and unbound all events 
$(".sw-3").switcher("destroy");

```

## Event / Callback

* <code>checked</code>: trigger when the switch is opened
* <code>unchecked</code>: trigger when the switch is close

how to use event:
```javascript
$(document).on('checked', function(event,instance) {
    // instance means current switcher instance 
    // some stuff
});
```

## Browser support
jquery-tabs is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is coming soon.

## Changes

| Version | Notes                                                            |
|---------|------------------------------------------------------------------|
|     ... | ...                                                              |

## Author
[amazingSurge](http://amazingSurge.com)

## License
jQuery-switcher plugin is released under the <a href="https://github.com/amazingSurge/jquery-switcher/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.


