import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { signOut, signUp, signIn } from '../actions/sessionActions';
import { fetchWorkspaces } from '../actions/workspaceActions';
import { modalOpen } from '../actions/uiActions';
import { selectSubbedWorkspaces } from '../reducers/selectors';
import WorkspaceModal from './WorkspaceModal';
import Dropdown from './Dropdown';
import Menu from './Menu';
import './WithPublicView.css';

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.currentUser,
  workspaces: Object.values(state.entities.workspaces),
  subbedWorkspaces: selectSubbedWorkspaces(state),
  currentUser: state.session.currentUser,
});

const mapDispatchToProps = (dispatch, { location }) => ({
  fetchWorkspacesRequest: () => dispatch(fetchWorkspaces.request()),
  modalOpen: (modalType, modalProps) => dispatch(modalOpen(modalType, modalProps)),
  signOutRequest: () => dispatch(signOut.request()),
  sessionRequest: (user) => {
    if (location.pathname === '/signin') {
      return dispatch(signIn.request(user));
    }

    return dispatch(signUp.request(user));
  },
});

const withPublicView = (WrappedComponent) => {
  class WithPublicView extends React.Component {
    componentDidMount() {
      const { fetchWorkspacesRequest, isLoggedIn } = this.props;

      if (isLoggedIn) {
        fetchWorkspacesRequest();
      }
    }

    render() {
      const {
        signOutRequest,
        isLoggedIn,
        subbedWorkspaces,
        ...props
      } = this.props;
      const { workspaces, location: { pathname } } = props;
      const pagePath = pathname.length > 1 ? pathname.slice(1) : 'home';
      const pageClassNames = classNames('PublicView', {
        [`PublicView__${pagePath}`]: pagePath,
        [`PublicView__${pagePath}--member`]: pagePath && isLoggedIn,
        [`PublicView__${pagePath}--guest`]: pagePath && !isLoggedIn,
      });

      const workspaceItems = subbedWorkspaces.map(({ slug, title }) => ({
        key: slug,
        link: slug,
        label: title,
      }));
      const ddModifierClassName = subbedWorkspaces.length ? 'filled' : 'empty';
      const createWorkspaceItem = {
        key: 'createWorkspace',
        label: 'Create Workspace',
        onClick: () => modalOpen('MODAL_WORKSPACE')
      };
      workspaceItems.push(createWorkspaceItem);

      let navItems = [
        { key: 'signup', label: 'Sign Up', link: '/signup' },
        { key: 'signin', label: 'Sign In', link: '/signin' },
      ];

      if (isLoggedIn) {
        navItems = [{ key: 'signout', label: 'Sign Out', onClick: () => signOutRequest() }];
      }

      return (
        <div className={pageClassNames}>
          <header className="PublicView__header">
            <div className="PublicView__container">
              <nav className="navbar PublicView__navbar--public">
                <Link className="PublicView__logo" to="/" rel="home">
                  Slack Clone
                </Link>
                <Menu menuFor="public" isRow items={navItems} />
                {isLoggedIn && workspaces && (
                  <Dropdown
                    menuFor="workspaces"
                    menuPos="right"
                    togglerText="Your Workspaces"
                    modifier={ddModifierClassName}
                    style={{ fontWeight: 400, borderWidth: '2px' }}
                    items={workspaceItems}
                  />
                )}
              </nav>
            </div>
          </header>
          <WrappedComponent {...this.props} />
          <WorkspaceModal />
        </div>
      );
    }
  }

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(WithPublicView));
};

export default withPublicView;
