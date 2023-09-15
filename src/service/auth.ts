import { destroyStorage } from '../store/storage';
import { axiosRequest } from './axios';

const userService = {
  getUser: async () => {
    try {
      const userInfo = await axiosRequest('GET', '/api/v1/auth/user/', true, null);

      return {
        status: true,
        data: userInfo,
      };
    } catch (err) {
      // console.error(err);
      return {
        status: false,
        data: null,
      };
    }
  },
  logout: async () => {
    try {
      await axiosRequest('POST', `/api/v1/auth/user/signout`, true);
      destroyStorage('accessToken');
      destroyStorage('refreshToken');
    } catch(err) {
      console.log(err)
      destroyStorage('accessToken');
      destroyStorage('refreshToken');
    }
  }
};

export default userService;
