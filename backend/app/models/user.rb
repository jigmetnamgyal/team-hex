class User < ApplicationRecord
  devise(
    :database_authenticatable,
    :registerable,
    :recoverable,
    :rememberable,
    :validatable,
    :passwordless_authenticatable
  )

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
