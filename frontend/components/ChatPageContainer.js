import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectChatMessagesBySlug, selectChatChannelsBySlug } from '../reducers/selectors';
import { fetchMessages, fetchUserThreads, fetchHistory } from '../actions/messageActions';
import { fetchUnreads } from '../actions/readActions';
import { loadChatPage, createChannelSub } from '../actions/channelActions';
import { drawerClose } from '../actions/uiActions';
import { clearUnreads } from '../actions/unreadActions';
import ChatPage from './ChatPage';

const mapStateToProps = (state, { match: { params: { chatPath } } }) => ({
  chatPath,
  isWorkspaceLoaded: !!state.ui.displayWorkspaceSlug,
  drawerType: state.ui.drawer.drawerType,
  drawerSlug: state.ui.drawer.drawerSlug,
  users: state.entities.members,
  modal: state.ui.displayModal,
  isLoading: state.ui.isPageLoading,
  currentUser: state.session.currentUser,
  channels: selectChatChannelsBySlug(state, chatPath),
  messages: selectChatMessagesBySlug(state, chatPath),
});

const mapDispatchToProps = (dispatch, { match: { params: { workspaceSlug, chatPath } } }) => ({
  fetchEntriesRequest: () => {
    if (chatPath === 'unreads') {
      return dispatch(fetchUnreads.request(workspaceSlug));
    }

    if (chatPath === 'threads') {
      return dispatch(fetchUserThreads.request(workspaceSlug));
    }

    return dispatch(fetchMessages.request(chatPath));
  },
  loadChatPage: pagePath => dispatch(loadChatPage(pagePath)),
  drawerClose: () => dispatch(drawerClose()),
  createChannelSubRequest: channelSub => dispatch(createChannelSub.request(channelSub)),
  fetchHistoryRequest: startDate => dispatch(fetchHistory.request(startDate)),
  clearUnreads: channelSlug => dispatch(clearUnreads(channelSlug)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
