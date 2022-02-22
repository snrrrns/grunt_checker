# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_02_22_132005) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "recordings", force: :cascade do |t|
    t.string "vocal_style", null: false
    t.string "example_vocal"
    t.string "instruments"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["example_vocal"], name: "index_recordings_on_example_vocal", unique: true
    t.index ["instruments"], name: "index_recordings_on_instruments", unique: true
    t.index ["vocal_style"], name: "index_recordings_on_vocal_style", unique: true
  end

end
