braintree = require('braintree-web');

var requestClientToken = function () {
  return $.ajax({
    url: '/client_token',
    method: 'GET'
  })
}

var createClientGateway = function() {
  
  requestClientToken().done(function(response) {
    
    braintree.client.create({
      authorization: response.token
    }, function(clientErr, clientInstance) {
        if(clientErr){ throw new Error(clientErr); }

        console.log(clientInstance);
        makePaymentRequest(clientInstance);

      });
  });
}

var makePaymentRequest = function(clientInstance) {
  var data = {
    creditCard: {
      number: $('#cc-number')[0].value,
      cvv: $('#cvv')[0].value,
      expirationDate: $('#expiration-date')[0].value,
      options: {
        validate: false
      }
    }
  };
  clientInstance.request({
      endpoint: 'payment_methods/credit_cards',
      method: 'post',
      data: data
    }, function (requestErr, response) {
        if (requestErr) { throw new Error(requestErr); }

        console.log('Got nonce:', response.creditCards[0].nonce);
        completeTransaction(response.creditCards[0].nonce);
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
    console.log(err);
   });
}

$(document).ready(function(){
  $('#checkout-form').on('submit', createClientGateway);
});