import { select } from 'redux-saga/effects';
import { selectEntityBySlug, selectUIByDisplay, getCurrentUser } from '../reducers/selectors';

export const getReadProps = msg => ({
  slug: msg.parentMessageSlug || msg.channelSlug,
  readableType: msg.parentMessageSlug ? 'Message' : 'Channel',
  readableId: msg.parentMessageId || msg.channelId,
});

export function* getUnread(props) {
  const unread = yield select(selectEntityBySlug, 'unreads', props.slug);

  return {
    lastRead: unread && unread.lastRead,
    ...props,
    ...unread,
  };
}

export function* isCurrentUserNotInConvo(authors) {
  const currUser = yield select(getCurrentUser);

  return authors && authors.every(authorSlug => authorSlug !== currUser.slug);
}

export function* isCurrentUserInView({ slug, readableType }) {
  const chatPath = yield select(selectUIByDisplay, 'displayChatPath');

  if (readableType === 'Channel') {
    return chatPath === slug;
  }

  if (chatPath === 'threads') {
    return true;
  }

  const drawer = yield select(selectUIByDisplay, 'drawer');

  return drawer.drawerType === 'convo' && drawer.drawerSlug === slug;
}