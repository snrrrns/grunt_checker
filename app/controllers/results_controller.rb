class ResultsController < ApplicationController
  before_action :set_result, only: %i[show]

  def show
    @display = ResultDisplayService.new(@result).call
  end

  def create
    url = ENV['API_URL']
    vocal = File.new(params[:vocal_data])
    response = RestClient::Request.execute(
      method: :post,
      url: url,
      payload: {
        multipart: true,
        voice_data: vocal
      },
      content_type: 'audio/wav'
    )

    result = Result.create(result_params.merge(uuid: SecureRandom.uuid, emotion_strength: response.body))
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
