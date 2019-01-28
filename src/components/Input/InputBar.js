import React from "react";
import classes from "./InputBar.css";
import Aux from "../../hoc/Auxilary";
import Button from "../Button/Button";

const input = props => {
  return (
    <Aux>
      <form className={classes.InputBar}>
        <input type="text" placeholder="Search your stock.." name="search" tabIndex="0" autoFocus 
        className={classes.Input}
        onChange={props.search}
        value={props.value}/>
        <Button>{<i className="fa fa-search" />}</Button>
        <Button>Today</Button>
        <Button>Daily</Button>
        <Button>Weekly</Button>
        <Button>Monthly</Button>
      </form>
    </Aux>
  );
};

export default input;
