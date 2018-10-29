import React, { Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Avatar from './Avatar';
import StatusIcon from './StatusIcon';
import AccordionItem from './AccordionItem';
import { dateUtil } from '../util/dateUtil';
import UserPreview from './UserPreview';
import PinnedMessagesItem from './PinnedMessagesItem';
import './ChannelDetailsDrawer.css';

class ChannelDetailsDrawer extends React.Component {
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
      channel,
      messages,
      users,
      isLoading,
      destroyPinRequest,
      match: { params },
    } = this.props;
    const { ...state } = this.state;

    if (!channel || isLoading) {
      return null;
    }

    const dateCreated = dateUtil(channel.createdAt).monthDayYear();
    const usersLen = channel.members.length;

    const { 0: pagePath, chatPath, workspaceSlug } = params;
    let teamUrl = `/${workspaceSlug}/${pagePath}`;
    if (chatPath) {
      teamUrl += `/${chatPath}`;
    }
    teamUrl += '/team';

    let accordionItems = [];

    if (!channel.hasDm) {
      accordionItems = [
        {
          icon: 'info-circle',
          itemTitle: 'Channel Details',
          name: 'details',
          body: (
            <Fragment>
              <div className="AccordionItem__sub">
                <h5 className="AccordionItem__sub-title">Purpose</h5>
                {channel.topic || 'Set a channel topic'}
              </div>
              <div className="AccordionItem__sub">
                <h5 className="AccordionItem__sub-title">Created</h5>
                {`${dateCreated} by ${channel.ownerName}`}
              </div>
            </Fragment>
          ),
        },
        {
          icon: 'users',
          itemTitle: `${usersLen} Members`,
          name: 'members',
          body: channel.members.map(userSlug => (
            <Link key={userSlug} to={`${teamUrl}/${userSlug}`} className="AccordionItem__sub">
              <StatusIcon member={users[userSlug]} />
              <Avatar avatarFor="details-drawer" author={users[userSlug]} size="22" />
              {users[userSlug].username}
            </Link>
          )),
        }
      ];
    }

    accordionItems.push({
      icon: 'thumbtack',
      itemTitle: 'Pinned Messages',
      name: 'pinned',
      body: messages && messages.map(message => (
        <PinnedMessagesItem
          key={message.id}
          message={message}
          destroyPinRequest={destroyPinRequest}
        />
      ))
    });

    const user = users[channel.dmUserSlug];

    return (
      <div className="ChannelDetailsDrawer">
        {channel.hasDm && user && (
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

export default withRouter(ChannelDetailsDrawer);
