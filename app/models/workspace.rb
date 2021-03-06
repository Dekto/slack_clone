class Workspace < ApplicationRecord
  include Concerns::Broadcastable

  DEFAULT_CHAT_TITLES = %w(general random).freeze
  EXCLUDE_SLUGS = %w(api assets signin signout).freeze

  attr_accessor :skip_broadcast
  
  validates_presence_of :title, :slug, :owner_id
  validates_uniqueness_of :slug
  validates_length_of :title, within: 3..55
  validates_exclusion_of :slug, in: EXCLUDE_SLUGS

  belongs_to :owner, class_name: 'User'
  has_many :workspace_subs
  has_many :users, through: :workspace_subs
  has_many :user_appearances
  has_many :reads
  has_many :chatrooms
  has_many :chatroom_subs, through: :chatrooms
  has_many :messages, through: :chatrooms

  alias_attribute :subs, :workspace_subs

  def self.without_user_sub(user_id)
    includes(:workspace_subs).where.not(workspace_subs: { user_id: user_id })
  end

  def broadcast_name
    'app'
  end

  def members
    users
      .select('users.*', 'user_appearances.status AS status')
      .left_joins(:appears)
      .order(:id)
  end

  def user_convos(user_id)
    parents = messages.convo_parents_with_author_id(user_id)
    Message.parents_or_children(parents).includes(:chatroom, :author)
  end

  def user_convos_reads(user_id)
    messages
      .select('messages.*', 'reads.accessed_at AS last_read')
      .convo_parents_with_author_id(user_id)
  end

  def user_unreads(user_id)
    messages
      .with_entry_type
      .with_parent
      .joins(chatroom: :reads)
      .where(reads: { user_id: user_id })
      .where('messages.created_at > reads.accessed_at')
  end

  def last_entries_created_at_map(user_id)
    chatrooms = messages.chatrooms_last_created_at(user_id)
    convos = messages.convos_last_created_at(user_id)
    convos.merge(chatrooms)
  end

  def generate_default_chatrooms_reads(user = owner)
    user.reads.create(default_chatrooms_reads_params)
  end

  def default_chatrooms_reads_params
    chatrooms_amount = DEFAULT_CHAT_TITLES.length
    chatrooms.first(chatrooms_amount).reduce([]) do |memo, chatroom|
      memo << { readable_id: chatroom.id, readable_type: 'Chatroom' }
    end
  end

  after_create_commit :create_defaults_broadcast

  private

  def create_defaults_broadcast
    generate_workspace_subs
    generate_default_chatrooms
    generate_default_chatrooms_reads
    broadcast_create
  end

  def generate_workspace_subs
    subs.create(user_id: owner.id, skip_broadcast: true)
  end

  def generate_default_chatrooms
    chatrooms.create(default_chatrooms_params)
  end

  def default_chatrooms_params
    DEFAULT_CHAT_TITLES.reduce([]) do |memo, title|
      memo << { title: title, owner_id: owner_id, skip_broadcast: true }
    end
  end
end
