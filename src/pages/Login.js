import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { LoginAPI } from '../config';


const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }else if( name == 'rememberMe'){
            setRememberMe(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check if email and password are not empty
        if (!email.trim()) {
            // If either field is empty, set an error message and return early
            toast.error('Please enter email');
            return;
        }
        if (!password.trim()) {
            // If either field is empty, set an error message and return early
            toast.error('Please enter password');
            return;
        }

        try {
            const response = await axios.post(LoginAPI, { email, password });
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.auth_token);
                localStorage.setItem('isAuthenticated', response.data.data.isLoggedIn);
                toast.success('Login successful');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                // Handle other status codes if needed
                toast.error('Invalid email or password');
            }
        } catch (error) {
            // If request fails or server responds with 401
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access (invalid credentials)
                toast.error('Invalid email or password');
            } else {
                // Handle other errors
                toast.error('An error occurred while logging in');
                console.error('Login error:', error);
            }
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className='col-lg-12' style={{ overflow: "hidden" }}> 
            <div className='row' style={{ margin: '-17px' }}>
                <div className='col-lg-8'>
                    <img src={process.env.PUBLIC_URL + "/images/Rectangle_ban.png"} className='h-100 object-fit-cover w-100'/>
                </div>
                <div class="auth-bg-gradient card-img-overlay"></div>
                <div className='col-lg-4'>
                    <div className='login-page'>
                        <div className="login-box">
                            <div style={{display:'flex', justifyContent:'center', marginBottom:'100px'}}>
                                <img src={process.env.PUBLIC_URL + "/Banner_Logo.png"} alt="Prixy Logo" className="login-logo" style={{height:'100px'}}/>
                            </div>
                            <div className="login-title-box">
                                <h4 className="login-title">Welcome to Prixy    </h4>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email" className="lableclassName">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        placeholder="Enter Email Address" 
                                        className="form-control"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="lableclassName">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        placeholder="Enter  Password" 
                                        className="form-control"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <div className="icheck-primary">
                                        <input 
                                            type="checkbox" 
                                            id="remember"
                                            checked={rememberMe}
                                            onChange={handleChange}  
                                        />
                                        <span className="custom-checked">
                                            <img src="{{URL('public/admin/dist/img/checked.svg')}}" alt="" />
                                        </span>
                                        {/* <label htmlFor="remember">
                                            Remember Me
                                        </label> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
                                    </div>
                                    {/* <div className="col-lg-8">
                                        <p className="forgot-link">
                                        <a href="">Forgot Password?</a>
                                        </p>
                                    </div> */}
                                </div>
                            </form>
                        </div>       
                    </div>    
                </div>
            </div>
        </div>
    )
}
export default Login;