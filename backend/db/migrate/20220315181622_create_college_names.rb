# frozen_string_literal: true

# Create Profile table
class CreateCollegeNames < ActiveRecord::Migration[6.1]
  def change
    create_table :college_names do |t|
      t.string :description
      t.string :address
      t.string :email
      t.string :country
      t.string :date_of_establishment

      t.timestamps
    end
  end
end
