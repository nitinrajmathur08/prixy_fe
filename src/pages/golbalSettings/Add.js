import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { addEdit, addGobalSetting, editGobalSetting, getFaq, MAIN_BASE_URL } from '../../config';
import { Button } from '@mui/material';

const AddGlobalSettings = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [adminPreTransactionRate, setAdminPreTransactionRate] = useState('');
    const [userDesposistFeeRate, setUserDesposistFeeRate] = useState('');
    const [userTransferToAnotherUserRate, setUserTransferToAnotherUserRate] = useState('');
    const [userWithdrawalFeeRate, setUserWithdrawalFeeRate] = useState('');
    const [fundraiserFee, setFundraiserFee] = useState('');
    const [home, setHome] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [street, setStreet] = useState('');
    const [faqs, setFaqs] = useState([]);
    const [fquestion, setFquestion] = useState('');
    const [fanswer, setFanswer] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const token = localStorage.getItem('token');

    // Check if ID is present in the URL
    const { id } = params;
    const isEditing = !!id;

    const fetchSettings = async () => {
        try {
            const response = await axios.post(editGobalSetting, { id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const faqResponse = await axios.get(getFaq);
            console.log(response, faqResponse);
            setFaqs(faqResponse?.data?.data)
            setPhoneNumber(response.data.data.admin_phone_number);
            setEmailAddress(response.data.data.admin_email);
            setAddress(response.data.data.admin_address);
            setAdminPreTransactionRate(response.data.data.admin_pre_transaction_rate);
            setUserWithdrawalFeeRate(response.data.data.user_withdrawal_fee_rate);
            setUserDesposistFeeRate(response.data.data.user_desposist_fee_rate);
            setFundraiserFee(response.data.data.fundraiser_fee);
            setUserTransferToAnotherUserRate(response.data.data.user_transfer_to_another_user_rate);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    // Call fetchSettings only once when the component mounts
    useEffect(() => {
        if (isEditing) {
            fetchSettings();
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'admin_phone_number') {
            setPhoneNumber(value);
        } else if (name === 'admin_email') {
            setEmailAddress(value);
        } else if (name === 'admin_address') {
            setAddress(value);
        } else if (name === 'admin_pre_transaction_rate') {
            setAdminPreTransactionRate(value);
        } else if (name === 'user_withdrawal_fee_rate') {
            setUserWithdrawalFeeRate(value);
        } else if (name === 'user_desposist_fee_rate') {
            setUserDesposistFeeRate(value);
        } else if (name === 'user_transfer_to_another_user_rate') {
            setUserTransferToAnotherUserRate(value);
        } else if (name === 'fundraiser_fee') {
            setFundraiserFee(value);
        } else if (name === 'home') {
            setHome(value);
        } else if (name === 'city') {
            setCity(value);
        } else if (name === 'state') {
            setState(value);
        } else if (name === 'zip') {
            setZip(value);
        } else if (name === 'street') {
            setStreet(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check if email and password are not empty
        if (!emailAddress.trim() || !phoneNumber.trim() || !address.trim()
            || !adminPreTransactionRate.trim() || !userDesposistFeeRate.trim() || !userWithdrawalFeeRate.trim()
            || !userTransferToAnotherUserRate.trim()) {
            // If either field is empty, set an error message and return early
            toast.error('Please enter required fields');
            return;
        }

        try {

            const bodyParms = {
                "admin_address": address,
                "admin_email": emailAddress,
                "admin_phone_number": phoneNumber,
                "admin_pre_transaction_rate": adminPreTransactionRate,
                "user_desposist_fee_rate": userDesposistFeeRate,
                "user_transfer_to_another_user_rate": userTransferToAnotherUserRate,
                "user_withdrawal_fee_rate": userWithdrawalFeeRate,
                "fundraiser_fee": fundraiserFee,
                "id": id,
                "addressDetails":{
                    "home": home,
                    "street": street,
                    "city": city,
                    "state": state,
                    "zip": zip
                }
            };
            const cleanedAddress = { ...bodyParms.addressDetails };

            // Loop through and delete keys that are empty strings
            Object.keys(cleanedAddress).forEach(key => {
                if (cleanedAddress[key] === "") {
                    delete cleanedAddress[key];
                }
            });

            const finalPayload = {
                ...bodyParms,
                addressDetails: cleanedAddress
            };
            console.log(finalPayload);
            const response = await axios.post(addGobalSetting, finalPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            if (response.status === 200) {
                toast.success('Gobal setting save successful');
                setTimeout(() => {
                    navigate('/gobal-setting');
                }, 3000);
            } else {
                // Handle other status codes if needed
                toast.error('someting went wrong');
            }
        } catch (error) {
            toast.error('An error occurred while saving global settings');
        } finally {
            setLoading(false);
        }
    };

    const handleEditFaq = (id, type, value) => {
        setFaqs(prev => prev.map(p => p.id === id ? ({...p, question: type === 'q' ? value : p.question, answer: type === 'a' ? value : p.answer }) : p))
    }

    const handleAddFaq = () => {
        setFaqs(prev => [...prev, { question: '', answer: '', id:(new Date()).getTime() }])
    }


    const handleEditfaqSubmit = async (id) => {
        try {
            console.log(id);
            
            const payload = {
                 "question": id ? faqs.find(f => f.id === id)?.question : fquestion,
                "answer": id ? faqs.find(f => f.id === id)?.answer : fanswer,
                "faqId": id
            }
            await axios.post(addEdit,payload)

        } catch (error) {
            console.error(error);

        }
    }

    const handleDeletefaq = async (id) => {
        try {
            setFaqs(prev => prev.filter(p => p.id !== id))
            await axios.delete(`${MAIN_BASE_URL}/api/admin/gobal-settings/delete-faq/${id}`)

        } catch (error) {
            console.error(error);

        }
    }

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark"> {isEditing ? 'Edit ' : 'Add'} Global Settings</h1>
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

                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Email Address</label>

                                                <input
                                                    type="text"
                                                    name="admin_email"
                                                    id="admin_email"
                                                    placeholder="Enter Email Address"
                                                    className="form-control"
                                                    value={emailAddress}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Phone Number</label>

                                                <input
                                                    type="text"
                                                    name="admin_phone_number"
                                                    id="admin_phone_number"
                                                    placeholder="Enter Phone Number"
                                                    className="form-control"
                                                    value={phoneNumber}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Address</label>

                                                <input
                                                    type="text"
                                                    name="admin_address"
                                                    id="admin_address"
                                                    placeholder="Enter Address"
                                                    className="form-control"
                                                    value={address}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Admin Pre Transaction Rate</label>

                                                <input
                                                    type="text"
                                                    name="admin_pre_transaction_rate"
                                                    id="admin_pre_transaction_rate"
                                                    placeholder="Enter Admin Pre Transaction Rate"
                                                    className="form-control"
                                                    value={adminPreTransactionRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Deposist Fee Rate</label>

                                                <input
                                                    type="text"
                                                    name="user_desposist_fee_rate"
                                                    id="user_desposist_fee_rate"
                                                    placeholder="Enter User Deposist Fee Rate"
                                                    className="form-control"
                                                    value={userDesposistFeeRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Transfer To Another User Rate</label>

                                                <input
                                                    type="text"
                                                    name="user_transfer_to_another_user_rate"
                                                    id="user_transfer_to_another_user_rate"
                                                    placeholder="Enter User Transfer To Another User Rate"
                                                    className="form-control"
                                                    value={userTransferToAnotherUserRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Withdrawal Fee Rate</label>

                                                <input
                                                    type="text"
                                                    name="user_withdrawal_fee_rate"
                                                    id="user_withdrawal_fee_rate"
                                                    placeholder="Enter User Withdrawal Fee Rate"
                                                    className="form-control"
                                                    value={userWithdrawalFeeRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Fundraiser Fee Rate</label>

                                                <input
                                                    type="text"
                                                    name="fundraiser_fee"
                                                    id="fundraiser_fee"
                                                    placeholder="Enter Fundraiser Fee Rate"
                                                    className="form-control"
                                                    value={fundraiserFee}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <label htmlFor="key" className="lableClass">Faqs</label>
                                    {faqs?.length > 0 && faqs?.map((faq, i) => (
                                        <div key={i} className='row'>
                                            <div className='col-lg-4'>
                                                <div className="form-group">
                                                    <label htmlFor="key" className="lableClass">Question</label>

                                                    <input
                                                        type="text"
                                                        name="fundraiser_fee"
                                                        id="fundraiser_fee"
                                                        placeholder="Enter Fundraiser Fee Rate"
                                                        className="form-control"
                                                        value={faq?.question}
                                                        onChange={(e) => handleEditFaq(faq?.id, 'q', e.target.value)}
                                                        style={{ marginTop: '5px' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4'>
                                                <div className="form-group">
                                                    <label htmlFor="key" className="lableClass">Answer</label>

                                                    <input
                                                        type="text"
                                                        name="fundraiser_fee"
                                                        id="fundraiser_fee"
                                                        placeholder="Enter Fundraiser Fee Rate"
                                                        className="form-control"
                                                        value={faq?.answer}
                                                        onChange={(e) => handleEditFaq(faq?.id, 'a', e.target.value)}
                                                        style={{ marginTop: '5px' }}
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={() => handleEditfaqSubmit(faq?.id)}>
                                                <i className="fa fa-check-circle enablecheck fa-lg"
                                                    style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                                            </Button>
                                            <Button onClick={() => handleDeletefaq(faq?.id)}>
                                                <i className="fa fa-trash enablecheck fa-lg"
                                                    style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                                            </Button>
                                        </div>
                                    ))}
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Question</label>

                                                <input
                                                    type="text"
                                                    name="fundraiser_fee"
                                                    id="fundraiser_fee"
                                                    placeholder="Enter Fundraiser Fee Rate"
                                                    className="form-control"
                                                    value={fquestion}
                                                    onChange={(e) => setFquestion(e.target.value)}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Answer</label>

                                                <input
                                                    type="text"
                                                    name="fundraiser_fee"
                                                    id="fundraiser_fee"
                                                    placeholder="Enter Fundraiser Fee Rate"
                                                    className="form-control"
                                                    value={fanswer}
                                                    onChange={(e) => setFanswer(e.target.value)}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={() => handleEditfaqSubmit(null)}>
                                            <i className="fa fa-check-circle enablecheck fa-lg"
                                                style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                                        </Button>
                                        <Button onClick={handleAddFaq}>
                                            <i className="fa fa-plus enablecheck fa-lg"
                                                style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                                        </Button>

                                    </div>
                                    <label htmlFor="key" className="lableClass">Office Address</label>

                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Home</label>

                                                <input
                                                    type="text"
                                                    name="home"
                                                    id="home"
                                                    placeholder="Enter Home"
                                                    className="form-control"
                                                    value={home}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Street</label>

                                                <input
                                                    type="text"
                                                    name="street"
                                                    id="street"
                                                    placeholder="Enter Street"
                                                    className="form-control"
                                                    value={street}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">City</label>

                                                <input
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    placeholder="Enter City"
                                                    className="form-control"
                                                    value={city}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">State</label>

                                                <input
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    placeholder="Enter State"
                                                    className="form-control"
                                                    value={state}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">ZIP</label>

                                                <input
                                                    type="text"
                                                    name="zip"
                                                    id="zip"
                                                    placeholder="Enter ZIP"
                                                    className="form-control"
                                                    value={zip}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <button type="submit" className="btn btn-primary">Submit</button>
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

}
export default AddGlobalSettings;