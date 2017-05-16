define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:calendar' );
  
  // Module dependencies
  var _                 = require( 'underscore' );
  var Valkie            = require( 'valkie' );
  var MatchCell         = require( './matchCell' );
  var NewMatchForm      = require( './newMatch' );
  var NewSeasonForm     = require( './newSeason' );
  var MatchResultsForm  = require( './matchResults' );
  var MatchModel        = require( 'models/match' );
  var utils             = require( 'helpers/utils' );
  
  // View definition
  var TournamentCalendar = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/calendar.hbs' ) ),
    childView: MatchCell,
    childViewContainer: 'div.matches-list',
    childViewOptions: {},
    
    ui: {
      'createBtn'  : 'button.create',
      'addSeasonBtn' : 'button.jornada',
      'dateFilter' : 'select[name="jornada"]'
    },
    
    events: {
      'click @ui.createBtn'    : 'newMatch',
      'click @ui.addSeasonBtn' : 'newSeason',
      'change @ui.dateFilter'  : 'filter'
    },
    
    childEvents: {
      'details:edit'   : 'editMatch',
      'details:result' : 'captureResults'
    },
    
    fillDateSelector: function() {
      debug( 'update date list' );
      this.ui.dateFilter.html( '' );
      this.ui.dateFilter.append( '<option value="*">Jornadas</option>' );
      
      _.each( this.options.item.get( 'extras' )['seasons'], function( el, i ) {
        var option;
        if (el.endDate) {
          option = '<option value="' + el.startDate + ';' + el.endDate + '">Jornada ' + ( i + 1 ) + '</option>';
        } else {
          option = '<option value="' + el.startDate + '">Jornada ' + ( i + 1 ) + '</option>';
        }
        this.ui.dateFilter.append( option );
      }, this );
      
      if( this.filterValue ) {
        this.ui.dateFilter.val( this.filterValue );
      }
    },
    
    filter: function() {
      debug( 'filter the records displayed' );
      this.filterValue = this.ui.dateFilter.val();
      this.collection.clearFilter();

      if( this.filterValue !== '*' ) {
        var season = this.filterValue.split( ';' );

        var startDate = new Date( season[0] );
        var endDate = undefined;
        if ( season.length === 2 ) {
          endDate = new Date( season[1] );
        }

        this.collection.applyFilter( function( match ) {
          var date = new Date( match.get( 'date' ) );
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);

          var res = false;
          if ( !endDate ) {
            if ( startDate.getTime() === date.getTime() ) {
              res = true;
            }
          } else {
            if ( startDate <= date && date <= endDate ) {
              res = true;
            }
          }          
          
          return res;
        });
      }
    },
    
    newMatch: function() {
      debug( 'show new match form' );
      
      // Get teams registered on the tournament
      var tournament = this.options.item;
      var teams = _.filter( tournament.get( 'participants' ), function( item ) {
        return item.team !== null;
      });
      var seasons = tournament.get( 'extras' )['seasons'];
      if( ! seasons ) {
        seasons = [];
      }
      
      var match = new MatchModel();
      match.set( 'league', tournament.get( 'league' ) );
      match.set( 'tournament', tournament.id );
      var form  = new NewMatchForm({
        teams   : teams,
        seasons : seasons,
        model   : match
      });
      form.on( 'submit', function( model ) {
        // Save match record and add it to the collection if ok
        tournament.addMatch( model.toJSON(), function( item ) {
          if( item ) {
            utils.message( 'success', 'OK', 'CHANGES_STORED' );
            this.collection.add( item )
          }
        }, this );
      }, this );
      this.trigger( 'show:modal', form );
    },
    
    editMatch: function( cell ) {
      debug( 'edit existing match record' );
      // Get teams registered on the tournament
      var tournament = this.options.item;
      var teams = _.filter( tournament.get( 'participants' ), function( item ) {
        return item.team !== null;
      });
      var seasons = tournament.get( 'extras' )['seasons'];
      if( ! seasons ) {
        seasons = [];
      }
      
      // Confir match form
      var form  = new NewMatchForm({
        edit    : true,
        teams   : teams,
        seasons : seasons,
        model   : cell.model
      });

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
            collection.sort();
          }
        });
      }, this );
      
      // Show form on modal
      this.trigger( 'show:modal', form );
    },
    
    newSeason: function() {
      var tournament = this.options.item;
      var form = new NewSeasonForm( {
        seasons: tournament.get( 'extras' )['seasons']
      } );
      form.on( 'submit', function( startDate, endDate ) {

        // Get existing seasons if any
        var seasons = tournament.get( 'extras' )['seasons'];
        if( ! seasons ) {
          seasons = [];
        }

        // Add new one and store it on the server
        seasons.push( {
          startDate : startDate,
          endDate   : endDate
        } );

        var extras = tournament.get( 'extras' );
        extras.seasons = seasons;

        tournament.save( null, {
          error: function() {
            utils.message( 'error', 'ERROR', 'ERROR_HAPPEND' );
          },
          success:function() {
            utils.message( 'success', 'OK', 'CHANGES_STORED' );
          }
        });

        this.fillDateSelector();
      }, this );
      this.trigger( 'show:modal', form );
    },
    
    captureResults: function( cell ) {
      var form = new MatchResultsForm({ match: cell.model });
      form.on( 'done', function() {
        this.trigger( 'reset' )
      }, this );
      this.trigger( 'show:subview', form );
    },
    
    onRender: function() {
      debug( 'rendered' );
      this.bindUIElements();
      this.fillDateSelector();
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
