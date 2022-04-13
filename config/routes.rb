Rails.application.routes.draw do
  devise_for :users, skip: %i[registrations password]
  root 'static_pages#top'
  get '/terms', to: 'static_pages#terms'
  get '/privacy_policy', to: 'static_pages#privacy_policy'
  get '/inquiry', to: 'static_pages#inquiry'

  resources :recordings, except: %i[destroy] do
    resources :results, param: :uuid, only: %i[show create], shallow: true
  end
end
