# == Schema Information
#
# Table name: results
#
#  id           :bigint           not null, primary key
#  comment      :string
#  compose_song :string
#  score        :string
#  uuid         :string           not null
#  vocal_data   :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  recording_id :bigint           not null
#
# Indexes
#
#  index_results_on_recording_id  (recording_id)
#  index_results_on_uuid          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (recording_id => recordings.id)
#
class Result < ApplicationRecord
  belongs_to :recording
  mount_uploader :vocal_data, VocalDataUploader
  mount_uploader :compose_song, ComposeSongUploader
end
