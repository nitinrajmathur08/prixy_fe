import React, { Component } from 'react';
import axios from 'axios';
import { getAllGobalSetting,deleteGobalSetting } from '../../config';
import { Link } from 'react-router-dom';

class GobalSettingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [], // Initialize users as an empty array
            loading: true,
            error: null,
            currentPage: 1,
            itemsPerPage: 10, // Number of items to display per page
            searchQuery: '' 
        };
    }
    componentDidMount() {
        this.fetchUsers();
    }
    fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Parse as boolean
            const response = await axios.get(getAllGobalSetting, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            this.setState({ users: response.data.data, loading: false, error: null });
        } catch (error) {
            console.error('Error fetching users:', error);
            this.setState({ error: error.message, loading: false });
        }
    };
    handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(deleteGobalSetting, { id: id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // If the deletion request is successful, reload the page
            if (response.status === 200) {
                window.location.reload(); // Reload the page
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            this.setState({ error: error.message, loading: false });
        }
    };
    getTotalPages = () => {
        const { usersPerPage, users } = this.state;
        return Math.ceil(users.length / usersPerPage);
    };
    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };
    render() {
        const { users, loading, error, currentPage, itemsPerPage, searchQuery } = this.state;
        const totalPage = this.getTotalPages();
        // Calculate index of the last and first items to display on the current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        // Filter users based on search query
        const filteredUsers = users.filter(user => {
            // Check if any field contains the search query
            return Object.values(user).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        // Slice the array of users to get the users for the current page
        const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
        const user = currentUsers[0];
        // Render pagination buttons
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
       
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Manage Global Settings</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="box-main">
                            <div className="box-main-top">
                                <div className="box-main-title">Global Settings List</div>
                                <div className="box-main-top-right">
                                    {/* <div className="box-serch-field">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={this.handleSearchChange}
                                        placeholder="Search"
                                        className='form-control'
                                    />
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </div> */}
                                    <Link to={`/gobal-setting/edit/${user?._id}`}>
                                        <button className="btn btn-primary">Edit</button>
                                    </Link> 
                                </div>
                               
                            </div>
                            <div className="box-main-table">
                                <div className="table-responsive">
                                    <table  className="table table-bordered admin-table">
                                        <thead>
                                            <tr>
                                
                                                <th>Name</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead> 
                                      
                                        <React.Fragment >
                                            <tr>
                                                <th>Email Address</th>
                                                <td>{user?.admin_email}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone Number</th>
                                                <td>{user?.admin_phone_number}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>{user?.admin_address}</td>
                                            </tr>
                                            <tr>
                                                <th>Admin Pre Transaction Rate</th>
                                                <td>{user?.admin_pre_transaction_rate}</td>
                                            </tr>
                                            <tr>
                                                <th>User Deposist Fee Rate</th>
                                                <td>{user?.user_desposist_fee_rate}</td>
                                            </tr>
                                            <tr>
                                                <th>User Transfer To Another User Rate</th>
                                                <td>{user?.user_transfer_to_another_user_rate}</td>
                                            </tr>
                                            <tr>
                                                <th>User Withdrawal Fee Rate</th>
                                                <td>{user?.user_withdrawal_fee_rate}</td>
                                            </tr>
                                            <tr>
                                                <th>Fundraiser Fee Rate</th>
                                                <td>{user?.fundraiser_fee}</td>
                                            </tr>
                                            <tr>
                                                <th>Home</th>
                                                <td>{user?.addressDetails?.home}</td>
                                            </tr>
                                            <tr>
                                                <th>Street</th>
                                                <td>{user?.addressDetails?.street}</td>
                                            </tr>
                                            <tr>
                                                <th>City</th>
                                                <td>{user?.addressDetails?.city}</td>
                                            </tr>
                                            <tr>
                                                <th>State</th>
                                                <td>{user?.addressDetails?.state}</td>
                                            </tr>
                                            <tr>
                                                <th>ZIP</th>
                                                <td>{user?.addressDetails?.zip}</td>
                                            </tr>
                    
                                        </React.Fragment>

                                        
                                    </table>
                                </div>
                            </div> 
                                
                        </div>    
                       
                    </div>
                </section>
            </div>
        );
    }
}

export default GobalSettingList;
