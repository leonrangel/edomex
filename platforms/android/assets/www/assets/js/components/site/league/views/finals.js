define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:liguilla' );
  
  // Module dependencies
  var _                 = require( 'underscore' );
  var Valkie            = require( 'valkie' );
  var FinalCell         = require( './matchCellFinal' );
  //var NewFinalForm      = require( './newMatchFinal' );
  //var NewFinalsForm     = require( './newFinals' );
  //var FinalResultsForm  = require( './matchResultsFinal' );
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
      
      'dateFilter' : 'select[name="finals"]'
    },
    
    events: {
      
      'change @ui.dateFilter'  : 'filter'
    },
    

    syncHeader : function(){
      $('.headmatch', this.$el).remove();
      // if (!$('.match', this.$el).length) {
      //   $('.matches-list').append('<div>Aun no has creado una liguilla.</div>');
      //   return;
      // }
      
      $('.match', this.$el).each(function(){
        var $this = $(this);
        if (!$this.prev().is('.stage-'+$this.attr('data-stage')))
          $this.prepend('<div class="headmatch" style="height: 60px; background-color: #32B846; margin: -30px -30px 30px -30px; text-align: center; font-size: 16px; color :white;"><br>'+stages[parseInt($this.attr('data-stage'))]+'</div>');
      });
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
      $('#leagueFinalsList').show();
      }else{
        $('#leagueFinalsList').hide();
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
    
    onRender: function() {
      debug( 'rendered' );
     //console.log('creacdon!!!!!');
      this.bindUIElements();
      this.fillDateSelector();
      //this.filter();
      this.syncHeader();
    },    
    
    onBeforeShow: function() {
      debug( 'about to be shown' );

      //var tmp =  this.options.item.toJSON().participants;

      // $('.match', this.$el).each(function(){
      //   var $this = $(this);
      //   $this.prepend('<div class="info">'+stages[parseInt($this.attr('data-stage'))]+'</div>');

      // })
       
    },
    
    onShow: function() {
      debug( 'displayed' );
      this.ui.dateFilter.change();
      
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = TournamentCalendar;
});
