# == Schema Information
#
# Table name: recordings
#
#  id               :bigint           not null, primary key
#  embed_identifier :string           not null
#  emotion          :integer          default("angry"), not null
#  example_vocal    :string           not null
#  summary          :string           not null
#  vocal_image      :string           not null
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
  validates :vocal_image, presence: true
  validates :summary, presence: true, length: { maximum: 255 }
  validates :embed_identifier, presence: true

  enum emotion: { angry: 0, sad: 10, happy: 20, disgust: 30, surprise: 40, neutral: 50, fear: 60 }
end
