import { useSearchParams } from 'react-router-dom';
import Contact from '../../components/Contact';

export const SupportForm = () => {
  const [searchParams] = useSearchParams();
  return <Contact supportType={searchParams.get('title') || 'IT Support'} />;
};
