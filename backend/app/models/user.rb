# frozen_string_literal: true

require_relative '../../lib/devise/jwt/revocation_strategies/custom_jti_matcher'

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

  include Devise::JWT::RevocationStrategies::CustomJTIMatcher

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
