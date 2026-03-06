import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { Component } from 'react'
import { getTotal } from '../config'
 function Dashboard()  {
    const token = localStorage.getItem('token'); // Parse as boolean


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: 'getTotal',
        queryFn: async () => {
            const { data } = await axios.get(getTotal, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return data?.data
        },
        enabled: token ? true : false
    })

        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-6">
                                <a href="">
                                    <div className="small-box bg-orange">
                                        <div className="inner">
                                            <p>Total Users</p>
                                            <h3>{data?.userTotal || '_'}</h3>
                                        </div>
                                    </div>        
                                </a>
                            </div>
                            <div className="col-lg-3 col-6">
                                <a href="">
                                    <div className="small-box bg-blue">
                                        <div className="inner">
                                            <p>Total Withdraws</p>
                                            <h3>{data?.withdrawTotal || '_'}</h3>
                                        </div>
                                    </div>        
                                </a>
                            </div>
                            <div className="col-lg-3 col-6">
                                <a href="">
                                    <div className="small-box bg-purple">
                                        <div className="inner">
                                            <p>Total Requests</p>
                                            <h3>{data?.requestTotal || '_'}</h3>
                                        </div>
                                    </div>        
                                </a>
                            </div>
                            <div className="col-lg-3 col-6">
                                <a href="">
                                    <div className="small-box bg-green">
                                        <div className="inner">
                                            <p>Total Agents</p>
                                            <h3>{data?.agentTotal || '_'}</h3>
                                        </div>
                                    </div>        
                                </a>
                            </div>
                        </div>
                    </div>    
                </section>
            </div>    
        )
    
}
export default Dashboard