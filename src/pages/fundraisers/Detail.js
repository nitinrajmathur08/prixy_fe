import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { getAgentProfileAPI, MAIN_BASE_URL, updateKycAndVerifiedStatusForAgent } from '../../config';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


function FundraiserDetail() {
    const { id } = useParams();
    const [users, setUsers] = useState({
        // Initial state of users
        kycApproved: 0,
        is_block_user: '0', // Assuming kycApproved is initially false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchUsers(id);
    }, [id]);

    const token = localStorage.getItem('token'); // Parse as boolean
    
   

   const handleApprove = async () => {
        try {
            const response = await axios.post(`${MAIN_BASE_URL}/api/fundraiser/approve`, 
            { fundraiserId: id },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Fundraiser approved successfully!");
            setUsers((prev) => ({ ...prev, isVerified: true }));
        } catch (error) {
            console.error("Error approving fundraiser:", error);
            toast.error("Failed to approve fundraiser. Please try again.");
        }
    }

    const handleReject = async () => {
        try {
            await axios.post(`${MAIN_BASE_URL}/api/fundraiser/reject`, 
            { fundraiserId: id },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Fundraiser rejected successfully!");
            setUsers((prev) => ({ ...prev, isVerified: false }));
        } catch (error) {
            console.error("Error rejecting fundraiser:", error);
            toast.error("Failed to reject fundraiser. Please try again.");
        }
    }
    
    const fetchUsers = async (id) => {
        try {
            const response = await axios.get(`${MAIN_BASE_URL}/api/fundraiser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            setUsers(response.data.data);
            setLoading(false);
            setError(null);

        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Manage Fundraiser </h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="box-main">
                        <div className="box-main-top">
                            <div className="box-main-title">Fundraiser Details </div>
                        
                        </div>
                   
                        <div className="box-main-table">
                                {/* <div className="text-center">
                                    <div className="profile-img">
                                        <img src="" alt=""/>
                                        
                                    </div>
                                </div>   */}
                            <div  > 
                                <div className="col-lg-12">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Title  </label>
                                            <br/>
                                            <span className='spanclassTxt'> { users.title || 'N/A' }</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Purpose </label>
                                            <br/>
                                            <span className='spanclassTxt'> { users.purpose || 'N/A' }</span>
                                        </div>
                                    </div>    
                                </div> 
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Target amount  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.target_amount || '0' } HTG</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Start Date  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users?.start_date?.replace(/\//g, '-') ?? 'N/A'}</span>
                                        </div>
                                    </div>    
                                </div>   
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Collaborators  </label>
                                            <br/>
                                            {users?.collabs?.map((c,i) => (
                                                <span key={i} className='spanclassTxt'>{ c ?? 'N/A'},{" "}</span>

                                            ))}
                                        </div>
                                              <div className="col-lg-4">
                                                <label className="lableClass"> Status </label>
                                                <br/>
                                             
                                            
                                                {!users?.isVerified ? (
                                                    <div>
                                                        <a onClick={handleReject} style={{ cursor: 'pointer' }}>
                                                            <i className="fa fa-times-circle disblecheck fa-lg"
                                                            style={{ color: 'red',  fontSize: '25px',  marginTop: '10px', cursor: 'pointer'}}></i>
                                                        </a>
                                                        <a onClick={handleApprove} style={{ cursor: 'pointer' }}>
                                                            <i className="fa fa-check-circle enablecheck fa-lg" 
                                                            style={{ marginLeft: '10px', color: 'green',  fontSize: '25px',  marginTop: '10px', cursor: 'pointer'}}></i>
                                                        </a>    
                                                    </div>
                                                ) : (
                                                    null
                                                )}
    
                                                <span className='spanclassTxt'>{
                                                    users.isVerified ? 'Approved' :
                                                    'Pending'
                                                }</span>
                                                
                                            </div>
                                    </div>    
                                </div>   
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-12">
                                            <label className="lableClass">Banner</label>
                                            <br/>
                                            <div className="row" style={{ marginTop: '10px' }}>
                                                {users.banner && users.banner.length > 0 ? (
                                                        <div  className="col-lg-4 file-item">
                                                            <a href={users.banner} target="_blank" rel="noopener noreferrer">
                                                                <img src={users.banner} alt="file-icon" className="file-icon" />
                                                                
                                                            </a>
                                                        </div>
                                                    
                                                ) : (
                                                    <div className="col-lg-12">
                                                        <span className='spanclassTxt'>No Banner found.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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

export default FundraiserDetail;

// Detail screen - title, purpose, collaborator list, amount, start date, image and Approve | Decline button same as user section.