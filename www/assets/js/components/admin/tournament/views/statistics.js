define( function( require, exports, module ) {
  'use strict';

  // Set debug ID
  var debug = require( 'debug' )( 'module:admin:tournament:views:statistics' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );

  var $  = require( 'jquery' );
  
  // View definition
  var TournamentStats = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/statistics.hbs' ) ),
    
    behaviors: {
      tooltip: {}
    },

    initialize: function( options ){
      this.typeView = 'gpo';
      this.userList = null;
      this.showSel = false;
    },

    userFill : function(){
      var userList = {};
      this.options.data.users.forEach(function(d){
        userList[d._id] = d.name + ' ' + d.lastnameFather + ' ' + d.lastnameMother;
      });
      this.userList = userList;
    },

    byPlayer :  function(){
      if (!this.userList) {
        this.userFill();
      }
     
      var userList = this.userList;
      var nobj = JSON.parse(JSON.stringify(this.options.data));
      nobj.goals = nobj.goals.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id];
        return i
      });
      
      this.setElement( Valkie.template( require( 'text!./templates/statByPlayer.hbs' ) )(nobj) );
      this.bindUIElements();
      return this;
    },

    byPasses :  function(){
      if (!this.userList) {
        this.userFill();
      }
     
      var userList = this.userList;
      var nobj = JSON.parse(JSON.stringify(this.options.data));
      nobj.passes = nobj.passes.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id];
        return i
      });
      
      this.setElement( Valkie.template( require( 'text!./templates/statByPasses.hbs' ) )(nobj) );
      this.bindUIElements();
      return this;
    },

    byFouls :  function(){
      if (!this.userList) {
        this.userFill();
      }
     
      var userList = this.userList;
      var nobj = JSON.parse(JSON.stringify(this.options.data));
      nobj.fouls = nobj.fouls.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id];
        return i
      });
      
      this.setElement( Valkie.template( require( 'text!./templates/statByFouls.hbs' ) )(nobj) );
      this.bindUIElements();
      return this;
    },

    byYells :  function(){
      if (!this.userList) {
        this.userFill();
      }
     
      var userList = this.userList;
      var nobj = JSON.parse(JSON.stringify(this.options.data));
      nobj.yells = nobj.yells.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id];
        return i
      });
      
      this.setElement( Valkie.template( require( 'text!./templates/statByYells.hbs' ) )(nobj) );
      this.bindUIElements();
      return this;
    },
    
    render: function() {
      debug( 'redering with data: %o', this.options.data );

      if (this.typeView === 'byPlayer') {
        return this.byPlayer();
      }

      if (this.typeView === 'byPasses') {
        return this.byPasses();
      }

      if (this.typeView === 'byFouls') {
        return this.byFouls();
      }

      if (this.typeView === 'byYells') {
        return this.byYells();
      }

      if (this.typeView === 'all'){
        this.options.data.table = this.options.data.table.map(function(i, x){
          i.cntr = x+1;
          return i
        });
        var nobj = JSON.parse(JSON.stringify(this.options.data))
        nobj.showSel = this.showSel;
        nobj.gposel = false;
        nobj.sHead = true;
        this.setElement( this.template( nobj ) );
        this.bindUIElements();
        return this;
      }

      //console.log('renderrr');

      // es por grupo entonces
      var tmp =  this.options.tournament.toJSON().participants;
      var dat = {};
      var tgpo = '';
      this.options.data.table.forEach(function(d){
        tmp.forEach(function(i){
          if (i.team){
            if(d.team._id === i.team._id){
              tgpo = i.group;
              if (!tgpo) tgpo = '00000__';
              if (!dat[tgpo]) dat[tgpo] = [];
              dat[tgpo].push(d);
            }
          }
        });
      });

      var res = {table : []};
      var tmp = Object.keys(dat);
      tmp.sort(function(a,b){return a.localeCompare(b); });
      tmp.forEach(function(d){
        if (d != '00000__') res.table.push({isheader : true, name : d});
        dat[d] = dat[d].map(function(i, x){
          i.cntr = x+1;
          return i
        });
        res.table = res.table.concat(dat[d]);
      });

      //console.log('res',res);
      this.showSel = res.showSel = tmp.length != 1;
      res.gposel = true;
      if (tmp.length > 1 && !dat['00000__']){
        res.sHead = false; 
      }else{
        res.sHead = true;
      }

      this.setElement( this.template( res ) );
      this.bindUIElements();
      return this;
      
    },
    
    onBeforeShow: function() {
      debug( 'about to be shown' );
      var self = this;
      $('[name="opsSel"]', this.$el).change(function(){
        self.typeView = this.value;
        self.$el.replaceWith(self.render().el);
        self.onBeforeShow();
      });
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
  module.exports = TournamentStats;
});