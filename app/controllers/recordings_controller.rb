class RecordingsController < ApplicationController
  before_action :set_recording, only: %i[show]

  def index
    @recordings = Recording.all
  end

  def show; end

  private

  def set_recording
    @recording = Recording.find(params[:id])
  end
end
