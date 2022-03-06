# frozen_string_literal: true

class SessionController < Devise::SessionsController

  private

  def respond_to_on_destroy
    head :no_content
  end
end

