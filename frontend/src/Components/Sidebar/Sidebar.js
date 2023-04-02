import React, { useState, useEffect, createContext } from "react";
import MyButton from "../../HelperComponents/Button/Button";
import Channel from "../../HelperComponents/Channel/Channel";
import style from "./Sidebar.module.css";
import * as openpgp from "openpgp";
import axios from "axios";
import { ethers } from "ethers";
import { abi } from "./abi";
import { Button, Modal } from "antd";
import { useMoralis } from "react-moralis";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Sidebar = () => {
  let key;
  let otherKey;
  const [activeChannel, setActiveChannel] = useState("");
  //   const { account } = useMoralis();
  const contractAddress = "0x473a6f67E52BA67d3613e92d9657a026f845fd57";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { account } = useMoralis();
  const getMoralis = async () => {
    const myAccount = account;
    return myAccount;
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [channels, setChannels] = React.useState([]);
  const getAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  };
  const handleGenerateKey = async () => {
    key = await openpgp.generateKey({
      curve: "curve25519",
      userIDs: [{ name: "Test", email: "test@test.com" }],
    });

    var data = JSON.stringify({
      // pinataOptions: {
      //   cidVersion: 1,
      // },
      // pinataMetadata: {
      //   name: "testing",
      //   keyvalues: {
      //     customKey: "customValue",
      //     customKey2: "customValue2",
      //   },
      // },
      pinataContent: key,
    });

    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZDI2YThhNy0xOTk1LTRmY2ItOTMxMC1mYmJjODRlODlmODgiLCJlbWFpbCI6Im5vbmFkaTM3NDhAZ2FsY2FrZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjc3OTBmNTNhNDkyYjU4YjgwOGEiLCJzY29wZWRLZXlTZWNyZXQiOiI5NGUyZmZjMjkzYmJjZDhiZWU1Y2E1NGY5ZDM1NjFiZWE3OGNhZjQwMzNkZTY1YjlhM2FlNDE2YWRlYjM1Yzg4IiwiaWF0IjoxNjc4ODczNDkwfQ.UMyM8rhnK1GZCXi5Tc9r9xV62Pec4W2ZkWSCZsltmNs"}`,
      },
      data: data,
    };

    const res = await axios(config);
    console.log(res.data.IpfsHash);
    const account = await getAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const contractAddress = "0x473a6f67E52BA67d3613e92d9657a026f845fd57";
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.generateKeys(res.data.IpfsHash);
    await tx.wait();
    console.log("Transaction:", tx.hash);
  };

  const handleGetContacts = async () => {
    const account = await getAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const contractAddress = "0x473a6f67E52BA67d3613e92d9657a026f845fd57";
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.getContacts(account);
    setActiveChannel(tx[0]);
    return tx;
  };

  const [newAddress, setNewAddress] = useState("");
  const handleNewAddress = (e) => {
    setNewAddress(e.target.value);
  };
  const handleOk = async () => {
    const account = await getAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const contractAddress = "0x473a6f67E52BA67d3613e92d9657a026f845fd57";
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.addContact(newAddress);
    await tx.wait();
    // console.log("Transaction:", tx.hash);
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const tx = await handleGetContacts();
      setChannels(tx);
    })();
  }, []);

  //   const [myCid, setMyCid] = useState("");
//   const [otherCid, seOtherCid] = useState("");
//   const getCid = async (otherAddress) => {
//     // const accountAddress = "0xc1490E0489f487477A9B4e52Da19416d21fC09E0"
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner(account);
//     const contract = new ethers.Contract(contractAddress, abi, signer);
//     const otherCid = await contract.getCid(otherAddress);
//     axios
//       .get(`https://gateway.pinata.cloud/ipfs/${otherCid}`)
//       .then((response) => {
//         otherKey = response.data;
//         console.log(otherKey);
//       })
//       .catch((error) => console.log(error));
//   };
//   getCid(channels[0]);  //   console.log(otherCid);
//   console.log("Transaction:", channels);

  return (
    <>
      <div className={style.container}>
        <div className={style.header}>
          <MyButton text={"Generate Key"} onClick={handleGenerateKey} />
          <MyButton text={"Add Contacts"} onClick={showModal} />
        </div>
        <Modal
          title="Add Contacts"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                padding: "0 10px",
                marginBottom: "10px",
              }}
              type="text"
              placeholder="Alias"
            />
            <input
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                padding: "0 10px",
                marginBottom: "10px",
              }}
              type="text"
              placeholder="Enter Contact Address"
              onChange={handleNewAddress}
            />
          </form>
        </Modal>
        <div className="p-10">
          {channels.map((channel, index) => {
            const address = channel.slice(0, 10) + "..." + channel.slice(-8);
            return <Channel name={address} />;
          })}
        </div>
      </div>
      <Outlet context={[activeChannel, setActiveChannel]} />
    </>
  );
};

export default Sidebar;
