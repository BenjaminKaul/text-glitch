### Glitch.js

Animating a text to a different text using a random character array

## Usage

```javascript
var glitch = new Glitch(document.querySelector('#glitch'), {/* options */});
glitch.animateInterval();
```

## Options

backToFront: the randomizing character animation starts at the end of the text (Boolean)
textArray: the array of texts to animate between (Array)
charArray: the array of characters used for the animation (Array)
interval.randomizing: the time it takes to randomize the characters (Number in ms)
interval.adding: the time it takes to add characters at the end of the text (Number in ms)
interval.removing: the time it takes to remove characters at the end of the text (Number in ms)
interval.inserting: the time it takes to set the new text (Number in ms)
