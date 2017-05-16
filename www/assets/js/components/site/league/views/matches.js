define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:matches' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  var MatchCell  = require( './matchCell' );

  var $  = require( 'jquery' );
  
  // View definition
  var LeagueMatches = Valkie.CompositeView.extend({
    template: Valkie.template( require( 'text!./templates/matches.hbs' ) ),
    childView: MatchCell,
    childViewContainer: 'div.matches-list',

    initialize: function( options ){
      
      var now   = new Date();
      var today = '';
          today += now.getMonth() + 1;
          today += '/' + now.getDate(); 
          today += '/' +  now.getFullYear();
      if (this.collection.find(function( match ) {
              var date = new Date( match.get( 'date' ) );
              var res  = false;
              var test = '';
              test += date.getMonth() + 1;
              test += '/' + date.getDate(); 
              test += '/' +  date.getFullYear();
              if( today == test ) {
                res = true;
              }
              
              return res;
            })) {
        this.typeView = 'today';
      }else{
        this.typeView = 'next';
      }
    },
    
    onRender: function() {
      debug( 'rendered' );
      this.bindUIElements();
    },

    filterList :  function(){
      this.collection.clearFilter();
      var now   = new Date();
      var limit = new Date();
      //var today = '';

      if (this.typeView === 'next'){
        limit.setDate(limit.getDate()+7);
        //now.setDate(now.getDate()+1);
        now.setHours(23,59,59,0);
        this.collection.applyFilter( function( match ) {
          var date = new Date( match.get( 'date' ) );
          var res  = false;
          
          if( date >= now && date <= limit ) { //if( today == test ) {
            res = true;
          }
          
          return res;
        });

        this.collection.comparator = function(model) {
          return (new Date(model.get('date'))).getTime();
        }
        this.collection.sort();
        return;
      }

      if (this.typeView === 'prev'){
        limit.setDate(limit.getDate()-7);
        //now.setDate(now.getDate()-1);
        now.setHours(0,0,0,0);
        this.collection.applyFilter( function( match ) {
          var date = new Date( match.get( 'date' ) );
          var res  = false;
          
          if( date <= now && date >= limit ) { //if( today == test ) {
            res = true;
          }
          
          return res;
        });

        this.collection.comparator = function(model) {
          return -(new Date(model.get('date'))).getTime();
        }
        this.collection.sort();

        return;
      }

      if (this.typeView === 'today') {
          var today = '';
          today += now.getMonth() + 1;
          today += '/' + now.getDate(); 
          today += '/' +  now.getFullYear();
          this.collection.applyFilter( function( match ) {
            var date = new Date( match.get( 'date' ) );
            var res  = false;
            var test = '';
            test += date.getMonth() + 1;
            test += '/' + date.getDate(); 
            test += '/' +  date.getFullYear();
            if( today == test ) {
              res = true;
            }
            
            return res;
          });
          
      }
      
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      
      // Filter matches shown for today
     this.filterList();
    },
    
    onShow: function() {
      debug( 'displayed' );
      var self = this;
      setTimeout(function(){
        $('#viewMatchesSel').removeAttr('disabled').val(self.typeView).change(function(){
          self.typeView = this.value;
          self.filterList();
        });
      },1000)
    }
  });
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return view definition as module export
  module.exports = LeagueMatches;
});