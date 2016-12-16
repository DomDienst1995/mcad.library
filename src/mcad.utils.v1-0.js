/**
 * @fileOverview Contains the MCAD Utility class.
 * @name MCAD Utility
 * @version 1.0
 */
 
 /**
 * The MCAD namespace for utility functions.
 * @namespace mcad
 */
 var mcad = {
	 	 
	/**
	* Converts an unsigned normalized value in the {@linkcode [0,1]} range to a parameter value in the {@linkcode min} to {@linkcode max} range.
	* @function unsignedNormToParam
	* @memberof mcad
	* @param {number} t   - the unsigned normalized value in the {@linkcode [0,1]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The parameter value in the {@linkcode min} to {@linkcode max} range.
	* @example 
	* var t = 0.5;
	* var min = 200;
	* var max = 400;
	*
	* // p is assigned the value 300
	* var p = mcad.unsignedNormToParam(t, min, max);
	*/
	unsignedNormToParam: function (t, min, max) {
		 
		return min + ((max - min) * t);
	},
	 
	/**
	* Converts a parameter value in the {@linkcode [min,max]} range to an unsigned normalized value in the {@linkcode [0,1]} range.
	* @function paramToUnsignedNorm
	* @memberof mcad
	* @param {number} p   - the parameter value in the {@linkcode [min,max]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The unsigned normalized value in the {@linkcode [0,1]} range.
	* @example
	* var p = 300;
	* var min = 200;
	* var max = 400;
	*
	* // t is assigned the value 0.5
	* var t = mcad.paramToUnsignedNorm(p, min, max);
	*/
	paramToUnsignedNorm: function (p, min, max) {
		 
		return (p - min) / (max - min);
	},
	
	/**
	* Converts an unsigned normalized value in the {@linkcode [0,1]} range to a signed normalized value in the {@linkcode [-1,1]} range.
	* @function unsignedNtoSignedN
	* @memberof mcad
	* @param {number} t   - the unsigned normalized value in the {@linkcode [0,1]} range.
	* @returns {number}     The signed normalized value in the {@linkcode [-1,1]} range.
	* @example
	* var tU = 0.5;
	*
	* // tN is assigned the value 0
	* var tN = mcad.unsignedNtoSignedN(tU);
	*/
	unsignedNtoSignedN: function (t) {
		 
		return t * 2 - 1;
	},
	 
	/**
	* Converts a signed normalized value in the {@linkcode [-1,1]} range to an unsigned normalized value in the {@linkcode [0,1]} range.
	* @function signedNtoUnsignedN
	* @memberof mcad
	* @param {number} t   - the signed normalized value in the {@linkcode [-1,1]} range.
	* @returns {number}     The unsigned normalized value in the {@linkcode [0,1]} range.
	* @example
	* var tN = 0.0;
	*
	* // tU is assigned the value 0.5
	* var tU = mcad.signedNtoUnsignedN(tN);
	*/
	signedNtoUnsignedN: function (t) {
		 
		return (t + 1) / 2;
	},
	 
	/**
	* Converts a signed normalized value in the {@linkcode [-1,1]} range to a parameter value in the {@linkcode min} to {@linkcode max} range.
	* @function signedNormToParam
	* @memberof mcad
	* @param {number} t   - the signed normalized value in the {@linkcode [-1,1]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The parameter value in the {@linkcode min} to {@linkcode max} range.
	* @example <caption>Converting a parameter value to a signed normalized value in the [-1,1]</caption>
	* var t = 0.0;
	* var min = 200;
	* var max = 400;
	*
	* // p is assigned the value 300
	* var p = mcad.signedNormToParam(t, min, max);
	*/
	signedNormToParam: function (t, min, max) {
		 
		return this.unsignedNormToParam(this.signedNtoUnsignedN(t), min, max);
	},
	 
	/**
	* Converts a parameter value in the {@linkcode [min,max]} range to a signed normalized value in the {@linkcode [-1,1]} range.
	* @function paramToSignedNorm
	* @memberof mcad
	* @param {number} p   - the parameter value in the {@linkcode [min,max]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The signed normalized value in the {@linkcode [-1,1]} range.
	* @example
	* var p = 300;
	* var min = 200;
	* var max = 400;
	*
	* // t is assigned the value 0.0
	* var t = mcad.paramToSignedNorm(p, min, max);
	*/
	paramToSignedNorm: function (p, min, max) {
		 
		return this.unsignedNtoSignedN(this.paramToUnsignedNorm(p, min, max));
	},
	
	/**
	* Converts a parameter value in the {@linkcode [min,max]} range to an unsigned normalized value in the {@linkcode [0,1]} range using a logarithmic scale.
	* @function logParamToUnsignedNorm
	* @memberof mcad
	* @param {number} p   - parameter value in the {@linkcode [min,max]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The unsigned normalized value in the {@linkcode [0,1]} range using a logarithmic scale.
	* @example
	* var freq = 20000
	*
	* // t is assigned the value 1.0
	* var t = mcad.logParamToUnsignedNorm(freq, 20, 20000);
	*/
	 
	logParamToUnsignedNorm: function (p, min, max) {
    
		var minv = Math.log(min);
		var maxv = Math.log(max);

		var scale = (maxv-minv);

		return (Math.log(p) - minv) / scale;
	},
	
	/**
	* Converts an unsigned normalized value in the {@linkcode [0,1]} range to a parameter value in the {@linkcode [min,max]} range using a logarithmic scale.
	* @function unsignedNormToLogParam
	* @memberof mcad
	* @param {number} t   - the unsigned normalized value in the {@linkcode [0,1]} range.
	* @param {number} min - the minimum parameter value.
	* @param {number} max - the maximum parameter value.
	* @returns {number}     The parameter value in the {@linkcode [-1,1]} range using a logarithmic scale.
	* @example
	* var sliderPos = 50;
	* var sliderMin = 0;
	* var sliderMax = 100;
	*
	* // t is assigned the value 0.5
	* var t = mcad.paramToUnsignedNorm(sliderPos, sliderMin, sliderMax);
	* 
	* // Maps the t value of the linear sider value p to the 20 to 20000 range using a logarithmic scale
	* var freq = mcad.unsignedNormToLogParam(t, 20, 20000);
	*/
	
	unsignedNormToLogParam: function (t, min, max) { 
			 
		var minv = Math.log(min);
		var maxv = Math.log(max);

		var scale = (maxv-minv);

		return Math.exp(scale * t + minv);
	},
	
	/**
	* Converts a parameter value in the {@linkcode srcMin} to {@linkcode srcMax} range to a parameter value in the {@linkcode destMin} to {@linkcode destMax} range.
	* @function paramToParam
	* @memberof mcad
	* @param {number} p       - the parameter value in the {@linkcode [srcMin,srcMax]} range.
	* @param {number} srcMin  - the source minimum parameter value.
	* @param {number} srcMax  - the source maximum parameter value.
	* @param {number} destMin - the destination minimum parameter value.
	* @param {number} destMax - the destination maximum parameter value.
	* @returns {number}         The parameter value in the {@linkcode destMin} to {@linkcode destMax} range.
	* @example
	* var sliderPos = 50;
	* var sliderMin = 0;
	* var sliderMax = 100;
	* 
	* var reverbMin = 0;
	* var reverbMax = 5000;
	*
	* // reverbTime is assigned the value 2500
	* var reverbTime = mcad.paramToParam(sliderPos, sliderMin, sliderMax, reverbMin, reverbMax);
	*/
	
	paramToParam: function(p, srcMin, srcMax, destMin, destMax) {
		
		var t = this.paramToUnsignedNorm(p, srcMin, srcMax);
		
		return this.unsignedNormToParam(t, destMin, destMax);
		
	},
	
	/**
	* Converts a parameter value in the {@linkcode srcMin} to {@linkcode srcMax} range to a parameter value in the {@linkcode destMin} to {@linkcode destMax} range using a logarithmic scale.
	* @function paramToLogParam
	* @memberof mcad
	* @param {number} p       - the parameter value in the {@linkcode [srcMin,srcMax]} range.
	* @param {number} srcMin  - the source minimum parameter value.
	* @param {number} srcMax  - the source maximum parameter value.
	* @param {number} destMin - the destination minimum parameter value.
	* @param {number} destMax - the destination maximum parameter value.
	* @returns {number}         The parameter value in the {@linkcode destMin} to {@linkcode destMax} range using a logarithmic scale.
	* @example
	* var sliderPos = 50;
	* var sliderMin = 0;
	* var sliderMax = 100;
	* 
	* var freqMin = 20;
	* var freqMax = 20000;
	*
	* // Maps the p value of the linear sider value p to the 20 to 20000 range using a logarithmic scale
	* var freq = mcad.paramToParam(sliderPos, sliderMin, sliderMax, freqMin, freqMax);
	*/
	
	paramToLogParam: function(p, srcMin, srcMax, destMin, destMax) {
		
		var t = this.paramToUnsignedNorm(p, srcMin, srcMax);
		
		return this.unsignedNormToLogParam(t, destMin, destMax);
	},
	
	/**
	* Converts a parameter value in the logarithmic {@linkcode srcMin} to {@linkcode srcMax} range to a parameter value in the {@linkcode destMin} to {@linkcode destMax} range.
	* @function logParamToParam
	* @memberof mcad
	* @param {number} p       - the parameter value in the logarithmic {@linkcode [srcMin,srcMax]} range.
	* @param {number} srcMin  - the source minimum parameter value.
	* @param {number} srcMax  - the source maximum parameter value.
	* @param {number} destMin - the destination minimum parameter value.
	* @param {number} destMax - the destination maximum parameter value.
	* @returns {number}         The parameter value in the {@linkcode destMin} to {@linkcode destMax} range.
	* @example
	* var sliderMin = 0;
	* var sliderMax = 100;
	* 
	* var freqValue = 1000;
	* var freqMin = 20;
	* var freqMax = 20000;
	*
	* // Maps the p value of the logarithmic 20 to 20000 range to the linear 0 to 100 range
	* var freq = mcad.logParamToParam(freqValue, freqMin, freqMax, sliderMin, sliderMax);
	*/
	
	logParamToParam: function(p, srcMin, srcMax, destMin, destMax) {
		
		var t = this.logParamToUnsignedNorm(p, srcMin, srcMax);
		
		return this.unsignedNormToParam(t, destMin, destMax);
	},
	
	/**
	* Converts a MIDI note number in the {@linkcode [0,127]} range to a frequency in Hertz.
	* @function midiNoteToHz
	* @memberof mcad
	* @param {number} noteNumber - the MIDI note number in the {@linkcode [0,127]} range.
	* @returns {number}            The frequency of the note in Hertz.
	* @example
	* // freq will have the value 440.0
	* var freq = midiNoteToHz(69);
	*/
	 
	midiNoteToHz: function (noteNumber) {
		
		// f_0
		// Frequency (hz) of middle A
		f_0 = 440;

		// MidA
		// The MIDI note value of our reference pitch (A440)
		MidA = 69;

		// n
		// The difference (in semitones) between middle A and the note we wish to calculate the frequency for
		var n = noteNumber - MidA;

		// a
		// The ratio between frequencies of any two adjacent semitones
		var a = Math.pow(2, 1 / 12);

		// f_n
		// The formula for calculating the frequency of a given note
		return f_0 * Math.pow(a, n);
	}
 };