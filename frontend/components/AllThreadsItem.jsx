import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkWithDrawer from '../util/linkUtil';
import MessageThreadAuthors from './MessageThreadAuthors';
import MessagesListContainer from './MessagesListContainer';
import MessageForm from './MessageForm';
import './AllThreadsItem.css';

const AllThreadsItem = ({
  convo,
  users,
  currentUserSlug,
  workspaceSlug,
}) => {
  const channelUrl = `/${workspaceSlug}/messages/${convo.channelSlug}`;

  return (
    <div className="AllThreadsItem" role="listitem">
      <header className="AllThreadsItem__header">
        <LinkWithDrawer to={channelUrl} className="AllThreadsItem__title">
          <FontAwesomeIcon icon="hashtag" size="xs" className="AllThreadsItem__hashtag" />
          <div className="AllThreadsItem__title-text">{convo.channelTitle}</div>
        </LinkWithDrawer>
        <MessageThreadAuthors
          parentAuthorSlug={convo.authorSlug}
          authors={convo.authors}
          users={users}
          currentUserSlug={currentUserSlug}
        />
      </header>
      <div className="AllThreadsItem__body">
        <div className="AllThreadsItem__list" role="list">
          <MessagesListContainer
            messages={convo.messages}
            role="listitem"
            isThreadHidden
            isHoverable
          />
        </div>
        <MessageForm
          channelId={convo.channelId}
          convoId={convo.id}
          convoSlug={convo.slug}
        />
      </div>
    </div>
  );
};

export default AllThreadsItem;
