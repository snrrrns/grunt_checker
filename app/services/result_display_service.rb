class ResultDisplayService
  def initialize(result)
    @result = result
  end

  def call
    if @result.score.ceil(0).zero?
      {
        score: (@result.created_at.strftime('%S')[1].to_i).ceil(0),
        evaluation: 'Keep trying!',
        comment: 'お手本を聴いて再チャレンジ！'
      }
    elsif @result.score.ceil(0) > 0 && @result.score.ceil(0) < 20
      {
        score: @result.score.ceil(0),
        evaluation: 'Keep trying!',
        comment: 'お手本を聴いて再チャレンジ！'
      }
    elsif @result.score.ceil(0) >= 20 && @result.score.ceil(0) < 40
      {
        score: @result.score.ceil(0),
        evaluation: 'OK!',
        comment: 'もっといけそうです！更に練習してみよう！'
      }
    elsif @result.score.ceil(0) >= 40 && @result.score.ceil(0) < 60
      {
        score: @result.score.ceil(0),
        evaluation: 'Nice!!',
        comment: 'いい感じです！更に磨きをかけよう！'
      }
    elsif @result.score.ceil(0) >= 60 && @result.score.ceil(0) < 80
      {
        score: @result.score.ceil(0),
        evaluation: 'Great!!!',
        comment: 'かなりいい線！バンドのコーラスは担当できそうです！'
      }
    elsif @result.score.ceil(0) >= 80 && @result.score.ceil(0) < 90
      {
        score: @result.score.ceil(0),
        evaluation: 'Exellent!!!!',
        comment:'すばらしい！デスボイスでボーカルやれちゃいます！'
      }
    else
      {
        score: @result.score.ceil(0),
        evaluation: 'Insane!!!!!',
        comment: '本業の方ですか？さすがです！'
      }
    end
  end

  private

  attr_reader :result
end
