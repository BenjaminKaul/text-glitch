
'use strict';

var Glitch = (function(){

  /* Constructor */
  function Glitch( element, params ){
    if( element === null || element === undefined ) {
      throw new Error( 'Element must not be null or undefined' );
    }
    /* Duck typing test for DOM element */
    if( typeof element !== 'object' || element.nodeType !== 1 || typeof  element.nodeName !== 'string' ) {
      throw new Error( 'Element must be a DOM element' );
    }

    var _options = {
      charArray: '+*/|}{[]~:;?/.=+-_)(*^%$#@!)}',
      textArray: [ 'firstGlitchText', 'secondGlitchText', 'thirdGlitchText', 'fourthGlitchText' ],
      backToFront: false,
      offset: 0,
      interval: {
        randomizing: 1000,
        adding: 1000,
        removing: 1000,
        inserting: 1000
      }
    };

    if( params ) _options.deepExtend( params );

    function setText( newText ) { this.element.innerHTML = newText; this.element.setAttribute('data-text', newText); }
    function getText() { return this.element.innerHTML; }

    function getElement() { return element; }
    function getOptions() { return _options; }

    Object.defineProperties( this, {
      element: { get: getElement, enumerable: true, configurable: false },
      _text: { set: setText, get: getText, enumerable: false, configurable: false },
      _options: { get: getOptions, enumerable: false, configurable: false },
      _currentTextIdx: { value: 0, writable: true, enumerable: false, configurable: false },
      _currentTextIdxMax: { value: _options.textArray.length, writable: false, enumerable: false, configurable: false }
    });
  }

  /**
   * Extends the object with the given source properties
   */
  Object.prototype.deepExtend = function( source ){
    if( ! source ) return this;
    for( var property in source ) {
      if( source[property] && source[property].constructor && source[property].constructor === Object ) {
        if( this[property] === null || this[property] === undefined ) this[property] = {};
        this[property].deepExtend( source[property] );
      } else {
        this[property] = source[property];
      }
    }
    return this;
  }

  /* Make the deepExtend function not enumerable or overwritable */
  Object.defineProperty( Object.prototype, 'deepExtend',
  { enumerable: false, writable: false, configurable: false });

  /**
   * Check for missing context
   */
  function checkCtx() {
    if( this === null || this === undefined ) throw new Error('Missing context');
  }

  /**
   * Gets the text that is next in the array
   */
  function nextText(){
    if( this._currentTextIdx >= this._currentTextIdxMax ) return this._options.textArray[0];
    else return this._options.textArray[this._currentTextIdx];
  }

  /**
   * Increases the text array index
   */
  function progressToNextText(){
    this._currentTextIdx =
    (this._currentTextIdx + 1) == this._currentTextIdxMax ?
    0 :
    ++this._currentTextIdx;
    return this;
  }

  /**
   * Append a character at the end of the elements text
   */
  function appendChar() {
    this._text = this._text + getRandomCharacter.call( this );
  }

  /**
   * Remove a character at the end of the elements text
   */
  function removeChar() {
    var elText = this._text;
    this._text = elText.substr( 0, elText.length - 1 );
  }

  /**
   * Adds or removes the given amount of characters
   */
  function changeTextLength( callback ) {
    checkCtx.call( this );
    var diff = nextText.call( this ).length - this._text.length;
    if( diff > 0 ) {
      var interval = this._options.interval.adding
      for( var charsToAdd = diff; charsToAdd > 0; charsToAdd-- ) {
        setTimeout( appendChar.bind( this ), ( interval / diff ) * charsToAdd );
        if( charsToAdd == 1 ) setTimeout( callback, interval );
      }
    } else if( diff < 0 ) {
      diff = Math.abs( diff );
      var interval = this._options.interval.removing;
      for( var charsToRemove = diff; charsToRemove > 0; charsToRemove-- ) {
        setTimeout( removeChar.bind( this ), ( interval / diff ) * charsToRemove );
        if( charsToRemove == 1 ) setTimeout( callback, interval );
      }
    } else {
      callback();
    }
  }

  /**
   * Returns a random character out of the given character array
   */
  function getRandomCharacter( charArray ) {
    return ( this === null || this === undefined ) ?
    charArray[Math.floor(Math.random() * charArray.length)] :
    this._options.charArray[Math.floor(Math.random() * this._options.charArray.length)];
  }

  /**
   * Changes the character at the given index to a random character
   */
  function changeCharacter( idx, char, callback ) {
    var text = this._text;
    var newText = text.substr( 0, idx )
    + char
    + text.substr( idx + 1, text.length - idx - 1 );
    this._text = newText;
    if( callback ) callback();
  }

  /**
   * Changes character after character of the given element's text
   */
  function randomizeText( callback ) {
    checkCtx.call(this);
    var max = this._text.length;
    var interval = this._options.interval.randomizing;
    if( this._options.backToFront ) {
      for( var charIdx = max - 1, timerIdx = 0; charIdx >= 0; charIdx--, timerIdx++ ) {
        setTimeout(
          changeCharacter.bind( this, charIdx, getRandomCharacter.call( this ) ),
          ( interval / max ) * timerIdx
        );
        if( charIdx == 0 ) setTimeout( callback, interval );
      }
    } else {
      for( var charIdx = 0; charIdx < max; charIdx++ ) {
        setTimeout(
          changeCharacter.bind( this, charIdx, getRandomCharacter.call( this ) ),
          ( interval / max ) * charIdx
        );
        if( charIdx == max - 1 ) setTimeout( callback, interval );
      }
    }
  }

  /**
   * Sets the new text character after character
   */
  function setNextText( callback ) {
    checkCtx.call( this );
    var text = nextText.call( this );
    var len = text.length;
    if( len !== this._text.length ) throw new Error('Length of old and new text must be the same');
    var interval = this._options.interval.inserting;
    for( var charIdx = 0; charIdx < len; charIdx++ ) {
      setTimeout(
        changeCharacter.bind( this, charIdx, text.charAt( charIdx ) ),
        ( interval / len ) * charIdx
      )
      if( charIdx == len - 1 ) setTimeout( callback, interval );
    }
  }

  /**
   * Animating to the next text in the array
   */
  function animateToNext( callback ) {
    var self = this;
    randomizeText.call( self, function(){
      changeTextLength.call( self, function(){
        setNextText.call( self, function(){
          progressToNextText.call( self );
          if( callback ) callback();
        } );
      } );
    } );
  }

  /* Public functions */

  Glitch.prototype.animateToNext = function( callback ){
    setTimeout( animateToNext.bind( this, callback ), this._options.offset );
  };

  Glitch.prototype.animateInterval = function(){
    setTimeout( animateToNext.bind( this, this.animateInterval.bind( this ) ), this._options.offset );
  };

  Object.defineProperties( Glitch.prototype, {
    'animateToNext': { writable: false, enumerable: true, configurable: false },
    'animateInterval': { writable: false, enumerable: true, configurable: false }
  } )

  return Glitch;
}());
