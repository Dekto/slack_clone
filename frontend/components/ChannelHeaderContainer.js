import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateModal,
  updateDrawer,
  accordionOpen,
  destroySearch,
  fetchSearch,
} from '../actions/uiActions';
import { destroyChannelSub } from '../actions/channelActions';
import { selectMessages, selectChannelsMap } from '../reducers/selectors';
import ChannelHeader from './ChannelHeader';

const mapStateToProps = (state, { match: { params: { chatPath } } }) => ({
  chatPath,
  channelsMap: selectChannelsMap(state),
  messages: selectMessages(state),
  users: state.entities.members,
  currentUser: state.session.currentUser,
  modalType: state.ui.displayModal.modalType,
  drawerType: state.ui.drawer.drawerType,
  searchQuery: state.ui.searchQuery,
  isLoading: state.isLoading.search,
});

const mapDispatchToProps = dispatch => ({
  openModal: (modalType, modalProps = null) => dispatch(updateModal(modalType, modalProps)),
  closeDrawer: () => dispatch(updateDrawer(null)),
  accordionOpen: accordionType => dispatch(accordionOpen('details', accordionType)),
  fetchSearchRequest: (query, shouldNotSearch = false) => (
    dispatch(fetchSearch.request(query, shouldNotSearch))
  ),
  destroySearch: () => dispatch(destroySearch()),
  destroyChannelSubRequest: channelSlug => dispatch(destroyChannelSub.request(channelSlug)),
  closeModal: () => dispatch(updateModal(null)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelHeader));
