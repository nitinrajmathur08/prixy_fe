import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title || 'Confirm Action'}</h3>
                <p>{message || 'Are you sure you want to proceed?'}</p>
                <div className="modal-actions">
                    <button className="btn-no" onClick={onClose}>No</button>
                    <button className="btn-yes" onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white; padding: 25px; border-radius: 8px;
                    width: 400px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .modal-actions { display: flex; justify-content: space-around; margin-top: 20px; }
                .btn-no { padding: 8px 25px; cursor: pointer; border: 1px solid #ccc; background: #eee; border-radius: 4px; }
                .btn-yes { padding: 8px 25px; cursor: pointer; border: none; background: #dc3545; color: white; border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default ConfirmationModal;