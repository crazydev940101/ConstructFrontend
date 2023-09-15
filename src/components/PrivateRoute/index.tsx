import { useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import {useAuth} from '../../store/auth';
import { axiosRequest } from '../../service/axios';
import Loading from '../../components/Loading/PageLoading';
import userService from '../../service/auth';

interface IProps {
  role?: string[] | undefined;
}

const PrivateRoute = (props: IProps) => {
  const navigate = useNavigate();
  const { isAuth, loading, updateAuthParams } = useAuth();
  const getUserInfo = async () => {

    try {
      const res: any | string = await axiosRequest('GET', '/api/v1/user/profile', true, null);
      const authUser = await userService.getUser();
      if (props.role) {
        for (let i = 0; i < props.role.length; i++) {
          if (props.role[i] === authUser.data.user.role) {
            updateAuthParams({ isAuth: true, user: { ...res.data }, loading: false });
            break;
          } else {
            updateAuthParams({ isAuth: false });
            setTimeout(() => {
              navigate('/app');
            }, 1000);
            break;
          }
        }
      } else {
        updateAuthParams({ isAuth: true, user: { ...res.data }, loading: false });
      }
    } catch {
      updateAuthParams({ isAuth: false });
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    }
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {!isAuth ? (
        <div className="h-[100vh] w-full">
          <Loading color={'text-blue'} />
        </div>
      ) : (
        <>
          {loading ?
            <div className='z-10 fixed top-1/2 left-1/2 translate-1/2'>
              <Loading size={50} />
            </div> :
            (<></>)
          }
          <Outlet />
        </>
      )
      }
    </div>
  );
}

export default PrivateRoute;


