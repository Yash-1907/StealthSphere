import React from "react";
import style from "./Chat.module.css";

const Chat = (props) => {
  const className = props.isMe ? style.me : style.other;
  const container = props.isMe ? style.meContainer : style.otherContainer;
  return (
    <div className={container}>
      <div className={className}>{props.text}</div>
    </div>
  );
};

export default Chat;
