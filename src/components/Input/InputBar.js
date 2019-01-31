import React from "react";
import classes from "./InputBar.css";
import Button from "../Button/Button";

const input = props => {
  let searchResults = null;
  let searchResultsItem = null;
  if (props.show) {
      /*show first 5 results*/
    searchResultsItem = props.searchResults.map(item => {
        let companyKey=item.companySymbol+item.companyRegion
      return (
        <li key={companyKey} 
        className={classes.SearchResultsContent}
         onClick={()=>props.companyCodeClick(item.companySymbol)}>
            {item.companySymbol} : {item.companyName},
            {item.companyRegion}
         </li>
      );
    })
    searchResults = (
      <ul className={classes.SearchResults}>{searchResultsItem}</ul>
    );
  }

  return (
    <div className={classes.InputBar}>
      <form className={classes.Form}>
        <input
          type="text"
          placeholder="Search your stock.."
          name="search"
          tabIndex="0"
          autoFocus
          autoComplete="off"
          className={classes.Input}
          onChange={props.search}
          value={props.value}
        />
        <Button style={{ marginBottom: "0" }}
        clicked={props.searchButtonClick}>
          {<i className="fa fa-search" />}
        </Button>
        {searchResults}
      </form>
      <div className={classes.ButtonGroup}>
        <Button clicked={props.todayButtonClick}>Today</Button>
        <Button clicked={props.dailyButtonClick}>Daily</Button>
        <Button clicked={props.weeklyButtonClick}>Weekly</Button>
        <Button>Monthly</Button>
      </div>
    </div>
  );
};

export default input;
