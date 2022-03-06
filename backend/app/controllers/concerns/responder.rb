# frozen_string_literal: true

module Responder
  private

  def respond_with(resource, _opts = {})
    if resource.is_a?(Hash) then super
    elsif resource.errors.present? then render json: error_message, status: :unprocessable_entity
    else
      render json: user_params(resource)
    end
  end

  def error_message
    { errors: resource.errors.full_messages }
  end

  def user_params(user)
    { wallet_address: user.wallet_address }
  end
end
