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
      console.err(err);
      return;
    }
    console.log(payload);
    completeTransaction(payload.nonce);

  });  
}

var createHostedFields = function(clientInstance) {
  braintree.hostedFields.create({
    client: clientInstance,
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
   $.ajax({
      url: '/checkout',
      method: 'POST',
      data: {
        payment_method_nonce: nonce
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