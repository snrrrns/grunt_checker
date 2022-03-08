# == Schema Information
#
# Table name: recordings
#
#  id            :bigint           not null, primary key
#  example_vocal :string
#  instruments   :string
#  vocal_style   :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_recordings_on_vocal_style  (vocal_style) UNIQUE
#
class Recording < ApplicationRecord
  has_many :results, dependent: :delete_all
  mount_uploader :instruments, InstrumentsUploader
  mount_uploader :example_vocal, ExampleVocalUploader

  validates :vocal_style, presence: true, uniqueness: true
end
