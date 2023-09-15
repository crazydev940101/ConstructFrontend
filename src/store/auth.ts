import { Slice, createSlice } from '@reduxjs/toolkit';

import { IAuthStore } from '../@types';
import { RootState, useAppDispatch, useAppSelector } from '.';

const initialState: IAuthStore = {
  isAuth: false,
  user: {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    role: '',
  },
  loading: false,
};

export const authSlice: Slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    updateAuthParams: (state: any, action: any) => {
      for (const k in action.payload) {
        if (state[k] === undefined) new Error(`undefined store key ${k}`);
        state[k] = action.payload[k];
      }
    },
  },
});

export const authReducer = authSlice.reducer

export const useAuth = () => {
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const updateAuthParams = (payload: Partial<IAuthStore>) => dispatch(authSlice.actions.updateAuthParams(payload as any));
  return {
    ...auth,
    updateAuthParams,
    update: updateAuthParams
  };
};
