import React from 'react';
import MessageContainer from './MessageContainer';
import MessageFormContainer from './MessageFormContainer';
import RightSidebarContainer from '../Layout/RightSidebarContainer';

class MessageThread extends React.Component {
  componentDidMount() {
    const { message, ...props } = this.props;

    if (props.isWorkspaceLoaded) {
      props.fetchMessageRequest(props.messageSlug);
      if (message) props.readUpdateRequest(message.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { message, messageSlug, ...props } = this.props;

    if (messageSlug !== prevProps.messageSlug) {
      props.fetchMessageRequest(messageSlug);
      if (message) props.readUpdateRequest(message.id);
    }
  }

  render() {
    const { message, threadMessages, ...props } = this.props;

    if (!message || !props.isWorkspaceLoaded) {
      return null;
    }

    return (
      <RightSidebarContainer
        sidebarType="Thread"
        sidebarSubtitle={`Author: ${message.authorId}`}
      >
        <div className="thread">
          <div className="thread__message">
            <MessageContainer
              author={props.authors[message.authorSlug]}
              isSingleMessage
              message={message}
            />
          </div>
          {threadMessages && (
            <div className="thread__messages">
              {threadMessages.map(threadMessage => (
                <MessageContainer
                  key={threadMessage.slug}
                  message={threadMessage}
                  author={props.authors[threadMessage.authorSlug]}
                />
              ))}
            </div>
          )}
          <MessageFormContainer
            parentMessageId={message.id}
          />
        </div>
      </RightSidebarContainer>
    );
  }
}

export default MessageThread;
