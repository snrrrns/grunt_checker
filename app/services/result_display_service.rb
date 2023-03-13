class ResultDisplayService
  SCORE_INSANE = 90
  SCORE_EXCELLENT = 80
  SCORE_GREAT = 60
  SCORE_NICE = 40
  SCORE_OK = 20
  SCORE_MINIMUM = 0

  def initialize(result)
    @result = result
  end

  def call
    {
      score: display_score,
      evaluation: display_evaluation,
      comment: display_comment
    }
  end

  private

  attr_reader :result

  def display_score
    score = @result.score.ceil(0)
    score = (@result.created_at.to_i % 10 + 1).ceil(0) if score.zero?
    score
  end

  def display_evaluation
    case display_score
    when SCORE_INSANE..Float::INFINITY
      'Insane!!!!!'
    when SCORE_EXCELLENT...SCORE_INSANE
      'Excellent!!!!'
    when SCORE_GREAT...SCORE_EXCELLENT
      'Great!!!'
    when SCORE_NICE...SCORE_GREAT
      'Nice!!'
    when SCORE_OK...SCORE_NICE
      'OK!'
    when SCORE_MINIMUM...SCORE_OK
      'Keep trying!'
    end
  end

  def display_comment
    case display_score
    when SCORE_INSANE..Float::INFINITY
      '本業の方ですか？恐るべきデスボイス！'
    when SCORE_EXCELLENT...SCORE_INSANE
      'すばらしい！バンドでボーカルやれちゃいます！'
    when SCORE_GREAT...SCORE_EXCELLENT
      'かなりいい感じ！バンドでコーラスを担当できそうです！'
    when SCORE_NICE...SCORE_GREAT
      'まずまずです！更に磨きをかけましょう！'
    when SCORE_OK...SCORE_NICE
      'もっといけそうです！その調子で練習を重ねましょう！'
    when SCORE_MINIMUM...SCORE_OK
      '残念！練習して再チャレンジ！'
    end
  end
end
