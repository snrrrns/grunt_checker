class RenameCommentColumnToResults < ActiveRecord::Migration[6.1]
  def change
    rename_column :results, :comment, :emotion_strength
  end
end
