class RemoveScoreResults < ActiveRecord::Migration[6.1]
  def up
    remove_column :results, :score
  end

  def down
    add_column :results, :score, :string
  end
end
