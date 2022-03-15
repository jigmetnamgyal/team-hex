# frozen_string_literal: true

require 'active_support/concern'

module Devise
  module JWT
    module RevocationStrategies
      # This custom revocation strategies works as follows:
      # The payload received is sent to a serverless function that returns a boolean
      # If false jwt is not revoked and user is allowed to perform the action in BE
      # If true jwt is revoked and user is unauthorized to perform action

      module CustomMatcher
        extend ActiveSupport::Concern

        included do
          # @see Warden::JWTAuth::Interfaces::RevocationStrategy#jwt_revoked?
          def self.jwt_revoked?(payload, _) # rubocop:disable Metrics/MethodLength
            uri = URI('https://team-hex.vercel.app/api/verify/signature')
            http = Net::HTTP.new(uri.host, uri.port)
            http.use_ssl = true

            request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
            request.body = {
              "nonce": payload['nonce'],
              "signature": payload['signature'],
              "wallet_address": payload['wallet_address']
            }.to_json

            response = http.request(request)
            !JSON.parse(response.body)
          end

          def self.generate_random_token
            SecureRandom.uuid
          end
        end

        # Warden::JWTAuth::Interfaces::User#jwt_payload
        def jwt_payload
          { 'token' => generate_token }
        end

        private

        def generate_token
          self.class.generate_random_token
        end
      end
    end
  end
end
