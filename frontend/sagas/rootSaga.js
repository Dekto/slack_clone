import { fork, all } from 'redux-saga/effects';
import sessionSaga from './sessionSaga';
import workspaceSaga from './workspaceSaga';
import channelSaga from './channelSaga';
import channelSubSaga from './channelSubSaga';
import workspaceSubSaga from './workspaceSubSaga';
import messageSaga from './messageSaga';
import threadMessageSaga from './threadMessageSaga';
import favoriteSaga from './favoriteSaga';
import navigateSaga from './navigateSaga';
import sidebarSaga from './sidebarSaga';
import reactionSaga from './reactionSaga';

export default function* root() {
  yield all([
    fork(navigateSaga),
    fork(sessionSaga),
    fork(workspaceSaga),
    fork(channelSaga),
    fork(channelSubSaga),
    fork(workspaceSubSaga),
    fork(messageSaga),
    fork(threadMessageSaga),
    fork(favoriteSaga),
    fork(reactionSaga),
    fork(sidebarSaga),
  ]);
}
