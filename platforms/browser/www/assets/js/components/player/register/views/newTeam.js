define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug  = require( 'debug' )( 'module:player:register:views:newTeam' );
  
  // Module dependencies
  var _      = require( 'underscore' );
  var Valkie = require( 'valkie' );
  
  // View definition
  var NewTeamView = Valkie.ItemView.extend({
    template: Valkie.template( require( 'text!./templates/newTeam.hbs' ) ),
    
    behaviors: {
      'modal': {},
      'tooltip': {},
      'validator': {
        successHandler: 'submit'
      }
    },
    
    events: {
      'keyup @ui.name' : 'updateDefaultURL',
      'blur @ui.name'  : 'validateURL',
      'blur @ui.url'   : 'validateURL'
    },
    
    ui: {
      'form' : 'form',
      'name' : 'input[name=name]',
      'url'  : 'input[name=url]',
      'submit' : 'input[name=submit-team]'  
    },

    initialize: function (options) {
      this.user = options.user;
    },
    
    render: function() {
      this.setElement( this.template() );
      this.bindUIElements();
      return this;
    },

    onBeforeShow: function () {
      debug('on before show');

      // Prevent close if its necessary (means that the user dont
      // have created a team)
      this.$el.on('hide.bs.modal', _.bind( function (event) {
        if (this.user.get('teams').length === 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, this ));
    },
    
    submit: function() {
      debug( 'submit form with name: %s', this.ui.name.val() );
      
      var data = {
        name: this.ui.name.val(),
        url: this.ui.url.val()
      };
      
      this.trigger( 'submit', data, this );
    },
    
    updateDefaultURL: function() {
      // Get safe version of the url value
      var safe = this.ui.name.val()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
        
      this.ui.url.val( safe );
    },
    
    validateURL: function() {
      debug( 'check if url is available' );
      
      // If field is empty stop there
      if( this.ui.url.val() === '' )
        return;
      
      // Get safe version of the url value
      var test = this.ui.url.val()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
        
      // Update field and check availability
      this.ui.url.val( test );
      this.model.isAvailable( { url: test }, function( available ) {
        this.ui.url
          .removeClass( 'validator-error' )
          .removeAttr( 'data-validator-error' );
          
        if( ! available ) {
          this.ui.url
            .addClass( 'validator-error' )
            .attr( 'data-validator-error', 'URL no disponible' );
          this.ui.submit
            .attr( 'disabled' , 'disabled' )
        } else {
          this.ui.submit
            .removeAttr('disabled');
        }
      }, this );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = NewTeamView;
});