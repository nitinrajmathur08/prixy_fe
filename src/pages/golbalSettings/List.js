import React, { Component } from 'react';
import axios from 'axios';
import { getAllGobalSetting, deleteGobalSetting } from '../../config';
import { Link } from 'react-router-dom';

class GobalSettingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setting: null,   // Single global setting object (or null if none exists)
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchSettings();
    }

    fetchSettings = async () => {
        try {

            const token = localStorage.getItem('token');

            const response = await axios.get(getAllGobalSetting, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // TAKE FIRST RECORD
            const setting = response.data.data?.[0] || null;

            this.setState({
                setting,
                loading: false,
                error: null
            });

        } catch (error) {
            this.setState({
                error: error.message,
                loading: false
            });
        }
    };


    render() {
        const { setting, loading, error } = this.state;

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;

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
                                <div className="box-main-title">Global Settings</div>
                                <div className="box-main-top-right">
                                    {/* Show Add button if no settings exist, Edit button if they do */}
                                    {!setting  ? (
                                        <Link to="/gobal-setting/add">
                                            <button className="btn btn-success">+ Add Settings</button>
                                        </Link>
                                    ) : (
                                        <Link to={`/gobal-setting/edit/${setting._id}`}>
                                            <button className="btn btn-primary">Edit</button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="box-main-table">
                                {!setting ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                        No global settings found. Click <strong>Add Settings</strong> to create one.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>Email Address</th>
                                                    <td>{setting.admin_email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phone Number</th>
                                                    <td>{setting.admin_phone_number}</td>
                                                </tr>
                                                <tr>
                                                    <th>Address</th>
                                                    <td>{setting.admin_address}</td>
                                                </tr>
                                                <tr>
                                                    <th>Admin Pre Transaction Rate</th>
                                                    <td>{setting.admin_pre_transaction_rate}</td>
                                                </tr>
                                                <tr>
                                                    <th>User Deposit Fee Rate</th>
                                                    <td>{setting.user_desposist_fee_rate}</td>
                                                </tr>
                                                <tr>
                                                    <th>User Transfer To Another User Rate</th>
                                                    <td>{setting.user_transfer_to_another_user_rate}</td>
                                                </tr>
                                                <tr>
                                                    <th>User Withdrawal Fee Rate</th>
                                                    <td>{setting.user_withdrawal_fee_rate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fundraiser Fee Rate</th>
                                                    <td>{setting.fundraiser_fee}</td>
                                                </tr>
                                                <tr>
                                                    <th>Home</th>
                                                    <td>{setting.addressDetails?.home}</td>
                                                </tr>
                                                <tr>
                                                    <th>Street</th>
                                                    <td>{setting.addressDetails?.street}</td>
                                                </tr>
                                                <tr>
                                                    <th>City</th>
                                                    <td>{setting.addressDetails?.city}</td>
                                                </tr>
                                                <tr>
                                                    <th>State</th>
                                                    <td>{setting.addressDetails?.state}</td>
                                                </tr>
                                                <tr>
                                                    <th>ZIP</th>
                                                    <td>{setting.addressDetails?.zip}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default GobalSettingList;