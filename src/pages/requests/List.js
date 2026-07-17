import axios from 'axios';
import React, { useState } from 'react'
import { getAllRequestAPI } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function RequestList() {
    const token = localStorage.getItem('token'); // Parse as boolean
    const [searchQuery, setSearchQuery] = useState('');

    const {data,isLoading, isError} = useQuery({
        queryKey: 'getAllRequests',
        queryFn: async () => {
            const { data } = await axios.get(getAllRequestAPI, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return data?.data
        },
        enabled: token ? true : false
    })

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const filteredData = data ? data.filter(req => {
        const name = req.agent_name 
            ? req.agent_name 
            : (req.agent && req.agent[0] && (req.agent[0].first_name || req.agent[0].last_name)
                ? `${req.agent[0].first_name || ''} ${req.agent[0].last_name || ''}`.trim()
                : '');
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    }) : [];

    return (
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Manage Request</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div class="box-main">
                            <div class="box-main-top">
                                <div class="box-main-title">Manage Request List</div>
                                <div class="box-main-top-right">
                                    <div class="box-serch-field">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
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
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((req, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {req.agent_name 
                                                            ? req.agent_name 
                                                            : (req.agent && req.agent[0] && (req.agent[0].first_name || req.agent[0].last_name)
                                                                ? `${req.agent[0].first_name || ''} ${req.agent[0].last_name || ''}`.trim()
                                                                : 'N/A'
                                                            )
                                                        }
                                                    </td>
                                                    <td>{req.request_type || (req.money_request_type === '1' ? 'Withdrawal' : 'Deposit')}</td>
                                                    <td>{req.amount} HTG</td>
                                                    <td>
                                                        {req.is_accepted || (req.accept_decline_status === '2' ? 'Accepted' : (req.accept_decline_status === '3' ? 'Declined' : 'Pending'))}
                                                    </td>
                                                    <td>{req.createdAt && new Date(req.createdAt).toLocaleDateString('en-CA').replace(/-/g, '-')}</td> 
                                                    <td>
                                                        <Link to={`/requests/detail/${req._id}`} ><i class="fa fa-eye " aria-hidden="true"></i></Link>
                                                    </td> 
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div> 
                             
                        </div>    
                       
                    </div>
                </section>
            </div>
        </div>
    )
}

export default RequestList