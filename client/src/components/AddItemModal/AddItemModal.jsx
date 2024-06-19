// import Modal from "react-bootstrap/Modal"
// import Button from "react-bootstrap/Button"
// import { useState } from "react"

// const AddItemModal = (props) => {
//     const [itemName, setItemName] = useState("");
//     const [expiryDate, setExpiryDate] = useState(null);

//     const itemBody = {
//         itemName: itemName,
//         expiryDate: expiryDate,
//     }

//     const submitItem = async () => {
//         console.log(itemName, expiryDate);
//         const response = await fetch("http://localhost:5000/add-item", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(itemBody)
//         })

//         const status = response.status;
//         console.log(status);
//     }

//     return (
//         <div>
//             <Modal centered show={props.state} onHide={() => {props.toggle(false)}} dialogClassName="modal-80h py-4">
//                 <Modal.Header closeButton>
//                     <Modal.Title>New item</Modal.Title>
//                 </Modal.Header>

//                 <Modal.Body>
//                     <label htmlFor="item-name">Item name:</label>
//                     <input name="item-name" className="border-[2px] border-solid border-[#225175] rounded-lg p-2" 
//                         type="text" 
//                         placeholder="Item name" 
//                         onChange={(e) => {setItemName(e.target.value)}}    
//                     required/>
//                     <label htmlFor="expiry-date" className="mr-10">Expiry date:</label>
//                     <input name="expiry-date" type="date" 
//                         placeholder="Expiry date" 
//                         onChange={(e) => {setExpiryDate(e.target.value)}}    
//                     required/>
//                 </Modal.Body>

//                 <Modal.Footer>
//                 <Button variant="secondary" onClick={() => {props.toggle(false)}}>
//                     Close
//                 </Button>
//                 <Button variant="success" onClick={() => {submitItem()}}>
//                     Add
//                 </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     )
// }

// export default AddItemModal;