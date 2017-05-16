define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'module:site:league:views:tournamentStats' );
  
  // Module dependencies
  var Valkie = require( 'valkie' );
  
  // View definition
  var TournamentStatistics = Valkie.View.extend({
    template: Valkie.template( require( 'text!./templates/tournamentStats.hbs' ) ),
    
    initialize: function( options ){
      this.typeView = 'gpo';
      this.userList = null;
    },

    userFill : function(){
      var userList = {};
      this.options.stats.users.forEach(function(d){
        userList[d._id] = {name : d.name + ' ' + d.lastnameFather + ' ' + d.lastnameMother , url : d.url};
      });
      this.userList = userList;
    },

    byPlayer :  function(){
      if (!this.userList) {
        this.userFill();
      }
     
      var userList = this.userList;
      var nobj = JSON.parse(JSON.stringify(this.options.stats));
      nobj.goals = nobj.goals.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id].name; i.url = userList[i.id].url;
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
      var nobj = JSON.parse(JSON.stringify(this.options.stats));
      nobj.passes = nobj.passes.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id].name; i.url = userList[i.id].url;
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
      var nobj = JSON.parse(JSON.stringify(this.options.stats));
      nobj.fouls = nobj.fouls.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id].name; i.url = userList[i.id].url;
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
      var nobj = JSON.parse(JSON.stringify(this.options.stats));
      nobj.yells = nobj.yells.map(function(i, x){
        i.cntr = x+1;
        i.name = userList[i.id].name; i.url = userList[i.id].url;
        return i
      });
      
      this.setElement( Valkie.template( require( 'text!./templates/statByYells.hbs' ) )(nobj) );
      this.bindUIElements();
      return this;
    },

    render: function() {
      debug( 'render' );
     
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
        this.options.stats.table = this.options.stats.table.map(function(i, x){
          i.cntr = x+1;
          return i
        });
        var nobj = JSON.parse(JSON.stringify(this.options.stats))
        nobj.showSel = true;
        nobj.gposel = false;
        nobj.sHead = true;
        this.setElement( this.template( nobj ) );
        this.bindUIElements();
        return this;
      }

      // es por grupo entonces
      var tmp =  this.options.tournament.toJSON().participants;
      var dat = {};
      var tgpo = '';
      this.options.stats.table.forEach(function(d){
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
      this.showSel = tmp.length != 1;
      
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
      
      // if (!this.showSel) {
        
      //   $('[name="opsSel"]').remove();
      //   return;
      // }
      var self = this;
      var $tmp = $('<select name="opsSel" style="margin-left : 3px;height: 24px;padding: 5px 20px 5px 8px;font-size: 10px;"><option value="all">General</option>' + (this.showSel ? '<option value="gpo" selected="selected">Por Grupo</option>' : '') + '<option value="byPlayer" >Goleadores</option><option value="byPasses">Pases</option><option value="byFouls">Expulsiones</option><option value="byYells">Amonestaciones</option></select>')
      .change(function(){
        self.typeView = this.value;
        self.$el.replaceWith(self.render().el);
          //self.onBeforeShow();
      });
      $('<div class="actions" />').append($tmp)
      .appendTo($('#leagueMatchesList').prev());
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
  module.exports = TournamentStatistics;
});