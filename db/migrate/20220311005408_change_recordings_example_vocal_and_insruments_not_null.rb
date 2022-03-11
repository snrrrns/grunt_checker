class ChangeRecordingsExampleVocalAndInsrumentsNotNull < ActiveRecord::Migration[6.1]
  def up
    change_column_null :recordings, :example_vocal, false
    change_column_null :recordings, :instruments, false
  end

  def down
    change_column_null :recordings, :example_vocal, true
    change_column_null :recordings, :instruments, true
  end
end
