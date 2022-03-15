# frozen_string_literal: true

require_relative '../../lib/devise/jwt/revocation_strategies/custom_matcher'

class User < ApplicationRecord
  devise(
    :database_authenticatable,
    :registerable,
    :recoverable,
    :rememberable,
    :validatable,
    :passwordless_authenticatable,
    :jwt_authenticatable,
    jwt_revocation_strategy: self
  )

  validates :wallet_address, presence: true

  include Devise::JWT::RevocationStrategies::CustomMatcher

  def email_required?
    false
  end

  def email_changed?
    false
  end

  def will_save_change_to_email?
    false
  end

  def password_required?
    false
  end
end
