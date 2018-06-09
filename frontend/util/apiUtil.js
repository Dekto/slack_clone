import { decamelizeKeys } from 'humps';

export const apiCall = (method, endpoint, props) => {
  const args = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  let apiUrl = `api/${endpoint}`;
  if ((args.method === 'DELETE' || args.method === 'GET') && props !== '') {
    apiUrl += `/${props}`;
  }

  if (args.method === 'POST' || args.method === 'PATCH') {
    args.body = JSON.stringify(decamelizeKeys(props, { separator: '_' }));
  }

  return fetch(apiUrl, args).then(response => (
    response.json().then(json => ({ json, response }))
  )).then(({ json, response }) => {
    if (!response.ok) {
      throw json;
    }

    return json;
  }).catch((error) => {
    throw error || ['Unknown error!'];
  });
};
export const apiFetch = (endpoint, props = {}) => apiCall('GET', endpoint, props);
export const apiCreate = (endpoint, props = {}) => apiCall('POST', endpoint, props);
export const apiUpdate = (endpoint, props = {}) => apiCall('PATCH', endpoint, props);
export const apiDelete = (endpoint, props = {}) => apiCall('PATCH', endpoint, props);
