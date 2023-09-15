import { FaUserCircle } from 'react-icons/fa';
import './index.scss';

interface QuestionProps {
    question?: string;
}

const Question = (props: QuestionProps) => {
    return (
        <>
            <FaUserCircle className="w-[40px] h-[40px] avatar-question-color" />
             <p className="text-[16px] leading-[16px] max-[360px]:text-[13px] mt-[5px]">{props.question}</p>
        </>
    )
}

export default Question
