Rails.application.routes.draw do
  root 'static_pages#top'
  get '/terms', to: 'static_pages#terms'
  get '/privacy_policy', to: 'static_pages#privacy_policy'
  get '/inquiry', to: 'static_pages#inquiry'

  resources :recordings, only: %i[index show] do
    resources :results, param: :uuid, only: %i[show create], shallow: true
  end
end
