require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Braintree
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.assets.paths << Rails.root.join('node_modules')

    # By default only files in /app and /node_modules are browserified,
    # vendor stuff is normally not made for browserification and may stop
    # working.
    config.browserify_rails.paths << /vendor\/assets\/javascripts\/module\.js/


    system 'npm install' if Rails.env.development? || Rails.env.test?
  end
end
