/**
 * @fileOverview Contains the MCAD Rotary Widget class.
 * @name MCAD Rotary Widget
 * @version 1.0
 */
 
 /**
 * Constructs a rotary widget object.
 * @class
 * @classdesc A rotary widget that supports mouse and touch input (pinch and pan). The widget will handle all input and rotary mechanics and inform the user of value changes via the onChange event handler. 
 * @param {!string} selector            - jQuery selector string to select the element that represents this widget.
 * @param {object} options              - config options to override defaults.
 * @param {string} options.image_src    - path to the image file to be used for the rotary.
 * @param {number} options.onChange     - event handler for parameter value changes).
 * @param {number} options.width        - width of the widget (suffix with units, e.g. px or %).
 * @param {number} options.height       - width of the widget (suffix with units, e.g. px or %).
 * @param {number} options.paramMin     - minimum parameter value for this widget.
 * @param {number} options.paramMax     - maximum parameter value for this widget.
 * @param {number} [options.degMin=225] - minimum degree position for this widget.
 * @param {number} [options.degMax=135] - maximum degree position for this widget.
 * @param {number} [options.pinch=true] - allow pinch gestures to rotate widget.
 * @param {number} [options.pan=true]   - allow pan gestures to rotate widget.
 * @example <caption>Pitch knob with 300hz to 20khz parameter range</caption>
 * <div id="pitchKnob"></div>
 *
 * <script>
 *    function pitchKnobChange(pValue, nValue) {
 *        console.log("Parameter value: " + pValue + "hz, normalized value: " + nValue); 
 *    }
 * 
 *    var pitchKnob = new Rotary("#pitchKnob", {image_src: "resources/knob.png", onChange: pitchKnobChange, width: "128px", height: "128px", paramMin: 300, paramMax: 20000});
 * </script>
 * @example <caption>Pitch knob with 300hz to 20khz parameter range but no pinch gestures</caption>
 * <div id="pitchKnob"></div>
 *
 * <script>
 *    function pitchKnobChange(pValue, nValue) {
 *        console.log("Parameter value: " + pValue + "hz, normalized value: " + nValue); 
 *    }
 * 
 *    var pitchKnob = new Rotary("#pitchKnob", {image_src: "resources/knob.png", onChange: pitchKnobChange, width: "128px", height: "128px", paramMin: 300, paramMax: 20000, pinch: false});
 * </script>
 */

function Rotary(selector, options) {
				
	this._onChange = options.onChange;

	this._selector = selector;
	this._image_src = options.image_src;
	this._width = options.width;
	this._height = options.height;
						
	this._pMin = options.paramMin;
	this._pMax = options.paramMax;
	this._pVal = this._pMin;
	
	// Left range  (min to 0)
	this._degMin = 225;	
	if(options.degMin) this._degMin = options.degMin;
	
	// Right range (0 to max)
	this._degMax = 135;	
	if(options.degMax) this._degMax = options.degMax;
	
	// Const offset to get left hand values in 0 - range format
	this._valOffset = 360 - this._degMin;			
	
	// Absolue number of degrees between mi and max, passing 0
	this._valRange = this._valOffset + this._degMax;		
	
	// Const normalized offset to get left hand values in 0 - range format
	this._valNormOffset  = this._valOffset / this._valRange;	
	
	// Rotation value
	this._rVal	= this._degMin;

	// Last side (left or right) the rotary value was before mouse move value change (see code)
	this._lastSide = 0;
	
	// Normalized parameter value
	this._nVal = 0.0;
	
	$(this._selector).css("width", this._width);
	$(this._selector).css("height", this._height);
	
	$(this._selector).append("<img></img>");
	
	$(this._selector + " img").attr("src", this._image_src);
	$(this._selector + " img").css("width", this._width);
	$(this._selector + " img").css("height", this._height);
	$(this._selector + " img").css("user-select", "none");
	
	this._rotate(0);
	
	this._downY = 0;
	this._capturing = false;
	
	var pThis = this;
	var degHammerStart;

	$(this._selector).mousedown(function(e) {
	
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		e.cancelBubble=true;
		e.returnValue=false;

		pThis._capturing = true;
		pThis._downY = e.pageY;
		//console.log(downY);
	});
	
	$(this._selector).mouseup(function(e) {
	
		pThis._capturing = false;
	});
	
	$(this._selector).mouseleave(function(e) {
	
		pThis._capturing = false;
	});
	
	$(this._selector).mousemove(function(e) {
		
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		e.cancelBubble=true;
		e.returnValue=false;
		
		if(pThis._capturing)
		{
			var degDelta = pThis._downY - e.pageY;
			pThis._downY = e.pageY;
			
			pThis._rotate(degDelta);
		}
			
	});
	
	if(!options.pinch || options.pinch === true) {
	
		this._rotaryHammer = new Hammer($(selector)[0]);

		this._rotaryHammer.get('rotate').set({ enable: true });
		
		this._rotaryHammer.on("rotatestart", function(ev) {
			
			console.log("START");
			console.log(ev.rotation);
			console.log("----------");
			
			degHammerStart = ev.rotation;
		});
		
		this._rotaryHammer.on("rotate", function(ev) {
			
			var delta = ev.rotation - degHammerStart;
			pThis._rotate(delta);
			degHammerStart = ev.rotation;
		});
	}
	
	if(!options.pan || options.pan === true) {
		this._rotaryHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		
		this._rotaryHammer.on("panup pandown", function(ev) {
			
			pThis._rotate(-25.0 * ev.velocity);		
		});
	}
}

/** 
  * Sets the normalized value of this rotary to the supplied value.
  * @param {number} value - normalized value in the {@linkcode [0,1]} range.
  * @example
  * // Set the pitch knob to the half way position (12 o'clock).
  * pitchKnob.setNormValue(0.5);
  */

Rotary.prototype.setNormValue = function(value) {
	
	this._nVal = value;

	// Convert the val from a 0.0f to 1.0f back to 
	// an angle between min and max
	if(this._nVal < this._valNormOffset)
	{
		// Left side
		this._rVal = ((this._nVal * this._valRange) + 360) - this._valOffset;
	}
	else
	{
		// Right side
		this._rVal = (this._nVal * this._valRange) - this._valOffset;
	}

	this._rotate(0);
};

/** 
  * Sets the parameter value of this rotary to the supplied value.
  * @param {number} value - parameter value in the {@linkcode paramMin} to {@linkcode paramMax} range.
  * @example
  * // Set the pitch knob to the half way position (12 o'clock).
  * pitchKnob.setParamValue(9850);
  */


Rotary.prototype.setParamValue = function(value) {

	this.setNormValue(mcad.paramToUnsignedNorm(value, this._pMin, this._pMax));
};

/** 
  * Gets the normalized value of this rotary in the {@linkcode [0,1]} range.
  * @returns {number} The parameter value in the {@linkcode [0,1]} range.
  * @example
  * console.log(pitchKnob.getNormValue());
  */

Rotary.prototype.getNormValue = function(value) {
	
	return this._nVal;
};

/** 
  * Gets the parameter value of this rotary in the {@linkcode paramMin} to {@linkcode paramMax} range.
  * @returns {number} The parameter value in the {@linkcode paramMin} to {@linkcode paramMax} range.
  * @example
  * console.log(pitchKnob.getParamValue());
  */

Rotary.prototype.getParamValue = function(value) {

	return this._pVal;
};

Rotary.prototype._rotate = function(degDelta) {

	var rWrap = this._rVal;						
	var delta = degDelta;							// Distance to rotate the dial
	var validateWrap;

	// Excessive delta values may cause the wrap to wrap around more than once, producing
	// incorrect movement values (aliasing as it sweeps past 360)
	
	// Left side
	if(this._rVal > 180)
	{
		validateWrap = this._rVal - 180.0;
		if(delta < -validateWrap) delta = -validateWrap;
	}
	// Right side
	else
	{
		validateWrap = 180.0 - this._rVal;
		if(delta > validateWrap) delta = validateWrap;
	}

	rWrap += delta;

	if(rWrap >= 359) rWrap = 0;					// We must wrap around at 0 because our range is 360 degrees,
	else if(rWrap < 0 ) rWrap = 360 + rWrap;	// crossing over at 0

	this._rVal = rWrap;

	// Out of bounds?
	if((this._rVal > this._degMax) && (this._rVal < this._degMin))
	{
		// We know it's out of bounds but we need to find out where.
		// Seeing as the min ranges from 181 to 359 and the max from
		// 0 to 179, we can check to see whether the value is greater
		// than or equal to 180 degrees to find out which half the 
		// value is should clamp to
		if(this._rVal > 180)
		{
			// As an extra check to ensure we clamp the value to the correct side,
			// we check if a lastSide exists (will be 0 on start up). If one does,
			// we clamp the value to the last side to stop incorrect clamping when
			// large mouse movements are made
			if(1 == this._lastSide)
			{
				this._rVal = this._degMin;
			}
			else
			{
				this._rVal = this._degMax;
			}
		}
		else
		{
			if(1 == this._lastSide)
			{
				this._rVal = this._degMin;
			}
			else
			{
				this._rVal = this._degMax;
			}
		}
	}

	if(this._rVal < 0.0) this._rVal = 0.0;

	if(this._rVal > 360.0) this._rVal = 360.0;

	// Figure which side of the 0 that val lies on (l or r)
	// so we can convert the current angle as a ratio to the 
	// range in the format of 0.0f to 1.0f
	if(this._rVal > 180)
	{
		// Left side
		this._nVal = ((this._rVal + this._valOffset) - 360) / this._valRange;
		this._lastSide = 1;
	}
	else
	{
		// Right side (add 0.5f to ensure not 0 degrees)
		this._nVal = (this._valOffset + this._rVal + 0.5) / this._valRange;
		this._lastSide = 2;
	}

	// Clamp value to 0.0f to 1.0f range (can go slightly over in certain circumstances...
	if(this._nVal > 1.0) this._nVal = 1.0;

	if(this._nVal < 0.0) this._nVal = 0.0;

	this._pVal = mcad.unsignedNormToParam(this._nVal, this._pMin, this._pMax);

	//console.log("rotary nVal: " + this._nVal);
	//console.log("rotary pVal: " + this._pVal);
	$(this._selector).css("transform", "rotate(" + this._rVal + "deg)");
	
	this._onChange(this._pVal.toFixed(0), this._nVal.toFixed(2));
};