import React from 'react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Jumbotron from '../../components/Home/Jumbotron';
import Actions from '../../components/Home/Actions';
import Help from '../../components/Home/Help';
import Pricing from '../../components/Pricing';
import Contact from '../../components/Contact';

import './index.scss';

const Home = () => {
  return (
    <>
      <Navbar />
      <Jumbotron />
      <Actions />
      <Help />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
