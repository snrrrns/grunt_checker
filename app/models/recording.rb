# == Schema Information
#
# Table name: recordings
#
#  id               :bigint           not null, primary key
#  embed_identifier :string
#  emotion          :integer          default("angry"), not null
#  example_vocal    :string           not null
#  summary          :string
#  vocal_image      :string
#  vocal_style      :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_recordings_on_vocal_style  (vocal_style) UNIQUE
#
class Recording < ApplicationRecord
  has_many :results, dependent: :delete_all
  mount_uploader :example_vocal, ExampleVocalUploader
  mount_uploader :vocal_image, VocalImageUploader

  validates :vocal_style, presence: true, uniqueness: true
  validates :example_vocal, presence: true
  validates :emotion, presence: true

  enum emotion: { angry: 0, sad: 10, happy: 20, disgust: 30, surprise: 40, neutral: 50, fear: 60 }
end
