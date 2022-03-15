# frozen_string_literal: true

class RegistrationController < Devise::RegistrationsController
  def create
    render json: User.create!(registration_params)
  end

  private

  def registration_params
    resource_params.permit(:wallet_address)
  end
end

