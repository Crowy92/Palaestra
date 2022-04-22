import React from 'react'
import { Avatar } from '@mui/material';
import './css/Chat.css';
import { Link } from "react-router-dom";

function Chat({ match }) {
    return (
        <Link to={`/chat/${match.user_id}`}>

            <div className="chat">
                <Avatar className="chat__image" alt={match.first_name} src={match.url} />
                <div className="chat__details">
                    <h2>{match.first_name}</h2>
                    <p>{match.about}</p>
                </div>
            </div>
        </Link>
    )
}

export default Chat