import axiosClient from './axiosClient';

// import: default import, named import
// export: default export, named export
// default: can use your name --> have one default export ONLY
// name export: use exactly name --> have multipe exports

const commentApi = {
  getAll(params) {
    const url = '/comments';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/comments/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/comments';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/comments/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/comments/${id}`;
    return axiosClient.delete(url);
  },
};

export default commentApi;
