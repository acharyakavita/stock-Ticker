import React from "react";
import Classes from "./Header.css";

const header = props => {
  const iconClasses=['fas', 'fa-chart-line' ,'fa-2x','Graph-icon']
  return(
    <header className={Classes.Header}>
      <span>
        <i className={iconClasses.join(' ')} />
        <h1 className={Classes.Title}>STOCK CHECK</h1>
      </span>
  </header>
  )
  
  };
export default header;
