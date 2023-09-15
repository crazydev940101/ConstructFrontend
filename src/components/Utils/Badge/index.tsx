interface BadgeProps {
    type: 'grey' | 'danger' | 'warning' | 'success' | 'info' | 'indigo' | 'purple' | 'pink';
    content?: string;
    children?: string | JSX.Element;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const Badge = (props: BadgeProps) => {
    const classes = {
        grey: "inline-flex items-center rounded-md bg-gray-50 px-[5px] py-[2px] text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
        danger: "inline-flex items-center rounded-md bg-red-50 px-[5px] py-[2px] text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10",
        warning: "inline-flex items-center rounded-md bg-yellow-50 px-[5px] py-[2px] text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
        success: "inline-flex items-center rounded-md bg-green-50 px-[5px] py-[2px] text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20",
        info: "inline-flex items-center rounded-md bg-blue-50 px-[5px] py-[2px] text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10",
        indigo: "inline-flex items-center rounded-md bg-indigo-50 px-[5px] py-[2px] text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10",
        purple: "inline-flex items-center rounded-md bg-purple-50 px-[5px] py-[2px] text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10",
        pink: "inline-flex items-center rounded-md bg-pink-50 px-[5px] py-[2px] text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
    }
    return <span className={`${classes[props.type || 'success']} ${props.className}`} onClick={props.onClick}>{props.content || props.children}</span>
}

export default Badge;