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

ActiveRecord::Schema.define(version: 2022_03_15_154604) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "recordings", force: :cascade do |t|
    t.string "vocal_style", null: false
    t.string "example_vocal", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vocal_style"], name: "index_recordings_on_vocal_style", unique: true
  end

  create_table "results", force: :cascade do |t|
    t.bigint "recording_id", null: false
    t.string "uuid", null: false
    t.string "vocal_data"
    t.string "compose_song"
    t.string "score"
    t.string "comment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recording_id"], name: "index_results_on_recording_id"
    t.index ["uuid"], name: "index_results_on_uuid", unique: true
  end

  add_foreign_key "results", "recordings"
end
