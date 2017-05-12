var braintree = require('braintree-web');

var requestClientToken = function () {
  return $.ajax({
    url: '/client_token',
    method: 'GET'
  });
}
var createClientInstance = function() {
  requestClientToken().done(function(response) {
    braintree.client.create({
      authorization: response.token
    }, function(clientErr, clientInstance) {
        if(clientErr){ throw new Error(clientErr); }

        console.log(clientInstance);
        createHostedFields(clientInstance);
      });
  });
}

var processPayment = function(hostedFieldInstance) {
  // console.log(hostedFieldInstance.getState());
  hostedFieldInstance.tokenize(function (err, payload) {
    if(err){
      console.error(err);
      return;
    }
    console.log(payload);
    completeTransaction(payload.nonce);

  });  
}

var createHostedFields = function(clientInstance) {
  braintree.hostedFields.create({
    client: clientInstance,
    styles: {
      'input': {
        'color': '#282c37',
        'font-size': '16px',
        'transition': 'color 0.1s',
        'line-height': '3'
      },
      // Style the text of an invalid input
      'input.invalid': {
        'color': '#E53A40'
      },
      // placeholder styles need to be individually adjusted
      '::-webkit-input-placeholder': {
        'color': 'rgba(0,0,0,0.6)'
      },
      ':-moz-placeholder': {
        'color': 'rgba(0,0,0,0.6)'
      },
      '::-moz-placeholder': {
        'color': 'rgba(0,0,0,0.6)'
      },
      ':-ms-input-placeholder': {
        'color': 'rgba(0,0,0,0.6)'
      }
    },
    fields: {
      number: {
        selector: '#cc-number',
        placeholder: '1111 1111 1111 1111'
      },
      cvv: {
        selector: '#cvv',
        placeholder: '123'
      },
      expirationDate: {
        selector: '#expiration-date',
        placeholder: 'MM/YYYY'
      }
    }
  }, function(err, hostedFieldInstance) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(hostedFieldInstance);
      hostedFieldInstance;
      $('input[type="submit"]').click(function(e) {
        e.preventDefault();
        processPayment(hostedFieldInstance);
      })

  });
}

var completeTransaction = function(nonce) {
  var chargeAmount = $('#payment-amount')[0].value.toString();
   $.ajax({
      url: '/checkout',
      method: 'POST',
      data: {
        payment_method_nonce: nonce,
        payment_amount: chargeAmount
      },
      dataType: 'json'
    })
   .done(function(response) {
    console.log(response);
    $('body').append('<h2> Thank you. '+response.transaction_status+' </h2>');
   })
   .fail(function(err) {
    console.error(err);
   });
}

$(document).ready(function(){
  createClientInstance();
});