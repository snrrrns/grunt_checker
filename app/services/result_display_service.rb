class ResultDisplayService
  def initialize(result)
    @result = result
  end

  def call
    if @result.score.ceil(0).zero?
      {
        score: (@result.created_at.strftime('%S')[1].to_i).ceil(0),
        comment: 'Keep trying!!'
      }
    elsif @result.score.ceil(0) > 0 && @result.score.ceil(0) < 20
      {
        score: @result.score.ceil(0),
        comment: 'Keep trying!!'
      }
    elsif @result.score.ceil(0) >= 20 && @result.score.ceil(0) < 40
      {
        score: @result.score.ceil(0),
        comment: 'OK!!'
      }
    elsif @result.score.ceil(0) >= 40 && @result.score.ceil(0) < 60
      {
        score: @result.score.ceil(0),
        comment: 'Nice!!'
      }
    elsif @result.score.ceil(0) >= 60 && @result.score.ceil(0) < 80
      {
        score: @result.score.ceil(0),
        comment: 'Great!!'
      }
    elsif @result.score.ceil(0) >= 80 && @result.score.ceil(0) < 90
      {
        score: @result.score.ceil(0),
        comment: 'Exellent!!'
      }
    else
      {
        score: @result.score.ceil(0),
        comment: 'Insane!!'
      }
    end
  end

  private

  attr_reader :result
end
