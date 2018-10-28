import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import MessageHoverMenu from './MessageHoverMenu';
import Reactions from './Reactions';
import Avatar from './Avatar';
import MessageContent from './MessageContent';
import SingleMessageThread from './SingleMessageThread';
import ChannelSub from './ChannelSub';
import { dateUtil } from '../util/dateUtil';
import './Message.css';

const Message = ({
  match: { url },
  message,
  role,
  updateMessageRequest,
  createReactionRequest,
  users,
  reactions,
  modalOpen,
  deleteMessageRequest,
  createFavoriteRequest,
  deleteFavoriteRequest,
  deleteReactionRequest,
  createPinRequest,
  destroyPinRequest,
  isThreadHidden,
  isSearch,
  currentUser,
  handleEditToggle,
  handleHover,
  hoverMessageId,
  editMessageId,
  ddToggle,
  children,
}) => {
  const hasHover = message.id === hoverMessageId;
  const isEditing = message.id === editMessageId;
  const avatar = {
    slug: message.authorSlug,
    username: message.authorName,
    avatarThumb: message.avatarThumb,
  };
  const authorUrl = `${url}/team/${message.authorSlug}`;
  const dateCreated = dateUtil(message.createdAt).localTime();
  const entryReactions = reactions.filter(item => item.messageId === message.id);
  const hasReactions = !!entryReactions.length;

  const toggleHover = () => {
    if (handleHover) {
      const hoverId = hasHover ? -1 : message.id;
      handleHover(hoverId);
    }
  };

  const entryClassNames = classNames('Message', {
    'Message--editing': isEditing,
    'Message--hover': hasHover && !isEditing,
  });

  return (
    <div
      role={role}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      className={entryClassNames}
    >
      <Avatar baseUrl={url} author={avatar} />
      <div className="Message__body">
        {isSearch || isEditing || (
          <MessageHoverMenu
            {...message}
            ddToggle={ddToggle}
            isEditing={isEditing}
            handleEditToggle={handleEditToggle}
            createFavorite={createFavoriteRequest}
            deleteMessage={deleteMessageRequest}
            deleteFavorite={deleteFavoriteRequest}
            deleteReaction={deleteReactionRequest}
            createPin={createPinRequest}
            destroyPin={destroyPinRequest}
            currentUser={currentUser}
            modalOpen={modalOpen}
          />
        )}
        <div className="Message__content">
          <div className="Message__meta">
            <Link to={authorUrl} className="Message__author">
              {message.authorName}
            </Link>
            <time className="Message__time">{dateCreated}</time>
          </div>
          {message.entityType === 'entry' && (
            <MessageContent
              isEditing={isEditing}
              content={message.body}
              updateMessageRequest={updateMessageRequest}
              closeEditor={handleEditToggle}
              messageSlug={message.slug}
            />
          )}
          {message.entityType === 'entry' || <ChannelSub sub={message} />}
        </div>
        {(hasReactions && !isSearch) && (
          <Reactions
            createReaction={createReactionRequest}
            reactions={entryReactions}
            userId={currentUser.id}
            messageId={message.id}
          />
        )}
        <SingleMessageThread
          matchUrl={url}
          users={users}
          isThreadHidden={isThreadHidden}
          {...message}
        />
        {children}
      </div>
    </div>
  );
};

export default Message;
