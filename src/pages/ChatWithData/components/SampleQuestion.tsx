import { FaCheckCircle } from 'react-icons/fa';
import './SampleQuestion.scss';

interface SampleQuestionProps {
  retrieveMessage: (value: string) => void;
}

const SampleQuestion = ({ retrieveMessage }: SampleQuestionProps) => {
  const notes = [
    'Asks questions sites, materials products etc',
    'Explain Regulations quickly and easily',
    'Understand technical documents better',
    'Help with calculations',
    'Attach a PDF and summarise the document, extract actions points etc',
  ];
  const exampleQuestions = [
    'List all projects over the last 3 months by date',
    'How many deliveries did we get from Breedon',
    'Give me the top 10 least used materials',
    'Give me the top 10 most used materials',
  ];

  const sendMessage = async (e: any, item: string) => {
    e.preventDefault();
    if (item) {
      retrieveMessage(item);
    }
  };

  return (
    <>
      <div className="max-w-[28rem]">
        <h1 className="chat-title text-[30px] font-bold mb-[10px] text-center text-grey">DataGPT (beta)</h1>
        <p className="text-grey mb-[1rem] mr-[10px] ml-[10px]">Talk to your database, ask questions and get answers</p>
        <ul className="chat-option">
          {notes.map((item, key) => (
            <li key={key}>
              <FaCheckCircle className="mr-[10px]" />
              <span className="text-grey">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-grey mt-[2rem] mr-[10px] ml-[10px]">
          Chat with your data is in beta testing mode meaning some answers may not be accurate or the responses maybe
          slower than usual
        </p>
      </div>
      <div className="w-full-absolute mb-[8rem]">
        <div className="w-full-sample-question grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[20px] mt-[30px]">
          {exampleQuestions.map((item, key) => (
            <div key={key} className="flex border-[2px] border-zinc-300 rounded-sm">
              <a href="#question" onClick={(e) => sendMessage(e, item)} className=" flex justify-between items-center">
                <div className="px-[10px] py-[20px]">
                  <div className="text-[16px] leading-[16px] max-[360px]:text-[13px] mt-[5px]">
                    <p className="mt-[5px]">{item}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        {/* <p className='text-grey mb-[2.5rem] mt-[80px] text-[13px]'>ChatGPT may produce inaccurate information about people, places, or facts.</p> */}
      </div>
    </>
  );
};

export default SampleQuestion;
