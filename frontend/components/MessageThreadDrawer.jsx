import React from 'react';
import MessagesListContainer from './MessagesListContainer';
import MessageForm from './MessageForm';
import ScrollBar from './ScrollBar';
import withScrollManager from './withScrollManager';
import './MessageThreadDrawer.css';

const MessageThreadDrawer = ({ messages, createMessageRequest, ...props }) => {
  const parentMessage = messages[0];
  const filterMenuItems = ['convo'];

  if (!parentMessage) {
    return null;
  }

  return (
    <div className="MessageThreadDrawer">
      <ScrollBar {...props}>
        <MessagesListContainer
          messages={messages}
          role="listitem"
          filterMenuItems={filterMenuItems}
          isThreadHidden
          isHoverable
        />
        <MessageForm
          channelId={parentMessage.channelId}
          parentMessageId={parentMessage.id}
          parentMessageSlug={parentMessage.slug}
          createMessageRequest={createMessageRequest}
          hasSubmitButton
        />
      </ScrollBar>
    </div>
  );
};

export default withScrollManager('Message')(MessageThreadDrawer);
