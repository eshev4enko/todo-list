import $ from 'jquery';
import Routes from './routes';

export default class Project {

  constructor() {
    this._ENTER_KEY = 13;
    this._routes = new Routes();
  }

  createProject() {
    $('.new-todo input[type="submit"]').on('click', (e) => {
      e.preventDefault();
      let projects_path = this._routes.projectsCreate();
      $.ajax({
        url: projects_path,
        method: 'POST'
      })
      .done((data) => $('.content .list').append(data));
    });
  }

  manageActionButtons() {
    $('.content .list')
      .on('mouseover', 'article .todo-header', (e) => {
        $(e.currentTarget).find('ul').removeClass('hidden');
      })
      .on('mouseout', 'article .todo-header', (e) => {
        $(e.currentTarget).find('ul').addClass('hidden');
      });
  }

  editProjectTitleMode() {
    $('.content .list').on('click', '.todo-header .todo-action-edit', (e) => {
      e.preventDefault();
      let project_header = $(e.currentTarget).parents('.todo-header'),
          project_title = project_header.find('h3').text().trim();


      if(!project_header.hasClass('edit-mode')) {
        project_header
            .addClass('edit-mode');
        project_header
            .append(this._editProjectInput())
            .find('input')
            .val(project_title)
            .focus();
      }

      if ($(e.target).is('.project-edit-icon')) {
        $(e.target)
            .hide()
            .next()
            .show();

        project_header
            .find('input')
            .removeClass('editor')
            .removeAttr('readonly');
      } else {
        console.log("this cross icon");
        $(e.target)
            .hide()
            .prev()
            .show();

        project_header
            .find('input')
            .addClass('editor')
            .attr('readonly', 'readonly')
            .blur();
      }
    });
  }

  _editProjectInput() {
    return "<input type='text' name='' value=''>";
  }

  updateProjectTitle() {
    $('.content .list')
      .on('blur', '.todo-header input', (e) => {
        this._cancelEditing($(e.currentTarget));
      })
      .on('keypress', '.todo-header input', (e) => {
        if(e.which === this._ENTER_KEY) {
          this._cancelEditing($(e.currentTarget));
        }
    });
  }

  deleteProject() {
    $('.content .list').on('click', '.todo-header .todo-action-remove', (e) => {
      e.preventDefault();
      if(confirm('Are you sure ?')) {
        let project = $(e.currentTarget).parents('article'),
            project_id = project.data('project-id'),
            project_path = this._routes.projectsDestroy(project_id);

        $.ajax({
          url: project_path,
          method: 'DELETE'
        })
        .always(() => project.slideUp(function() { this.remove(); }));
      }
    });
  }

  _cancelEditing(input) {
    let project_title = input.val(),
        project_id = $(input).parents('article').data('project-id'),
        project_path = this._routes.projectsPut(project_id);

    $.ajax({
      url: project_path,
      method: 'PUT',
      data: { project: { title:  project_title } }
    })
    .done(() => {
      input.parent('.todo-header')
        .removeClass('edit-mode')
        .find('h3')
        .text(project_title);
    });
  }
}
