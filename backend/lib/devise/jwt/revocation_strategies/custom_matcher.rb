# frozen_string_literal: true

require 'active_support/concern'

module Devise
  module JWT
    module RevocationStrategies
      module CustomMatcher
        extend ActiveSupport::Concern

        included do
          before_create :initialize_token

          # @see Warden::JWTAuth::Interfaces::RevocationStrategy#jwt_revoked?
          def self.jwt_revoked?(payload, _) # rubocop:disable Metrics/MethodLength
            uri = URI('https://team-hex.vercel.app/api/verify/signature')
            http = Net::HTTP.new(uri.host, uri.port)
            http.use_ssl = true

            request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
            request.body = {
              "nonce": payload['nonce'],
              "signature": payload['jti'],
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
