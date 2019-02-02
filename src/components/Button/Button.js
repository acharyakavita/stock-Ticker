import React from 'react';
import classes from '../Button/Button.css';


const button = (props) => {
    return (
        <button className={classes.Button}
        disabled={props.disabled}
            onClick={props.clicked}>{props.children}
        </button>
    )
}
export default button;