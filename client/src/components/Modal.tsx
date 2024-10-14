// import React from 'react';
// import '../index.css'; // Make sure to create a separate CSS file for modal styles

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventDetails: {
//     timestamp: string;
//     sourceIP: string;
//     userEmail: string;
//     description: string;
//   };
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, eventDetails }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Event Details</h2>
//         <p><strong>Timestamp:</strong> {eventDetails.timestamp}</p>
//         <p><strong>Source IP:</strong> {eventDetails.sourceIP}</p>
//         <p><strong>User Email/ID:</strong> {eventDetails.userEmail}</p>
//         <p><strong>Description:</strong> {eventDetails.description}</p>
//         <button onClick={onClose} className="close-button">Close</button>
//       </div>
//     </div>
//   );
// };

// export default Modal;