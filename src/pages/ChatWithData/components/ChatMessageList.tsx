import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageType } from '../../../@types';
import { useChatbot } from '../../../store/chatbot';
import ChatLoading from '../../../components/Loading/ChatLoading';
import userImg from '../../../assets/img/airdocpro.png';
import AnswerItem from '../../../components/ChatWithData/ChatMessageList/Answer';
import QuestionItem from '../../../components/ChatWithData/ChatMessageList/Question';
// import CitationItem from "../../../components/ChatWithData/ChatMessageList/Citation";
import PDFViewer from '../../../components/ChatWithData/PDFViewer';
import withDrawer from '../../../components/Hocs/withDrawer';
import './ChatMessageList.scss';

interface MainChatEngineProps {
  isLoading: boolean,
  showDrawer: (value: boolean) => void;
}

const PDFDrawer = withDrawer(PDFViewer);

const ChatMessageList = (props: MainChatEngineProps) => {

  const citaTempId = 42;
  // const citaTempName = 'The meaning of Life Vol1.pdf';

  const drawerRef = useRef<HTMLDivElement>(null);
  const chatMsgListRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<Document>(document);
  const { messageList } = useChatbot();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const citationId = Number(searchParams.get('citationId'));
  const [toggleClassFlag, setToggleClassFlag] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messageList]);

  useEffect(() => {
    if (citationId) {
      setSearchParams({ citationId: citationId.toString() })
      onOpenDrawer(null, citaTempId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citationId])

  useEffect(() => {
    if (citationId) {
      toggleDrawerClass('add');
      drawerRef.current?.classList.add("show");
    }
  }, [messageList, citationId]);

  const onToggleDrawerForMouseEvent = () => {
    drawerRef.current?.classList.remove("show");
    props.showDrawer(false);
    setSearchParams({ citationId: '' })
    toggleDrawerClass('remove');
  }

  const onOpenDrawer = (e: any, citationId: Number) => {
    if (e) e.preventDefault();

    navigate(`/app/chat-with-data?citationId=${citationId}`);

    const chatElement = documentRef.current.querySelector('.w-full-chat-data') as HTMLTextAreaElement;
    if (chatElement) chatElement.focus();

    if (drawerRef.current) {
      drawerRef.current.classList.add("show");
    }

    props.showDrawer(true);
    toggleDrawerClass('add');
  }

  const toggleDrawerClass = (toggle: string) => {
    if (chatMsgListRef.current) {
      if (toggle === 'add') {
        setToggleClassFlag(true);
      } else if (toggle === 'remove') {
        setToggleClassFlag(false);
      }
    }
  }

  const scrollToBottom = () => {
    let ele = documentRef.current.querySelector(".h-screen");
    if (ele) {
      window.scrollTo(0, ele.scrollHeight);
    }
  };

  return (
    <div ref={chatMsgListRef} className={`chat-message-list ${toggleClassFlag ? 'child-hide' : ''}`}>
      {
        messageList && messageList.map((item: MessageType, key: number) => (
          <React.Fragment key={key} >
            {item.sender === 0 ? (
              <div className="card-body-question-background">
                <div className={`card-body-question flex gap-[20px] items-center main-chat-max-width ${toggleClassFlag ? 'child-hide' : ''}`}>
                  <QuestionItem question={item.message} />
                </div>
              </div>
            ) : (
              <>
                <div className={`card-body-answer flex gap-[20px] items-center main-chat-max-width ${toggleClassFlag ? 'child-hide' : ''}`}>
                  <AnswerItem userImg={userImg} answer={item.message} />
                </div>
                {/* <div className={`card-body-p flex gap-[0px] items-center pl-[60px] main-chat-max-width ${toggleClassFlag ? 'child-hide' : ''}`}>
                  <p className="text-[16px] leading-[16px] max-[360px]:text-[13px] mt-[5px]" style={{ marginBottom: 'auto' }}>Citations:</p>
                  <CitationItem onClick={(e) => onOpenDrawer(e, citaTempId)} citationName={citaTempName} />
                </div> */}
                <br />
                <br />
              </>
            )
            }
          </React.Fragment>
        ))
      }
      <div className={toggleClassFlag ? "wrap-full-screen-drawer" : ""} onClick={() => onToggleDrawerForMouseEvent()}>
        <PDFDrawer drawerRef={drawerRef} srcRoot={citationId.toString()} />
      </div>

      {props.isLoading && (
        <div className={`chat-loading w-[80px] text-center rounded-md px-[10px] py-[7px] mt-[30px] mb-[60px] text-[18px] bg-[#f7f7f7] text-home-text ${toggleClassFlag ? 'child-hide' : ''}`}>
          <ChatLoading />
        </div>
      )}
    </div>
  )
}

export default ChatMessageList