//  sử dụng `import` để nhập module `axios` từ thư viện Axios
import axios from 'axios';

// DEMO:
// should create axiosClient (tường minh hơn)
// should not be used axios of the library (ko rõ ràng)

//  tạo một instance tên là axiosClient
const axiosClient = axios.create({
  // Đối tượng chứa các cấu hình:

  // - địa chỉ cơ sở (base URL) mà tất cả các yêu cầu sẽ được xây dựng trên nó
  baseURL: 'https://js-post-api.herokuapp.com/api',
  // - đối tượng chứa các tiêu đề (headers) sẽ được gắn vào mỗi yêu cầu.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // attach token to request if exists
    const accessToken = localStorage.getItem('access_token');
    // privateRequests
    if (accessToken) {
      // lấy từ local storage (ko có thì chịu)
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // transform data for all responses
    return response.data;
  },
  function (error) {
    console.log('axiosClient - response error', error.response);
    if (!error.response) throw new Error('Network error. Please try again later');

    // rediract to logon if not login
    if (error.response.status === 401) {
      // clear token, logout
      //...
      window.location.assign('/login.html');
      return;
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

// xuất instance axiosClient
export default axiosClient;
