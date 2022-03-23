class AddSummaryToRecordings < ActiveRecord::Migration[6.1]
  def change
    add_column :recordings, :summary, :string
  end
end
