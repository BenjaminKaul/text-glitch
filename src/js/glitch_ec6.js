
"use strict";

class Glitch {

  constructor( element, params ) {

    if( element === null || element === undefined ) {
      throw new Error( "Element must not be null or undefined" );
    }
    /* Duck typing test for DOM element */
    if( typeof element !== "object" || element.nodeType !== 1 || typeof
    element.nodeName !== "string" ) { throw new Error( `Element must be a DOM
    element` ); }

    this._options = {
      charArray: "+*/|}{[]~:;?/.=+-_)(*^%$#@!)}",
      textArray: [ "firstGlitchText", "secondGlitchText", "thirdGlitchText",
      "fourthGlitchText" ],
      backToFront: false,
      offset: 0,
      interval: {
        randomizing: 1000,
        adding: 1000,
        removing: 1000,
        inserting: 1000
      }
    };
    if( params ) this._options.deepExtend(params);

    this._element = element;
    this._currentTextIdx = 0;
    this._currentTextIdxMax = this._options.textArray.length;

  }

  get options() {
    return this._options;
  }

  set text(text) {
    this._element.innerHTML = text;
    this._element.setAttribute("data-text", text);
  }

  get text() {
    return this._element.innerHTML;
  }

  /**
   * Gets the text that is next in the array
   */
  _nextText(){
    return this._currentTextIdx >= this._currentTextIdxMax ?
    this._options.textArray[0] :
    this._options.textArray[this._currentTextIdx];
  }

  /**
   * Increases the text array index
   */
  _progressToNextText(){
    this._currentTextIdx =
    (this._currentTextIdx + 1) == this._currentTextIdxMax ?
    0 :
    ++this._currentTextIdx;
    return this;
  }

  /**
   * Append a character at the end of the elements text
   */
  _appendChar() {
    this.text = this.text + this._getRandomCharacter();
  }

  /**
   * Remove a character at the end of the elements text
   */
  _removeChar() {
    let elText = this.text;
    this.text = elText.substr( 0, elText.length - 1 );
  }

  /**
   * Adds or removes the given amount of characters
   */
  _changeTextLength( callback ) {
    let diff = this._nextText().length - this.text.length;
    if( diff > 0 ) {
      let interval = this._options.interval.adding
      for( let charsToAdd = diff; charsToAdd > 0; charsToAdd-- ) {
        setTimeout( this._appendChar.bind(this),
        ( interval / diff ) * charsToAdd );
        if( charsToAdd == 1 ) setTimeout( callback, interval ); // when last one, fire callback
      }
    } else if( diff < 0 ) {
      diff = Math.abs( diff );
      let interval = this._options.interval.removing;
      for( let charsToRemove = diff; charsToRemove > 0; charsToRemove-- ) {
        setTimeout( this._removeChar.bind(this),
        ( interval / diff ) * charsToRemove );
        if( charsToRemove == 1 ) setTimeout( callback, interval);  // when last one, fire callback
      }
    } else {
      callback(); // when change is not needed fire callback immediately
    }
  }

  /**
   * Returns a random character out of the given character array
   */
  _getRandomCharacter( charArray ) {
    return ( this === null || this === undefined ) ?
    charArray[Math.floor(Math.random() * charArray.length)] :
    this._options.charArray[
      Math.floor(Math.random() * this._options.charArray.length)];
  }

  /**
   * Changes the character at the given index to a random character
   */
  _changeCharacter( idx, char, callback ) {
    let text = this.text;
    let newText = text.substr( 0, idx )
    + char
    + text.substr( idx + 1, text.length - idx - 1 );
    this.text = newText;
    if( callback ) callback();
  }

  /**
   * Changes character after character of the given element"s text
   */
  _randomizeText( callback ) {
    let max = this.text.length;
    let interval = this._options.interval.randomizing;
    if( this._options.backToFront ) {
      for( let charIdx = max - 1, timerIdx = 0;
        charIdx >= 0; charIdx--, timerIdx++ ) {
        setTimeout(this._changeCharacter.bind( this, charIdx,
          this._getRandomCharacter() ),
          ( interval / max ) * timerIdx
        );
        if( charIdx == 0 ) setTimeout( callback, interval );
      }
    } else {
      for( let charIdx = 0; charIdx < max; charIdx++ ) {
        setTimeout(this._changeCharacter.bind( this, charIdx,
          this._getRandomCharacter() ),
          ( interval / max ) * charIdx
        );
        if( charIdx == max - 1 ) setTimeout( callback, interval );
      }
    }
  }

  /**
   * Sets the new text character after character
   */
  _setNextText( callback ) {
    let text = this._nextText();
    let len = text.length;
    if( len !== this.text.length ) throw new Error("Length of old and new text must be the same");
    let interval = this._options.interval.inserting;
    for( var charIdx = 0; charIdx < len; charIdx++ ) {
      setTimeout(
        this._changeCharacter.bind( this, charIdx, text.charAt( charIdx ) ),
        ( interval / len ) * charIdx
      )
      if( charIdx == len - 1 ) setTimeout( callback, interval );
    }
  }

  /**
   * Animating to the next text in the array
   */
  _animateToNext( callback ) {
    this._randomizeText(() => {
      this._changeTextLength(() => {
        this._setNextText(() => {
          this._progressToNextText();
          if( callback ) callback();
        });
      });
    });
  }

  animateToNext( callback ) {
    setTimeout( this._animateToNext.bind(
      this, callback ), this._options.offset );
  }

  animateInterval() {
    setTimeout( this._animateToNext.bind(
      this, this.animateInterval.bind( this ) ), this._options.offset );
  }

}

/**
 * Extends the object with the given source properties
 */
Object.prototype.deepExtend = function( source ){
  if( ! source ) return this;
  for( let property in source ) {
    if( source[property] && source[property].constructor &&
      source[property].constructor === Object ) {
      if( this[property] === null || this[property] === undefined ) this[property] = {};
      this[property].deepExtend( source[property] );
    } else {
      this[property] = source[property];
    }
  }
  return this;
}

/* Make the deepExtend function not enumerable or overwritable */
Object.defineProperty( Object.prototype, "deepExtend",
{ enumerable: false, writable: false, configurable: false });
