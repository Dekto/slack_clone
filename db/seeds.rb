require 'faker'

User.create!(email: "jtf@gmail.com", username: "jtf", password: "123456")

def is_random_true?
  rand < 0.25
end

def random_lorem_short_or_long
  return Faker::Lorem.paragraphs if rand < 0.1
  rand < 0.7 ? Faker::Lorem.sentence : Faker::Lorem.sentence
end

5.times do
  title = Faker::Company.unique.name
  workspace = Workspace.create!(
    title: title,
    slug: "#{title.parameterize}",
    owner_slug: User.first.slug
  )

  [*2..5].sample.times do
    title = Faker::Company.unique.buzzword
    Channel.create!(
      title: title,
      owner_slug: User.first.slug,
      topic: (is_random_true? ? Faker::Company.bs : nil),
      workspace_slug: workspace.slug
    )
  end
end

15.times do
  user = User.create!(
    email: Faker::Internet.unique.email,
    username: Faker::Internet.unique.user_name,
    password: "123456"
  )

  Workspace.all.shuffle.each do |workspace|
    next if user.is_workspace_sub?(workspace) || is_random_true?
    WorkspaceSub.create!(
      workspace_slug: workspace.slug,
      user_slug: user.slug
    )

    workspace.channels.shuffle.each do |channel|
      next if user.is_channel_sub?(channel) || is_random_true?
  
      ChannelSub.create!(
        channel_slug: channel.slug,
        user_slug: user.slug
      )
  
      [*1..10].sample.times do
        next if is_random_true?
        Message.create!(
          body: random_lorem_short_or_long,
          author_slug: user.slug,
          channel_slug: channel.slug
        )
      end
  
      random_parent_message = channel.parent_messages.sample
      next if random_parent_message.nil? || rand < 0.60
      Message.create!(
        body: random_lorem_short_or_long,
        author_slug: user.slug,
        channel_slug: channel.slug,
        parent_message_slug: random_parent_message.slug
      )
    end
  end
end

# Subscribe first user to all workspaces and channels
Workspace.all.each do |workspace|
  WorkspaceSub.create!(workspace_slug: workspace.slug, user_slug: User.first.slug)
end

Channel.all.each do |channel|
  ChannelSub.create!(channel_slug: channel.slug, user_slug: User.first.slug)
end