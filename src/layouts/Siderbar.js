import React, { Component } from 'react'
import { Link} from 'react-router-dom';
import withRouterProps from './WithRouterProps'

class Siderbar extends Component {
    render (){
        // Get the current path from location prop
        const { location }=  this.props;
        const currentPath = location.pathname;
        return (
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <Link to="/" className="brand-link">
                    <img src={process.env.PUBLIC_URL + "/Admin_Menu.png"} alt=""/>
                    </Link>
                    {/* <div className="main-navigation">MAIN NAVIGATION</div> */}
                  
                    <div className="sidebar">
                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                <li className="nav-item">
                                    <Link to="/dashboard" className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-tachometer-alt"></i>
                                        <p>Dashboard</p>
                                    </Link>
                                </li>
                                
                                <li className="nav-item">
                                    <Link to="/users" className={`nav-link ${currentPath.startsWith('/users') ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-user"></i>
                                        <p>Users</p>
                                    </Link>
                                    
                                </li>
                                <li className="nav-item">
                                    <Link to="/agents" className={`nav-link ${currentPath.startsWith('/agents') ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-users"></i>
                                        <p>Agents</p>
                                    </Link>
                                    
                                </li>
                                <li className="nav-item">
                                    <Link to="/requests" className={`nav-link ${currentPath.startsWith('/requests') ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-users"></i>
                                        <p>Agent Requests</p>
                                    </Link>
                                    
                                </li>
                                <li className="nav-item">
                                    <Link to="/fundraisers" className={`nav-link ${currentPath.startsWith('/fundraisers') ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-users"></i>
                                        <p>Fundraisers</p>
                                    </Link>
                                    
                                </li>
                                <li className="nav-item">
                                    <Link to="/gobal-setting" className={`nav-link ${currentPath.startsWith('/gobal-setting') ? 'active' : ''}`}>
                                        <i className="nav-icon fas fa-cog"></i>
                                        <p>Global Settings</p>
                                    </Link>
                                    
                                </li> 
                            </ul>
                        </nav>
                    </div>
                </aside>
            </div>
        )
    }
}

export default withRouterProps(Siderbar);
