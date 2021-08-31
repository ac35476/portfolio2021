/*
Name: 			Theme Base
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version:	1.1.0
*/

// Theme
(function( $ ) {

	'use strict';

	window.theme = {};

	// Theme Common Functions
	window.theme.fn = {

		getOptions: function(opts) {

			if (typeof(opts) == 'object') {

				return opts;

			} else if (typeof(opts) == 'string') {

				try {
					return JSON.parse(opts.replace(/'/g,'"').replace(';',''));
				} catch(e) {
					return {};
				}

			} else {

				return {};

			}

		},

		getOptionsSemicolon: function(opts) {

			if (typeof(opts) == 'object') {

				return opts;

			} else if (typeof(opts) == 'string') {

				try {
					return JSON.parse(opts.replace(/'/g,'"'));
				} catch(e) {
					return {};
				}

			} else {

				return {};

			}

		}

	};

}).apply( this, [ jQuery ]);


// Carousel
(function(theme, $) {

	'use strict';

	theme = theme || {};

	var instanceName = '__carousel';

	var PluginCarousel = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginCarousel.defaults = {
		loop: true,
		responsive: {
			0: {
				items: 1
			},
			575: {
				items: 1
			},
			767: {
				items: 2
			},
			991: {
				items: 3
			},
			1199: {
				items: 4
			}
		},
		navText: [],
		clonePrevNext: false,
		vertical: false,
		rewind: false
	};

	PluginCarousel.prototype = {
		initialize: function($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginCarousel.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {
			if (!($.isFunction($.fn.owlCarousel))) {
				return this;
			}

			var self = this,
				$el = this.options.wrapper;

			// Add Theme Class
			$el.addClass('owl-theme');

			// Force RTL according to HTML dir attribute
			if ($('html').attr('dir') == 'rtl') {
				this.options = $.extend(true, {}, this.options, {
					rtl: true
				});
			}

			if (this.options.items == 1) {
				this.options.responsive = {}
			}

			// Auto Height Fixes
			if (this.options.autoHeight) {
				var itemsHeight = [];

				$el.find('.owl-item').each(function(){
					if( $(this).hasClass('active') ) {
						itemsHeight.push( $(this).height() );
					}
				});

				$(window).afterResize(function() {
					$el.find('.owl-stage-outer').height( Math.max.apply(null, itemsHeight) );
				});

				$(window).on('load', function() {
					$el.find('.owl-stage-outer').height( Math.max.apply(null, itemsHeight) );
				});
			}

			// Initialize OwlCarousel
			$el.owlCarousel(this.options).addClass('owl-carousel-init');

			// Carousel Corner Left Bottom Style
			if( $('.carousel-corner-left-bottom').get(0) ) {
				$('.carousel-corner-left-bottom').on('drag.owl.carousel change.owl.carousel', function(e){
					$(this).find('.owl-item').addClass('changing');
				});

				$('.carousel-corner-left-bottom').on('changed.owl.carousel', function(e){
					setTimeout(function(){
						$('.carousel-corner-left-bottom').find('.owl-item').removeClass('changing');
					}, 500);
				});
			}

			// Carousel Center Active Items Style
			if( $el.hasClass('carousel-center-active-items') ) {
				var itemsActive    = $el.find('.owl-item.active'),
					indexCenter    = Math.floor( ($el.find('.owl-item.active').length - 1) / 2 ),
					itemCenter     = itemsActive.eq(indexCenter),
					itemCenterPrev = itemCenter.prev(),
					itemCenterNext = itemCenter.next();

				itemCenter.addClass('current');
				itemCenterPrev.addClass('remove-blur');
				itemCenterNext.addClass('remove-blur');

				$el.on('change.owl.carousel', function(event) {
				  	$el.find('.owl-item').removeClass('current');
					
					setTimeout(function(){
					  	var itemsActive    = $el.find('.owl-item.active'),
					  		itemCenter     = itemsActive.eq(indexCenter);

					  	itemCenter.addClass('current');

						// Add blur effect for first and last active items
					  	itemsActive.first().removeClass('remove-blur');
						itemsActive.last().removeClass('remove-blur');

					  	// Remove blur effect for elements at right and left of current item
					  	itemCenter.prev().addClass('remove-blur');
						itemCenter.next().addClass('remove-blur');

					}, 100);
				});

				$el.on('resized.owl.carousel', function(event) {
					if( $el.find('.owl-item.active').length == 1 ) {
						$el
							.css({
								width: '100%'
							})
							.addClass('rm-degrade-now');
					} else {
						$el
							.css({
								width: ''
							})
							.removeClass('rm-degrade-now');
					}

					$el.trigger('refresh.owl.carousel');
				});

				// Refresh
				$el.trigger('refresh.owl.carousel');
			}

			// Clone Prev Next
			if (this.options.clonePrevNext) {
				$el.find('.owl-item').each(function() {
					$(this).prev().find('div:not(.clone-inside)').clone().addClass('clone-inside prev').prependTo($(this));
					$(this).next().find('div:not(.clone-inside)').clone().addClass('clone-inside next').appendTo($(this));
				});

				$el.on('change.owl.carousel', function(){
					$el.find('.owl-item.active div:not(.prev)').css('opacity', 0);
				});

				$el.on('changed.owl.carousel', function(){
					$el.find('.owl-item').one('animationend', function(){
						$el.find('.owl-item div:not(.prev)').css('opacity', 1);
						$el.find('.owl-item.cloned div:not(.prev)').css('opacity', 0);
						$el.find('.owl-item.active div:not(.prev)').css('opacity', 1);
					});
						
				});

				$el.on('drag.owl.carousel', function(){
					$el.find('.owl-item div:not(.prev)').css('opacity', 1);
				});
			}

			return this;
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginCarousel: PluginCarousel
	});

	// jquery plugin
	$.fn.themePluginCarousel = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginCarousel($this, opts);
			}

		});
	}

}).apply(this, [window.theme, jQuery]);











// Carousel +theme.init.js


(function($) {

	'use strict';

	if ($.isFunction($.fn['themePluginCarousel'])) {

		$(function() {
			$('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual):not(.owl)').each(function() {
				var $this = $(this),
					opts;

				var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
				if (pluginOptions)
					opts = pluginOptions;

				$this.themePluginCarousel(opts);
			});
		});

	}

}).apply(this, [jQuery]);






