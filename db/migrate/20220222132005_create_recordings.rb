class CreateRecordings < ActiveRecord::Migration[6.1]
  def change
    create_table :recordings do |t|
      t.string :vocal_style, null: false
      t.string :example_vocal
      t.string :instruments

      t.timestamps
    end
      add_index :recordings, :vocal_style, unique: true
      add_index :recordings, :example_vocal, unique: true
      add_index :recordings, :instruments, unique: true
  end
end
