import './css/App.css';
import Header from './Header';
import TinderCards from './TinderCards'
import SwipeButtons from './SwipeButtons'
import Onboarding from './Onboarding'
import Chats from './Chats'
import ChatScreen from './ChatScreen'
import Login from './Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null)
  const [cookies] = useCookies(['user'])
  //const peopleCollectionRef = collection(db, "people");
  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = axios.get('http://localhost:8000/user', {
        params: { userId }
      })
      setUser((await response).data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className="App">
      {/* Header */}
      <Router>
        <Routes>
          <Route path="/chat/:person"
            element={<><Header backButton="/chat" /> <ChatScreen user={user} /></>
            } />
          <Route path="/chat"
            element={<><Header backButton="/home" /> <Chats user={user} /></>
            } />
          <Route path="/onboarding"
            element={<><Header backButton="/home" /> <Onboarding /></>
            } />
          <Route path="/home" element={<><Header /> <TinderCards user={user} /><SwipeButtons /></>} />
          <Route path="/" element={<><Header /> <Login /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
