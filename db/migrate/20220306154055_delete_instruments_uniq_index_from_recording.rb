class DeleteInstrumentsUniqIndexFromRecording < ActiveRecord::Migration[6.1]
  def change
    remove_index :recordings, :instruments
  end
end
