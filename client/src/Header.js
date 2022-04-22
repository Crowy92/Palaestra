import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import "./css/Header.css";

function Header({ backButton }) {
    const navigate = useNavigate();
    return (
        //BEM <<<<<
        <div className="header">
            {backButton ? (
                <IconButton onClick={() => navigate(backButton)}>
                    <ArrowBackIosIcon className="header__icon" fontSize="large" />
                </IconButton>
            ) : (
                <IconButton onClick={() => navigate("/Onboarding")}>
                    <PersonIcon className="header__icon" fontSize="large" />
                </IconButton>
            )}
            < Link to="/">
                <IconButton>
                    <img className="header__logo" src="https://1000logos.net/wp-content/uploads/2018/07/Tinder-icon-3.png" alt="tinder-logo" />
                </IconButton>
            </Link>
            <Link to="/chat">
                <IconButton>
                    <ForumIcon className="header__icon" fontSize="large" />
                </IconButton>
            </Link>

        </div>
    )
}

export default Header;
