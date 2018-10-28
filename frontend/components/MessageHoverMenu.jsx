import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from './Dropdown';
import Button from './Button';
import './MessageHoverMenu.css';

class MessageHoverMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleReactionToggle = this.handleReactionToggle.bind(this);
    this.handleFavToggle = this.handleFavToggle.bind(this);
  }

  handleReactionToggle(e) {
    const { modalOpen, id: messageId } = this.props;

    const menuNode = e.currentTarget.parentNode;
    const nodeBounds = menuNode.getBoundingClientRect();
    const modalProps = {
      clickPosY: nodeBounds.top,
      clickPosX: nodeBounds.right,
      messageId,
    };

    modalOpen('MODAL_REACTION', modalProps);
  }

  handleFavToggle() {
    const {
      id,
      favoriteId,
      createFavorite,
      deleteFavorite,
    } = this.props;

    if (favoriteId) {
      deleteFavorite(favoriteId);
    } else {
      createFavorite(id);
    }
  }

  render() {
    const {
      handleEditToggle,
      id,
      slug,
      favoriteId,
      parentMessageId,
      entityType,
      authorId,
      pinId,
      currentUser,
      createPin,
      destroyPin,
      ddToggle,
      deleteMessage,
      match: { url },
    } = this.props;

    const isAuthor = currentUser.id === authorId;
    const isMessageType = entityType === 'entry';
    const ddItems = [];

    if (pinId) {
      const onClick = () => destroyPin(pinId);
      ddItems.push({ label: 'Un-pin message', onClick });
    } else {
      const onClick = () => createPin({ messageId: id });
      ddItems.push({ label: 'Pin message', onClick });
    }

    if (isAuthor) {
      ddItems.push({ label: 'Edit message', onClick: () => handleEditToggle(id) });
      ddItems.push({ label: 'Delete message', onClick: () => deleteMessage(slug) });
    }

    const favIcon = favoriteId ? ['fas', 'star'] : ['far', 'star'];
    const favClassName = favoriteId ? 'filled' : 'empty';

    return (
      <div className="MessageHoverMenu">
        <Button unStyled buttonFor="reaction" onClick={this.handleReactionToggle}>
          <FontAwesomeIcon icon={['far', 'smile']} fixedWidth />
        </Button>
        {(!parentMessageId && isMessageType) && (
          <Button className="Btn Btn__convo" linkTo={`${url}/convo/${slug}`}>
            <FontAwesomeIcon icon={['far', 'comment']} fixedWidth />
          </Button>
        )}
        {isMessageType && (
          <Button unStyled buttonFor="fav" modifier={favClassName} onClick={this.handleFavToggle}>
            <FontAwesomeIcon icon={favIcon} fixedWidth />
          </Button>
        )}
        {isMessageType && (
          <Dropdown menuFor="message" items={ddItems} menuPos="right" unStyled ddToggle={ddToggle}>
            <FontAwesomeIcon icon="ellipsis-h" fixedWidth />
          </Dropdown>
        )}
      </div>
    );
  }
}

export default withRouter(MessageHoverMenu);
