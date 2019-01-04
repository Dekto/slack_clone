import React from 'react';
import ChannelHeaderContainer from './ChannelHeaderContainer';
import AllUnreads from './AllUnreads';
import AllThreads from './AllThreads';
import Channel from './Channel';
import { PageRoutes } from '../util/routeUtil';
import './ChatPageSwitch.css';

class ChatPageSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isInitLoadingDone: false };
  }

  componentDidMount() {
    this.updateChatPath();
    this.getChatData();
    this.updateHistoryDrawerPath();
  }

  componentDidUpdate(prevProps) {
    const {
      match: { isExact },
      drawerType,
      closeDrawer,
      chatPath,
      channel,
      isLoading,
    } = this.props;

    if (chatPath !== prevProps.chatPath) {
      this.updateChatPath();

      if (channel && channel.shouldFetch) {
        this.getChatData();
      }

      if (!channel) {
        this.getChatData();
      }
    }

    if (channel && drawerType && isExact && !prevProps.isExact) {
      if (chatPath === prevProps.chatPath) {
        closeDrawer();
        return;
      }
    }

    this.updateHistoryDrawerPath();

    if (!isLoading.channel && prevProps.isLoading) {
      this.updateLoadingState();
    }
  }

  getChatData() {
    const { fetchChatPageData } = this.props;
    fetchChatPageData();
  }

  getDrawerRedirectPath() {
    const {
      match: { url, isExact },
      drawerType,
      drawerSlug,
      channel,
    } = this.props;

    if (isExact && drawerType === 'details' && !channel) {
      return null;
    }

    if (isExact && drawerType) {
      if (drawerSlug) {
        return `${url}/${drawerType}/${drawerSlug}`;
      }

      return `${url}/${drawerType}`;
    }

    return null;
  }

  updateChatPath() {
    const { updateChatPath, chatPath } = this.props;
    updateChatPath(chatPath);
  }

  updateHistoryDrawerPath() {
    const { history } = this.props;

    if (this.getDrawerRedirectPath()) {
      history.replace(this.getDrawerRedirectPath());
    }
  }

  updateLoadingState() {
    const { isInitLoadingDone } = this.state;

    if (!isInitLoadingDone) {
      this.setState({ isInitLoadingDone: true });
    }
  }

  render() {
    const {
      chatPath,
      routes,
      messages,
      users,
      channel,
      channels,
      currentUser,
      isLoading,
      clearUnreads,
      openModal,
      updateScrollLocation,
      fetchHistoryRequest,
      createChannelSubRequest,
      createMessageRequest,
      match: { url, params: { workspaceSlug } },
    } = this.props;
    const { isInitLoadingDone } = this.state;

    let chatType = 'channel';
    if (chatPath === 'unreads' || chatPath === 'threads') {
      chatType = chatPath;
    }

    return (
      <div className={`ChatPageSwitch ChatPageSwitch__${chatType}`}>
        <ChannelHeaderContainer />
        <div className="ChatPageSwitch__row">
          <div className="ChatPageSwitch__body">
            {chatPath === 'unreads' && (
              <AllUnreads
                messagesMap={messages}
                users={users}
                isLoading={isLoading.channel}
                channels={channels}
                clearUnreads={clearUnreads}
              />
            )}
            {chatPath === 'threads' && (
              <AllThreads
                messages={messages}
                users={users}
                isLoading={isLoading.channel}
                currentUserSlug={currentUser.slug}
                workspaceSlug={workspaceSlug}
                createMessageRequest={createMessageRequest}
              />
            )}
            {channel && (
              <Channel
                messages={messages}
                isLoading={isLoading}
                channel={channel}
                currentUserSlug={currentUser.slug}
                openModal={openModal}
                fetchHistoryRequest={fetchHistoryRequest}
                createChannelSubRequest={createChannelSubRequest}
                createMessageRequest={createMessageRequest}
                updateScrollLocation={updateScrollLocation}
                matchUrl={url}
              />
            )}
          </div>
          {isInitLoadingDone && <PageRoutes routes={routes} />}
        </div>
      </div>
    );
  }
}

export default ChatPageSwitch;
