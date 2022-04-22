import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import "./css/TinderCards.css";
import axios from "axios";

function TinderCards({ user }) {
    const [lastDirection, setLastDirection] = useState();
    const [allUsers, setAllUsers] = useState(null);
    let userId = null;
    if (user)
        userId = user.user_id;

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
        } catch (error) {
            console.log(error)
        }
    }

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    function interestsMatch(match) {
        let interested = false;
        if (!match.interests)
            return false;
        if (match.email === user.email)
            return false;
        if (user?.matches.includes(match.user_id))
            return false;
        user.interests.forEach(interest => {
            if (match?.interests.includes(interest)) {
                interested = true;
            }
        });
        return interested;
    }

    const getInterestUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/users', {
                params: {}
            })
            const allUsers = res.data;
            const interestUsers = allUsers.filter(interestsMatch);
            setAllUsers(interestUsers)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getInterestUsers();
    }, [])

    return (
        <div>
            <div className="tinderCards__cardContatiner">
                {allUsers ? allUsers.map((character) =>
                    <TinderCard className='swipe' key={character.first_name} onSwipe={(dir) => swiped(dir, character.user_id)} onCardLeftScreen={() => outOfFrame(character.first_name)}>
                        <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                            <h3>{character.first_name}</h3>
                        </div>
                    </TinderCard>
                ) : <p />}
                <div className="swipe-info">
                    {lastDirection ? <p>You swiped {lastDirection}</p> : <p> No More Matches</p>}
                </div>
            </div>
        </div>
    );
}

export default TinderCards;