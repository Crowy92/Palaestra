import React, { useEffect } from 'react';
import './css/Chats.css';
import Chat from './Chat.js'
import axios from 'axios';
import { useState } from 'react'

function Chats({ user }) {
    //const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)
    const [matchedProfiles, setMatchedProfiles] = useState(null);

    const getMatches = async () => {
        try {
            const res = await axios.get('http://localhost:8000/matchedUsers', {
                params: { userIds: JSON.stringify(user.matches) }
            })
            setMatchedProfiles(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMatches()
    }, [])

    return <div className="chats">
        {matchedProfiles?.map((match, _index) => (
            <div key={{ _index }}>
                <Chat match={match} />
            </div>
        ))}
    </div>;
}

export default Chats