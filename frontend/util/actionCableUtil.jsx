import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ActionCable } from 'react-actioncable-provider';
import { camelizeKeys } from 'humps';
import {
  createMessageReceive,
  updateMessageReceive,
  deleteMessageReceive
} from '../actions/messageActions';
import { getChannels } from '../reducers/selectors';
import { statusRequest, setStatus } from '../actions/memberActions';
import { createWorkspaceReceive } from '../actions/workspaceActions';
import {
  createChannelReceive,
  updateChannelReceive,
  deleteChannelReceive
} from '../actions/channelActions';
import {
  createFavoriteReceive,
  deleteFavoriteReceive
} from '../actions/favoriteActions';
import {
  createReactionReceive,
  deleteReactionReceive
} from '../actions/reactionActions';

const mapStateToProps = state => ({
  channels: getChannels(state)
});

const mapDispatchToProps = dispatch => ({
  onReceivedCallback: received => {
    const camelized = camelizeKeys(received);
  
    switch (received.event) {
      case 'CREATE_MESSAGE' :
        return dispatch(createMessageReceive(
          camelized.message,
          camelized.parentMessageSlug
        ));
      case 'EDIT_MESSAGE' :
        return dispatch(updateMessageReceive(camelized.message));
      case 'DELETE_MESSAGE' :
        return dispatch(deleteMessageReceive(camelized.message.slug));
      case 'CREATE_FAVORITE' :
        camelized.favorite.messageSlug = camelized.messageSlug;
        return dispatch(createFavoriteReceive(camelized.favorite));
      case 'DELETE_FAVORITE' :
        camelized.favorite.messageSlug = camelized.messageSlug;
        return dispatch(deleteFavoriteReceive(camelized.favorite));
      case 'CREATE_REACTION' :
        return dispatch(createReactionReceive(camelized.reaction));
      case 'DELETE_REACTION' :
        return dispatch(deleteReactionReceive(camelized.reaction));
      case 'CREATE_CHANNEL' :
        return dispatch(createChannelReceive(camelized.channel));
      case 'EDIT_CHANNEL' :
        return dispatch(updateChannelReceive(camelized.channel));
      case 'DELETE_CHANNEL' :
        return dispatch(deleteChannelReceive(camelized.channel));
      case 'CREATE_WORKSPACE' :
        return dispatch(createWorkspaceReceive(camelized.workspace));
      case 'STATUS' :
        return dispatch(setStatus(
          camelized.user.slug,
          camelized.user.appearance
        ));
    }
  }
});

export class SocketWorkspace extends React.Component {
  constructor(props) {
    super(props);

    this.handleReceived = this.handleReceived.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleDisconnected = this.handleDisconnected.bind(this);
  }

  handleReceived(received) {
    this.props.onReceivedCallback(received);
  }

  handleConnected() {
    this.refs.workspaceCable.perform('online', {
      workspace_slug: this.props.workspaceSlug
    });
  }

  handleDisconnected() {
    this.refs.workspaceCable.perform('offline', {
      workspace_slug: this.props.workspaceSlug
    });
  }

  render() {
    return (
      <ActionCable
        ref="workspaceCable"
        channel={{
          channel: 'WorkspaceChannel',
          workspace_slug: this.props.workspaceSlug
        }}
        onReceived={this.handleReceived}
        onConnected={this.handleConnected}
        onDisconnected={this.handleDisconnected}
      />
    );
  }
}

class SocketChatChannel extends React.Component {
  constructor(props) {
    super(props);

    this.handleReceived = this.handleReceived.bind(this);
  }

  handleReceived(received) {
    this.props.onReceivedCallback(received);
  }

  render() {
    return (
      <Fragment>
        {this.props.channels.map(channel =>
          <ActionCable
            key={channel.slug}
            channel={{ channel: 'ChatChannel', channel_id: channel.id }}
            onReceived={this.handleReceived}
          />
        )}
      </Fragment>
    );
  }
}

export const WorkspaceActionCable = connect(
  null,
  mapDispatchToProps
)(SocketWorkspace);

export const ChannelActionCables = connect(
  mapStateToProps,
  mapDispatchToProps
)(SocketChatChannel);