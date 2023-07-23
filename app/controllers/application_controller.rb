class ApplicationController < ActionController::Base
  before_action :ensure_domain
  FQDN = 'www.gruntchecker.com'.freeze

  private

  def ensure_domain
    # リクエストがFQDNに一致する場合、何もしない
    return if request.host == FQDN

    # gruntchecker.com または gruntchecker.fly.dev からのアクセスの場合にリダイレクト
    if /gruntchecker\.com\z|gruntchecker\.fly\.dev\z/.match?(request.host)
      port = ":#{request.port}" unless [80, 443].include?(request.port)
      redirect_to "#{request.protocol}#{FQDN}#{port}#{request.path}", status: :moved_permanently
    end
  end
end
