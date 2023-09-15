import { useState, useEffect, useRef, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { BsCaretRightFill } from 'react-icons/bs';
import { FaPaperclip } from 'react-icons/fa';
import { useChatbot } from '../../../store/chatbot';
import { axiosRequest } from '../../../service/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './InputChatData.scss';

interface InputChatDataProps {
  messageFromSample: string;
  sendIsLoading: (value: boolean) => void;
  goToChatComponent: (value: boolean) => void;
}

const InputChatData = ({ goToChatComponent, sendIsLoading, messageFromSample }: InputChatDataProps) => {
  const inputChatDataRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { messageList, chatMessageFromSide, extractedTextFromFile, addMessage, updateExtractedText } = useChatbot();
  const dispatch = useDispatch();
  const { updateChatMessageFromSide } = useChatbot();

  const setLoadingState = (value: boolean) => {
    setIsLoading(value);
    sendIsLoading(value);
  };

  useEffect(() => {
    if (chatMessageFromSide) {
      sendMessage(chatMessageFromSide);
      dispatch(updateChatMessageFromSide(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessageFromSide]);

  useEffect(() => {
    if (messageFromSample) {
      sendMessage(messageFromSample);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageFromSample]);

  useEffect(() => {
    if (messageList.length > 0) {
      goToChatComponent(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

  const sendMessage = async (data: string) => {
    if (!isLoading) {
      let msg = '';
      if (message) {
        msg = message;
      } else if (data) {
        msg = data;
      }

      if (msg) {
        goToChatComponent(true);
        addMessage({
          sender: 0,
          message: msg,
        });
        setLoadingState(true);
        setMessage('');
        try {
          const response = await axiosRequest('POST', '/api/v1/chatbot/chat_v1', true, {
            text: msg,
            extraText: extractedTextFromFile,
          });
          addMessage({
            sender: 1,
            message: response.data,
          });
        } catch (err) {
          console.log(((err as AxiosError)?.response?.data as any)?.error?.message || (err as Error).message);
        }
        setLoadingState(false);
        textAreaRef.current?.focus();
      }
    }
  };

  const extractFile = async (event: SyntheticEvent) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || !files.length) return;
    if (files[0].size > 1048576) {
      toast.error('File size should less than 1MB.');
      return;
    }
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      setLoadingState(true);
      const response = await axiosRequest('POST', '/api/v1/utils/extract-pdf', true, formData);
      addMessage({
        sender: 0,
        message: `File: ${files[0].name}`,
      });
      // addMessage({
      //     sender: 1,
      //     message: '',
      // });
      updateExtractedText(response.data.text);
    } catch (err) {
      console.log(err);
    }
    setLoadingState(false);
  };

  return (
    <>
      <div
        ref={inputChatDataRef}
        className="input-chat-border-solid relative w-full flex items-center border-[2px] border-lightgrey rounded-lg overflow-hidden pr-[30px]"
      >
        <button
          className="rounded-full mx-[3px] text-gray-500 hover:text-hoverblue upload-link"
          onClick={() => {
            if (filePickerRef.current) {
              (filePickerRef.current.value as any) = null;
              filePickerRef.current.click();
            }
          }}
        >
          <FaPaperclip />
        </button>
        <input
          ref={filePickerRef}
          type="file"
          name="file"
          className="hidden"
          onChange={extractFile}
          accept="application/pdf"
        />
        <textarea
          placeholder="Ask anything.  e.g., number of delivery tickets on date 25/07/23 ?"
          className="w-full-chat-data max-h-[100px] resize-none outline-none p-[8px]"
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage('');
              e.preventDefault();
            }
          }}
        />
        <div
          className={classNames('absolute top-[50%] translate-y-[-50%] right-0', {
            'hover:cursor-pointer': message,
          })}
        >
          <button className="text-white rounded-full mt-[7px]" onClick={() => sendMessage('')}>
            <BsCaretRightFill
              className={classNames('text-[30px] text-blue', {
                'text-disableblue': !message,
                'hover:text-hoverblue': message,
              })}
            />
          </button>
        </div>
      </div>
      <p className="text-grey text-[13px]">
        ChatGPT may produce inaccurate information about people, places, or facts.
      </p>
    </>
  );
};

export default InputChatData;
