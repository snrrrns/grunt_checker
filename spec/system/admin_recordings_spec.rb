require 'rails_helper'

RSpec.describe "AdminRecordings", type: :system do
  let(:admin) { create :user, :admin }
  let(:recording) { create(:recording) }

  describe 'ログイン前' do
    context 'ページ遷移確認' do
      it 'ステージ一覧ページへのアクセスに失敗する' do
        visit admin_recordings_path
        expect(page).to have_content 'ログインしてください'
        expect(current_path).to eq admin_login_path
      end
    end
  end

  describe 'ログイン後' do
    before { login_as(admin) }
    context 'ページ遷移確認' do
      it 'ステージ一覧画面が表示される' do
        recording
        visit admin_recordings_path
        expect(page).to have_content recording.vocal_style
        expect(Recording.count).to eq 1
        expect(current_path).to eq admin_recordings_path
      end

      it 'ステージ詳細画面が表示される' do
        visit admin_recording_path(recording)
        expect(page).to have_content recording.vocal_style
        expect(current_path).to eq admin_recording_path(recording)
      end
    end
  end
end
