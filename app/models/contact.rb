class Contact < ApplicationRecord
  belongs_to :group
  belongs_to :user

  validates :name, :email, :group_id, presence: true
  validates :name, length: { minimum: 2 }

  has_attached_file :avatar, styles: { medium: "150x150>", thumb: "100x100>" }, default_url: "http://placehold.it/150x150" #"/images/:style/missing.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  def gravatar
    # create the md5 hash
    hash = Digest::MD5.hexdigest(email.downcase)
    "https://www.gravatar.com/avatar/#{hash}"
  end

  scope :search, ->(term) do
    # Do not need LOWER and term.downcase because of ILIKE
    where('LOWER(name) ILIKE :term or LOWER(company) ILIKE :term or LOWER(email) ILIKE :term', term: "%#{term.downcase}%") if term.present?
  end
  scope :by_group, ->(group_id) { where(group_id: group_id) if group_id.present? }

=begin
  def self.search(term)
    if term && !term.empty?
      where('name ILIKE ?', "%#{term}%")
    else
      all
    end
  end


  def self.by_group(group_id)
    if group_id && !group_id.empty?
      where(group_id: group_id)
    else
      all
    end
  end
=end
end
