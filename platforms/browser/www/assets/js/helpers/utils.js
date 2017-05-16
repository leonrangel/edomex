define( function( require, exports, module ) {
  'use strict';
  
  // Set debug ID
  var debug = require( 'debug' )( 'helpers:utils' );
  
  // Module dependencies
  require( 'ui.toaster' );
  var $ = require( 'jquery' );
  
  // Messages
  // This is not the best place for this but for the moment will do
  var msg = {
    CHANGES_STORED             : 'Los ajustes han sido registrados exitosamente',
    ERROR_HAPPEND              : 'Parece ser que un error ocurrio, intente más tarde',
    INVALID_CREDENTIALS        : 'Las credenciales proporcionadas no son válidas',
    DUPLICATED_EMAIL           : 'El email proporcionado ya se está siendo utilizado por otro usuario',
    UNVERIFIED_ACCOUNT         : 'Por favor valide la cuenta con el correo electronico enviado',
    SESSION_ENDED              : 'Sesión finalizada con éxito',
    USER_UPDATED               : 'Información del usuario actualizada con éxito',
    USER_DELETED               : 'El usuario ha sido elminado exitosamente',
    INVALID_VERIFICATION_TOKEN : 'Código de verificación invalido, vuelva a intentarlo',
    ACCOUNT_ALREADY_VERIFIED   : 'La cuenta ya ha sido verificada exitosamente',
    REQUEST_FAILED             : 'Error de comunicación con el servidor, por favor vuelva a intentarlo',
    ACCOUNT_VERIFIED           : 'La cuenta ha sido verificada con éxito',
    ACCOUNT_REGISTERED         : 'La cuenta ha sido registrada exitosamente',
    SESSION_STARTED            : 'Sesión iniciada exitosamente',
    TEAM_REGISTERED            : 'El equipo ha sido registrado exitosamente',
    TOURNAMENT_JOINED          : 'El equipo se unio al torneo',
    TEAM_JOINED                : 'Te has unido al equipo',
    TEAM_ALREADY_JOINED        : 'El equipo ya se unió al torneo',
    TEAM_INVITATION_SENDED     : 'Se invito a un jugador',
    INVALID_TEAMS_ID           : 'Los equipos son inválidos',
    MATCH_UPDATED              : 'El partido fue actualizado y reordenado',
    EMAIL_FACEBOOK_REQUIRED: 'Es necesario que nos compartas tu email de facebook para poder crear tu cuenta.',
    PASSWORD_REQUIRED: 'Contraseña requerida.'
  };
  
  // Utilities collection
  var utils = {
    // Generate a randome token
    makeToken: function( segments, size ) {
      // Default values
      if( ! segments ) segments = 2;
      if( ! size ) size = 4;
      
      var j = 0;
      var token = [];
      var seed  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      while( j < segments ) {
        token[j] = '';
        for( var i=0; i < size; i++ ) {
          token[j] += seed.charAt( Math.floor( Math.random() * seed.length ) );
        }
        j++;
      }
      
      return token.join( '-' );
    },
    
    // Display UI message
    message: function( type, title, content ) {
      // Is the message in the catalog
      if( msg[ content ] ) {
        content = msg[ content ];
      }
      
      debug( 'display %s message: %s', type, content );
      $.toaster({
        priority : type,
        title: title,
        message: content
      });
    }
  };
  
  // Simple exports check
  if( ! exports ) {
    exports = {};
  }
  
  // Return utils as module export
  module.exports = utils;
});
