import React from "react";
import classes from "./InputBar.css";
import Aux from "../../hoc/Auxilary";
import Button from "../Button/Button";

const input = props => {
    if(props.showResults){
        
    }
  return (
    <Aux>
      <form className={classes.InputBar}>
        <input type="text" placeholder="Search your stock.." name="search" tabIndex="0" autoFocus 
        autoComplete="off"
        className={classes.Input}
        onChange={props.search}
        value={props.value}/>
        <ul id="myUL">
  <li>{props.companyName[0]}{props.companySymbol[0]}</li>
</ul>
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
