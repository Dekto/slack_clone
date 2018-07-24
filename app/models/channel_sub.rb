class ChannelSub < ApplicationRecord
  attr_accessor :skip_broadcast

  validates_presence_of :channel_id, scope: :user_id

  belongs_to :user
  belongs_to :channel
  has_one :workspace, through: :channel

  def broadcast_name
    "channel_#{channel.slug}"
  end

  after_create_commit :generate_read, :broadcast_create_sub
  after_destroy :broadcast_destroy

  private

  def generate_read
    channel.reads.create!(user_id: user_id, accessed_at: DateTime.now)
  end

  def broadcast_create_sub
    return if user.id === workspace.owner.id
    broadcast_create
  end
end
