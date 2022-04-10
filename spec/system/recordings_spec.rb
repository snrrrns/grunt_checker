require 'rails_helper'

RSpec.describe "Recordings", type: :system do
  let(:recording) { create(:recording) }

  describe 'ステージ選択画面' do
    context '正常系' do
      it 'ステージ選択画面にRecodingモデルが表示される' do
        recording
        visit recordings_path
        expect(page).to have_content recording.vocal_style
        expect(page).to have_content recording.summary
        expect(page).to have_selector("img[src$='test_vocal_image.jpg']")
        expect(Recording.count).to eq 1
        expect(current_path).to eq recordings_path
      end
    end
  end
end
