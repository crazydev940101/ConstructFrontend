interface AnswerProps {
    userImg?: string;
    answer?: string;
}

const Answer = (props: AnswerProps) => {
    return (
        <>
            <img width={40} height={40} src={props.userImg} className="mt-[5]" alt='userImg' style={{ marginBottom: 'auto' }} />
            <p className="text-[16px] max-[360px]:text-[13px] mt-[5px]">{props.answer}</p>
        </>
    )
}

export default Answer
