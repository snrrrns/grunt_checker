Rails.application.routes.draw do
  root 'static_pages#top'

  resources :recordings, only: %i[index show] do
    resources :results, param: :uuid, only: %i[show]
  end
end
