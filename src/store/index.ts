
import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { authReducer } from './auth';
import { chatbotReducer } from './chatbot';

export const store = configureStore({ reducer: {
    auth: authReducer,
    chatbot: chatbotReducer
} });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

