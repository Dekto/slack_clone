import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signOut, signUp, signIn } from '../actions/sessionActions';
import { fetchWorkspaces, updateWorkspaceSub, createWorkspaceSub } from '../actions/workspaceActions';
import { updateDropdown, updateModal } from '../actions/uiActions';
import { getSubbedWorkspaces } from '../reducers/selectors';
import PublicView from './PublicView';

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.currentUser,
  workspacesMap: state.entities.workspaces,
  subbedWorkspaces: getSubbedWorkspaces(state),
  currentUser: state.session.currentUser,
});

const mapDispatchToProps = (dispatch, { location }) => ({
  fetchWorkspacesRequest: () => dispatch(fetchWorkspaces.request()),
  openModal: (modalType, modalProps) => dispatch(updateModal(modalType, modalProps)),
  openDropdown: (ddType, ddProps) => dispatch(updateDropdown(ddType, ddProps)),
  closeDropdown: () => dispatch(updateDropdown(null)),
  createWorkspaceSubRequest: workspaceSub => dispatch(createWorkspaceSub.request(workspaceSub)),
  updateWorkspaceSubRequest: workspaceSub => dispatch(updateWorkspaceSub.request(workspaceSub)),
  signOutRequest: () => dispatch(signOut.request()),
  sessionRequest: (user) => {
    if (location.pathname === '/signin') {
      return dispatch(signIn.request(user));
    }

    return dispatch(signUp.request(user));
  },
});

const withPublicView = (WrappedComponent) => {
  const WithPublicView = props => (
    <PublicView
      {...props}
      render={content => <WrappedComponent content={content} {...props} />}
    />
  );

  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  WithPublicView.displayName = `withPublicView(${wrappedComponentName})`;

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(WithPublicView));
};

export default withPublicView;
