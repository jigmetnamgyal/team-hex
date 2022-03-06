# frozen_string_literal: true

require 'devise/strategies/authenticatable'

module Devise
  module Strategies
    class PasswordlessAuthenticatable < Authenticatable
      def authenticate!
        user = User.find_by(wallet_address: params[:user][:wallet_address])

        user.present? ? success!(user) : fail!(:invalid)
      end
    end
  end
end

Warden::Strategies.add(:passwordless_authenticatable, Devise::Strategies::PasswordlessAuthenticatable)

