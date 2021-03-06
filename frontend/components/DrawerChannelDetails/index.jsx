import React from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import AccordionItem from '../AccordionItem';
import UserPreview from '../UserPreview';
import AccordionBodyInfo from '../AccordionBodyInfo';
import AccordionBodyMembers from '../AccordionBodyMembers';
import AccordionBodyPins from '../AccordionBodyPins';
import './styles.css';

class DrawerChannelDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { details: true, members: false, pinned: false };
  }

  componentDidMount() {
    const { accordion } = this.props;

    if (!accordion) {
      return;
    }

    Object.keys(accordion).forEach((key) => {
      this.setState({ [key]: accordion[key] });
    });
  }

  componentDidUpdate(_, prevState) {
    const { accordion } = this.props;
    const { members } = this.state;

    if (prevState.members !== members) {
      return;
    }

    if (accordion.members !== undefined && accordion.members !== members) {
      this.setMembersState(accordion.members);
    }
  }

  setMembersState(val) {
    const { members } = this.state;

    if (members !== val) {
      this.setState({ members: val });
    }
  }

  handleItemToggle(name) {
    const { ...state } = this.state;
    this.setState({ [name]: !state[name] });
  }

  render() {
    const {
      chatroom,
      messages,
      usersMap,
      isLoading,
      destroyPinRequest,
      openModal,
      currentUserSlug,
    } = this.props;
    const { ...state } = this.state;

    if (!chatroom || isLoading) {
      return null;
    }

    const accordionItems = [];

    if (!chatroom.hasDm) {
      accordionItems.push({
        icon: 'info-circle',
        itemTitle: 'Channel Details',
        name: 'details',
        body: (
          <AccordionBodyInfo
            chatroom={chatroom}
            currentUserSlug={currentUserSlug}
            openModal={openModal}
          />
        ),
      });
      accordionItems.push({
        icon: faUsers,
        itemTitle: `${chatroom.members.length} Members`,
        name: 'members',
        body: <AccordionBodyMembers members={chatroom.members} usersMap={usersMap} />
      });
    }

    accordionItems.push({
      icon: 'thumbtack',
      itemTitle: 'Pinned Messages',
      name: 'pinned',
      body: (
        <AccordionBodyPins
          messages={messages}
          currentUserSlug={currentUserSlug}
          destroyPinRequest={destroyPinRequest}
        />
      ),
    });

    const user = usersMap[chatroom.dmUserSlug];

    return (
      <div className="DrawerChannelDetails">
        {chatroom.hasDm && user && (
          <UserPreview user={user} avatarSize="52" avatarVersion="avatarLarge" />
        )}
        {accordionItems.map(item => (
          <AccordionItem
            key={item.name}
            name={item.name}
            isShowing={state[item.name]}
            itemToggle={() => this.handleItemToggle(item.name)}
            {...item}
          />
        ))}
      </div>
    );
  }
}

export default DrawerChannelDetails;
