import React from 'react'
import './css/Onboarding.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState, prevState } from 'react';
import { useCookies } from 'react-cookie';

function Onboarding() {
    const [formData, setFormData] = useState({
        user_id: '',
        fname: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        email: '',
        url: '',
        password: '',
        confirm_password: '',
        about: '',
        interests: []
    })
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    let navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const checked = e.target.checked;

        if (!checked && e.target.type === "checkbox") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: prevState.interests.filter(word => word !== value)
            }))
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: name === "interests" ? [...prevState.interests, value] : value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("submitted");
        try {
            if (formData.password !== formData.confirm_password) {
                window.alert('Passwords do not match');
                return;
            } else {
                const response = await axios.post('http://localhost:8000/signup', { formData })

                setCookie('AuthToken', response.data.token)
                setCookie('UserId', response.data.userId)
                const success = response.status === 201;

                if (success) navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    //console.log(formData);
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="fname">First name:</label>
                    <input type="text" id="fname" name="fname" placeholder="First name" required={true} value={formData.fname} onChange={handleChange} /><br />
                    <label htmlFor="password">Password:</label>
                    <input type="text" id="password" name="password" placeholder="Password" required={true} value={formData.password} onChange={handleChange} /><br />
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input type="text" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required={true} value={formData.confirm_password} onChange={handleChange} /><br />
                    <label htmlFor="dob_day">DOB day:</label>
                    <input type="number" id="dob_day" name="dob_day" min="1" max="31" placeholder="DD" value={formData.dob_day} onChange={handleChange} />
                    <label htmlFor="dob_month">DOB month:</label>
                    <input type="number" id="dob_month" name="dob_month" min="1" max="12" placeholder="MM" value={formData.dob_month} onChange={handleChange} />
                    <label htmlFor="dob_year">DOB year:</label>
                    <input type="number" id="dob_year" name="dob_year" min="1920" max="2020" placeholder="YYYY" value={formData.dob_year} onChange={handleChange} />
                </section>
                <br />
                <section>

                    <label htmlFor="email">email:</label>
                    <input type="text" id="email" name="email" placeholder="Email" required={true} value={formData.email} onChange={handleChange} />
                    <label htmlFor="about">about:</label>
                    <input type="text" id="about" name="about" placeholder="I like sports..." required={true} value={formData.about} onChange={handleChange} />
                    <label htmlFor="url">Profile Pic:</label>
                    <input type="url" id="url" name="url" placeholder="url" required={true} value={formData.url} onChange={handleChange} />
                    <div className="photo-container">
                        {formData.url && <img src={formData.url} alt="profile pic preview" />}
                    </div>
                </section>
                <section>
                    <h2>Sporting Interests</h2>

                    <label htmlFor="interest1"><input type="checkbox" id="interest1" name="interests" value="tennis" onChange={handleChange} checked={formData.interests.includes("tennis")} /><span>tennis</span></label>
                    <label htmlFor="interest2"><input type="checkbox" id="interest2" name="interests" value="cycling" onChange={handleChange} checked={formData.interests.includes("cycling")} /><span>cycling</span></label>
                    <label htmlFor="interest3"><input type="checkbox" id="interest3" name="interests" value="running" onChange={handleChange} checked={formData.interests.includes("running")} /><span>running</span></label>
                    <label htmlFor="interest4"><input type="checkbox" id="interest4" name="interests" value="badminton" onChange={handleChange} checked={formData.interests.includes("badminton")} /><span>badminton</span></label>
                    <label htmlFor="interest5"><input type="checkbox" id="interest5" name="interests" value="squash" onChange={handleChange} checked={formData.interests.includes("squash")} /><span>squash</span></label>
                    <label htmlFor="interest6"><input type="checkbox" id="interest6" name="interests" value="pool" onChange={handleChange} checked={formData.interests.includes("pool")} /><span>pool</span></label>
                    <label htmlFor="interest7"><input type="checkbox" id="interest7" name="interests" value="darts" onChange={handleChange} checked={formData.interests.includes("darts")} /><span>darts</span></label>
                    <label htmlFor="interest8"><input type="checkbox" id="interest8" name="interests" value="hiking" onChange={handleChange} checked={formData.interests.includes("hiking")} /><span>hiking</span></label>
                    <label htmlFor="interest9"><input type="checkbox" id="interest9" name="interests" value="zumba" onChange={handleChange} checked={formData.interests.includes("zumba")} /><span>zumba</span></label>
                    <label htmlFor="interest10"><input type="checkbox" id="interest10" name="interests" value="yoga" onChange={handleChange} checked={formData.interests.includes("yoga")} /><span>yoga</span></label>
                    <label htmlFor="interest11"><input type="checkbox" id="interest11" name="interests" value="pilates" onChange={handleChange} checked={formData.interests.includes("pilates")} /><span>pilates</span></label>
                    <label htmlFor="interest12"><input type="checkbox" id="interest12" name="interests" value="gym" onChange={handleChange} checked={formData.interests.includes("gym")} /><span>gym</span></label>
                    <input className="primary-button" type="submit" />
                </section>
            </form>
        </div>
    )
}

export default Onboarding
