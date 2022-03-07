class ResultsController < ApplicationController
  before_action :set_result, only: %i[show]

  def show; end

  def create
    result = Result.create(result_params.merge(uuid: SecureRandom.uuid))
    render json: { url: result_path(result.uuid) }
  end

  private

  def result_params
    params.permit(:recording_id, :vocal_data)
  end

  def set_result
    @result = Result.find_by(uuid: params[:uuid])
  end
end
