import React from "react";
import classes from "./span.css";
import Aux from '../../hoc/Auxilary'


const span = props => {
    const children=Number(props.children).toFixed(2)
  return (
    <Aux>
        <span className={classes.Span}>{children}</span>
    </Aux>
  );
};

export default span;