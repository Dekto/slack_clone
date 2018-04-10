import * as WorkspaceAPIUtil from '../util/workspace_api_util';

export const RECEIVE_WORKSPACES = 'RECEIVE_WORKSPACES';
export const RECEIVE_WORKSPACE = 'RECEIVE_WORKSPACE';
export const CREATE_WORKSPACE = 'CREATE_WORKSPACE';
export const RECEIVE_WORKSPACE_ERRORS = 'RECEIVE_WORKSPACE_ERRORS';
export const REMOVE_WORKSPACE = 'REMOVE_WORKSPACE';

export const receiveWorkspaces = workspaces => ({
  type: RECEIVE_WORKSPACES,
  workspaces
});

export const receiveWorkspace = workspace => ({
  type: RECEIVE_WORKSPACE,
  workspace
});

export const createWorkspace = workspace => ({
  type: CREATE_WORKSPACE,
  workspace
});

export const receiveWorkspaceErrors = errors => ({
  type: RECEIVE_WORKSPACE_ERRORS,
  errors
});

export const removeWorkspace = workspace => ({
  type: REMOVE_WORKSPACE,
  workspace
});

export const fetchWorkspaces = () => dispatch => (
  WorkspaceAPIUtil.fetchAll().then(
    workspaces => dispatch(receiveWorkspaces(workspaces)),
    errors => dispatch(receiveWorkspaceErrors(errors.responseJSON))
  )
);

export const fetchWorkspace = workspaceId => dispatch => (
  WorkspaceAPIUtil.fetch(workspaceId).then(
    workspace => dispatch(receiveWorkspace(workspace)),
    errors => dispatch(receiveWorkspaceErrors(errors.responseJSON))
  )
);

export const addNewWorkspace = workspace => dispatch => (
  WorkspaceAPIUtil.create(workspace).then(
    newWorkspace => dispatch(createWorkspace(workspace)),
    errors => dispatch(receiveWorkspaceErrors(errors.responseJSON))
  )
);

export const destroyWorkspace = workspaceId => dispatch => (
  WorkspaceAPIUtil.destroy(workspaceId).then(
    delWorkspace => dispatch(removeWorkspace(delWorkspace)),
    errors => dispatch(receiveWorkspaceErrors(errors.responseJSON))
  )
);