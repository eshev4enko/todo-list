class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.boolean :completed, default: false
      t.integer :project_id
      t.integer :position, default: 0

      t.timestamps
    end
  end
end
