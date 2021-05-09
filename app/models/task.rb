class Task < ApplicationRecord
  belongs_to :project

  validates :name, presence: true
  validates :name, length: { maximum: 250 }
  validates :completed, inclusion: { in: [true, false] }

  def self.sort_tasks(tasks)
    tasks_positions = {}
    tasks.each_index { |index| tasks_positions[tasks[index]] = { 'position': index + 1 } }
    update(tasks_positions.keys, tasks_positions.values)
  end
end
