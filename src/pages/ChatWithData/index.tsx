import { useState } from 'react';
import SampleQuestion from './components/SampleQuestion';
import ChatMessageList from './components/ChatMessageList';
import InputChatData from './components/InputChatData';
import { useSearchParams } from 'react-router-dom';
import "./index.scss";

const ChatWithData = () => {

    const [sendMessage, setSendMessage] = useState<string>('');
    const [showChatData, setShowChatData] = useState<boolean>(false);
    const [flagWithOpenDrawer, setFlagWithOpenDrawer] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const retrieveMessage = async (data: string) => {
        setSendMessage(data);
        setShowChatData(true);
    }

    const onOpenDrawer = async (value: boolean) => {
        setFlagWithOpenDrawer(value);
    }

    const goToChatComponent = async (flag: boolean) => {
        setShowChatData(flag);
    }

    const sendIsLoading = async (value: boolean) => {
        setIsLoading(value);
    }

    return (
        <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px] pl-[0px] pr-[0px] chatbot-page">
            <div className={`flex flex-col justify-between ${!flagWithOpenDrawer ? "items-center" : "items-left"} `}>
                {
                    !showChatData && !searchParams.get('citationId') ? (
                        <SampleQuestion retrieveMessage={retrieveMessage} />
                    ) : (
                        <ChatMessageList showDrawer={onOpenDrawer} isLoading={isLoading}/>
                    )
                }
                <div className={`px-[10px] py-[10px] input-chat-data ${!flagWithOpenDrawer ? "" : "ml-[100px]"} `}>
                    <InputChatData goToChatComponent={goToChatComponent} messageFromSample={sendMessage} sendIsLoading={sendIsLoading} />
                </div>
            </div>
        </div>
    );
};

export default ChatWithData;
