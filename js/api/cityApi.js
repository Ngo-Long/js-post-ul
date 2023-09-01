import axiosClient from './axiosClient';

// name export
export function getAllCitys(params) {
  const url = '/cities';
  return axiosClient.get(url, { params });
}

export function getCityById(id) {
  const url = `/cities/${id}`;
  return axiosClient.get(url);
}
