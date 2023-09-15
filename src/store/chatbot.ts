import { Slice, createSlice } from '@reduxjs/toolkit';

import { IChatbotStore, MessageType } from '../@types';
import { RootState, useAppDispatch, useAppSelector } from '.';

const initialState: IChatbotStore = {
  chatMessageFromSide: '',
  messageList: [],
  extractedTextFromFile: null
};

export const chatbotSlice: Slice = createSlice({
  name: 'chatbot',
  initialState: initialState,
  reducers: {
    updateChatMessageFromSide: (state: any, action: any) => {
        state.chatMessageFromSide = action.payload
    },
    addMessage: (state: IChatbotStore, action: {payload: MessageType}) => {
      state.messageList.push(action.payload)
    },
    updateExtractedText: (state: IChatbotStore, action: {payload: string}) => {
      state.extractedTextFromFile = action.payload
    }
  },
});

export const chatbotReducer = chatbotSlice.reducer

export const useChatbot = () => {
  const chatbot = useAppSelector((state: RootState) => state.chatbot);
  const dispatch = useAppDispatch();
  const updateChatMessageFromSide = (payload: string) => dispatch(chatbotSlice.actions.updateChatMessageFromSide(payload));
  const addMessage = (payload: MessageType) => dispatch(chatbotSlice.actions.addMessage(payload));
  const updateExtractedText = (payload: string) => dispatch(chatbotSlice.actions.updateExtractedText(payload));
  return {
    ...chatbot,
    updateChatMessageFromSide,
    addMessage,
    updateExtractedText
  };
};
