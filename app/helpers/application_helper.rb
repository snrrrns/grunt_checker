module ApplicationHelper
  def default_meta_tags
    {
      site: 'Grunt Checker - デスボイス測定アプリ',
      title: title,
      reverse: true,
      description: 'あなたのデスボイスを測定し、バンドの演奏と融合します！',
      canonical: 'https://www.gruntchecker.com',
      noindex: !Rails.env.production?,
      icon: image_url('favicon.ico'),

      og: {
        title: :site,
        description: :description,
        type: 'website',
        url: 'https://www.gruntchecker.com',
        image: image_url('ogp.png'),
        locale: 'ja_JP'
      },

      twitter: {
        card: 'summary_large_image',
        creator: '@snrrrns'
      }
    }
  end

  def page_title(page_title = '')
    base_title = 'Grunt Checker（管理画面）'

    page_title.empty? ? base_title : "#{page_title} | #{base_title}"
  end
end
