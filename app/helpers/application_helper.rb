module ApplicationHelper
  def page_title(page_title = '')
    base_title = 'Grunt Checker - デスボイス測定アプリ'

    page_title.empty? ? base_title : "#{page_title} | #{base_title}"
  end
end
