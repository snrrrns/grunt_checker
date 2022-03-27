class RecordingsController < ApplicationController
  before_action :set_recording, only: %i[show edit update]

  def index
    @recordings = Recording.all
  end

  def show; end

  def edit; end

  def update
    if @recording.update(recording_params)
      redirect_to recordings_path
    else
      render :edit
    end
  end

  private

  def recording_params
    params.require(:recording).permit(:vocal_style, :summary, :vocal_image, :example_vocal, :embed_identifier)
  end

  def set_recording
    @recording = Recording.find(params[:id])
  end
end
