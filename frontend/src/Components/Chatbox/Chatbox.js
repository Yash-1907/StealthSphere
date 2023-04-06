import React, { useContext, useState, useRef, useEffect } from "react";
import style from "./Chatbox.module.css";
import Chat from "../../HelperComponents/Chat/Chat";
import { Send, Reload } from "./assets";
import { abi } from "../Sidebar/abi";
import { ethers, providers } from "ethers";
import { useMoralis } from "react-moralis";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import * as openpgp from "openpgp";

const Chatbox = () => {
  let [myKey, setMyKey] = useState("");
  let [otherKey, setOtherKey] = useState("");
  let [messagesArr, setMessagesArr] = useOutletContext();
  //   const [msg, setMsg] = useState("");
  const isEmpty = (arr, form) => {
    for (const key of arr) {
      if (form[key].value == "") {
        return true;
      }
    }

    return false;
  };

  //Define useRef() to access form data
  const formData = useRef();

  const contractAddress = "0x473a6f67E52BA67d3613e92d9657a026f845fd57";
  const { account } = useMoralis();
  const [activeChannel, setActiveChannel] = useOutletContext();
  const params = useParams();
  console.log("Hi", params.userId);

  const getMyCid = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    if (account != null) {
      const myCid = await contract.getCid(account);
      axios
        .get(`https://gateway.pinata.cloud/ipfs/${myCid}`)
        .then((response) => {
          setMyKey(response.data);
          console.log(myKey);
        })
        .catch((error) => console.log(error));
      //   console.log(myCid);
    }
  };
  const getOtherCid = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    if (account != null) {
      const otherCid = await contract.getCid(params.userId);
      axios
        .get(`https://gateway.pinata.cloud/ipfs/${otherCid}`, {
          headers: {
            Accept: "text/plain",
          },
        })
        .then((response) => {
          setOtherKey(response.data);
          console.log(otherKey);
        })
        .catch((error) => console.log(error));
      //   console.log(myCid);
    }
  };
  // setTimeout(getMyCid, 5000);
  // setTimeout(getOtherCid, 5000);

  const encryptAndSend = async (event) => {
    event.preventDefault();
    await getMyCid();
    await getOtherCid();
    let msg = formData.current.msg.value;
    if (myKey != null && otherKey != null) {
      const myPublicKey = await openpgp.readKey({
        armoredKey: myKey.publicKey,
      });
      const otherPublicKey = await openpgp.readKey({
        armoredKey: otherKey.publicKey,
      });
      const myEncrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: `0${msg}` }), // input as Message object
        encryptionKeys: myPublicKey,
      });
      const otherEncrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: `1${msg}` }), // input as Message object
        encryptionKeys: otherPublicKey,
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.sendMessage(
        params.userId,
        otherEncrypted,
        myEncrypted
      );
      await tx.wait();
      console.log(tx);
      formData.current.reset();
    }
  };

  const decrypt = async (event) => {
    event.preventDefault();
    getMyCid();
    getOtherCid();
    if (myKey != null && otherKey != null) {
      // const privateKey = await openpgp.readKey({
      //   armoredKey: myKey.privateKey,
      // });
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({
          armoredKey: myKey.privateKey,
        }),
        passphrase: window.sessionStorage.getItem(account),
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const length = await contract.getMessagesLength(account, params.userId);
      const msgArr = [];
      for (let index = 0; index < length; index++) {
        const msg = await contract.messages(account, params.userId, index);
        const message = await openpgp.readMessage({
          armoredMessage: msg, // parse armored message
        });
        const { data: decrypted, signatures } = await openpgp.decrypt({
          message,
          // verificationKeys: publicKey, // optional
          decryptionKeys: privateKey,
        });
        msgArr.push(decrypted);
      }
      setMessagesArr(msgArr);
      return msgArr;
    }
  };

  console.log(messagesArr);
  // useEffect(() => {
  //   (async () => {
  //     const tx = await decrypt();
  //     setMessagesArr(tx);
  //   })();
  // }, []);
  useEffect(() => {
    (async () => {
      getMyCid();
      getOtherCid();
    })();
  }, [params.userId]);

  return (
    <div className={style.container}>
      {messagesArr.length != 0 &&
        messagesArr.map((msg, index) => {
          if (msg[0] == "0") {
            return <Chat text={msg.slice(1)} isMe={true} />;
          } else {
            return <Chat text={msg.slice(1)} isMe={false} />;
          }
        })}
      <form
        className="input absolute bottom-3 w-2/3 flex rounded-none bg-transparent gap-2"
        style={{
          width: "80%",
          marginLeft: "10%",
        }}
        ref={formData}
      >
        <input
          type="text"
          className="input w-[100%] text-black px-10 h-12 rounded-none bg-white"
          name="msg"
        />
        <button
          className="btn rounded-full w-50 h-12 bg-[#5C15F9] border-none hover:bg-[#4F0BE6] overflow-hidden"
          style={{
            width: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={encryptAndSend}
        >
          <Send className="w-7" />
        </button>
        <button
          className="btn rounded-full w-50 h-12 bg-[#5C15F9] border-none hover:bg-[#4F0BE6] overflow-hidden"
          style={{
            width: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={decrypt}
        >
          <Reload className="w-7" />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
