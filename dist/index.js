

  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @property list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

    Polymer('core-transition', {
      
      type: 'transition',

      /**
       * Run the animation.
       *
       * @method go
       * @param {Node} node The node to apply the animation on
       * @param {Object} state State info
       */
      go: function(node, state) {
        this.complete(node);
      },

      /**
       * Set up the animation. This may include injecting a stylesheet,
       * applying styles, creating a web animations object, etc.. This
       *
       * @method setup
       * @param {Node} node The animated node
       */
      setup: function(node) {
      },

      /**
       * Tear down the animation.
       *
       * @method teardown
       * @param {Node} node The animated node
       */
      teardown: function(node) {
      },

      /**
       * Called when the animation completes. This function also fires the
       * `core-transitionend` event.
       *
       * @method complete
       * @param {Node} node The animated node
       */
      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      /**
       * Utility function to listen to an event on a node once.
       *
       * @method listenOnce
       * @param {Node} node The animated node
       * @param {string} event Name of an event
       * @param {Function} fn Event handler
       * @param {Array} args Additional arguments to pass to `fn`
       */
      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  ;


		(function(){

			/*
				STATIC (shared) FUNCTIONS & VALUES
			*/

			var transitionEndEventName = function () {
				var i,
					undefined,
					el = document.createElement('div'),
					transitions = {
						'transition':'transitionend',
						'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
						'MozTransition':'transitionend',
						'WebkitTransition':'webkitTransitionEnd'
					};

				for (i in transitions) {
					if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
						return transitions[i];
					}
				}

				//TODO: throw 'TransitionEnd event is not supported in this browser'; 
			},

			TRANSITION_CLASS = {
				BASE: 		'carousel',
				T: 			'transition',
				ENTER: 		'enter',
				LEAVE: 		'leave',
				SETUP: 		'setup', 
				ACTIVE:		'active', 
				FINAL: 		'final'
			},

			transitionClass = function() {
				return [
					TRANSITION_CLASS.BASE,
					TRANSITION_CLASS.T,
				].join('-');
			},
			enterSetupClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.ENTER,
					TRANSITION_CLASS.SETUP
				].join('-');
			},
			enterActiveClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.ENTER,
					TRANSITION_CLASS.ACTIVE
				].join('-');
			},
			enterFinalClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.ENTER,
					TRANSITION_CLASS.FINAL
				].join('-');
			},
			leaveSetupClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.LEAVE,
					TRANSITION_CLASS.SETUP
				].join('-');
			},
			leaveActiveClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.LEAVE,
					TRANSITION_CLASS.ACTIVE
				].join('-');
			},
			leaveFinalClass = function(transitionType) {
				return [
					TRANSITION_CLASS.BASE,
					transitionType,
					TRANSITION_CLASS.T,
					TRANSITION_CLASS.LEAVE,
					TRANSITION_CLASS.FINAL
				].join('-');
			}

			/*
				INSTANCE FUNCTIONS & VALUES
			*/
			
			Polymer('carousel-transition', { 

				publish: {
					transitionType: null
				},

				registerCallback: function(element) {
					// grab styles from template
					this._transitionStyle = element.templateContent().firstElementChild;
				},

				// template is just for loading styles, we don't need a shadowRoot
				fetchTemplate: function() {
					return null;
				},

				ready: function(){

					// make sure to run the rady method in supre
					// the the meta element will not be registered
					this.super();

					// buld trasistion classes
					var t = this.transitionType;
					this._CLASSES = {
						BASE:			transitionClass(),
						ENTER:			enterSetupClass(t),
						LEAVE:			leaveSetupClass(t),
						ENTER_ACTIVE:	enterActiveClass(t),
						LEAVE_ACTIVE:	leaveActiveClass(t),
						ENTER_END:		enterFinalClass(t),
						LEAVE_END:		leaveFinalClass(t)
					};

					this._completeEventName = transitionEndEventName();

				},

				/**
				* Run the animation.
				*
				* @method go
				* @param {Node} node The node to apply the animation on
				* @param {Object} state State info
				*/
				go: function(node, state, modifier, doneCallback) {

					node.classList.add(this._CLASSES.BASE);
					node.classList.remove(this._CLASSES.LEAVE_END);
					node.classList.remove(this._CLASSES.ENTER_END);

					var _self = this;
					switch(state){
						case 'enter': 

							node.classList.add(this._CLASSES.ENTER);

							// give time for classes to apply to DOM 
							// before adding end state for transition
							this.async(function() {
								node.classList.add(this._CLASSES.ENTER_ACTIVE);
							}, null, 1);
							
							this.listenOnce(node, this._completeEventName, function(e){ 
								
								node.classList.remove(_self._CLASSES.ENTER_ACTIVE);
								node.classList.switch(
									_self._CLASSES.ENTER,
									_self._CLASSES.ENTER_END
								);

								doneCallback && doneCallback(node);

								_self.complete.call(_self, node, state);

							});
							break;

						case 'leave': 
					
							node.classList.add(this._CLASSES.LEAVE);

							// give time for classes to apply to DOM 
							// before adding end state for transition
							this.async(function() {
								node.classList.add(this._CLASSES.LEAVE_ACTIVE);
							}, null, 1);

							this.listenOnce(node, this._completeEventName, function(e){ 

								node.classList.remove(_self._CLASSES.LEAVE_ACTIVE);
								node.classList.switch(
									_self._CLASSES.LEAVE, 
									_self._CLASSES.LEAVE_END
								);

								doneCallback && doneCallback(node);

								_self.complete.call(_self, node, state);

							});
							break;

					}

				},
				/**
				* Set up the animation. This may include injecting a stylesheet,
				* applying styles, creating a web animations object, etc.. This
				*
				* @method setup
				* @param {Node} node The animated node
				*/
				setup: function(node) {
					//node.classList.add(this._CLASSES.BASE);
					//node.classList.add(this._CLASSES.LEAVE); 
					node.classList.add(this._CLASSES.LEAVE_END); 

					if (!node._hasTransitionStyle) {
						if (!node.shadowRoot) {
							node.createShadowRoot().innerHTML = '<content></content>';
						}
						// write the transition styles to the nodes shadowRoot
						this.installScopeStyle(this._transitionStyle, 'transition', node.shadowRoot);
						node._hasTransitionStyle = true;
					}
				},

				/**
				* Tear down the animation.
				*
				* @method teardown
				* @param {Node} node The animated node
				*/
				teardown: function(node) {
					node.classList.add(this._CLASSES.BASE);
					node.classList.remove(this._CLASSES.ENTER);
					node.classList.remove(this._CLASSES.LEAVE);
					node.classList.remove(this._CLASSES.ENTER_END);
					node.classList.remove(this._CLASSES.LEAVE_END);

					node.removeEventListener(transitionEndEventName());
				},
				/**
				* Called when the animation completes. This function also fires the
				* `carousel-item-transitionend` event.
				*
				* @method complete
				* @param {Node} node The animated node
				*/
				complete: function(node, state) {

					//console.log('complete:', state);

					node.classList.remove(this._CLASSES.BASE);
					this.fire('carousel-item-transitionend', { type: this.transitionType, node: node, state: state }, node);
				}
			});

		})()
	;

		Polymer('x-carousel', {

			publish : {
				slide: { value: 0, reflect: true },
				interval: { value: 10000, reflect: true },
				direction: { value: 'forward', reflect: true },
				isReady: { value: false, reflect: true },
				overflow: { value: 'hidden', reflect: true },
				infinate: false	
			},
			_slides: [],
			_slideInterval: undefined,
			domReady: function(){

				var _self = this;

				// get slides
				_self._slides = _self.querySelectorAll('x-carousel-item')

				var l = this._slides.length;

				// set up initial layout and transitions
				_self.next();
				var listner = function(e){

					if(e.detail.state === "enter"){

						e.stopPropagation();
						_self.removeEventListener('carousel-item-transitionend', listner, false);
						_self.async(function() { // delay a frame to transition back
							_self.prev();
							_self.isReady = true;
							_self.fire('carousel-ready', { node: _self }, _self);
						}, null, 1);

					}
				};
				_self.addEventListener('carousel-item-transitionend', listner, false);
				

				_self.style.overflow = _self.overflow;	

			},

			next: function(){
				this.direction = 'forward';
				this.slide = this.infinate ? 
					(this.slide + 1) % this._slides.length :
					Math.min(this.slide + 1, this._slides.length-1);
			},

			prev: function(){
				this.direction = 'back';
				var l = this._slides.length;
				this.slide = this.infinate ? 
					((((this.slide -1) % l) + l) % l) :
					Math.max(this.slide - 1, 0);
			},

			overflowChanged: function(oldVal, newVal){
				this.style.overflow = newVal;
			},
			
			intervalChanged: function(oldVal, newVal){

				var _self = this;

				clearInterval(_self._slideInterval);

				// set up interval
				if (newVal !== 'none' && newVal > 1000){
					_self._slideInterval = setInterval(function(){
						_self.next();
					}, newVal);
				}

			},

			// update the state of items
			slideChanged: function(oldVal, newVal){

				var _self = this,
					l = _self._slides.length,
				// get slide nodes
					Old = this._slides[oldVal],
					New = this._slides[newVal],
					Next = null;

				// predict next slide in series
				if (this.direction === 'forward'){
					Next = this.infinate ? 
							this._slides[(newVal + 1) % l] : // wrap around to get start of list
							this.slide + 1 < l ? 
								this._slides[newVal + 1] : 	// get next slide
								null;							// end of list return null;
				} else {
					Next = this.infinate ? 
							this._slides[((((newVal -1) % l) + l) % l)] : // wrap around to get end of list
							this.slide - 1 >= 0 ? 
								this._slides[newVal - 1] : 	// get next slide
								null;							// end of list return null;
				}

				// pre transition state
				for (var i=0; i < l; i++){

					// calculate posistion in carousel relative to active slide
					var position = this.direction === 'forward' ? 
						((Math.abs(l - i) + newVal) - 1) % l :
						(((i - newVal - 1)%l)+l) % l;

					// fix layering
					_self._slides[i].style.zIndex = position;

					switch(_self._slides[i]) {
						case New:
						case Old: 
						case Next:
							_self._slides[i].isHidden = false; // don't hide active slides
							break;
						default:
							// every slide isNext unless it is New (curr) or Old (prev)
							_self._slides[i].isNext = true;
							_self._slides[i].isHidden = true;
					}
					
				}

				// start old slide transition
				if (!!Old){
					Old.isPrev = true;
					Old.leave(_self._direction ,function(node){

						node.isPrev = true;

						// post transition state
						for (var i=0; i < l; i++){
							switch(_self._slides[i]) {
								case New:
								case Old:
								case node: break;
								default:
									_self._slides[i].isPrev = false;
							}
						}
					})
				};
				// start new slide transition
				if (!!New){
					New.isPrev	= false;
					New.isNext	= false;
					if (!!Next) { Next.isNext = true; }
					New.enter(_self._direction);	
				}	

			}

		});
	;

		Polymer('x-carousel-item', {

			publish : {
				isHidden: { value: false, reflect: true },
				isNext: { value: false, reflect: true },
				isPrev: { value: false, reflect: true },
				active: { value: false, reflect: true },
				direction: { value: 'forward', reflect: true },
				transitionType: 'fade'
			},

			_meta: undefined,
			_slideTransition: undefined,

			ready: function(){

				var _self = this;

				// Get the meta db with the transition in it
				_self._meta = document.createElement('core-meta'); 
				_self._meta.type = 'transition';

				var transistionId = 'carousel-' + this.transitionType + '-transition';
				_self._slideTransition = _self._meta.byId(transistionId);

				if (_self._slideTransition){
					_self._slideTransition.setup(_self);
				} else {
					console.error('ERROR: <x-carousel-item>: transitionType="' + this.transitionType + '" ['+transistionId+'] was not found, no transition will be used');
				}

			},

			directionChanged: function(oldVal, newVal){
				/*
				var transistionId = 'carousel-' + this.transitionType + '-transition';
				this._slideTransition = this._meta.byId(transistionId);
				*/
			},

			enter: function(modifier, callbcak){
				this.active = true;
				this._slideTransition && this._slideTransition.go(this, 'enter', modifier, function(node){
					callbcak && callbcak(node);
				});
			},

			leave: function(modifier, callbcak){
				this.active = false;
				this._slideTransition && this._slideTransition.go(this, 'leave', modifier, function(node){
					callbcak && callbcak(node);
				});	
			}

		});
	;

		Polymer('fix-aspect-ratio', {

			publish: {
				ratioW: { value: 1, reflect: true },
				ratioH: { value: 1 , reflect: true }
			},

			ratioHChanged: function(oldVal, newVal){
				var height = 100 / this.ratioW * this.ratioH;
				this.style.paddingBottom =  height + '%';

				console.log(height);
			}

		})
	;


		Polymer('flip-card', {

			publish: {
				flipped: { value: false, reflect: true },
				'autowire-events': { value: true, reflect: true }
			},

			domReady: function(){

				var _self = this;

				function flipHandler(event, detail, sender){
					_self.toggleFlip.call(_self, event, detail, sender);
				}

				if(!!this['autowire-events']){
					this.$.front.addEventListener('click', flipHandler);
					this.$.back.addEventListener('click', flipHandler);
				}

			},

			detached: function() {  
				this.$.front.removeEventListener();
				this.$.back.removeEventListener()
			},

			toggleFlip: function(event, detail, sender) { 
				this.flipped = !this.flipped;
			}

		});

	;

		Polymer('credit-card', {

			publish: {
				autowireFlipEvents: { value: true, reflect: true }
			}

		});
	;
		

		var appRoot = document.querySelector('#app-root');

		appRoot.account = [
			{
				bgColor: 'bg-color-primary-2',
				brand: 'Visa',
				number: "4242 4242 4242 4242",

				creditLimit: 4000,
				availBalance: 2397.52,
				nextPayment: 127.10,

				transactions: [
					{
						date: Date.now(),
						message: "Telstra Mobile - Bpay",
						ammount: -101.24
					}
				]
			},
			{
				bgColor: 'bg-color-secondary-1-2',
				brand: 'Mastercard',
				number: "1212 1212 1212 1212"
			},
			{
				bgColor: 'bg-color-secondary-2-2',
				brand: 'American-Express',
				number: "3535 3535 1212 1212"
			},
			{
				bgColor: 'bg-color-complement-2',
				brand: 'Other-Card',
				number: "9999 9999 9999 9999"
			},
			{
				bgColor: 'bg-color-primary-3',
				brand: 'Visa',
				number: "4242 4242 4242 4242"
			},
			{
				bgColor: 'bg-color-secondary-1-3',
				brand: 'Mastercard',
				number: "1212 1212 1212 1212"
			},
			{
				bgColor: 'bg-color-secondary-2-3',
				brand: 'American-Express',
				number: "3535 3535 1212 1212"
			},
			{
				bgColor: 'bg-color-complement-3',
				brand: 'Other-Card',
				number: "9999 9999 9999 9999"
			}
		];

		PolymerExpressions.prototype.json = function(input, pretty) {
			return !!pretty ? 
				JSON.stringify(input, null, '\t'): 
				JSON.stringify(input);
		};

		PolymerExpressions.prototype.currency = function(val, c, d, t){
			var n = val, 
			    c = isNaN(c = Math.abs(c)) ? 2 : c, 
			    d = d == undefined ? "." : d, 
			    t = t == undefined ? "," : t, 
			    s = n < 0 ? "-" : "", 
			    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
			    j = (j = i.length) > 3 ? j % 3 : 0;
		   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		}

		PolymerExpressions.prototype.currencyShort = function(val) {
				var cmpval = Math.abs(val);
				if (cmpval < 1000) {
					return '$' + val.toFixed(0);
				}
				else if (cmpval >= 1000 && cmpval < 1000000) {
					var truncVal = (val / 1000);
					return '$' + (truncVal % Math.floor(truncVal) ?
						truncVal.toFixed(1) :
						truncVal.toFixed(0)
						) + "K";
				} 
				else if (cmpval >= 1000000) {
					var truncVal = (val / 1000000);
					return '$' + (truncVal % Math.floor(truncVal) ?
						truncVal.toFixed(1) :
						truncVal.toFixed(0)
						) + "M";
				}
		};

		