/**
 * @fileOverview Contains the MCAD Buffer Loader class.
 * @name MCAD Buffer Loader
 * @version 1.0
 */
 
 /**
 * Constructs a buffer loader object.
 * @class
 * @classdesc An asynchronous buffer loader capable of loading multiple individual sample buffers and buffer lists simultaneously.
 * @param {!AudioContext} context - the audio context to use
 * @example
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 */
 function BufferLoader(context) {

	// Web Audio context
	this._context = context;
	
	// Download queue for queieing up samples and lists of samples for download
	this._downloadQueue = {};
	
	// Index to use when adding a new sample/list to the download queue
	this._downloadIndex = 0;
}

/**
 * Callback used by myFunction.
 * @callback MyClass~onSuccess
 * @param {number} resultCode
 * @param {string} resultMessage
 */

/** 
  * Loads a sequential array or key/value array of samples into a sequential or key/value array of buffers.
  * @param {AudioBuffer[] | Array.<key, AudioBuffer>} bufferList - the destination array (sequential or key/value) the sample buffers will be loaded into.
  * @param {string[] | Array.<key, string>} urlList              - the url array (sequential or key/value) dictating the location of the samples to be loaded.
  * @param {?function} onFinished                                - the event handler to be called when all of the sample buffers requested have been loaded (or attempted).
  * @param {?function} onLoad                                    - the event handler to be called when a sample buffer in the array is loaded (or attempted).
  * @param {object} onLoad.result                                - contains the result (key/value pairs) of a given sample buffer's loading/decoding:
  * @param {string} onLoad.result.url                            - the url of the sample buffer that was loaded (or attempted).
  * @param {number | string} onLoad.result.key                   - the index (for sequential) or key (for key/value) of the sample buffer that was loaded (or attempted).
  * @param {boolean} onLoad.result.success                       - {@linkcode true} if loading/decoding of this buffer was successful, {@linkcode false} if not. 
  * @example <caption>Loading an array of key/value samples</caption>
  * var samples;
  *  
  * bufferLoader.loadBufferList(samples, {"kick": "samples/kick.wav", "hat": "samples/hat.wav", "snare": "samples/snare.wav"}, function() {
  * 					
  *     console.log("Finished loading samples!");
  * 			
  *     for(key in samples) {
  * 
  *         var buffer = samples[key];
  * 		
  *         console.log("Sample: " + key + ", buffer: " + buffer);
  *     }
  * });
  * 
  * // Elsewhere in the code...
  * playBuffer(samples.kick); // Or playBuffer(samples["kick"]);
  * @example <caption>Handling sample load/decode failures</caption>
  * var samples;
  * 
  * bufferLoader.loadBufferList(samples, {"kick": "samples/kick.wav", "hat": "samples/hat.wav", "snare": "samples/snare.wav"}, function() {
  *     					
  *     console.log("Finished loading samples!");
  * 			
  *     for(key in samples) {
  *         console.log("Sample: " + key + ", buffer: " + samples[key]);
  *     }
  * },
  * function(result) {
  * 				
  *    if(!result.success) console.log("File " + result.url + " with key " + result.key + " failed to load!");
  *    else console.log("File " + result.url + " with key " + result.key + " loaded successfully!");
  * 			
  * });
  * @example <caption>Using a key/value array specified elsewhere in the code</caption>
  * var samples;
  * 
  * var toLoad = {"kick": "samples/kick.wav", "hat": "samples/hat.wav", "snare": "samples/snare.wav"};
  * 
  * bufferLoader.loadBufferList(samples, toLoad, function() {			
  *     console.log("Finished loading samples!");
  * });
  * 
  * @example  <caption>Loading an sequential array of samples</caption>
  * var samples;
  * 
  * var urls = ["samples/kick.wav", "samples/hat.wav", "samples/snare.wav"];
  * 
  * bufferLoader.loadBufferList(samples, urls, function() {
  * 					
  *     for(i = 0; i < samples.length; i++) {
  *         console.log("Sample: " + i + ", buffer: " + samples[i]);
  *     }
  * });
  *
  * // Elsewhere in the code...
  * playBuffer(samples[2]); // Plays back snare.wav;
  * @example <caption>Using event handlers specified elsewhere in the code</caption>
  * var samples;
  *
  * function finishedEventHandler() {
  *				
  *     for(i = 0; i < samples.length; i++) {
  *         console.log("Sample: " + i + ", buffer: " + samples[i]);
  *     }
  * }
  *
  * function onLoadEventHandler(result) {
  *				
  *     if(!result.success) console.log("File " + result.url + " with key " + result.key + " failed to load!");
  *     else console.log("File " + result.url + " with key " + result.key + " loaded successfully!");
  * }
  *
  * // URL arrays can be specified inline
  * bufferLoader.loadBufferList(samples, ["samples/kick.wav", "samples/hat.wav", "samples/snare.wav"], finishedEventHandler, onLoadEventHandler);
  *
  * // Elsewhere in the code...
  * playBuffer(samples[2]); // Plays back snare.wav;
  */
BufferLoader.prototype.loadBufferList = function(bufferList, urlList, onFinished, onLoad) {
	
	// If we were to make multiple calls to loadBufferList and use member variables for book keeping (tracking how many samples have been downloaded, total amount to download and 
	// so on), the different calls would trample all over our book keeping due to their asynchronous nature. Instead, our buffer loader object keeps a master list of downloads
	// where each call to loadBufferList gets its own entry in the array along with its own book keeping variables for that download queue. For each call to this method, we increase
	// the index position in the master download queue and add an entry for this partiuclar queue. Once this queue has finished downloaded (or attempting to download) all of its
	// samples, we remove this queue from the master list.
	
	this._downloadQueue[this._downloadIndex] = {};
	this._downloadQueue[this._downloadIndex].urls = {};
	this._downloadQueue[this._downloadIndex].loaded = 0;
	this._downloadQueue[this._downloadIndex].size = 0;
	
	for(key in urlList){
			
		this._downloadQueue[this._downloadIndex].urls[key] = urlList[key];
		this._downloadQueue[this._downloadIndex].size++;
	}
	
	this._loadQueue(bufferList, this._downloadIndex++, onFinished, onLoad);
}

/*
loadQueue Method
----------------

Responsible for loading all of the samples in a given download queue. This method hooks in its own onLoad event handler to perform the book keeping steps and then passes the event 
on to the user to handle.

Note that the method passes an associative array on to loadBuffer with all of the book keeping variables needed to process the queue in the onLoad event handler. This is because
the asynchronous nature means that any member or local variables we pass to the loadBuffer method could/will change with subqeuent calls to loadQueue. Therefore, we pass a copy
of said book keeping variables which are then in turned returned back to this method's event handler for modification. Think of it like posting something to yourself.

*/

BufferLoader.prototype._loadQueue = function(bufferList, index, onFinished, onLoad) {
	
	var queue = this._downloadQueue;

	for(key in queue[index].urls) {

		// Attempt to load this sample in the queue
		this.loadBuffer({url: queue[index].urls[key], key: key}, function(result, url) {

			// Store the result in the buffer array's element indicated by the key (either numerical for sequential or other for key/value array)
			// The value of result is either an AudioBuffer object with the sample data (on succesfull loading/decoding) or null for failure
			bufferList[url.key] = result;

			// This is where we pass the event information on to the user's event handler
			if(onLoad) onLoad({url: url.url, key:url.key, success: result ? true : false});
			
			// Once the number of loaded files in this list has equaled the total number of files, remove this queue from the master array and trigger the user's onFinish handler
			if(++queue[index].loaded >= queue[index].size) {
				console.log("Finished loading files");
				delete queue[index];
				onFinished();
			}
		});		
	}
}

/** 
  * Loads an audio sample into an AudioBuffer object.
  * @param {!string} resource               - the url of the sample to load into the buffer.
  * @param {?function} onFinished           - the event handler to be called when the sample buffer is loaded (or attempted).
  * @param {?AudioBuffer} onFinished.buffer - the sample buffer (null if load/decode failed).
  * @param {string} onFinished.url          - the url of that was used to load (or attempt to load) the buffer.
  * @example <caption>Load a single sample into a buffer</caption>
  * var url = "../kits/909/kick.wav"
  * 
  * bufferLoader.loadBuffer(url, function(result, url){
  * 				
  *     // Sample failed to load/decode
  *     if(result == null) {
  *         console.log("Single file failed to load " + url);
  *     }
  *     // Sample was successfully loaded
  *     else {
  * 	
  *         console.log("Finished loading single sample " + url);
  *     }
  * });				
  */
BufferLoader.prototype.loadBuffer = function(resource, onFinished) {

	var loader = this;
	var url;
	
	// When the user calls this method, reource will be a string with a url address. If loadQueue calls this method, it will contain other book keeping data so the url
	// needs to be extracted from this key/value array
	if(typeof resource === 'string' || resource instanceof String) {
		url = resource;
	}
	else {
		url = resource.url;
	}
	
	// Set up the request to retrieve the buffer
	var request = new XMLHttpRequest();
	request.open('GET', url, true);                                     // Use GET for retrieving a resource
	request.responseType = 'arraybuffer';                               // Format of retrieved resource (raw array)
	
	// Asynchronous callback for when the buffer has been retrieved
	request.onload = function() 
	{
		// Decode the raw data into a suitable audio buffer
		loader._context.decodeAudioData(request.response,               // Source to be decoded (here, the response)
		function(buffer) {                                              // Callback function for successful decoding	
			
			console.log("Successfully decoded " + url);
			onFinished(buffer, resource);
		},		
		function() {                                                    // Callback function for unsuccessful decoding	
			
			console.log("Error decoding " + url);
			onFinished(null, resource);
		});	
	}
	
	// Go ahead and submit the request
	request.send();	
}
