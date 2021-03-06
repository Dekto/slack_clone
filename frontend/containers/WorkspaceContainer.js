import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchWorkspace, fetchWorkspaces } from '../actions/workspaceActions';
import { getSubbedWorkspaces, getChatroomsMap } from '../reducers/selectors';
import Workspace from '../components/Workspace';

const mapStateToProps = (state, { match: { params: { workspaceSlug } } }) => {
  const chatroomsMap = getChatroomsMap(state);
  const { defaultChatroomSlug, displayChatroomSlug: currChatroomSlug } = state.ui;
  const chatroomSlug = currChatroomSlug || defaultChatroomSlug;
  const chatroom = chatroomsMap[chatroomSlug] || chatroomsMap[defaultChatroomSlug];

  return {
    isLoading: state.isLoading.workspace,
    workspace: state.entities.workspaces[workspaceSlug],
    workspaces: getSubbedWorkspaces(state),
    workspaceSlug,
    chatroomSlug,
    chatroom,
  };
};

const mapDispatchToProps = (dispatch, { match: { params: { workspaceSlug } } }) => ({
  fetchWorkspaceRequest: () => dispatch(fetchWorkspace.request(workspaceSlug)),
  fetchWorkspacesRequest: () => dispatch(fetchWorkspaces.request()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace));
