import { Link } from "react-router-dom";

export const ComingSoon = () => {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <span className="text-[24px] text-center">
        Coming Soon
        <br />
        <Link to={'/'} className="text-[14px] text-blue">
          Go to Home
        </Link>
      </span>
    </div>
  );
};
