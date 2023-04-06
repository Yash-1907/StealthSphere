import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Chatbox from "./Components/Chatbox/Chatbox";
import { MoralisProvider, useMoralis } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
// import Channel from "./HelperComponents/Channel/Channel";

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Router>
          <Navbar />
          <div className="App">
            <Routes>
              <Route path="/" element={<Sidebar />}>
                {/* <Route  path="chat" element={<Chatbox />}>
                <Route path=":channelId" element={<Channel />} /> */}
                <Route path="chat/:userId" element={<Chatbox />}></Route>
              </Route>
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default App;
