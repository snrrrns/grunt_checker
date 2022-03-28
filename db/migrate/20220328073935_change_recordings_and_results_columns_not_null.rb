class ChangeRecordingsAndResultsColumnsNotNull < ActiveRecord::Migration[6.1]
  def up
    change_column_null :recordings, :embed_identifier, false
    change_column_null :recordings, :summary, false
    change_column_null :recordings, :vocal_image, false

    change_column_null :results, :compose_song, false
    change_column_null :results, :emotion_strength, false
    change_column_null :results, :vocal_data, false
  end
  
  def down
    change_column_null :recordings, :embed_identifier, true
    change_column_null :recordings, :summary, true
    change_column_null :recordings, :vocal_image, true

    change_column_null :results, :compose_song, true
    change_column_null :results, :emotion_strength, true
    change_column_null :results, :vocal_data, true
  end
end
