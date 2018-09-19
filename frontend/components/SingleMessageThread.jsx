import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import './SingleMessageThread.css';

const SingleMessageThread = ({
  threadMessages,
  users,
  messageSlug,
  isInSidebar,
  matchUrl,
}) => {
  if (isInSidebar || !threadMessages || !threadMessages.length) {
    return null;
  }

  const threadUrl = `${matchUrl}/thread/${messageSlug}`;
  const authors = threadMessages.map(msg => users[msg.authorSlug]);
  const lastMessageDate = threadMessages.slice(-1).createdAt;
  let threadLength = threadMessages.length;
  threadLength += threadLength === 1 ? ' reply' : ' replies';
  let threadUsers = authors;
  if (authors.length !== threadMessages.length) {
    threadUsers = authors.slice(1);
  }

  return (
    <div className="SingleMessageThread">
      <Link to={threadUrl} className="SingleMessageThread__link">
        <ul className="SingleMessageThread__items">
          <li className="SingleMessageThread__item SingleMessageThread__avatars">
            {threadUsers.map(user => (
              <Avatar key={user.id} author={user} avatarFor="thread" size="24" />
            ))}
          </li>
          <li className="SingleMessageThread__item SingleMessageThread__counter">
            {threadLength}
          </li>
          <li className="SingleMessageThread__item SingleMessageThread__date">
            <time className="SingleMessage__date-text">
              {lastMessageDate}
            </time>
          </li>
        </ul>
      </Link>
    </div>
  );
};

export default SingleMessageThread;
