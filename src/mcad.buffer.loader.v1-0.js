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
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 */
function BufferLoader(context) {
    
    //-------------------------------------------------------------------------------------------------------------------------------------
    console.info("@@0@@BufferLoader.BufferLoader@@Creating buffer loader instance...");
    //-------------------------------------------------------------------------------------------------------------------------------------
    
    if(context === null) throw new TypeError("(BufferLoader.BufferLoader) Invalid AudioContext (did you make a typo or forget to create the context?");
    
    // Web Audio context
    this._context = context;
    
    // Download queue for queieing up samples and lists of samples for download
    this._downloadQueue = {};
    
    // Index to use when adding a new sample/list to the download queue
    this._downloadIndex = 0;
}

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
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 * 
 * // List to hold all of our audio buffers
 * var sampleBuffers = {};
 * 
 * // Flag to determine whether or not the samples have finished loading
 * var samplesLoaded = false;
 *  
 * // Load a kick, hat and snare sample into the list and associate them with the "kick", "hat" and "snare" keys
 * bufferLoader.loadBufferList(sampleBuffers, {"kick": "samples/909kick.wav", "hat": "samples/909hat.wav", "snare": "samples/909snare.wav"}, function() {
 *     
 *     console.log("Finished loading sampleBuffers!");
 *     samplesLoaded = true;
 * });
 *
 *
 * // When the element with id "kick" is clicked...
 * $("#kick").click(function() {
 *
 *     if(samplesLoaded) {
 * 
 *         // Play back the kick sample
 *         var source = audioCtx.createBufferSource();
 *         source.buffer = sampleBuffers["kick"]; // Or source.buffer = sampleBuffers.kick;
 *         source.connect(audioCtx.destination);
 *         source.start();  
 * 
 *     }
 *     else console.log("Sampled not loaded yet!");
 * 
 * });
 * @example <caption>Handling sample load/decode failures</caption>
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 * 
 * // List to hold all of our audio buffers
 * var sampleBuffers = {};
 * 
 * // Flag to determine whether or not the samples have finished loading
 * var samplesLoaded = false;
 *  
 * // Load a kick, hat and snare sample into the list and associate them with the "kick", "hat" and "snare" keys
 * bufferLoader.loadBufferList(sampleBuffers, {"kick": "samples/909kick.wav", "hat": "samples/909hat.wav", "snare": "samples/909snare.wav"}, function() {
 *     
 *     console.log("Finished loading samples!");
 *     samplesLoaded = true;
 * },
 * function(result) {
 *                 
 *    if(!result.success) console.log("File " + result.url + " with key " + result.key + " failed to load!");
 *    else console.log("File " + result.url + " with key " + result.key + " loaded successfully!");
 *             
 * });
 *
 *
 * // When the element with id "kick" is clicked...
 * $("#kick").click(function() {
 *
 *     if(samplesLoaded) {
 * 
 *         // Play back the kick sample
 *         var source = audioCtx.createBufferSource();
 *         source.buffer = sampleBuffers["kick"]; // Or source.buffer = sampleBuffers.kick;
 *         source.connect(audioCtx.destination);
 *         source.start();  
 * 
 *     }
 *     else console.log("Sampled not loaded yet!");
 * 
 * });
 * @example <caption>Using a key/value array specified elsewhere in the code</caption>
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 * 
 * // List to hold all of our audio buffers
 * var sampleBuffers = {};
 * 
 * // List of samples (and their associated key values) to load
 * toLoad = {"kick": "samples/909kick.wav", "hat": "samples/909hat.wav", "snare": "samples/909snare.wav"};
 * 
 * // Flag to determine whether or not the samples have finished loading
 * var samplesLoaded = false;
 *  
 * // Load a kick, hat and snare sample into the list and associate them with the "kick", "hat" and "snare" keys
 * bufferLoader.loadBufferList(sampleBuffers, toLoad, function() {
 *     
 *     console.log("Finished loading samples!");
 *     samplesLoaded = true;
 * });
 *
 *
 * // When the element with id "kick" is clicked...
 * $("#kick").click(function() {
 *
 *     if(samplesLoaded) {
 * 
 *         // Play back the kick sample
 *         var source = audioCtx.createBufferSource();
 *         source.buffer = sampleBuffers["kick"]; // Or source.buffer = sampleBuffers.kick;
 *         source.connect(audioCtx.destination);
 *         source.start();  
 * 
 *     }
 *     else console.log("Sampled not loaded yet!");
 * 
 * });
 * 
 * @example  <caption>Loading a sequential array of samples</caption>
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 * 
 * // Array to hold all of our audio buffers
 * var sampleBuffers = [];
 * 
 * // Array of samples to load
 * var toLoad = ["samples/909kick.wav", "samples/909hat.wav", "samples/909snare.wav"];
 * 
 * // Flag to determine whether or not the samples have finished loading
 * var samplesLoaded = false;
 *  
 * // Load a kick, hat and snare sample into the list and associate them with the "kick", "hat" and "snare" keys
 * bufferLoader.loadBufferList(sampleBuffers, toLoad, function() {
 *     
 *     console.log("Finished loading samples!");
 *     samplesLoaded = true;
 * });
 *
 *
 * // When the element with id "kick" is clicked...
 * $("#kick").click(function() {
 *
 *     if(samplesLoaded) {
 * 
 *         // Play back the kick sample
 *         var source = audioCtx.createBufferSource();
 *         source.buffer = sampleBuffers[0]; 
 *         source.connect(audioCtx.destination);
 *         source.start();  
 * 
 *     }
 *     else console.log("Sampled not loaded yet!");
 * 
 * });
 */
BufferLoader.prototype.loadBufferList = function(bufferList, urlList, onFinished, onLoad) {
    
    //-------------------------------------------------------------------------------------------------------------------------------------
    console.info("@@0@@BufferLoader.loadBufferList@@Loading sample list/array...");
    console.debug("@@1" + urlList);
    //-------------------------------------------------------------------------------------------------------------------------------------
    
    if(urlList === null) throw new TypeError("(BufferLoader.loadBufferList) List of samples to load is invalid");

    // If we were to make multiple calls to loadBufferList and use member variables for book keeping (tracking how many samples have been downloaded, total amount to download and 
    // so on), the different calls would trample all over our book keeping due to their asynchronous nature. Instead, our buffer loader object keeps a master list of downloads
    // where each call to loadBufferList gets its own entry in the array along with its own book keeping variables for that download queue. For each call to this method, we increase
    // the index position in the master download queue and add an entry for this partiuclar queue. Once this queue has finished downloaded (or attempting to download) all of its
    // samples, we remove this queue from the master list.
    
    this._downloadQueue[this._downloadIndex] = {};
    this._downloadQueue[this._downloadIndex].urls = {};
    this._downloadQueue[this._downloadIndex].loaded = 0;
    this._downloadQueue[this._downloadIndex].size = 0;
    
    for(var key in urlList){
        //-------------------------------------------------------------------------------------------------------------------------------------
        console.info("@@2@@BufferLoader.loadBufferList@@Adding " + urlList[key] + " with key " + key + " to decode queue...");
        //-------------------------------------------------------------------------------------------------------------------------------------
        this._downloadQueue[this._downloadIndex].urls[key] = urlList[key];
        this._downloadQueue[this._downloadIndex].size++;
    }
    
    this._loadQueue(bufferList, this._downloadIndex++, onFinished, onLoad);
};

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
    
    //------------------------------------------------------------------------------------------------------------------------------------------------
    console.info("@@1@@BufferLoader._loadQueue@@Loading sample queue...");
    //------------------------------------------------------------------------------------------------------------------------------------------------
    
    var queue = this._downloadQueue;

    for(var key in queue[index].urls) {
        
        //--------------------------------------------------------------------------------------------------------------------------------------------
        console.info("@@1@@BufferLoader._loadQueue@@Attempting to decode sample " + queue[index].urls[key] + " with key " + key + "...");
        //-------------------------------------------------------------------------------------------------------------------------------------------- 
        
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // Asynchronous: Attempt to load this sample in the queue
        this.loadBuffer({url: queue[index].urls[key], key: key}, function(result, url) {

            // Store the result in the buffer array's element indicated by the key (either numerical for sequential or other for key/value array)
            // The value of result is either an AudioBuffer object with the sample data (on succesfull loading/decoding) or null for failure
            bufferList[url.key] = result;

            // This is where we pass the event information on to the user's event handler
            if(onLoad) onLoad({url: url.url, key:url.key, success: result ? true : false});
            
            // Once the number of loaded files in this list has equaled the total number of files, remove this queue from the master array and trigger the user's onFinish handler
            if(++queue[index].loaded >= queue[index].size) {
                //------------------------------------------------------------------------------------------------------------------------------------
                console.info("@@1@@BufferLoader._loadQueue@@Finished loading " + queue[index].size + " samples");
                console.debug("@@2" + queue[index].urls);
                //------------------------------------------------------------------------------------------------------------------------------------
                delete queue[index];
                onFinished();
            }
        });        
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    }
};

/** 
 * Loads an audio sample into an AudioBuffer object.
 * @param {!string} resource               - the url of the sample to load into the buffer.
 * @param {?function} onFinished           - the event handler to be called when the sample buffer is loaded (or attempted).
 * @param {?AudioBuffer} onFinished.result - the sample buffer (null if load/decode failed).
 * @param {string} onFinished.url          - the url of that was used to load (or attempt to load) the buffer.
 * @example <caption>Load a single sample into a buffer</caption>
 * // Create web audio context
 * var audioCtx = new AudioContext();
 * 
 * // Create a buffer loader object
 * var bufferLoader = new BufferLoader(audioCtx); 
 * 
 * // URL of sample to load
 * var kickURL = "samples/909kick.wav"
 * 
 * // Load the kick sample
 * bufferLoader.loadBuffer(kickURL, function(result, url){
 *                 
 *     // Sample failed to load/decode
 *     if(result === null) {
 *         console.log("Single file failed to load " + url);
 *     }
 *     // Sample was successfully loaded
 *     else {
 *     
 *         // Play back the kick sample
 *         var source = audioCtx.createBufferSource();
 *         source.buffer = result; 
 *         source.connect(audioCtx.destination);
 *         source.start();  
 *     }
 * });                
 */
BufferLoader.prototype.loadBuffer = function(resource, onFinished) {

    //-------------------------------------------------------------------------------------------------------------------------------------
    console.info("@@0@@BufferLoader.loadBuffer@@Loading buffer...");
    console.debug("@@1" + resource);
    //-------------------------------------------------------------------------------------------------------------------------------------
    
    if(resource === null) throw new TypeError("(BufferLoader.loadBuffer) Sample resource to load is invalid");

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
    
    //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Asynchronous: Callback for when the buffer has been retrieved
    request.onload = function() 
    {
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // Asynchronous: Decode the raw data into a suitable audio buffer
        loader._context.decodeAudioData(request.response,               // Source to be decoded (here, the response)
        function(buffer) {                                              // Callback function for successful decoding    
            //------------------------------------------------------------------------------------------------------------------------------------
            console.info("@@0@@BufferLoader.loadBuffer@@Successfully decoded " + url);
            console.debug("@@1" + buffer);
            //------------------------------------------------------------------------------------------------------------------------------------
            onFinished(buffer, resource);
        },        
        function() {                                                    // Callback function for unsuccessful decoding    
            //------------------------------------------------------------------------------------------------------------------------------------
            console.error("@@0@@BufferLoader.loadBuffer@@Error decoding " + url);
            //------------------------------------------------------------------------------------------------------------------------------------
            onFinished(null, resource);
        });    
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    };
    //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    // Go ahead and submit the request
    request.send();    
};
