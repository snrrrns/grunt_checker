class AddEmbedIdentifierToRecordings < ActiveRecord::Migration[6.1]
  def change
    add_column :recordings, :embed_identifier, :string
  end
end
