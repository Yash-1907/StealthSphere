import React from "react";
import style from "./Channel.module.css";
import { HiUserCircle } from "react-icons/hi"; 

const Channel = (props) => {
  return (
    <div className={style.main}>
      <HiUserCircle size={70} />
      <div className={style.container}>
        <div className={style.channelName}>{props.name}</div>
        <div className={style.channelDescription}>{props.description}</div>
      </div>
    </div>
  );
};

export default Channel;
