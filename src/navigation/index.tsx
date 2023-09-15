import { FaHome, FaPlusCircle } from 'react-icons/fa';
import { AiFillWechat } from 'react-icons/ai';
import { TUserRole } from '../components/RoleSelector';

export type TFullUserRole = 'systemAdmin' | TUserRole

export const navigation: {
    [key: string]: {
        to: string;
        icon?: JSX.Element;
        label: string;
        enabled?: string[]; // highlighted link. ex: /extractions,  /extractions/1
        topDevider?: boolean;
        blockRoles?: TFullUserRole[]
    }[]
} = {
    main: [
        {
            to: '/app',
            icon: <FaHome />,
            label: 'Home'
        },
        {
            to: '/app/new-extraction',
            icon: <FaPlusCircle />,
            label: 'New Extraction',
            blockRoles: ['systemAdmin']
        },
        {
            to: '/app/chat-with-data',
            icon: <AiFillWechat />,
            label: 'Chat with your data',
            topDevider: true,
        }
    ],
    settings: [
        // {
        //     to: '',
        //     icon: '',
        //     label: ''
        // }
    ],
    extra: [
        // {
        //     to: '',
        //     icon: '',
        //     label: ''
        // }
    ]
}