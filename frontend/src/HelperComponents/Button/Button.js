import React from "react";
import style from "./Button.module.css";

const MyButton = (props) => {
    return(
        <button className={style.button} onClick={props.onClick}>{props.text}</button>
    ) 
}

export default MyButton;