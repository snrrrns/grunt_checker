class RecordingsController < ApplicationController
  before_action :set_recording, only: %i[show]

  def index
    @recordings = Recording.all.order(created_at: :asc)
  end

  def create
    @recording = Recording.new(recording_params)
    if @recording.save
      redirect_to recordings_path
    else
      render :new
    end
  end

  def show; end

  private

  def recording_params
    params.require(:recording).permit(:vocal_style, :emotion, :summary, :vocal_image, :example_vocal, :embed_identifier)
  end

  def set_recording
    @recording = Recording.find(params[:id])
  end
end
