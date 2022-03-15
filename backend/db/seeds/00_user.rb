# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

test_user = User.find_or_initialize_by(wallet_address: '0xbD6e2111fa9ea5B70D9F2832925391031Ce275f4')
binding.pry;
test_user.update!(
  { wallet_address: '0xbD6e2111fa9ea5B70D9F2832925391031Ce275f4' }
)
p 'A User sample user have been seeded'
