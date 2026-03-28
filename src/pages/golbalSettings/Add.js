import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { addGobalSetting, editGobalSetting, MAIN_BASE_URL } from '../../config';
import { Button } from '@mui/material';
import { use } from 'react';

const AddGlobalSettings = () => {
    const [emailAddress, setEmailAddress]= useState('');
    const [phoneNumber, setPhoneNumber]= useState('');
    const [address, setAddress]= useState('');
    const [adminPreTransactionRate, setAdminPreTransactionRate]= useState('');
    const [userDesposistFeeRate, setUserDesposistFeeRate]= useState('');
    const [userTransferToAnotherUserRate, setUserTransferToAnotherUserRate] = useState('');
    const [userWithdrawalFeeRate, setUserWithdrawalFeeRate]= useState('');
    const [fundraiserFee, setFundraiserFee]= useState('');
    const [home, setHome]   = useState('');
    const [zip, setZip]     = useState('');
    const [city, setCity]   = useState('');
    const [state, setState] = useState('');
    const [street, setStreet] = useState('');
    const [loading, setLoading]     = useState(false);

    const navigate  = useNavigate();
    const params    = useParams();
    const token     = localStorage.getItem('token');

    // Determine mode: editing if an id is present in the URL
    const { id } = params;
    const isEditing = !!id;

    // ─── Fetch existing data when editing ────────────────────────────────────
    const fetchSettings = async () => {
        setLoading(true);
        try {
            // editGobalSetting endpoint should return the record for the given id
            const response     = await axios.post(editGobalSetting, { id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = response.data.data;
            setEmailAddress(data.admin_email || '');
            setAddress(data.admin_address || '');
            setAdminPreTransactionRate(data.admin_pre_transaction_rate || '');
            setUserWithdrawalFeeRate(data.user_withdrawal_fee_rate || '');
            setUserDesposistFeeRate(data.user_desposist_fee_rate || '');
            setFundraiserFee(data.fundraiser_fee || '');
            setUserTransferToAnotherUserRate(data.user_transfer_to_another_user_rate || '');
            // Address details
            setHome(data.addressDetails?.home || '');
            setStreet(data.addressDetails?.street || '');
            setCity(data.addressDetails?.city || '');
            setState(data.addressDetails?.state || '');
            setZip(data.addressDetails?.zip || '');
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing) fetchSettings();
    }, []);

    // ─── Generic field change handler ────────────────────────────────────────
    const handleChange = (event) => {
        const { name, value } = event.target;
        const map = {
            admin_phone_number:              setPhoneNumber,
            admin_email:                     setEmailAddress,
            admin_address:                   setAddress,
            admin_pre_transaction_rate:      setAdminPreTransactionRate,
            user_withdrawal_fee_rate:        setUserWithdrawalFeeRate,
            user_desposist_fee_rate:         setUserDesposistFeeRate,
            user_transfer_to_another_user_rate: setUserTransferToAnotherUserRate,
            fundraiser_fee:                  setFundraiserFee,
            home:    setHome,
            city:    setCity,
            state:   setState,
            zip:     setZip,
            street:  setStreet,
        };
        if (map[name]) map[name](value);
    };

    // ─── Submit: POST (create) or PUT (update) ───────────────────────────────
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = {
                id: isEditing ? id : undefined,
                admin_address: address,
                admin_email: emailAddress,
                admin_phone_number: phoneNumber,
                admin_pre_transaction_rate: adminPreTransactionRate,
                user_desposist_fee_rate: userDesposistFeeRate,
                user_transfer_to_another_user_rate: userTransferToAnotherUserRate,
                user_withdrawal_fee_rate: userWithdrawalFeeRate,
                fundraiser_fee: fundraiserFee,
                addressDetails: {
                    home,
                    street,
                    city,
                    state,
                    zip
                }
            };
            const cleanedAddress = { ...payload.addressDetails };

            // Loop through and delete keys that are empty strings
            Object.keys(cleanedAddress).forEach(key => {
                if (cleanedAddress[key] === "") {
                    delete cleanedAddress[key];
                }
            });

            const finalPayload = {
                ...payload,
                addressDetails: cleanedAddress
            };

            const response = await axios.post(
                addGobalSetting,
                finalPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.msg);

            setTimeout(() => {

                const newId =
                    response.data?.data?._id || id;

                navigate(`/gobal-setting`);

            }, 1200);

        } catch (err) {

            toast.error(err.response?.data?.msg || "Error saving settings");

        } finally {
            setLoading(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    if (loading) return <div>Loading...</div>;

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">
                                {isEditing ? 'Edit' : 'Add'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="box-main">
                        <div className="box-main-table">
                            <div className="container-fluid">
                                <form onSubmit={handleSubmit}>

                                    {/* ── Contact Info ── */}
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Email Address <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="admin_email" placeholder="Enter Email Address"
                                                    className="form-control" value={emailAddress} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Phone Number <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="admin_phone_number" placeholder="Enter Phone Number"
                                                    className="form-control" value={phoneNumber} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Address <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="admin_address" placeholder="Enter Address"
                                                    className="form-control" value={address} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Fee Rates ── */}
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Admin Pre Transaction Rate <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="admin_pre_transaction_rate" placeholder="Enter rate"
                                                    className="form-control" value={adminPreTransactionRate} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">User Deposit Fee Rate <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="user_desposist_fee_rate" placeholder="Enter rate"
                                                    className="form-control" value={userDesposistFeeRate} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">User Transfer To Another User Rate <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="user_transfer_to_another_user_rate" placeholder="Enter rate"
                                                    className="form-control" value={userTransferToAnotherUserRate} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">User Withdrawal Fee Rate <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="user_withdrawal_fee_rate" placeholder="Enter rate"
                                                    className="form-control" value={userWithdrawalFeeRate} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Fundraiser Fee Rate <span style={{color:'red'}}>*</span></label>
                                                <input type="text" name="fundraiser_fee" placeholder="Enter rate"
                                                    className="form-control" value={fundraiserFee} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Office Address ── */}
                                    <label className="lableClass" style={{ marginTop: '15px' }}>Office Address</label>

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Home</label>
                                                <input type="text" name="home" placeholder="Enter Home"
                                                    className="form-control" value={home} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">Street</label>
                                                <input type="text" name="street" placeholder="Enter Street"
                                                    className="form-control" value={street} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">City</label>
                                                <input type="text" name="city" placeholder="Enter City"
                                                    className="form-control" value={city} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">State</label>
                                                <input type="text" name="state" placeholder="Enter State"
                                                    className="form-control" value={state} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label className="lableClass">ZIP</label>
                                                <input type="text" name="zip" placeholder="Enter ZIP"
                                                    className="form-control" value={zip} onChange={handleChange} style={{ marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row" style={{ marginTop: '20px' }}>
                                        <div className="col-lg-4">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Saving...' : isEditing ? 'Update Settings' : 'Save Settings'}
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddGlobalSettings;