Rails.application.routes.draw do
  resources :projects, only: [:index, :create, :update, :destroy] do
    resources :tasks, only: [:create, :update, :destroy] do
      put :complete, on: :member
      put :sort, on: :collection
    end
  end

  root 'projects#index'
end
