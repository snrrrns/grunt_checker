class RecordingsController < ApplicationController
  before_action :set_recording, only: %i[show edit update]
  before_action :login_scan, only: %i[new create edit update]
  before_action :admin_scan, only: %i[create update]

  def index
    @recordings = Recording.all.order(created_at: :asc)
  end

  def new
    @recording = Recording.new
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
    params.require(:recording).permit(:vocal_style, :emotion, :summary, :vocal_image, :example_vocal, :embed_identifier)
  end

  def set_recording
    @recording = Recording.find(params[:id])
  end

  def login_scan
    redirect_to root_path unless user_signed_in?
  end

  def admin_scan
    redirect_to root_path unless current_user.admin?
  end
end
