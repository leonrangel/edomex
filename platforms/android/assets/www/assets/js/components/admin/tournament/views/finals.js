define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:liguilla' );
  
  // Module dependencies
  var _                 = require( 'underscore' );
  var Valkie            = require( 'valkie' );
  var FinalCell         = require( './matchCellFinal' );
  var NewFinalForm      = require( './newMatchFinal' );
  var NewFinalsForm     = require( './newFinals' );
  var FinalResultsForm  = require( './matchResultsFinal' );
  var FinalModel        = require( 'models/final' );
  var utils             = require( 'helpers/utils' );
  
  var $  = require( 'jquery' );
  

  // names
  var stages = [
    'Final',
    'Tercer lugar',
    'Semifinal',
    'Cuartos de final',
    'Octavos de final',
    'Dieciseisavos de final '
  ];

  // View definition
  var TournamentCalendar = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/finals.hbs' ) ),
    childView: FinalCell,
    childViewContainer: 'div.matches-list',
    childViewOptions: { },
    
    ui: {
      'createBtn'  : 'button.create',
      'dateFilter' : 'select[name="finals"]'
    },
    
    events: {
      'click @ui.createBtn'    : 'newFinal',
      'change @ui.dateFilter'  : 'filter'
    },
    
    childEvents: {
      'details:edit'   : 'editMatch',
      'details:result' : 'captureResults'
    },

    syncHeader : function(){
      $('.headmatch', this.$el).remove();
      // if (!$('.match', this.$el).length) {
      //   $('.matches-list').append('<div>Aun no has creado una liguilla.</div>');
      //   return;
      // }

      //if ($('.matches-list:eq(0)').is(':empty')){
        //$('.matches-list').append('<div style="text-align: center;padding-top: 45px;font-size: 20px;font-weight: lighter;color: black;display: block;height: 100px;">aún no se crea liguilla</div>');
      //}
      
      $('.match', this.$el).each(function(){
        var $this = $(this);
        if (!$this.prev().is('.stage-'+$this.attr('data-stage')))
          $this.prepend('<div class="headmatch" style="height: 60px; background-color: #32B846; margin: -30px -30px 30px -30px; text-align: center; font-size: 16px; color :white;"><br>'+stages[parseInt($this.attr('data-stage'))]+'</div>');
      });
    },

    newFinal : function(){
      var form  = new NewFinalsForm({
        
      });
      var self = this;
      form.on( 'submit', function( model ) {
        $.get('https://www.somosfut.com/tournament/'+this.options.item.get('_id')+'/newfinals?l='+model, function(d){
          
          //console.log('d',d);
          self.trigger( 'reset' );
          //self.ui.dateFilter.append( '<option value="'+d.ops[0].noFinal+'">Liguilla '+(d.ops[0].noFinal+1)+'</option>' );
        });
      }, this );
      
      // Show form on modal
      this.trigger( 'show:modal', form );
    },
    
    fillDateSelector: function() {
      debug( 'update date list' );
      this.ui.dateFilter.html( '' );
      var self = this;
      var flist = this.options.item.get( 'finals' );
      //console.log('this.options.item',this.options.item.toJSON());
      //self.ui.dateFilter.append( '<option value="*">Todas</option>' );
      if (flist){
        if (Object.keys(flist).length > 1 ) self.ui.dateFilter.show();
        Object.keys(flist).sort(function(a,b){ return flist[a].noFinal - flist[b].noFinal;}).forEach(function(d, i){
          self.ui.dateFilter.append( '<option value="'+flist[d].noFinal+'">Liguilla '+(flist[d].noFinal+1)+'</option>' );
        });
      }
      
      

    },
    
    filter: function() {
      debug( 'filter the records displayed' );
      var fval = this.filterValue = this.ui.dateFilter.val();
      this.collection.clearFilter();

      if (fval === '*') {
        this.syncHeader();
        return;
      }
      fval = parseInt(fval);

      this.collection.applyFilter( function( match ) {
        return match.get('noFinal') ===  fval;
      });

      this.syncHeader();
    },
    
    editMatch: function( cell ) {
      debug( 'edit existing match record' );
      // Get teams registered on the tournament
      var tournament = this.options.item;
      var teams = _.filter( tournament.get( 'participants' ), function( item ) {
        return item.team !== null;
      });
      
      // Confir match form
      var form  = new NewFinalForm({
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

           
            self.syncHeader();

          }
        });
      }, this );
      
      // Show form on modal
      this.trigger( 'show:modal', form );
    },
    
    captureResults: function( cell ) {
      var form = new FinalResultsForm({ match: cell.model });
      form.on( 'done', function() {
        this.trigger( 'reset' );
        this.syncHeader();
        //console.log('cell.model',cell.model);
       
      }, this );
      this.trigger( 'show:subview', form );
    },

    onRender: function() {
      debug( 'rendered' );
      var flist = this.options.item.get( 'finals' );
      if (flist) {
         if (Object.keys(flist).length > 0 ) {
          this.collection.clearFilter();

          this.collection.applyFilter( function( match ) {
            //console.log('q pedo!!!!');
            return match.get('noFinal') ===  0;
          });
        }
      }
     
      this.bindUIElements();
      this.fillDateSelector();
      //this.filter();
      this.syncHeader();
    },    
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      var tmp =  this.options.item.toJSON().participants;

      // $('.match', this.$el).each(function(){
      //   var $this = $(this);
      //   $this.prepend('<div class="info">'+stages[parseInt($this.attr('data-stage'))]+'</div>');

      // })
       
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
