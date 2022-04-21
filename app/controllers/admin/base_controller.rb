class Admin::BaseController < ApplicationController
  add_flash_types :success, :info, :warning, :danger
  before_action :require_login
  before_action :check_admin
  layout 'admin/layouts/application'

  private

  def not_authenticated
    redirect_to admin_login_path, warning: t('defaults.message.require_login')
  end

  def check_admin
    redirect_to admin_login_path, warning: t('defaults.message.not_authorized') unless current_user.admin?
  end
end
