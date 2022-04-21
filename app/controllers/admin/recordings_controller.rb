class Admin::RecordingsController < Admin::BaseController
  before_action :set_recording, only: %i[show edit update destroy]

  def index
    @recordings = Recording.all.order(created_at: :asc)
  end

  def new
    @recording = Recording.new
  end

  def create
    @recording = Recording.new(recording_params)
    if @recording.save
      redirect_to admin_recordings_path, success: t('defaults.message.created', item: Recording.model_name.human)
    else
      flash.now[:danger] = t('defaults.message.not_created', item: Recording.model_name.human)
      render :new
    end
  end

  def show; end

  def edit; end

  def update
    if @recording.update(recording_params)
      redirect_to admin_recording_path(@recording), success: t('defaults.message.updated', item: Recording.model_name.human)
    else
      flash.now[:danger] = t('defaults.message.not_updated', item: Recording.model_name.human)
      render :edit
    end
  end

  def destroy
    @recording.destroy!
    redirect_to admin_recordings_path, success: t('defaults.message.deleted', item: Recording.model_name.human)
  end

  private

  def set_recording
    @recording = Recording.find(params[:id])
  end

  def recording_params
    params.require(:recording).permit(:vocal_style, :emotion, :summary, :vocal_image, :example_vocal, :embed_identifier)
  end
end
