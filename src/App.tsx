import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';

import Routes from './routes';

import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
import './assets/global.scss';

function App() {

  return (
    <>
      <Provider store={store}>
        <Routes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </Provider>
    </>
  );
}

export default App;
