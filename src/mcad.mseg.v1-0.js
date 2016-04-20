/**
 * @fileOverview Contains the MCAD Multi-Stage Envelope Generator class.
 * @name MCAD MSEG
 * @version 1.0
 */

 /**
 * Constructs a multi-stage envelope generator object.
 * @class
 * @classdesc A multi-stage envelope generator that handles as many stages as needed as well as one release stage. Any Web Audio parameter can be modulated by this object, e.g. frequency, gain, etc.
 * @example var adsr = new Mseg();
 */
function Mseg() {
		
	this._stages = [];
	this._release = [0, 0];
	this._stageLengthInSeconds = 0;
}

/** 
 * Adds a stage to the multi-stage envelope. Newly added stages are added to the end of the envelope.
 * @param {object} stage                 - the stage parameters to add.
 * @param {number} stage.value           - normalized parameter value in the {@linkcode [0,1]} range for this stage to reach.
 * @param {number} stage.duration          - duration (in seconds) taken to reach the the stage value.
 * @param {("linear"|"exp")} [stage.type="linear"] - curvature of this stage, either linear or exponential.
 * @example <caption>Creating an attack-decay envelope that rises from {@linkcode 0.0} to {@linkcode 1.0} linearly in 0.25 seconds and back down to {@linkcode 0.0} exponentially over 0.5 seconds</caption>
 * // Attack-decay envelope for a gain parameter
 * var gainEnv = new Mseg();
 *
 * // Start stage with 0.0 gain
 * gainEnv.addStage({duration: 0.0, value: 0.0});
 *
 * // Attack stage of envelope
 * gainEnv.addStage({duration: 0.25, value: 1.0});
 *
 * // Decay stage of envelope
 * gainEnv.addStage({duration: 0.5, value: 0.0, type: "exp"});
 */

Mseg.prototype.addStage = function(stage) {

	var duration = stage.duration;
	var value = stage.value;
	var type = 0;
	
	if(stage.type) {
		
		if(stage.type == "linear") type = 0;
		else type = 1;
	}
	
	this._stages.push(new Array(duration, value, type));
	this._stageLengthInSeconds += stage.duration;
}

/** 
 * Adds a release stage to the multi-stage envelope. Release stages are triggered on note off and modulate from the current parameter value (depending on what stage has currently been reached, if any) to {@linkcode 0.0}.
 * @param {object} release                 - the stage parameters to add.
 * @param {number} stage.duration          - duration (in seconds) taken to reach {@linkcode 0.0}.
 * @param {("linear"|"exp")} [stage.type="linear"] - curvature of this stage, either linear or exponential.
 * @example <caption>Creating an attack-decay envelope that rises from {@linkcode 0.0} to {@linkcode 1.0} linearly in 0.25 seconds and back down to {@linkcode 0.0} exponentially over 0.5 seconds with a 1 second linear release time</caption>
 * // Attack-decay envelope for a gain parameter
 * var gainEnv = new Mseg();
 *
 * // Start stage with 0.0 gain
 * gainEnv.addStage({duration: 0.0, value: 0.0});
 *
 * // Attack stage of envelope
 * gainEnv.addStage({duration: 0.25, value: 1.0});
 *
 * // Decay stage of envelope
 * gainEnv.addStage({duration: 0.5, value: 0.0, type: "exp"});
 *
 * // Release stage of envelope
 * gainEnv.addRelease({duration: 1.0});
 */

Mseg.prototype.addRelease = function(release) {

	var type = 0;
	
	if(release.type) {
		
		if(release.type == "linear") type = 0;
		else type = 1;
	}
	
	this._release = new Array(release.duration, type);
}

Mseg.prototype._applyRelease = function(param, when, range) {

	var paramMin = 0.0;
	
	if(range) {
	
		if(range.min) paramMin = range.min;
	}
	
	if(this._release[1] == 0) {
		param.linearRampToValueAtTime(paramMin, when + this._release[0]);
	}
	else {
		param.exponentialRampToValueAtTime(paramMin, when + this._release[0]);
	}
	
}

/** 
 * Returns the duration of the release stage of an MSEG. This is needed to correctly calculate the proper duration (including release) of oscillators that have a predetermined duration (e.g. steps triggered by a pattern scheduler).
 * @example <caption>Applies the stages of an MSEG to an oscillator's gain node sone second from the current context time</caption>
 * // Note duration of 0.25 seconds
 * var noteDuration = 0.25;
 *
 * // Total duration of tirggered note (otherwise the release stage would start after the oscillator had stopped)
 * var totalDuration = noteDuration + adsr.durationOfRelease();
 */

Mseg.prototype.durationOfRelease = function() {
	return this._release[0];
}

/** 
 * Schedules the given Web Audio parameter for modulation by the stages of a multi-stage envelope at a the specified time. This method should be used for oscillators that are continuously running (such as the voices of a synthesizer). For oscillators with a predetermined duration, the method noteOnAndOff should instead be used.
 * @param {object} param           - the Web Audio parameter to modulate.
 * @param {number} when            - the time to schedule the modulation for.
 * @param {object} range           - the range of parameter modulation to apply.
 * @param {number} [range.min=0.0] - minimum parameter value.
 * @param {number} [range.max=1.0] - maximum parameter value.
 * @example <caption>Applies the stages of an MSEG to an oscillator's frequency and gain immediately</caption>
 * function keyboardDown() {
 *     // Note that the amp envelope does not need to specify a min and max paramater range as the default range is between 0.0 and 1.0
 *     ampEnv.noteOn(masterGain.gain, context.currentTime);
 *     pitchEnv.noteOn(oscillator.frequency, context.currentTime, {min: 400.0, max: 800.0});
 * }
 */
Mseg.prototype.noteOn = function(param, when, range) {

	param.cancelScheduledValues(when);
	param.setValueAtTime(param.value, when);

	var stageTimeAccum = 0;
	var paramMin = 0.0;
	var paramMax = 1.0;
	
	if(range) {
	
		if(range.min) paramMin = range.min;
		if(range.max) paramMax = range.max;
	}
	
	for (var i = 0; i < this._stages.length; i++) {
			
		var value = mcad.unsignedNormToParam(this._stages[i][1], paramMin, paramMax);
		var stageDuration = when + stageTimeAccum + this._stages[i][0];
		
		if(this._stages[i][2] == 0) {
			param.linearRampToValueAtTime(value, stageDuration);
		}
		else {
			param.exponentialRampToValueAtTime(value, stageDuration);
		}
		
		stageTimeAccum += this._stages[i][0];
	}
}

/** 
 * Schedules the given Web Audio parameter for modulation by the release stage of a multi-stage envelope at a the specified time. This method should be used for oscillators that are continuously running (such as the voices of a synthesizer). For oscillators with a predetermined duration, the method noteOnAndOff should instead be used.
 * @param {object} param           - the Web Audio parameter to modulate.
 * @param {number} when            - the time to schedule the modulation for.
 * @param {object} range           - the range of parameter modulation to apply.
 * @param {number} [range.min=0.0] - minimum parameter value.
 * @param {number} [range.max=1.0] - maximum parameter value.
 * @example <caption>Applies the release stage of an MSEG to an oscillator's frequency and gain immediately</caption>
 * function keyboardUp() {
 *     // Note that the amp envelope does not need to specify a min and max paramater range as the default range is between 0.0 and 1.0
 *     ampEnv.noteOff(masterGain.gain, context.currentTime);
 *     pitchEnv.noteOff(oscillator.frequency, context.currentTime, {min: 400.0, max: 800.0});
 * }
 */

Mseg.prototype.noteOff = function(param, when, range) {

	param.cancelScheduledValues(when);
	param.setValueAtTime(param.value, when);

	if(this._release[0] > 0.0) {
		
		this._applyRelease(param, when, range);
	}
	
}

/** 
 * Schedules the given Web Audio parameter for modulation by all stages (including release) of a multi-stage envelope at a the specified time. This method should be used for oscillators that are not continuously running but instead have a predetermined duration (e.g. notes triggered by a pattern scheduler). For oscillators that have no specified duration (such as the continuously running voices of a synthesizer), the noteOn and noteOff methods should instead be used.
 * @param {object} param           - the Web Audio parameter to modulate.
 * @param {number} when            - the time to schedule the modulation for.
 * @param {object} range           - the range of parameter modulation to apply.
 * @param {number} [range.min=0.0] - minimum parameter value.
 * @param {number} [range.max=1.0] - maximum parameter value.
 * @example <caption>Applies all stages to the pitch and gain of an oscillator triggered by a pattern scheduler</caption>
 * // Create and oscillator node and connect it to a gain node
 * var oscillator = context.createOscillator();
 * var gainNode = context.createGain();
 * gainNode.connect(context.destination);
 * oscillator.connect(gainNode);
 *
 * // Create an MSEG that starts at full intensity then falls to zero intensity lenearly over 0.1 seconds before rising back up to full intensity exponentially ovre a duration of 0.1 seconds
 * var adsr = new Mseg(); 		
 * adsr.addStage({duration: 0.0, value: 1.0});
 * adsr.addStage({duration: 0.1, value: 0.0});
 * adsr.addStage({duration: 0.1, value: 1.0, type: "exp"});
 *
 * // Add the linear release stage of 0.25 seconds (the "linear" is optional)
 * adsr.addStage({duration: 0.25, value: 0.0, type: "linear"});
 * 	
 * // Duration of the oscillator (without release) in seconds
 * var noteLength = 0.1;
 *
 * // Duration of the oscillator (with release) in seconds
 * var totalLength = noteLength + adsr.durationOfRelease();
 *
 * // Schedule the gain and freuency modulation immediately
 * adsr.noteOnAndOff(gainNode.gain, conext.currentTime, noteLength);
 * adsr.noteOnAndOff(oscillator.frequency, conext.currentTime, noteLength, {min: 400.0, max: 800.0});
 *
 * // Shedule the oscillator for immediate playback
 * oscillator.start(conext.currentTime);
 *
 * // Shecdule the oscillator to play for the note length + MSEG release
 * oscillator.stop(conext.currentTime + totalLength);
 */

Mseg.prototype.noteOnAndOff = function(param, when, duration, range) {

	this.noteOn(param, when, range);
	if(this._release[0] > 0.0) this._applyRelease(param, when + duration);	
}