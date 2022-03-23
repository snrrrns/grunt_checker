Rails.application.routes.draw do
  root 'static_pages#top'
  get '/terms', to: 'static_pages#terms'
  get '/privacy_policy', to: 'static_pages#privacy_policy'

  resources :recordings, only: %i[index show edit update] do
    resources :results, param: :uuid, only: %i[show create], shallow: true
  end
end
