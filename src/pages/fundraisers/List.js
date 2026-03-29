import axios from 'axios';
import React, { useMemo, useState } from 'react'
import { getAllFundraisersAPI } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function FundraiserList() {
    const token = localStorage.getItem('token'); // Parse as boolean

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: 'getAllFundraisers',
        queryFn: async () => {
            const { data } = await axios.get(getAllFundraisersAPI, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return data?.data
        },
        enabled: token ? true : false
    })
    // console.log('---req data---',token,data);
    const [searchQuery, setSearchQuery] = useState('')
    const finalData = useMemo(() => {
        if (searchQuery) {
            return data.filter(user => user.title.toLowerCase().includes(searchQuery.toLowerCase()));
        } else {
            return data
        }
    }, [data, searchQuery])

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
                                <h1 className="m-0 text-dark">Manage Fundraisers</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div class="box-main">
                            <div class="box-main-top">
                                <div class="box-main-title">Manage Fundraisers List</div>
                                <div class="box-main-top-right">
                                    <div class="box-serch-field">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                                <th>Title</th>
                                                <th>Start Date</th>
                                                <th>Target Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {finalData && finalData.map((req, index) => (
                                                <tr key={index}>
                                                    <td>{req.title}</td>
                                                    <td>{req.start_date.replace(/\//g, '-')}</td>
                                                    <td>{req.target_amount} HTG</td>
                                                    <td>{req.isVerified ? 'Approved' : 'Pending'}</td>
                                                    <td>
                                                        {/* <button class="ml-2 btn btn-sm btn-primary" disabled={req.isVerified} onClick={ () => handleApprove(req.id)}>{req.isVerified ? 'Approved' : 'Approve'}</button> */}
                                                        <Link to={`/fundraisers/detail/${req.id}`} ><i class="fa fa-eye " aria-hidden="true"></i></Link>
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

export default FundraiserList

// Title, start date, target amount, status. eye icon