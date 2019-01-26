import React from "react";
import Aux from "../../hoc/Auxilary";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ChartArea from '../../containers/ChartArea/ChartArea'

const layout = props => {
  return (
    <Aux>
      <Header />
      <ChartArea />
      <Footer />
    </Aux>
  );
};

export default layout;
