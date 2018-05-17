import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Message from './Message';
import {
  updateMessageRequest,
  deleteMessageRequest
} from '../../actions/messageActions';
import { openRightSidebar } from '../../actions/rightSidebarActions';

const mapStateToProps = (state, { message }) => ({
  isUserAuthor: state.session.currentUser.id === message.authorId
});

const mapDispatchToProps = dispatch => ({
  updateMessageRequest: message => dispatch(updateMessageRequest(message)),
  deleteMessageRequest: messageSlug => dispatch(
    deleteMessageRequest(messageSlug)
  ),
  openRightSidebar: sidebarProps => dispatch(
    openRightSidebar('Thread', sidebarProps)
  )
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Message)
);