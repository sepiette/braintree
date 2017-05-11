class PaymentController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show

  end

  def checkout
    nonce_from_client = params[:payment_method_nonce]
    result = Braintree::Transaction.sale(
          :amount => "10.00",
          :payment_method_nonce => 'fake-valid-nonce',
          :options => {
            :submit_for_settlement => true
          }
        )
    if(result.success?)
      @transaction = result.transaction
      render :json => {'transaction_status': @transaction.status, 'transaction_type': @transaction.payment_instrument_type}
    else
      @errors = result.errors
      render :json => {'errors': @errors}
      format.html { render :action => "show" }
    end

    
  end

  def generate_token
    @client_token = Braintree::ClientToken.generate
    render :json => {'token': @client_token}
  end
end
