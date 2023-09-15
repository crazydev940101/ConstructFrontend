import classNames from 'classnames';
import { CircleNotch } from 'phosphor-react';

interface PropsType {
  size?: number;
  color?: string;
}

const Loading = ({ size, color }: PropsType) => {
  return (
    <div className={classNames(`flex h-full w-full items-center justify-center ${color ? color : 'text-zinc-700'}`)}>
      <CircleNotch className="animate-spin" size={size || 50} weight="bold" />
    </div>
  );
};

export default Loading;
