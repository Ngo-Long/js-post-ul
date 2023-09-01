import axiosClient from './api/axiosClient';
import postApi from './api/postApi';
import { getAllCitys, getCityById } from './api/cityApi';

// asynchronous function that make HTTP requests use axiosClient
async function main() {
  // use `await` để chờ cho đến khi yêu cầu GET tới địa chỉ '/posts'
  // const response = await axiosClient.get('/posts');
  try {
    const queryParams = {
      _pape: 1,
      _limit: 5,
    };

    const data = await postApi.getAll(queryParams);
    console.log(data);
  } catch (error) {
    console.log('get all failed', error);
  }

  // await postApi.updateFormData({
  //   // id:
  // });
}

main();
