Rails.application.routes.draw do
  root to: 'static_pages#top'
  get '/terms', to: 'static_pages#terms'
  get '/privacy_policy', to: 'static_pages#privacy_policy'
  get '/inquiry', to: 'static_pages#inquiry'

  resources :recordings, except: %i[destroy] do
    resources :results, param: :uuid, only: %i[show create], shallow: true
  end

  namespace :admin do
    root to: 'dashboards#index'
    get 'login', to: 'user_sessions#new'
    post 'login', to: 'user_sessions#create'
    delete 'logout', to: 'user_sessions#destroy'

    resources :recordings
  end
end
