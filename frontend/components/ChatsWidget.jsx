import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from './Button';
import Menu from './Menu';
import ChatModal from './ChatModal';
import ChatsModal from './ChatsModal';
import './ChatsWidget.css';

class ChatsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }

  handleModalOpen(modalType) {
    const { modalOpen } = this.props;
    modalOpen(`MODAL_${modalType}`);
  }

  render() {
    const {
      channels,
      workspaceSlug,
      workspaceId,
      fetchChannelsRequest,
    } = this.props;
    const chats = channels.sort((a, b) => a.title && b.title && a.title.localeCompare(b.title));
    const subbedChannels = chats.filter(ch => ch.isSub);
    const unsubbedChannels = chats.filter(ch => !ch.isSub);

    const chatList = subbedChannels.map(item => ({
      icon: <FontAwesomeIcon className="Icon" icon={['fas', 'hashtag']} size="sm" />,
      label: item.title,
      link: `/${workspaceSlug}/messages/${item.slug}`,
      modifierClassName: item.hasUnreads ? 'unread' : null,
    }));

    return (
      <div className="SidebarWidget SidebarWidget__chats">
        <header className="SidebarWidget__header">
          <span className="SidebarWidget__title">
            <Button unStyled buttonFor="chats" onClick={() => this.handleModalOpen('CHATS')}>
              Channels
            </Button>
          </span>
          <Button unStyled buttonFor="widget" onClick={() => this.handleModalOpen('CHAT')}>
            <FontAwesomeIcon icon={['fas', 'plus-circle']} />
          </Button>
        </header>
        {subbedChannels && <Menu menuFor="chats" items={chatList} />}
        <ChatModal workspaceId={workspaceId} />
        <ChatsModal
          workspaceId={workspaceSlug}
          workspaceSlug={workspaceSlug}
          unsubbedChannels={unsubbedChannels}
          fetchChannelsRequest={fetchChannelsRequest}
        />
      </div>
    );
  }
}

export default ChatsWidget;
