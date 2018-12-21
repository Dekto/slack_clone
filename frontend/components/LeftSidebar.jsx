import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './Modal';
import Menu from './Menu';
import StatusIcon from './StatusIcon';
import Button from './Button';
import LeftSidebarMenus from './LeftSidebarMenus';
import InlineSuffixButton from './InlineSuffixButton';
import ProfileDropdown from './ProfileDropdown';
import './LeftSidebar.css';

class LeftSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleDmUnsubClick = this.handleDmUnsubClick.bind(this);
    this.handleHistoryPush = this.handleHistoryPush.bind(this);
  }

  handleDmUnsubClick(e) {
    e.preventDefault();

    const { updateChannelSubRequest } = this.props;
    const dmChannelSlug = e.target.id;
    updateChannelSubRequest(dmChannelSlug);
  }

  handleHistoryPush(linkUrl) {
    const {
      match: { url },
      drawer: { drawerType, drawerSlug },
      history,
      isModalOpen,
      closeModal,
    } = this.props;

    let menuUrl = `${url}/${linkUrl}`;
    if (drawerType && drawerType !== 'details') {
      menuUrl += `/${drawerType}`;

      if (drawerSlug) {
        menuUrl += `/${drawerSlug}`;
      }
    }

    if (isModalOpen) {
      closeModal();
    }

    history.push(menuUrl);
  }

  render() {
    const {
      dmChannels,
      subbedChannels,
      hasUnreadChannels,
      hasUnreadConvos,
      user,
      workspace,
      closeModal,
      isModalOpen,
      isDdOpen,
      openDropdown,
      closeDropdown,
      dropdownProps,
      workspaces,
      chatPath,
      openModal,
      isMobileSize,
      match: { url },
    } = this.props;

    const openChatModal = () => openModal('MODAL_CHAT', { workspaceId: workspace.id });
    const openChatsModal = () => openModal('MODAL_CHATS', { workspaceSlug: workspace.slug });

    const quickLinksList = [
      {
        icon: <FontAwesomeIcon icon="align-left" />,
        label: 'All Unreads',
        onClick: () => this.handleHistoryPush('unreads'),
        isItemActive: chatPath === 'unreads',
        modifierClassName: hasUnreadChannels ? 'unread' : null,
      },
      {
        icon: <FontAwesomeIcon icon={['far', 'comment']} />,
        label: 'All Threads',
        onClick: () => this.handleHistoryPush('threads'),
        isItemActive: chatPath === 'threads',
        modifierClassName: hasUnreadConvos ? 'unread' : null,
      },
    ];

    const channelsItems = subbedChannels.map(ch => ({
      ...ch,
      icon: <FontAwesomeIcon icon="hashtag" size="sm" />,
    }));

    const dmChannelsItems = dmChannels.map(({ status, ...ch }) => ({
      ...ch,
      icon: <StatusIcon member={{ status }} />,
      label: (
        <InlineSuffixButton
          id={ch.slug}
          icon="times-circle"
          onClick={this.handleDmUnsubClick}
        >
          {ch.label}
        </InlineSuffixButton>
      ),
    }));

    const sidebarMenuItems = [
      {
        key: 'profile',
        component: ProfileDropdown,
        props: {
          chatPath,
          url,
          workspace,
          workspaces,
          user,
          isDdOpen,
          dropdownProps,
          openDropdown,
          closeDropdown,
        },
      },
      { key: 'quicklinks', component: Menu, items: quickLinksList },
      {
        key: 'chats',
        component: Menu,
        items: channelsItems,
        title: (
          <InlineSuffixButton icon="plus-circle" onClick={openChatModal}>
            <Button unStyled buttonFor="chats" onClick={openChatsModal}>Channels</Button>
          </InlineSuffixButton>
        ),
      },
      {
        key: 'dm-chats',
        component: Menu,
        items: dmChannelsItems,
        title: 'Direct Messages',
      }
    ];

    return (
      <aside className="LeftSidebar">
        <LeftSidebarMenus menuGroups={sidebarMenuItems} />
        {isModalOpen && isMobileSize && (
          <Modal
            isOpen
            modalFor="left-sidebar"
            modalPos="left"
            close={closeModal}
            hasDarkOverlay
            unStyled
          >
            <LeftSidebarMenus menuGroups={sidebarMenuItems} />
          </Modal>
        )}
      </aside>
    );
  }
}

export default LeftSidebar;
