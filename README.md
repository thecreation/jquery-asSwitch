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

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
		<tr>
            <td>skin</td>
            <td>null</td>
            <td>compulsory property, set transition effect, it works after you load specified skin file</td>
        </tr>
		<tr>
            <td>dragable</td>
            <td>true</td>
            <td>compulsory property, set the switcher of the drag effect, if false, the drag effect will be stop</td>
        </tr>
		<tr>
            <td>clickable</td>
            <td>true</td>
            <td>compulsory property, add the click effect</td>
        </tr>
		<tr>
            <td>disabled</td>
            <td>false</td>
            <td>compulsory property, set the button disabled or enabled</td>
        </tr>
		<tr>
            <td>ontext</td>
            <td>'ON'</td>
            <td>compulsory property, display the state of the switch</td>
        </tr>
		<tr>
            <td>offtext</td>
            <td>'OFF'</td>
            <td>compulsory property, display the state of the switch</td>
        </tr>
		<tr>
            <td>checked</td>
            <td>true</td>
            <td>compulsory property, set the state of swith, if true, the switch opend</td>
        </tr>
		<tr>
            <td>animation</td>
            <td>200</td>
            <td>compulsory property, set the switch to change state of sliding time</td>
        </tr>
        <tr>
            <td>namespace</td>
            <td>'switch'</td>
            <td>Optional property, set a namspace for css class, for example, we have <code>.switch_active</code> class for active effect, if namespace set to 'as-switch', then it will be <code>.as-switch_active</code></td>
        </tr>
    </tbody>
</table>

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
* <code>unchecked</code>: trigger when the switch is unopened
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


