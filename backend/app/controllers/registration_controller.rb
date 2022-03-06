# frozen_string_literal: true

class RegistrationController < Devise::RegistrationsController
  def create
    render json: User.create!(registration_params.merge(signature: request.headers['signature']))
  end

  private

  def registration_params
    resource_params.permit(:wallet_address)
  end
end

