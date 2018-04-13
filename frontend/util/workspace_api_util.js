import { camelizeKeys } from 'humps';

export const fetchWorkspaces = () => (
  fetch('api/workspaces', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }).then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (!response.ok) {
      throw json;
    }

    return camelizeKeys(json);
  }).catch(error => {
    throw error.message || ['Unknown workspaces error!'];
  })
);

export const fetchWorkspace = workspaceId => (
  fetch(`api/workspaces/${workspaceId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }).then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (!response.ok) {
      throw json;
    }

    return camelizeKeys(json);
  }).catch(error => {
    throw error.message || ['Unknown workspaces error!'];
  })
);

export const createWorkspace = workspace => (
  fetch('api/workspaces', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workspace)
  }).then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (!response.ok) {
      throw json;
    }

    const { id, title, slug, ownerId } = camelizeKeys(json);
    return { id, title, slug, ownerId };
  }).catch(errors => {
    throw errors || ['Unknown workspace error!'];
  })
);

export const destroyworkspace = workspaceId => (
  $.ajax({
    url: `api/workspaces/${workspaceId}`,
    method: 'DELETE'
  })
);