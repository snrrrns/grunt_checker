class AddVocalImageToRecordings < ActiveRecord::Migration[6.1]
  def change
    add_column :recordings, :vocal_image, :string
  end
end
