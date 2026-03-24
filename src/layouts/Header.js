import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Clear the authentication status in local storage
        localStorage.clear(); // Clear everything
        sessionStorage.clear();
        localStorage.setItem('isAuthenticated','false');
        toast.success('Logout successful');
        //  Redirect to login
        // navigate('/login');
        window.location.href = '/admin-panel/login';
    };

    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                <li className="nav-item profile-item dropdown">
                    <a className="nav-link" data-toggle="dropdown" href="#">
                    <span className="profile-img">
                        <img src={process.env.PUBLIC_URL + "/Profile_Picture.png"} alt=""/>
                    </span>
                    <span className="profile-name"></span>
                    <i className="fas fa-angle-down"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">

                        <a href="#" className="dropdown-item">
                            <i className="fa fa-user mr-2"></i>Profile
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item">
                            <i className="fas fa-lock mr-2"></i> Change Password
                        </a>
                        <div className="dropdown-divider"></div>
                        <a  onClick={handleLogout} className="dropdown-item">
                            <i className="fas fa-sign-out-alt mr-2"></i> Logout
                        </a>
                    </div>
                   
                </li>
                </ul>
            </nav>
        </div>
    )
}

export default Header;