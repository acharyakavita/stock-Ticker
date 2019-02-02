import React from "react";
import classes from "./StockBar.css";
import Span from "../span/span";

const stockBar = props => {
 
  return (
    <div className={classes.StockBar}>
    <p>
        Open : <Span>{props.quoteData.open}</Span>
        High : <Span>{props.quoteData.high}</Span>
        Low : <Span>{props.quoteData.low}</Span>
        Price : <Span>{props.quoteData.price}</Span>
        Volume : <Span>{props.quoteData.volume}</Span>
        Closing : <Span>{props.quoteData.close}</Span>
    </p>
    </div>
  );
};

export default stockBar;
