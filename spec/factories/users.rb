FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user_#{n}@example.com" }
    password { "password" }
    password_confirmation { "password" }
    role { :general }
  end

  trait :admin do
    sequence(:email) { |n| "admin_#{n}@example.com" }
    role { :admin }
  end
end
