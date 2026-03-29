import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
function DetailRequest() {
    const { id } = useParams();
    const queryClient = useQueryClient()
    console.log('---params---', id);
    const token = localStorage.getItem('token'); // Parse as boolean

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getSingleRequests', id],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}agent/get-requests/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return data?.data
        },
        enabled: token ? true : false
    })
    console.log('---req data---', token, data);

    const handleAorR = useCallback(
        async (t) => {
            // /agent/update-requests/:reqId
            try {
                await axios.post(`${BASE_URL}agent/update-requests/${id}`, {
                    accept_decline_status: t
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                queryClient.refetchQueries(['getSingleRequests', id])

                if (t === '2') {
                    toast.success('Request approved successfully');
                } else if (t === '3') {
                    toast.success('Request rejected successfully');
                } else {
                    toast.info('Request status updated successfully');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to update request status. Please try again.');
            }
        },
        [id, queryClient, token],
    )


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading request details. Please try again.</div>;
    }

    if (!data || data.length === 0) {
        return <div>No request data found.</div>;
    }
    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Manage Agent Requets </h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="box-main">
                        <div className="box-main-top">
                            <div className="box-main-title">Request Details </div>


                            <div className="box-main-table">

                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <label className="lableClass">First Name  </label>
                                            <br />
                                            <span className='spanclassTxt'> {data[0]?.agent[0]?.first_name || 'N/A'}</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Last Name </label>
                                            <br />
                                            <span className='spanclassTxt'> {data[0]?.agent[0]?.last_name || 'N/A'}</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Phone Number  </label>
                                            <br />
                                            <span className='spanclassTxt'>{data[0]?.agent[0]?.phone_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <label className="lableClass">Amount  </label>
                                            <br />
                                            <span className='spanclassTxt'>{data[0]?.total_amount || 'N/A'} HTG</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Current Balance  </label>
                                            <br />
                                            <span className='spanclassTxt'>{data[0]?.agent[0]?.current_balance || 'N/A'} HTG</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Date of requested  </label>
                                            <br />
                                            <span className='spanclassTxt'>{new Date(data[0]?.createdAt).toLocaleDateString('en-CA').replace(/-/g, '-') || '0'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <label className="lableClass">Receipt  </label>
                                            <br />
                                            <div className="row" style={{ marginTop: '10px' }}>
                                                <div className="col-lg-12 file-item">
                                                    <a href={`https://dev-prixy.s3.amazonaws.com/dev/${data[0]?.receipt}`} target="_blank" rel="noopener noreferrer">
                                                        <img src={`https://dev-prixy.s3.amazonaws.com/dev/${data[0]?.receipt}`} alt="file-icon" className="file-icon" />
                                                        <br />
                                                        <span className='spanclassTxt'>{data[0]?.receipt}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        {data[0]?.accept_decline_status === '1' ? <div className="col-lg-4">
                                            <label className="lableClass">Money Accept/Reject  </label>
                                            <br />
                                            <div>
                                                <Button onClick={() => { handleAorR('3') }} style={{ cursor: 'pointer' }}>
                                                    <i className="fa fa-times-circle disblecheck fa-lg"
                                                        style={{ color: 'red', fontSize: '25px', marginTop: '10px', cursor: 'pointer' }}></i>
                                                </Button>
                                                <Button onClick={() => { handleAorR('2') }} style={{ cursor: 'pointer' }}>
                                                    <i className="fa fa-check-circle enablecheck fa-lg"
                                                        style={{ color: 'green', fontSize: '25px', marginTop: '10px', cursor: 'pointer' }}></i>
                                                </Button>
                                            </div>
                                        </div> : <div className="col-lg-4">
                                            <label className="lableClass">Status  </label>
                                            <br />
                                            <span className='spanclassTxt'>{data[0]?.accept_decline_status === '2' ? 'Approved' : data[0]?.accept_decline_status === '3' ? 'Not approved' : 'Pending'}</span>
                                        </div>}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DetailRequest

// `https://dev-prixy.s3.amazonaws.com/dev/${file.fileName}`