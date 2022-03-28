# == Schema Information
#
# Table name: results
#
#  id               :bigint           not null, primary key
#  compose_song     :string           not null
#  emotion_strength :string           not null
#  uuid             :string           not null
#  vocal_data       :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  recording_id     :bigint           not null
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

  validates :uuid, presence: true, uniqueness: true
  validates :vocal_data, presence: true
  validates :compose_song, presence: true
  validates :emotion_strength, presence: true

  def score
    parse = JSON.parse(emotion_strength)
    parse['emotion_detail'][recording.emotion] * 100
  end
end
