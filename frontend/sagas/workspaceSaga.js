import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/workspaceActions';
import * as api from '../util/workspaceAPIUtil';
import { WORKSPACE, WORKSPACES, CREATE_WORKSPACE, DELETE_WORKSPACE } from '../actions/actionTypes';
import { getChannels, getCurrentUserId } from '../reducers/selectors';
import { navigate } from '../actions/navigateActions';

export function* fetchWorkspace(workspaceSlug) {
  try {
    const workspace = yield call(api.fetchWorkspace, workspaceSlug);
    yield put(actions.workspaceReceive(workspace));
  } catch (error) {
    yield put(actions.workspaceFailure(error));
  }
}

function* redirectOwner({ workspace }) {
  const currentUserId = yield select(getCurrentUserId);

  if (currentUserId === workspace.ownerId) {
    yield put(navigate({ path: `/${workspace.slug}` }));
  }
}

function* fetchDeleteWorkspace({ workspaceSlug }) {
  try {
    yield call(api.deleteWorkspace, workspaceSlug);
    yield put(actions.deleteWorkspaceReceive(workspaceSlug));
  } catch (error) {
    yield put(actions.deleteWorkspaceFailure(error));
  }
}

function* addNewWorkspace({ workspace }) {
  try {
    yield call(api.createWorkspace, workspace);
  } catch (error) {
    yield put(actions.createWorkspaceFailure(error));
  }
}

function* loadWorkspaces() {
  try {
    const workspaces = yield call(api.fetchWorkspaces);
    yield put(actions.workspacesReceive(workspaces));
  } catch (error) {
    yield put(actions.workspacesFailure(error));
  }
}

function* loadWorkspace({ workspaceSlug }) {
  yield call(fetchWorkspace, workspaceSlug);

  const channels = yield select(getChannels);
  if (channels.length) {
    yield put(navigate({ path: `/${workspaceSlug}/${channels[0].slug}` }));
  } else {
    yield put(navigate({ path: '/' }));
  }
}

function* newWorkspaceFlow() {
  yield takeLatest(CREATE_WORKSPACE.REQUEST, addNewWorkspace);
  yield takeLatest(CREATE_WORKSPACE.RECEIVE, redirectOwner);
}

function* watchWorkspaces() {
  yield takeLatest(WORKSPACES.REQUEST, loadWorkspaces);
}

function* watchWorkspacePage() {
  yield takeLatest(WORKSPACE.REQUEST, loadWorkspace);
}

function* watchDeleteWorkspace() {
  yield takeLatest(DELETE_WORKSPACE.REQUEST, fetchDeleteWorkspace);
}

export function* workspaceSaga() {
  yield all([
    fork(newWorkspaceFlow),
    fork(watchWorkspaces),
    fork(watchWorkspacePage),
    fork(watchDeleteWorkspace),
  ]);
}
