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
#  index_recordings_on_example_vocal  (example_vocal) UNIQUE
#  index_recordings_on_instruments    (instruments) UNIQUE
#  index_recordings_on_vocal_style    (vocal_style) UNIQUE
#
class Recording < ApplicationRecord
  validates :vocal_style, presence: true, uniqueness: true
  validates :example_vocal, uniqueness: true, allow_blank: true
  validates :instruments, uniqueness: true, allow_blank: true
end
