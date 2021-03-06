import { actionTypes, apiActions } from '../util/actionsUtil';

export const SIGN_IN = actionTypes('SIGN_IN');
export const SIGN_UP = actionTypes('SIGN_UP');
export const SIGN_OUT = actionTypes('SIGN_OUT');
export const USER = apiActions('USER', ['SHOW', 'UPDATE']);
export const USER_APPEARANCE = apiActions('USER_APPEARANCE', ['CREATE', 'DESTROY']);
export const WORKSPACE = apiActions('WORKSPACE', ['INDEX', 'SHOW', 'CREATE', 'UPDATE', 'DESTROY']);
export const CHATROOM = apiActions('CHATROOM', ['INDEX', 'SHOW', 'CREATE', 'UPDATE', 'DESTROY']);
export const MESSAGE = apiActions('MESSAGE', ['INDEX', 'SHOW', 'CREATE', 'UPDATE', 'DESTROY']);
export const WORKSPACE_SUB = apiActions('WORKSPACE_SUB', ['CREATE', 'UPDATE', 'DESTROY']);
export const CHATROOM_SUB = apiActions('CHATROOM_SUB', ['CREATE', 'UPDATE', 'DESTROY']);
export const FAVORITE = apiActions('FAVORITE', ['INDEX', 'CREATE', 'DESTROY']);
export const REACTION = apiActions('REACTION', ['CREATE', 'DESTROY']);
export const USER_THREAD = apiActions('USER_THREAD', ['INDEX', 'UPDATE']);
export const READ = apiActions('READ', ['INDEX', 'UPDATE', 'DESTROY']);
export const PIN = apiActions('PIN', ['CREATE', 'DESTROY']);
export const PASSWORD = apiActions('PASSWORD', ['UPDATE']);
export const SEARCH = apiActions('SEARCH', ['INDEX']);
export const SEARCH_QUERY_UPDATE = 'SEARCH_QUERY_UPDATE';

export const MODAL_UPDATE = 'MODAL_UPDATE';
export const DRAWER_UPDATE = 'DRAWER_UPDATE';
export const DROPDOWN_UPDATE = 'DROPDOWN_UPDATE';
export const REACTION_TOGGLE = 'REACTION_TOGGLE';
export const FAVORITE_TOGGLE = 'FAVORITE_TOGGLE';
export const FORM_SUCCESS_UPDATE = 'FORM_SUCCESS_UPDATE';
export const FORM_ERRORS_DESTROY = 'FORM_ERRORS_DESTROY';
export const MESSAGE_EDITOR_TOGGLE = 'MESSAGE_EDITOR_TOGGLE';
export const SCROLL_LOCATION_UPDATE = 'SCROLL_LOCATION_UPDATE';
export const UNREAD_CLEAR_ALL = 'UNREAD_CLEAR_ALL';
export const NAVIGATE = 'NAVIGATE';
export const ACCORDION_OPEN = 'ACCORDION_OPEN';
export const UNREAD_UPDATE = 'UNREAD_UPDATE';
export const CHATROOM_PATH_UPDATE = 'CHATROOM_PATH_UPDATE';
