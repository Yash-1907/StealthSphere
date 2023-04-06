import React, { useState } from "react";
import style from "./Channel.module.css";
import { HiUserCircle } from "react-icons/hi";
import { useOutletContext, useParams } from "react-router-dom";

const Channel = (props) => {
  // // const [activeChannel, setActiveChannel] = useOutletContext();
  // let mainClass = style.main;
  // if(props.name == activeChannel){
  //   mainClass = style.mainActive;
  // }
  let mainClass = style.main;
  const params = useParams();
  if (params.userId == props.id) {
    mainClass = style.mainActive;
  } else {
    mainClass = style.main;
  }
  return (
    <div className={mainClass}>
      <HiUserCircle size={70} />
      <button
        className={style.container}
        onClick={() => {
          props.onClick();
        }}
      >
        <div className={style.channelName}>{props.name}</div>
        <div className={style.channelDescription}>{props.description}</div>
      </button>
    </div>
  );
};

export default Channel;
