import $ from 'jquery';
import * as jquery_ui from 'jquery-ui';
import Routes from './routes';

export default class Task {

  constructor() {
    this._ENTER_KEY = 13;
    this._routes = new Routes();
  }

  manageActionButtons() {
    $('.list')
      .on('mouseover', 'article .todo-list tr',
        (e) => $(e.currentTarget).find('ul').removeClass('hidden'))
      .on('mouseout', 'article .todo-list tr',
        (e) => $(e.currentTarget).find('ul').addClass('hidden'));
  }

  completeTask() {
    $('.list').on('change', 'article .todo-list table tr .todo-list-checkbox input', (e) => {
      this._completeTask($(e.currentTarget));
    });
  }

  editTaskDescription() {
    $('.list').on('click', 'article .todo-list tr .todo-list-task-edit', (e) => {
      e.preventDefault();
      let todoListTask = $(e.currentTarget).parents('tr').find('.todo-list-task'),
          textToBeEdited = todoListTask.find('span').text().trim();

      if(!todoListTask.hasClass('edit-mode')) {
        todoListTask
            .addClass('edit-mode');
        todoListTask
            .append(this._editTaskInput())
            .find('input')
            .val(textToBeEdited)
            .focus();
      }

      if ($(e.target).is('.edit-icon')) {
        $(e.target)
            .hide()
            .next()
            .show();

        todoListTask
            .find('input')
            .removeClass('editor')
            .removeAttr('readonly');
      } else {
        $(e.target)
            .hide()
            .prev()
            .show();
        todoListTask
            .find('input')
            .addClass('editor')
            .attr('readonly', 'readonly')
            .blur();
      }
    });
  }

  taskDescriptionKeypress() {
    $('.list').on('keypress', 'article .todo-list tr .todo-list-task input', (e) => {
      if(e.which === this._ENTER_KEY) {
        e.preventDefault();
        this._cancelTaskEditing($(e.currentTarget));
      }
    });
  }

  taskDescriptionBlur() {
    $('.list').on('blur', 'article .todo-list tr .todo-list-task input', (e) => {
      e.preventDefault();
      this._cancelTaskEditing($(e.currentTarget));
    });
  }

  destroyTask() {
    $('.list').on('click', 'article .todo-list tr .todo-list-task-delete', (e) => {
      e.preventDefault();
      if(confirm('Are you sure ?')) {
        let task = $(e.currentTarget).closest('tr'),
            task_id = task.data('task-id'),
            project_id = $(e.currentTarget).parents('article').data('project-id'),
            project_task_path = this._routes.tasksDestory(project_id, task_id);

        $.ajax({
          url: project_task_path,
          method: 'DELETE'
        })
        .always(() => task.remove());
      }
    });
  }

  _completeTask(checkbox) {
    checkbox.parents('tr').toggleClass('completed-task');
    let project_id = checkbox.parents('article').data('project-id'),
        task_id = checkbox.parents('tr').data('task-id'),
        complete_project_task_path = this._routes.tasksComplete(project_id, task_id);

    $.ajax({
      url: complete_project_task_path,
      method: 'PUT',
      data: { task: { complete:  checkbox.prop('checked') } }
    });
  }

  _cancelTaskEditing(input) {
    let project_id = input.parents('article').data('project-id'),
        task_id = input.parents('tr').data('task-id'),
        project_task_path = this._routes.tasksPut(project_id, task_id),
        task_description = input.val();

    $.ajax({
      url: project_task_path,
      method: 'PUT',
      data: { task: { name:  task_description } }
    })
    .done(() => {
      let parent = input.parent();
      parent.find('span').text(task_description);
      if (parent.find('input')) {
        parent.find('input').remove();
      }
      parent.removeClass('edit-mode');
    });
  }

  sortable() {
    var self = this;
    $(".todo-list table tbody").sortable({
      update(event, ui) {
        let task_ids = $.map($(event.target).find('tr'), (row) => $(row).data('task-id')),
            project_id = $(event.target).parents('article').data('project-id'),
            sort_project_tasks_path = self._routes.tasksSort(project_id);

        $.ajax({
          url: sort_project_tasks_path,
          method: 'PUT',
          data: { project: { tasks: task_ids } }
        });
      }
    });
  }

  _editTaskInput() {
    return "<input type='text' name='' value=''>";
  }

  addTaskButton() {
    $('.content .list').on('click', '.todo-bar .todo-bar-new button', (e) => {
      e.preventDefault();
      this._addNewTask($(e.currentTarget));
    });
  }

  addTaskKeypress() {
    $('.content .list').on('keypress', '.todo-bar .todo-bar-new button', (e) => {
      if(e.which === this._ENTER_KEY) {
        e.preventDefault();
        this._addNewTask($(e.currentTarget).next('button'));
      }
    });
  }

  _addNewTask(button) {
    let article = button.parents('article'),
        project_id = article.data('project-id'),
        project_tasks_path = this._routes.tasksCreate(project_id),
        task_description = button.prev('input').val();

    $.ajax({
      url: project_tasks_path,
      method: 'POST',
      data: { task: { name: task_description } }
    })
    .done((data) => {
      article
          .find('.todo-list table tbody')
          .append(data);
      button
          .prev('input')
          .val('');
      this
          .sortable();
    });
  }
}