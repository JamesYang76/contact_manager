class ContactsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_contact, only: [:edit, :update, :destroy, :delete]
  # before_action :all_contacts, only: [:index, :create]

  def index
    session[:selected_group_id] = params[:group_id]
    @contacts = all_contacts(params)
    respond_to do |format|
      format.js
      format.html
    end
  end

  def autocomplete
    @contacts =current_user.contacts.search(params[:term]).order(created_at: :desc).page(params[:page])
    # render json: @contacts.map { |contact| { id: contact.id, value: contact.name } }
  end

  def new
    @contact = Contact.new
  end

  def create
    @contact = current_user.contacts.build(contact_params)

    respond_to do |format|
      if @contact.save
        format.html do
          flash[:success] = "Contact was successfully created."
          redirect_to contacts_path(previous_query_string)
        end
        format.js do
          @contacts = all_contacts(previous_query_string)
          render 'create', status: :created
        end
      else
        format.html do
          flash[:error] = "Contact failed to be created."
          render 'new'
        end
        format.js { render 'new', status: :unprocessable_entity }
      end
    end

  end

  def edit
    authorize @contact
  end

  def update
    authorize @contact
    respond_to do |format|
      if @contact.update(contact_params)
        format.html do
          flash[:success] = "Contact was successfully updated."
          redirect_to contacts_path(previous_query_string)
        end
        format.js { render 'update', status: :ok }
      else
        format.html do
          flash[:error] = "Contact failed to be updated."
          render 'edit'
        end
        format.js { render 'edit', status: :unprocessable_entity }
      end
    end
  end

  def destroy
    authorize @contact
    @contact.destroy

    respond_to do |format|
      format.html do
        flash[:success] = "Contact was successfully deleted."
        redirect_to contacts_path(previous_query_string)
      end
      format.js { @contacts = all_contacts(previous_query_string) }
    end
  end

  def delete
  end


  private

  def all_contacts(parameters)
   current_user.contacts.by_group(parameters[:group_id]).search(parameters[:term]).order(created_at: :desc).page(parameters[:page])
  end

  def find_contact
    @contact = Contact.find(params[:id])
  end

  def contact_params
    params.require(:contact).permit(:name, :email, :company, :address, :phone, :group_id, :avatar )
  end
end
