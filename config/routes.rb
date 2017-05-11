Rails.application.routes.draw do
  get '/payment' => 'payment#show'
  get '/client_token' => 'payment#generate_token'
  post '/checkout' => 'payment#checkout'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
