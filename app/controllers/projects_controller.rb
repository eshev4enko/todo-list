class ProjectsController < ApplicationController
  protect_from_forgery except: :destroy
  before_action :set_project, only: [:update, :destroy]

  def index
    @projects = Project.includes(:tasks).order(created_at: :asc).all
  end

  def create
    @project = Project.create(title: "Project ##{Project.count + 1}")
    render partial: @project
  end

  def update
    @project.update(project_params)
    render nothing: true
  end

  def destroy
    @project.destroy
    render nothing: true
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:title)
  end
end
