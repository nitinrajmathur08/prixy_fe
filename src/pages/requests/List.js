import axios from 'axios';
import React from 'react'
import { getAllRequestAPI } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function RequestList() {
    const token = localStorage.getItem('token'); // Parse as boolean

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
    // console.log('---req data---',token,data);
    if (isLoading) {
        return <div>Loading...</div>;
    }
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
                                
                            </div>
                            <div class="box-main-table">
                                <div class="table-responsive">
                                    <table id="example2" className="table table-bordered admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Acion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data && data.map((req, index) => (
                                                <tr key={index}>
                                                    <td>{req?.agent[0]?.first_name} {req?.agent[0]?.last_name}</td>
                                                    <td>{req.amount} HTG</td>
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