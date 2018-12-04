import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateMessage,
  deleteMessage,
  createPin,
  destroyPin,
  toggleMessageEditor,
} from '../actions/messageActions';
import { toggleReaction } from '../actions/reactionActions';
import { toggleFavorite } from '../actions/favoriteActions';
import { updateModal, updateDropdown } from '../actions/uiActions';
import MessagesList from './MessagesList';

const mapStateToProps = (state, { match: { url } }) => ({
  currentUserSlug: state.session.currentUser.slug,
  users: state.entities.members,
  pinsMap: state.entities.pins,
  dropdownProps: state.ui.dropdown.dropdownProps,
  isDdOpen: state.ui.dropdown.dropdownType === 'DROPDOWN_MESSAGE',
  url,
});

const mapDispatchToProps = dispatch => ({
  updateMessageRequest: message => dispatch(updateMessage.request(message)),
  deleteMessageRequest: messageSlug => dispatch(deleteMessage.request(messageSlug)),
  toggleReaction: reaction => dispatch(toggleReaction(reaction)),
  toggleFavorite: favorite => dispatch(toggleFavorite(favorite)),
  toggleMessageEditor: slug => dispatch(toggleMessageEditor(slug)),
  createPinRequest: pin => dispatch(createPin.request(pin)),
  destroyPinRequest: id => dispatch(destroyPin.request(id)),
  openModal: (modalType, modalProps) => dispatch(updateModal(modalType, modalProps)),
  openDropdown: (ddType, ddProps) => dispatch(updateDropdown(ddType, ddProps)),
  closeDropdown: () => dispatch(updateDropdown(null)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesList));
