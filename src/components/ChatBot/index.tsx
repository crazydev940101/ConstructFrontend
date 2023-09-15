/* eslint-disable eqeqeq */

import { useState, useRef, useEffect, SyntheticEvent } from 'react';
import classNames from 'classnames';
import { BiChevronDown } from 'react-icons/bi';
import { FaPaperclip } from 'react-icons/fa';
import { BsFillChatDotsFill, BsCaretRightFill } from 'react-icons/bs';

import ChatLoading from '../Loading/ChatLoading';

import './index.scss';
import { axiosRequest } from '../../service/axios';
import { AxiosError } from 'axios';
import { useAuth } from '../../store/auth';
// import { useFileUpload } from 'react-use-file-upload/dist/lib/useFileUpload';
import { toast } from 'react-toastify';
import { MessageType } from '../../@types';
import { useChatbot } from '../../store/chatbot';

const ChatBot = () => {
  const [message, setMessage] = useState<string>('');
  // const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatBox, setIsChatBox] = useState<boolean>(false);

  // const { files, setFiles, clearAllFiles } = useFileUpload();
  const { isAuth } = useAuth();
  const { messageList, extractedTextFromFile, addMessage, updateExtractedText } = useChatbot();

  const chatRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);

  // const addMessages = (message: MessageType) => {
  //   setMessages((prev) => {
  //     return [...prev, message];
  //   });
  // };

  const sendMessage = async () => {
    if (message && !isLoading) {
      addMessage({
        sender: 0,
        message: message,
      });
      setIsLoading(true);
      setMessage('');
      try {
        const response = await axiosRequest('POST', '/api/v1/chatbot/chat_v1', true, { text: message, extraText: extractedTextFromFile });
        addMessage({
          sender: 1,
          message: response.data,
        });
      } catch (err) {
        console.log(((err as AxiosError)?.response?.data as any)?.error?.message || (err as Error).message);
      }

      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollTo({
      behavior: 'smooth',
      top: chatBoxRef.current?.scrollHeight,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messageList]);

  // useEffect(() => {
  //   setMessages([]);
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const extractFile = async (event: SyntheticEvent) => {
    const files = (event.target as HTMLInputElement).files
    if (!files || !files.length) return;
    if (files[0].size > 1048576) {
      toast.error('File size should less than 1MB.');
      return;
    }
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      setIsLoading(true);
      const response = await axiosRequest('POST', '/api/v1/utils/extract-pdf', true, formData);
      addMessage({
        sender: 0,
        message: `File: ${files[0].name}`,
      });
      updateExtractedText(response.data.text)
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   console.log('files')
  //   extractFile();
  // }, [files]);

  return (
    <>
      {isAuth ? (
        <>
          <div className="fixed bottom-[30px] right-[25px]">
            {!isChatBox && (
              <div
                className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-blue hover:cursor-pointer hover:bg-hoverblue max-[360px]:w-[38px] max-[360px]:h-[38px]"
                onClick={() => setIsChatBox(true)}
              >
                <BsFillChatDotsFill className="text-white text-[30px] max-[360px]:text-[22px]" />
              </div>
            )}
            <div
              className={classNames(
                'chat-modal w-[320px] xs:w-[350px] flex flex-col justify-between absolute bottom-0 right-0 bg-white rounded-md overflow-hidden',
                { 'h-[600px] x-shadow': isChatBox, 'h-0': !isChatBox }
              )}
            >
              <div className="h-[90px] flex items-center gap-[5px] text-white bg-blue pt-[20px] pb-[15px] px-[20px] border-b-[3px] border-b-lightgrey">
                <p className="text-[16px] xs:text-[18px] tracking-[0.5px] font-size-14">
                  Understand your data more by asking questions
                </p>
                <span
                  className="hover:cursor-pointer text-white hover:text-blue hover:bg-lightgrey rounded-full"
                  onClick={() => setIsChatBox(false)}
                >
                  <BiChevronDown className="text-[40px] xs:text-[45px] font-size-28" />
                </span>
              </div>
              <div ref={chatBoxRef} className="chat-box overflow-y-auto h-full bg-slate-200 px-[20px] py-[20px]">
                {messageList.map((ele: MessageType, ind: number) => (
                  <div
                    key={ind}
                    className={classNames('pt-[10px] pb-[10px]', {
                      'text-right': ele.sender === 0,
                      'text-left': ele.sender === 1,
                    })}
                  >
                    <span
                      key={ind}
                      className={classNames('text-[15px] px-[10px] py-[10px]', {
                        'text-white bg-blue rounded-l-lg rounded-tr-lg': ele.sender === 0,
                        'text-black bg-white rounded-r-lg rounded-tl-lg h-auto': ele.sender === 1,
                      })}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ele.message.replace(/, \n/g, '\n').replace(/\n\n/g, '\n').replace(/\n/g, '<br />'),
                        }}
                      />
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="w-[80px] text-center rounded-md px-[10px] py-[7px] text-[18px] bg-[#f7f7f7] text-home-text">
                    <ChatLoading />
                  </div>
                )}
              </div>
              <div className="px-[10px] py-[10px]">
                <div className="relative w-full flex items-center border-[2px] border-lightgrey rounded-lg overflow-hidden pr-[30px]">
                  <button
                    className="rounded-full mx-[3px] text-gray-500 hover:text-hoverblue"
                    onClick={() => {
                      if(filePickerRef.current) {
                        (filePickerRef.current.value as any) = null
                        filePickerRef.current.click();
                      }
                    }}
                  >
                    <FaPaperclip />
                  </button>
                  <input ref={filePickerRef} type="file" name="file" className="hidden" onChange={extractFile} accept="application/pdf"/>
                  <textarea
                    placeholder="Type a message"
                    className="w-full max-h-[100px] h-[34px] text-[16px] resize-none outline-none p-[5px]"
                    ref={chatRef}
                    value={message}
                    onInput={(e) => {
                      e.currentTarget.style.height = '16px';
                      e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        sendMessage();
                        e.preventDefault();
                        e.currentTarget.style.height = '34px';
                      }
                    }}
                  />
                  <div
                    className={classNames('absolute top-[50%] translate-y-[-50%] right-0', {
                      'hover:cursor-pointer': message,
                    })}
                  >
                    <button className="text-white rounded-full mt-[7px]" onClick={() => sendMessage()}>
                      <BsCaretRightFill
                        className={classNames('text-[30px] text-blue', {
                          'text-disableblue': !message,
                          'hover:text-hoverblue': message,
                        })}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatBot;
