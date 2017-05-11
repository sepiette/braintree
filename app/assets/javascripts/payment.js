braintree = require('braintree-web');

var requestClientToken = function () {
  return $.ajax({
    url: '/client_token',
    method: 'GET'
  })
}

var makePaymentRequest = function() {
  
  requestClientToken().done(function(response) {
    
    braintree.client.create({
      authorization: response.token
    }, function(clientErr, clientInstance) {
        if(clientErr){
          console.log(clientErr);
          return;
        }
        console.log(clientInstance);
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
        });
      });
  });
}



$(document).ready(function(){
  $('#checkout-form').on('submit', makePaymentRequest);
});