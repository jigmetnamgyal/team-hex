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
          # FIXME: What is the value of nonce ? Am I getting this from the FE?

          # @see Warden::JWTAuth::Interfaces::RevocationStrategy#jwt_revoked?
          def self.jwt_revoked?(payload, user) # rubocop:disable Metrics/MethodLength
            uri = URI('https://team-hex.vercel.app/api/verify/signature')
            http = Net::HTTP.new(uri.host, uri.port)
            http.use_ssl = true

            request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json' })
            request.body = {
              "nonce": {
                "message": "Team Hex dApp\n\n We authorize universities with verified kyc to mint and issue certificates seamlessly.\n  \n  Nonce: 0x8a37f988803d7ee6101ae21998f69618219c0ea622ba7342fae0bfde3cd314b8\n  ",
                "value": '0x5dC7e18022eec5b5f710cfb663088BCCCdB27fBb'
              },
              "signature": payload['jti'],
              "wallet_address": user.wallet_address
            }.to_json

            response = http.request(request)
            !JSON.parse(response.body)
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
          self.jti = signature
        end
      end
    end
  end
end
