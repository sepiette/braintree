class PaymentController < ApplicationController
  skip_before_action :verify_authenticity_token
  def show

  end

  def checkout
    nonce_from_client = params[:payment_method_nonce]
  end

  def generate_token
    @client_token = Braintree::ClientToken.generate
    render :json => {'token': @client_token}
  end
end
