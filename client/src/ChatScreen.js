import "./css/ChatScreen.css";
import { Avatar } from '@mui/material';
import { useEffect, useState } from "react";
import axios from 'axios'

function ChatScreen({ user }) {
    const URL = window.location.href.toString()
    const matchId = URL.substring(URL.lastIndexOf("/") + 1, URL.length);
    const userId = user?.user_id;
    const [matchedUser, setMatchedUser] = useState(null)
    const [userMessages, setUserMessages] = useState(null)
    const [matchMessages, setMatchMessages] = useState(null)
    const [textArea, setTextArea] = useState(null)

    const addMessage = async () => {
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: matchId,
            message: textArea
        }

        try {
            await axios.post('http://localhost:8000/message', { message })
            getUserMessages()
            getMatchMessages()
            setTextArea("")
        } catch (err) {
            console.log(err)
        }
    }

    const getMatchedUser = async () => {
        try {
            const response = axios.get('http://localhost:8000/user', {
                params: { matchId }
            })
            setMatchedUser((await response).data)
        } catch (error) {
            console.log(error)
        }
    }
    const getUserMessages = async () => {
        try {
            const res = await axios.get('http://localhost:8000/messages', {
                params: { userId: userId, correspondingUserId: matchId }
            })
            setUserMessages(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    const getMatchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:8000/messages', {
                params: { userId: matchId, correspondingUserId: userId }
            })
            setMatchMessages(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getMatchedUser();
        getUserMessages();
        getMatchMessages();
    }, [])

    const messages = []

    userMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = user?.first_name
        formattedMessage['img'] = user?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    matchMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = matchedUser?.first_name
        formattedMessage['img'] = matchedUser?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <div className="chatScreen">
            <p className="chatScreen__timestamp">YOU MATCHED WITH {matchedUser?.first_name} ON 10/08/20</p>
            {descendingOrderMessages?.map((message) =>
                message.name === matchedUser?.first_name ? (
                    <div key={message.timestamp} className="chatScreen__message">
                        < Avatar
                            className="chatScreen__image"
                            alt={message.name}
                            src={message.img}
                        />
                        <p className="chatScreen__text">{message.message}</p>
                    </div>
                ) : (
                    <div key={message.timestamp} className="chatScreen__message">

                        <p className="chatScreen__textUser">{message.message}</p>
                    </div>
                )
            )}
            <form className="chatScreen__input">
                <input className="chatScreen__inputField"
                    type="text"
                    value={textArea ? textArea : ""} onChange={(e) => setTextArea(e.target.value)} />
                <button onClick={addMessage} className="chatScreen__inputButton">SEND</button>
            </form>
        </div>
    );
}

export default ChatScreen