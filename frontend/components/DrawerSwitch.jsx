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
    const { openDrawer, drawerType, drawerSlug } = this.props;

    openDrawer({ drawerType, drawerSlug });
  }

  componentDidUpdate(prevProps) {
    const { drawerType, fetchEntityRequest } = this.props;

    if (drawerType && drawerType !== prevProps.drawerType) {
      fetchEntityRequest();
    }
  }

  getMessages() {
    const {
      drawerType,
      messagesMap,
      chatPath,
      favorites,
    } = this.props;

    const messages = Object.values(messagesMap);

    if (drawerType === 'details') {
      return messages.filter(msg => msg.pinId && msg.channelSlug === chatPath);
    }

    if (drawerType === 'favorites') {
      return favorites.sort((a, b) => (
        new Date(b.createdAt) - new Date(a.createdAt)
      )).map(msg => messagesMap[msg.messageSlug]);
    }

    if (drawerType === 'convo') {
      return messagesMap;
    }

    return [];
  }

  getChannel() {
    const { channelsMap, chatPath } = this.props;
    return channelsMap[chatPath];
  }

  getDrawerTitle() {
    const { drawerType } = this.props;

    let title;
    switch (drawerType) {
      case 'favorites':
        title = 'Starred items';
        break;
      case 'convo':
        title = 'Thread';
        break;
      case 'team':
        title = 'Workspace directory';
        break;
      case 'details': {
        const channel = this.getChannel();
        if (channel && !channel.hasDm) {
          title = `About #${channel.title}`;
        }

        if (channel && channel.hasDm) {
          title = 'About this conversation';
        }

        break;
      }
      default: break;
    }

    return title;
  }

  handleClose() {
    const {
      closeDrawer,
      history,
      match: { params: { 0: drawerParent, workspaceSlug } },
    } = this.props;

    closeDrawer();
    history.replace(`/${workspaceSlug}/${drawerParent}`);
  }

  render() {
    const {
      drawerSlug,
      drawerType,
      users,
      isLoading,
      currentUser,
      accordion,
      createChannelRequest,
      destroyPinRequest,
      modalOpen,
      history,
      match: { params: { workspaceSlug } },
    } = this.props;

    const channel = this.getChannel();

    if (drawerType === 'details' && !channel) {
      return null;
    }

    const currentUserSlug = currentUser.slug;
    const drawers = [
      {
        component: UserDrawer,
        path: 'team',
        drawerSlug,
        createChannelRequest,
        history,
        workspaceSlug,
        currentUserSlug,
        modalOpen,
      },
      { component: FavoritesDrawer, path: 'favorites' },
      { component: MessageThreadDrawer, path: 'convo' },
      {
        component: ChannelDetailsDrawer,
        path: 'details',
        channel,
        accordion,
        isLoading: isLoading.drawer,
        destroyPinRequest,
        currentUserSlug,
        modalOpen,
      },
    ];

    return drawers.filter(drawer => drawer.path === drawerType)
      .map(({ component: Component, path, ...props }) => (
        <Drawer
          key={path}
          isLoading={isLoading.drawer}
          users={users}
          drawerType={drawerType}
          drawerTitle={this.getDrawerTitle()}
          modalOpen={modalOpen}
          closeDrawer={this.handleClose}
          messages={this.getMessages()}
          currentUserSlug={currentUser.slug}
          children={drawerProps => <Component {...props} {...drawerProps} />}
        />
      ));
  }
}

export default DrawerSwitch;
