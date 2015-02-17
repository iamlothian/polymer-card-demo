(function accountManagerConstructor(){

	var events = [
			// base events
			'down',			// a pointer is activated, or a device button held.
			'up',			// a pointer is deactivated, or a device button released. Same target as down, provides the element under the pointer with the relatedTarget property
			'trackstart',	// denotes the beginning of a series of tracking events. Same target as down.
			'track',		// fires for all pointer movement being tracked.
			'trackend',		// denotes the end of a series of tracking events. Same target as down. Provides the element under the pointer with the relatedTarget property.
			'tap',			// a pointer has quickly gone down and up. Used to denote activation.
			'hold',			// a pointer is held down for 200ms.
			'holdpulse',	// fired every 200ms while a pointer is held down.
			'release'		// a pointer is released or moved.
		];

	Polymer('account-manager', {

		publish : {
			account: { value: {}, reflect: true }
		},


		cardCarouselIdx:  0,
		accountDetailCarouselIdx: 0,
		delayedAccountCarouselIdx: 0,
		rotateInterval: 'none',

		domReady : function(){

			var _self = this;
	
			this.cardCarousel = this.shadowRoot.querySelector('#card-carousel > x-carousel');
			this.cardCarouselContainer = this.shadowRoot.querySelector('#card-carousel');

			this.cardDetails = this.shadowRoot.querySelector('#card-details');

			this.transactionDetails = this.shadowRoot.querySelector('#transaction-details');
			this.transactionCarousel = this.shadowRoot.querySelector('#transaction-details > x-carousel');

			// add event listeners for PolymerGestures
			events.forEach(function(en) {
				PolymerGestures.addEventListener(_self.cardCarousel, en, function(ev) {
					_self.handleCardCarouselGesture.call(_self, ev);
				});
			});

			events.forEach(function(en) {
				PolymerGestures.addEventListener(_self.transactionDetails, en, function(ev) {
					_self.handletransactionDetailsGesture.call(_self, ev);
				});
			});

			_self.addEventListener('carousel-item-transitionend', _self.carouselItemTransitionend, false);

		},

		carouselItemTransitionend: function(ev){			
			// update delayedAccountCarouselIdx after animations

			var src = ev.detail.node;

			if(src.parentElement.parentElement.id === "card-carousel" && ev.detail.state === "enter"){
				this.delayedAccountCarouselIdx = this.cardCarouselIdx;
				//console.log(ev.type, ev.detail);
			}
		},

		handleCardCarouselGesture: function(ev) {

			//console.log(ev.type);
			switch(ev.type) {
				case 'tap': 

					var item = ev.target.parentElement.parentElement,
						itemIsActive = item.attributes.hasOwnProperty('active');

					// flip item if current active card
					if (itemIsActive){
						// trigger flip card

						var flipcard = 	ev.target.parentElement
										.shadowRoot.querySelector('fix-aspect-ratio')
										.querySelector('flip-card');

						var cabinet  =	this.cardDetails.querySelectorAll('x-cabinet')[this.accountDetailCarouselIdx];

						cabinet.selected = flipcard.flipped ? 0 : 1;

						flipcard.toggleFlip(ev);

					} 

					// test which side of screen was tapped and scroll carousel
					else {
						((screen.width / 2) - ev.x >= 0) ?
							this.prev():
							this.next();
					}

					break;
				case 'trackstart':
					break;
				case 'trackend':

					if (Math.abs(ev.dx) > Math.abs(ev.dy)){
						//console.log((ev.dx < 0 ? "LEFT" : "RIGHT") + ' : ' + Math.abs(ev.dx));
						ev.dx < 0 ? 
							this.next():
							this.prev();

					} else {
						//console.log((ev.dy < 0 ? "UP" : "DOWN") + ' : ' + Math.abs(ev.dy));
					}

					ev.preventTap();

					break;
				
			}

		},

		handletransactionDetailsGesture: function(ev) {

			//console.log(ev.type);
			switch(ev.type) {
				case 'trackend':

					if (Math.abs(ev.dx) > Math.abs(ev.dy)){
						console.log((ev.dx < 0 ? "LEFT" : "RIGHT") + ' : ' + Math.abs(ev.dx));
					} else {
						console.log((ev.dy < 0 ? "UP" : "DOWN") + ' : ' + Math.abs(ev.dy));
						ev.dy < 0 ? 
							this.maximiseTransactions():
							this.minimiseTransactions();

					}

					ev.preventTap();

					break;
				
			}

		},

		next: function(){
			this.cardCarousel.next();
			this.transactionCarousel.next();
		},
		prev: function(){
			this.cardCarousel.prev();
			this.transactionCarousel.prev();
		},

		maximiseTransactions: function(){
			this.cardCarouselContainer.classList.add('docToTop');
			this.transactionDetails.classList.add('maximise');

			var cabinet = this.cardDetails.querySelectorAll('x-cabinet')[this.accountDetailCarouselIdx];
			cabinet.selected = 2;
			cabinet.isOpen = true;
		},
		minimiseTransactions: function(){
			this.cardCarouselContainer.classList.remove('docToTop');
			this.transactionDetails.classList.remove('maximise');

			var cabinet = this.cardDetails.querySelectorAll('x-cabinet')[this.accountDetailCarouselIdx];
			cabinet.selected = 0;
			cabinet.isOpen = true;
		},

		delayedAccountCarouselIdxChanged: function(oldVal, newVal){
			this.classList.remove(this.account[oldVal].bgColor);
			this.classList.add(this.account[newVal].bgColor);
		}

	});

})();