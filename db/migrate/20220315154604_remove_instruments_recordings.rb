class RemoveInstrumentsRecordings < ActiveRecord::Migration[6.1]
  def up
    remove_column :recordings, :instruments
  end

  def down
    add_column :recordings, :instruments, :string
  end
end
