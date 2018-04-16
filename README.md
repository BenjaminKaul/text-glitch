## Glitch.js

Animating a text to a different text using a random character array

### Installation

Using npm:

```javascript
$ npm install text-glitch
```

### Usage

```javascript
var glitch = new Glitch(document.querySelector('#glitch'), {/* options */});
glitch.animateInterval();
```

### Options

| Option | Value | Effect |
| ------ | ----- | ------ |
| backToFront | Boolean | the randomizing character animation starts at the end of the text |
| textArray | Array | the array of texts to animate between |
| charArray | Array | the array of characters used for the animation |
| interval.randomizing | Number (ms) | the time it takes to randomize the characters |
| interval.adding | Number (ms) | the time it takes to add characters at the end of the text |
| interval.removing | Number (ms) | the time it takes to remove characters at the end of the text |
| interval.inserting | Number (ms) | the time it takes to set the new text |
