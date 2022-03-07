class DeleteExampleVocalUniqIndexFromRecording < ActiveRecord::Migration[6.1]
  def change
    remove_index :recordings, :example_vocal
  end
end
