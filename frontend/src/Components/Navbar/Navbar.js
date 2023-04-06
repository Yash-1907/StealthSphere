import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import style from "./Navbar.module.css";
import { HiUserCircle } from "react-icons/hi";
import Sidebar from "../Sidebar/Sidebar";
import logo from "./assets/logo.png";
import Chatbox from "../Chatbox/Chatbox";
import MyButton from "../../HelperComponents/Button/Button";
import { ethers } from "ethers";
import { Button, Modal } from "antd";
import { Outlet } from "react-router-dom";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
      // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
    }
  }, [isWeb3Enabled]);
  // no array, run on every render
  // empty array, run once
  // dependency array, run when the stuff in it changesan

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);
  return (
    <>
      <div className={style.container}>
        <div className={style.logo}>
          <img
            style={{
              width: "15%",
              height: "10%",
              marginLeft: "0",
            }}
            src={logo}
          />
          <h3>Stealth Sphere</h3>
        </div>
        <div className={style.navItems}>
          <div className={style.user}>
            {account ? (
              <div>
                Connected to {account.slice(0, 6)}...
                {account.slice(account.length - 4)}
              </div>
            ) : (
              <MyButton
                text={"Connect Wallet"}
                onClick={async () => {
                  // await walletModal.connect()
                  const ret = await enableWeb3();
                  if (typeof ret !== "undefined") {
                    // depends on what button they picked
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("connected", "injected");
                      // window.localStorage.setItem("connected", "walletconnect")
                    }
                  }

                }}
                disabled={isWeb3EnableLoading}
              >
                Connect Wallet
                <Modal
                  title="Basic Modal"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                </Modal>
              </MyButton>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
