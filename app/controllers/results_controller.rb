class ResultsController < ApplicationController
  before_action :set_result, only: %i[show]

  def show
    @display = ResultDisplayService.new(@result).call
  end

  def create
    result = Result.new(result_params.merge(uuid: SecureRandom.uuid))
    result.vocal_params = params[:vocal_data]
    result.save!
    render json: { url: result_path(result.uuid) }
  end

  private

  def result_params
    params.permit(:recording_id, :vocal_data, :compose_song)
  end

  def set_result
    @result = Result.find_by(uuid: params[:uuid])
  end
end
