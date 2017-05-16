define( function( require, exports, module ) {
  'use strict';
  
  // Module dependencies
  var moment = require( 'moment' );
  
  // Templete Helpers collection
  var TemplateHelpers = {
    // Format a given date string as a relative date from the
    // present time: 2 days ago
    // Usage: {{relativeDate dataString}}
    relativeDate: function( seed ) {
      var date = moment( seed );
      date.locale( 'es' );
      return date.fromNow() + ' ( ' + date.calendar() + ' )';
    },
    
    // Format a date string in a provided format
    // Usage: {{formatDate 'dddd, MMMM D' dataString}}
    formatDate: function( format, seed ) {
      var date = moment( seed );
      date.locale( 'es' );
      return date.format( format );
    },
    
    // Calculate date differences from the current date in a specific unit
    // Usage: {{dateFromNow 02-26-85 'years'}}
    dateFromNow: function( date, unit ) {
      var now  = moment();
      var test = new Date( date );
      return now.diff( test, unit );
    },
    
    // Format a date string to a maximum number of characters
    // Usage: {{maxChars 10 string}}
    maxChars: function( limit, string ) {
      if( string.length > limit ) {
        string = string.substr( 0, limit - 3 ) + '...';
      }
      return string;
    },
    
    // Perform simple math operations
    // Usage: {{math 1 '+' 1}}
    math: function( lvalue, operator, rvalue ) {
      lvalue = parseFloat( lvalue );
      rvalue = parseFloat( rvalue );
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
      }[operator];
    }
  };
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return Templete Helpers collection as module export
  module.exports = TemplateHelpers;
});