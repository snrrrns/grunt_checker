class CreateResults < ActiveRecord::Migration[6.1]
  def change
    create_table :results do |t|
      t.references :recording, null: false, foreign_key: true
      t.string :uuid, null: false
      t.string :vocal_data
      t.string :compose_song
      t.string :score
      t.string :comment

      t.timestamps
    end
      add_index :results, :uuid, unique: true
  end
end
