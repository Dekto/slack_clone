import React from 'react';
import Drawer from './Drawer';
import UserDrawer from './UserDrawer';
import FavoritesDrawer from './FavoritesDrawer';
import MessageThreadDrawer from './MessageThreadDrawer';
import ChannelDetailsDrawer from './ChannelDetailsDrawer';

class DrawerSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { openDrawer, drawerType, entitySlug: drawerSlug } = this.props;

    openDrawer({ drawerType, drawerSlug });
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
      fetchEntityRequest,
      openDrawer,
      drawerType,
      entitySlug: drawerSlug,
    } = this.props;

    if (pathname !== prevProps.location.pathname) {
      openDrawer({ drawerType, drawerSlug });

      if (prevProps.drawerType && drawerType !== prevProps.drawerType) {
        fetchEntityRequest();
      }
    }
  }

  handleClose() {
    const {
      closeDrawer,
      history,
      match: { params: { 0: pagePath, chatPath, workspaceSlug } },
    } = this.props;

    let chatPagePath = pagePath;
    if (chatPath) {
      chatPagePath += `/${chatPath}`;
    }

    closeDrawer();
    history.push(`/${workspaceSlug}/${chatPagePath}`);
  }

  render() {
    const {
      entitySlug: drawerSlug,
      drawerType,
      messages,
      users,
      channel,
      isLoading,
      currentUser,
      accordion,
      openProfileModal,
      createChannelRequest,
    } = this.props;

    if (drawerType === 'details' && !channel) {
      return null;
    }

    return (
      <Drawer drawerType={drawerType} closeDrawer={this.handleClose} channel={channel}>
        {drawerType === 'team' && (
          <UserDrawer
            userSlug={drawerSlug}
            currentUser={currentUser}
            users={users}
            openProfileModal={openProfileModal}
            createChannelRequest={createChannelRequest}
          />
        )}
        {drawerType === 'favorites' && (
          <FavoritesDrawer messages={messages} users={users} />
        )}
        {drawerType === 'convo' && (
          <MessageThreadDrawer
            messages={messages}
            users={users}
            isLoading={isLoading}
            currentUser={currentUser}
          />
        )}
        {(drawerType === 'details' && channel) && (
          <ChannelDetailsDrawer
            users={users}
            channel={channel}
            accordion={accordion}
          />
        )}
      </Drawer>
    );
  }
}

export default DrawerSwitch;