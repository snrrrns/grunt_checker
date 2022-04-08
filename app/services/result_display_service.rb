class ResultDisplayService
  def initialize(result)
    @result = result
  end

  def call
    if @result.score.ceil(0).zero?
      {
        score: (@result.created_at.strftime('%S')[1].to_i).ceil(0),
        evaluation: 'Keep trying!',
        comment: '残念！練習して再チャレンジ！'
      }
    elsif @result.score.ceil(0).positive? && @result.score.ceil(0) < 20
      {
        score: @result.score.ceil(0),
        evaluation: 'Keep trying!',
        comment: '残念！練習して再チャレンジ！'
      }
    elsif @result.score.ceil(0) >= 20 && @result.score.ceil(0) < 40
      {
        score: @result.score.ceil(0),
        evaluation: 'OK!',
        comment: 'もっといけそうです！その調子で練習を重ねましょう！'
      }
    elsif @result.score.ceil(0) >= 40 && @result.score.ceil(0) < 60
      {
        score: @result.score.ceil(0),
        evaluation: 'Nice!!',
        comment: 'まずまずです！更に磨きをかけましょう！'
      }
    elsif @result.score.ceil(0) >= 60 && @result.score.ceil(0) < 80
      {
        score: @result.score.ceil(0),
        evaluation: 'Great!!!',
        comment: 'かなりいい感じ！バンドでコーラスを担当できそうです！'
      }
    elsif @result.score.ceil(0) >= 80 && @result.score.ceil(0) < 90
      {
        score: @result.score.ceil(0),
        evaluation: 'Exellent!!!!',
        comment: 'すばらしい！バンドでボーカルやれちゃいます！'
      }
    else
      {
        score: @result.score.ceil(0),
        evaluation: 'Insane!!!!!',
        comment: '本業の方ですか？恐るべきデスボイス！'
      }
    end
  end

  private

  attr_reader :result
end
