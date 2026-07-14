import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getOfficeAddress, addEditOfficeAddress, deleteOfficeAddress, MAIN_BASE_URL } from '../../config';
import { Button } from '@mui/material';

const OfficeAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOfficeAddress, setNewOfficeAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(getOfficeAddress);
      const items = Array.isArray(res?.data?.data) ? res.data.data : [];
      setAddresses(items.map((item) => ({ ...item, localId: item._id || item.id })));
    } catch (err) {
      console.error('Office Address fetch failed', err);
      toast.error('Failed to load Office Addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const onAddressChange = (localId, field, value) => {
    setAddresses((prev) => prev.map((addr) => (addr.localId === localId ? { ...addr, [field]: value } : addr)));
  };

  const onAddRow = () => {
    const tempId = `temp-${Date.now()}`;
    setAddresses((prev) => [...prev, { agentName: '', phoneNumber: '', email: '', officeAddress: '', localId: tempId, __new: true }]);
  };

  const onSaveAddress = async (addr) => {
    if (!addr.agentName?.trim() || !addr.phoneNumber?.trim() || !addr.email?.trim() || !addr.officeAddress?.trim()) {
      toast.error('All fields (Agent Name, Phone, Email, Office Address) are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        agentName: addr.agentName,
        phoneNumber: addr.phoneNumber,
        email: addr.email,
        officeAddress: addr.officeAddress,
        officeAddressId: addr._id || addr.id || undefined,
      };
      await axios.post(addEditOfficeAddress, payload);
      toast.success('Office Address saved');
      await fetchAddresses();
    } catch (err) {
      console.error('Save Office Address failed', err);
      toast.error('Failed to save Office Address');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAddress = async (addr) => {
    if (!addr._id && !addr.id) {
      setAddresses((prev) => prev.filter((item) => item.localId !== addr.localId));
      return;
    }

    setLoading(true);
    try {
      // Using axios.delete with string literal if deleteOfficeAddress doesn't include the ID placeholder
      await axios.delete(`${MAIN_BASE_URL}/api/admin/gobal-settings/delete-office-address/${addr._id || addr.id}`);
      toast.success('Office Address deleted');
      await fetchAddresses();
    } catch (err) {
      console.error('Delete Office Address failed', err);
      toast.error('Failed to delete Office Address');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-wrapper">Loading...</div>;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Office Address Management</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-table">
              <div className="container-fluid">
                <label className="lableClass">Office Addresses</label>

                {addresses.length === 0 ? <p>No Office Addresses found.</p> : null}

                {addresses.map((addr) => (
                  <div key={addr.localId} className="row" style={{ alignItems: 'center', marginBottom: '10px' }}>
                    <div className="col-lg-2">
                      <div className="form-group">
                        <label className="lableClass">Agent Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addr.agentName || ''}
                          onChange={(e) => onAddressChange(addr.localId, 'agentName', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="form-group">
                        <label className="lableClass">Phone No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addr.phoneNumber || ''}
                          onChange={(e) => onAddressChange(addr.localId, 'phoneNumber', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="lableClass">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={addr.email || ''}
                          onChange={(e) => onAddressChange(addr.localId, 'email', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="lableClass">Office Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addr.officeAddress || ''}
                          onChange={(e) => onAddressChange(addr.localId, 'officeAddress', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-2" style={{ display: 'flex', gap: '10px' }}>
                      <Button onClick={() => onSaveAddress(addr)} title="Save Address">
                        <i className="fa fa-check-circle fa-lg" style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                      </Button>
                      <Button onClick={() => onDeleteAddress(addr)} title="Delete Address">
                        <i className="fa fa-trash fa-lg" style={{ color: 'red', fontSize: '25px', marginTop: '10px' }}></i>
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="row" style={{ alignItems: 'center', marginTop: '20px' }}>
                  <div className="col-lg-2">
                    <div className="form-group">
                      <label className="lableClass">New Agent Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAgentName}
                        onChange={(e) => setNewAgentName(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Agent name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="form-group">
                      <label className="lableClass">New Phone No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Phone no"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="lableClass">New Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="lableClass">New Office Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newOfficeAddress}
                        onChange={(e) => setNewOfficeAddress(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Office address"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-2" style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      onClick={async () => {
                        if (!newAgentName.trim() || !newPhoneNumber.trim() || !newEmail.trim() || !newOfficeAddress.trim()) {
                          toast.error('All fields are required');
                          return;
                        }
                        await onSaveAddress({ 
                          agentName: newAgentName, 
                          phoneNumber: newPhoneNumber, 
                          email: newEmail, 
                          officeAddress: newOfficeAddress 
                        });
                        setNewAgentName('');
                        setNewPhoneNumber('');
                        setNewEmail('');
                        setNewOfficeAddress('');
                      }}
                      title="Save new Address"
                    >
                      <i className="fa fa-check-circle fa-lg" style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                    </Button>

                    <Button onClick={onAddRow} title="Add another Address row">
                      <i className="fa fa-plus fa-lg" style={{ color: 'blue', fontSize: '25px', marginTop: '10px' }}></i>
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficeAddress;
