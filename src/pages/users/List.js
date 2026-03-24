import React, { Component } from 'react';
import axios from 'axios';
import { getAllUsersAPI } from '../../config';
import { Link } from 'react-router-dom';

class UserList extends Component {
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
            const response = await axios.get(getAllUsersAPI, {
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
                                <h1 className="m-0 text-dark">Manage User</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div class="box-main">
                            <div class="box-main-top">
                                <div class="box-main-title">User List</div>
                                <div class="box-main-top-right">
                                    <div class="box-serch-field">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={this.handleSearchChange}
                                        placeholder="Search"
                                        className='form-control'
                                    />
                                        <i class="fa fa-search" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="box-main-table">
                                <div class="table-responsive">
                                    <table id="example2" className="table table-bordered admin-table">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Kyc</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map((user, index) => (
                                                <tr key={index}>
                                                    {/* Render user data */}
                                                    <td>{indexOfFirstItem + index + 1}</td>
                                                    <td>{user.first_name} {user.last_name}</td>
                                                    <td>{user.phone_number}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                    {
                                                        user.is_kyc_approved == 1 ? 'Approved' :
                                                        user.is_kyc_approved == 2 ? 'Rejected' :
                                                        'Pending'
                                                    }
                                                    </td>
                                                    <td>
                                                    {
                                                        user.is_block_user == "1" ? 'Active' :
                                                        'Block'
                                                    }
                                                    </td>
                                                    <td>{user.createdAt}</td>
                                                    <td>
                                                        <Link to={`/users/detail/${user._id}`}>
                                                            <i className="fa fa-eye" aria-hidden="true"></i>
                                                        </Link>                                                      
                                                    </td>   
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div> 
                             {/* Pagination buttons */}
                             <ul className="pagination justify-content-end" style={{ marginRight: '20px' }}>
                                {/* Previous button */}
                                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                                    <a 
                                        onClick={() => this.setState(prevState => ({ currentPage: Math.max(prevState.currentPage - 1, 1) }))}
                                        className="page-link"
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                </li>

                                {/* Render page numbers */}
                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item${currentPage === number ? ' active' : ''}`}>
                                        <a onClick={() => this.setState({ currentPage: number })} className="page-link">
                                            {number}
                                        </a>
                                    </li>
                                ))}

                                {/* Next button */}
                                <li className={`page-item${currentPage === totalPage ? ' disabled' : ''}`}>
                                    <a 
                                        onClick={() => this.setState(prevState => ({ currentPage: Math.min(prevState.currentPage + 1, totalPage) }))}
                                        className="page-link"
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </li>
                            </ul>     
                        </div>    
                       
                    </div>
                </section>
            </div>
        );
    }
}

export default UserList;
