// jQuery plugin: accordion
// @author Ben Cessa <ben@pixative.com>

;(function( $ ){
  // Enable strict mode
  'use strict';
  
  // Namespace
  if( ! $.pixative ) {
    $.pixative = {};
  }
  
  // Object structure
  $.pixative.accordion = function( holder, options ) {
    // Self reference holder
    var self = this;
    
    // jQuery and DOM element references
    self.$el = $( holder );
    self.el  = holder;
    
    // Setup
    self.init = function() {
      // Extend default settings with passed in options
      self.settings = $.extend( true, $.pixative.accordion.defaults, options );
      
      // Get togglers and blocks of content
      self.togglers = self.$el.find( self.settings.toggler );
      self.blocks   = self.$el.find( self.settings.content );
      
      // Store original height and display of each content block, then hide them all
      
      // We're not using index but that's the function signature
      // jshint unused:false
      self.blocks.each( function( index, block ) {
        block = $( block );
        block.data( 'originalHeight', block.height() );
        block.data( 'originalDisplay', block.css( 'display' ) );
        block.css({
          opacity: 0,
          height: 0,
          display: 'none'
        });
      });
      
      // Set the open handler on each headers
      self.togglers.each( function( index, toggler ) {
        toggler = $( toggler );
        toggler.on( self.settings.openMethod, function( e ){
          // Prevent default behavior
          e.preventDefault();
          e.stopPropagation();
          
          // Open requested section
          self.open( index );
        });
      });
      
      // Open first block
      self.open( 0 );
    };
    
    // Open a section of the accordion
    self.open = function( index ) {
      // Get the item toggler and content block
      var openClass       = self.settings.openClass;
      var selectedToggler = $( self.togglers[ index ] );
      var selectedBlock   = $( self.blocks[ index ] );
      
      if( selectedToggler.hasClass( openClass ) ) {
        if( self.settings.allClosed ) {
          // Animate out
          selectedBlock.animate(
            { opacity: 0, height: 0 },
            self.settings.animationSpeed,
            self.settings.animationMode,
            function() {
              selectedBlock.css( 'display', 'none' ).removeClass( openClass );
              selectedToggler.removeClass( openClass );
          });
        }
        
        // Exit
        return;
      }
      
      // Close any opened block
      var openTogglers = self.togglers.filter( '.' + openClass );
      if( openTogglers.length > 0 ) {
        openTogglers.removeClass( openClass );
        var openBlock = self.blocks.filter( '.' + openClass );
        openBlock.animate(
          { opacity: 0, height: 0 },
          self.settings.animationSpeed,
          self.settings.animationMode,
          function(){
            openBlock.css( 'display', 'none' ).removeClass( openClass );
        });
      }
      
      // Open the selected one
      selectedToggler.addClass( openClass );
      selectedBlock.addClass( openClass )
        // Set the display value back to the original
        .css( 'display', selectedBlock.data( 'originalDisplay' ) )
        // Animate the element in
        .animate(
          { opacity: 1, height: selectedBlock.data( 'originalHeight' ) },
          self.settings.animationSpeed,
          self.settings.animationMode
        );
      
      // Trigger custom event as notification
      self.$el.trigger({
        type: 'accordion.section.open',
        section: index
      });
    };
    
    // Self initialize
    self.init();
  };
  
  // Default settings
  $.pixative.accordion.defaults = {
    toggler: 'h3.accordion-header',
    content: 'div.accordion-content',
    animationSpeed: 400,
    animationMode: 'swing',
    openMethod: 'click',
    openClass: 'open',
    allClosed: false
  };
  
  // Plugin wrapper
  // To allow calling of the functionality as:
  // $( 'selector' ).pixativeAccordion( ... );
  $.fn.pixativeAccordion = function( options ) {
    // jshint nonew:false
    // This is the recommended jQuery plugin structure
    return this.each( function() {
      ( new $.pixative.accordion( this, options ) );
    });
  };
})( jQuery );