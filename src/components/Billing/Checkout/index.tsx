import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { config } from '../../../config';
export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    try {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${config.host}/app/billing`,
          },
        });
        if (result.error) {
          toast.error(result.error.message)
        }
    } catch(err) {
        toast.error((err as Error).message)
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <PaymentElement></PaymentElement>
      <div className='text-center'>
        <button className="text-white w-[180px] mt-[30px] bg-blue hover:bg-hoverblue border-[1px] border-blue rounded py-[10px] text-[14px]">Submit</button>
      </div>
    </form>
  );
};