FactoryBot.define do
  factory :recording do
    sequence(:vocal_style) { |n| "デスボイス#{n}" }
    summary { 'デスボイスの概要文' }
    vocal_image { File.open(File.join(Rails.root, 'spec/fixtures/files/images/test_vocal_image.jpg')) }
    example_vocal { File.open(File.join(Rails.root, 'spec/fixtures/files/audios/test_example_vocal.wav')) }
    emotion { :surprise }
    embed_identifier { 'zhmvD536HLI' }
  end
end