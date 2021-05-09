// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const channels = require.context('.', true, /_channel\.js$/)
channels.keys().forEach(channels)

import $ from 'jquery';
import Project from '../channels/project';
import Task from '../channels/task';

$(() => {
    var project = new Project();
    project.createProject();
    project.manageActionButtons();
    project.editProjectTitleMode();
    project.updateProjectTitle();
    project.deleteProject();

    var task = new Task();
    task.manageActionButtons();
    task.editTaskDescription();
    task.taskDescriptionKeypress();
    task.taskDescriptionBlur();
    task.completeTask();
    task.destroyTask();
    task.sortable();
    task.addTaskButton();
    task.addTaskKeypress();
});
