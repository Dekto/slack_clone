const values = entities => Object.values(entities);
const sortEntityId = (entity, a, b) => entity[a.slug].id - entity[b.slug].id;

export const selectCurrentUser = ({ session: { currentUser } }) => currentUser;

export const selectWorkspaces = ({ entities: { workspaces } }) => (
  values(workspaces).sort((a, b) => sortEntityId(workspaces, a, b))
);

export const selectSubbedWorkspaces = ({ entities: { workspaces }, session: { currentUser } }) => (
  values(workspaces).filter(workspace => workspace.members.includes(currentUser.slug))
);

export const selectUnsubbedChats = ({ entities: { channels }, session: { currentUser } }) => (
  values(channels).filter(ch => !ch.members.includes(currentUser.slug) && !ch.hasDm)
);

const selectDmWithUser = (channel, members, currUserSlug) => {
  const dmWith = channel.members.filter(userSlug => userSlug !== currUserSlug);
  return dmWith[0] && members[dmWith[0]];
};

export const selectDmChats = ({ entities: { channels, channelSubs, members }, session }) => {
  const { currentUser } = session;
  const currMember = members[currentUser.slug];

  if (!currMember || !currMember.subs) {
    return [];
  }

  return currMember.subs
    .map(subId => channelSubs[subId])
    .filter(sub => channels[sub.channelSlug].hasDm && sub.inSidebar)
    .map(({ channelSlug }) => {
      const channel = Object.assign({}, channels[channelSlug]);
      const dmUser = selectDmWithUser(channel, members, currMember.slug);
      const subs = channel.subs.filter(id => channelSubs[id].userId === currMember.id);
      const [subId] = subs;

      if (dmUser) {
        channel.title = dmUser.username;
        channel.userStatus = dmUser.status;
      }

      if (subId) {
        channel.userSubId = subId;
      }

      return channel;
    });
};

export const selectSubbedChats = ({ entities: { channels }, session: { currentUser } }) => (
  values(channels)
    .filter(ch => ch.members.includes(currentUser.slug))
    .sort((a, b) => a.title && a.title.localeCompare(b.title))
);

export const selectReactionByMessageEmoji = (state, { messageId, emoji }) => {
  const { entities: { reactions }, session: { currentUser } } = state;
  const filtered = values(reactions).filter(reaction => (
    reaction.userId === currentUser.id
    && reaction.messageId === messageId
    && reaction.emoji === emoji
  ));

  return !filtered.length ? null : filtered[0];
};

export const getReactionCounts = ({ entities: { reactions }, session }, messageSlug) => {
  const { currentUser } = session;

  return values(reactions)
    .filter(reaction => reaction.messageSlug === messageSlug)
    .reduce((acc, curr) => {
      if (!acc[curr.emoji]) {
        acc[curr.emoji] = { users: [] };
      }

      acc[curr.emoji].users.push(curr.userId);
      acc[curr.emoji].hasCurrentUser = curr.userId === currentUser.id;

      return acc;
    }, {});
};

const messagesWithEntitiesMap = ({ messages, members }) => (
  values(messages).reduce((acc, curr) => {
    const message = messages[curr.slug];
    const author = members && members[curr.authorSlug];

    if (author) {
      message.authorName = author.username;
    }

    acc[curr.slug] = message;

    return acc;
  }, {})
);

const selectMessagesFavorites = ({ favorites, messages, members }) => {
  const entries = messagesWithEntitiesMap({ messages, members });
  return values(favorites).map(({ messageSlug }) => entries[messageSlug]);
};

const selectMessageThreadBySlug = ({ messages, members }, slug) => {
  const entries = messagesWithEntitiesMap({ messages, members });
  const message = entries[slug];

  if (!message || !message.thread) {
    return [];
  }

  return message.thread.reduce((acc, curr) => {
    acc.push(entries[curr]);
    return acc;
  }, [message]);
};

export const selectMessageChildrenBySlug = ({ entities }, slug) => (
  selectMessageThreadBySlug(entities, slug).slice(1)
);

const selectChannelMessages = (channel, messages) => (
  values(messages)
    .filter(message => (channel.id === message.channelId && !message.parentMessageId))
    .sort((a, b) => sortEntityId(messages, a, b))
);

const selectAllThreadMessages = (entities) => {
  const entries = messagesWithEntitiesMap(entities);

  return values(entries)
    .filter(message => message.isInConvo)
    .reduce((acc, curr) => {
      const convo = Object.assign({}, curr);
      convo.thread = selectMessageChildrenBySlug({ entities }, curr.slug);
      acc.push(convo);
      return acc;
    }, [])
    .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
};

export const selectChatMessagesBySlug = ({ entities }, slug) => {
  const { messages, channels, members } = entities;
  const entries = messagesWithEntitiesMap({ messages, members });

  if (channels[slug]) {
    return selectChannelMessages(channels[slug], entries);
  }

  if (slug === 'threads') {
    return selectAllThreadMessages(entities);
  }

  return entries;
};

export const selectDrawerMessagesByType = ({ entities, ui: { drawer } }) => {
  const { drawerType, drawerSlug } = drawer;

  if (drawerType === 'favorites') {
    return selectMessagesFavorites(entities);
  }

  if (drawerType === 'thread') {
    return selectMessageThreadBySlug(entities, drawerSlug);
  }

  return [];
};

const channelsWithEntitiesMap = ({ channels, members }, currentUserSlug) => (
  values(channels).reduce((acc, curr) => {
    const channel = channels[curr.slug];

    if (channel.hasDm) {
      const dmUser = selectDmWithUser(channel, members, currentUserSlug);

      if (dmUser) {
        channel.title = dmUser.username;
        channel.dmUserSlug = dmUser.slug;
      }
    } else {
      const owner = members[channel.ownerSlug];
      channel.ownerName = owner && owner.username;
      channel.isSub = channel.members.includes(currentUserSlug);
    }

    acc[curr.slug] = channel;

    return acc;
  }, {})
);

export const selectChannelsWithEntities = ({ entities, session: { currentUser } }) => (
  channelsWithEntitiesMap(entities, currentUser.slug)
);

const selectThreadChannels = channels => (
  values(channels).filter(ch => !ch.hasDm).reduce((acc, curr) => {
    acc[curr.slug] = channels[curr.slug];
    return acc;
  }, {})
);

export const selectChatChannelsBySlug = ({ entities, session: { currentUser } }, slug) => {
  const { channels, members } = entities;

  if (slug === 'unreads') {
    return values(channels).filter(ch => ch.hasUnreads && !ch.hasDm);
  }

  if (slug === 'threads') {
    return selectThreadChannels(channels);
  }

  return channelsWithEntitiesMap({ channels, members }, currentUser.slug);
};

export const selectEntities = ({ entities }, type) => entities[type];

export const selectEntityBySlug = ({ entities }, type, slug) => entities[type][slug];

export const selectUIByDisplay = ({ ui }, display) => ui[display];
