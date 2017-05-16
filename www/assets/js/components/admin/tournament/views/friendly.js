define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:liguilla' );
  
  // Module dependencies
  var _                 = require( 'underscore' );
  var Valkie            = require( 'valkie' );
  var FriendlyCell         = require( './matchCellFriendly' );
  var NewFriendlyForm      = require( './newMatchFriendly' );
  var FriendlyResultsForm  = require( './matchResultsFinal' ); //./matchResultsFriendly
  var FriendlyModel        = require( 'models/friendly' );
  var utils             = require( 'helpers/utils' );
  
  var $  = require( 'jquery' );
  

  // View definition
  var TournamentCalendar = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/friendly.hbs' ) ),
    childView: FriendlyCell,
    childViewContainer: 'div.matches-list',
    childViewOptions: { },
    
    ui: {
      'createBtn'  : 'button.create'
    },
    
    events: {
      'click @ui.createBtn'    : 'newFriendly'
    },
    
    childEvents: {
      'details:edit'   : 'editMatch',
      'details:result' : 'captureResults'
    },

    newFriendly : function(){
      var tournament = this.options.item;
      var teams = _.filter( tournament.get( 'participants' ), function( item ) {
        return item.team !== null;
      });
      
      var match = new FriendlyModel();
      match.set( 'league', tournament.get( 'league' ) );
      match.set( 'tournament', tournament.id );
      var form  = new NewFriendlyForm({
        teams   : teams,
        model   : match
      });

      var self = this;
      form.on( 'submit', function( model ) {
        model.save(null, {
          wait: true,
          error: function( savedModel, response, options ) {
            model._notifyError( response.responseJSON );
            model.fetch( { async: true } );
           
          },
          success: function( savedModel, response, options) {
            model._notifySuccess( 'MATCH_UPDATED' );

            var collection = model.collection;

            //collection.add( savedModel );
            //collection.sort();
            self.trigger( 'reset' );

          }
        });
      }, this );
      
      // Show form on modal
      this.trigger( 'show:modal', form );
    },
    
    editMatch: function( cell ) {
      debug( 'edit existing match record' );
      // Get teams registered on the tournament
      var tournament = this.options.item;
      var teams = _.filter( tournament.get( 'participants' ), function( item ) {
        return item.team !== null;
      });
      
      // Confir match form
      var form  = new NewFriendlyForm({
        edit    : true,
        teams   : teams,
        model   : cell.model
      });

      var self = this;
      form.on( 'submit', function( model ) {
        model.save(null, {
          wait: true,
          error: function( savedModel, response, options ) {
            model._notifyError( response.responseJSON );
            model.fetch( { async: true } );
           
          },
          success: function( savedModel, response, options) {
            model._notifySuccess( 'MATCH_UPDATED' );

            var collection = model.collection;
            var index      = collection.indexOf( model );

            // Updating and sorting the collection.
            collection.remove( model );
            collection.add( savedModel, { at: index } );
            //collection.sort();

          }
        });
      }, this );
      
      // Show form on modal
      this.trigger( 'show:modal', form );
    },
    
    captureResults: function( cell ) {
      var form = new FriendlyResultsForm({ match: cell.model });
      form.on( 'done', function() {
        this.trigger( 'reset' );
        //console.log('cell.model',cell.model);
       
      }, this );
      this.trigger( 'show:subview', form );
    },

    onRender: function() {
      debug( 'rendered' );
     
      this.bindUIElements();

    },    
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
       
    },
    
    onShow: function() {
      debug( 'displayed' );
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = TournamentCalendar;
});
