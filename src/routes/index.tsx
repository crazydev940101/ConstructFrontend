import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import DefaultLayout from '../layouts/DefaultLayout';

// Pages
import Home from '../pages/Home';
import Auth from '../pages/Auth/Auth';
import Signup from '../pages/Auth/Signup';
import Signin from '../pages/Auth/Signin';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Team from '../pages/Team';
import Billing from '../pages/Billing';
import Profile from '../pages/Profile';
import Support from '../pages/Support';
import Dashboard from '../pages/Main';
import Extraction from '../pages/Main/Extractions';
import NewExtraction from '../pages/Main/NewExtraction';
import DeleteAccount from '../pages/DeleteAccount';
import SupplierRequest from '../pages/SupplierRequest';
import ContactSale from '../pages/ContactSale';
import SetPassword from '../pages/Auth/SetPassword';
import { SupportForm } from '../pages/SuppportForm';
import PrivateRoute from '../components/PrivateRoute';
import SaleRequest from '../pages/SaleRequest';
import { SaleRequestDetail } from '../pages/SaleRequest/Detail';
import { NewsletterPage } from '../pages/Newsletter';
import ChatWithData from '../pages/ChatWithData';
import { Global } from '../pages/Global';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' element={<Global />}>
          <Route path="/" element={<Home />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/contact-support" element={<SupportForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/contact-sale" element={<ContactSale />} />
            <Route path="/app" element={<DefaultLayout />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/new-extraction" element={<NewExtraction />} />
              <Route path="/app/extractions" element={<Extraction />} />
              <Route path="/app/extractions/:ExtractionId" element={<Extraction />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/team" element={<Team />} />
              <Route path="/app/delete-account" element={<DeleteAccount />} />
              <Route path="/app/supplier-request" element={<SupplierRequest />} />
              <Route path="/app/support" element={<Support />} />
              <Route path="/app/billing" element={<Billing />} />
              <Route path="/app/sale-request" element={<SaleRequest />} />
              <Route path="/app/sale-request/:id" element={<SaleRequestDetail />} />
              <Route path="/app/chat-with-data" element={<ChatWithData />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
