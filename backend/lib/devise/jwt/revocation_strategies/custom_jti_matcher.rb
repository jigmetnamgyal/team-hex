# frozen_string_literal: true

require 'active_support/concern'

module Devise
  module JWT
    module RevocationStrategies
      # This strategy must be included in the user model, and requires that it
      # has a `jti` column. It adds the value of the `jti` column as the `jti`
      # claim in dispatched tokens.
      #
      # In order to tell whether a token is revoked, it just compares both `jti`
      # values. On revocation, it changes column value so that the token is no
      # longer valid.
      module CustomJTIMatcher
        extend ActiveSupport::Concern

        included do
          before_create :initialize_jti

          # @see Warden::JWTAuth::Interfaces::RevocationStrategy#jwt_revoked?
          def self.jwt_revoked?(_payload, user) # rubocop:disable Metrics/MethodLength
          end

          # @see Warden::JWTAuth::Interfaces::RevocationStrategy#revoke_jwt
          def self.revoke_jwt(_payload, user)
            user.update_column(:jti, SecureRandom.uuid)
          end
        end

        # Warden::JWTAuth::Interfaces::User#jwt_payload
        def jwt_payload
          { 'jti' => jti }
        end

        private

        def initialize_jti
          binding.pry
          self.jti = signature
        end
      end
    end
  end
end
