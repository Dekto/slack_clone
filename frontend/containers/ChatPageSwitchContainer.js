import { connect } from 'react-redux';
import {
  getChatroomsMap,
  getChatViewChannels,
  getMessagesMap,
  getAllThreadViewMessages,
  getDrawerPath,
  getChatroomViewMessages,
} from '../reducers/selectors';
import {
  fetchMessages,
  createMessage,
  fetchUserThreads,
} from '../actions/messageActions';
import {
  updateDrawer,
  updateModal,
  updateScrollLocation,
  updateChatPath,
} from '../actions/uiActions';
import { createChatroomSub } from '../actions/chatroomActions';
import { clearAllUnread, fetchUnreads } from '../actions/readActions';
import ChatPageSwitch from '../components/ChatPageSwitch';

const mapStateToProps = (state, { match: { params: { chatPath } } }) => {
  const chatroom = getChatroomsMap(state)[chatPath];
  let messages = [];

  if (chatPath === 'unreads') {
    messages = getMessagesMap(state);
  } else if (chatPath === 'threads') {
    messages = getAllThreadViewMessages(state);
  } else {
    messages = getChatroomViewMessages(state);
  }

  const { drawerType } = state.ui.drawer;
  let drawerPath = getDrawerPath(state);

  if (chatroom && drawerType === 'details') {
    drawerPath = '';
  }

  return {
    usersMap: state.entities.members,
    currentUser: state.session.currentUser,
    isLoading: state.isLoading,
    drawerPath,
    chatPath,
    chatroom,
    messages,
    unreadsMap: state.entities.unreads,
    chatrooms: getChatViewChannels(state),
  };
};

const mapDispatchToProps = (dispatch, { match: { params } }) => ({
  updateChatPath: () => dispatch(updateChatPath(params.chatPath)),
  fetchChatPageData: () => {
    let slug = params.workspaceSlug;
    let fetchChatPage;

    if (params.chatPath === 'unreads') {
      fetchChatPage = fetchUnreads;
    } else if (params.chatPath === 'threads') {
      fetchChatPage = fetchUserThreads;
    } else {
      slug = params.chatPath;
      fetchChatPage = fetchMessages;
    }

    return dispatch(fetchChatPage.request(slug));
  },
  createChatroomSubRequest: chatroomId => (
    dispatch(createChatroomSub.request({ chatroomSlug: params.chatPath, chatroomId }))
  ),
  fetchHistoryRequest: lastId => (
    dispatch(fetchMessages.request(params.chatPath, lastId))
  ),
  updateScrollLocation: (chatroomSlug, scrollLoc) => (
    dispatch(updateScrollLocation(chatroomSlug, scrollLoc))
  ),
  clearAllUnread: (chatroomSlug, lastRead) => dispatch(clearAllUnread(chatroomSlug, lastRead)),
  closeDrawer: () => dispatch(updateDrawer(null)),
  openModal: modalType => dispatch(updateModal(modalType, null)),
  createMessageRequest: message => dispatch(createMessage.request(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPageSwitch);
