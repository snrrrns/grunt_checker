class AddEmotionToRecordings < ActiveRecord::Migration[6.1]
  def change
    add_column :recordings, :emotion, :integer, null: false, default: 0
  end
end
