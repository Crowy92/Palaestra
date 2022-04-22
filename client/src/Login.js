import React from 'react'
import './css/Login.css';
import { Link, useNavigate } from "react-router-dom";
import { useState, prevState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios'
import { Alert } from '@material-ui/lab'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const handleOutUp = () => {
        navigate("/onboarding")
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("submitted");
        try {

            const response = await axios.post('http://localhost:8000/login', { formData })
            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            const success = response.status === 201;

            if (success) {
                navigate('/home')
            } else { setErrorMessage('Bad login credentials!'); }


        } catch (error) {
            setErrorMessage('Bad login credentials!');
        }
    }
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const authToken = false;
    return (
        <div className="home">
            <h1>Swipe Right</h1>
            {errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}
            <button className="primary-button" onClick={handleOutUp}>
                {authToken ? 'Signout' : 'CreateAccount'}
            </button>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">email:</label>
                <input type="text" id="email" name="email" placeholder="Email" required={true} value={formData.email} onChange={handleChange} />
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" name="password" placeholder="Password" required={true} value={formData.password} onChange={handleChange} /><br />
                <input className="primary-button" type="submit" />
            </form>
        </div>
    )
}

export default Login