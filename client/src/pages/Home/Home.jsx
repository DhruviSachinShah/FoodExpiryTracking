import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { useState, useEffect } from "react";
import AddItemFail from "../../components/AddItemFail/AddItemFail";
import AddItemSuccess from "../../components/AddItemSuccess/AddItemSuccess";
import DeleteItemSuccess from "../../components/DeleteItemSuccess/DeleteItemSuccess";
import DeleteItemFail from "../../components/DeleteItemFail/DeleteItemFail";
import { Link } from "react-router-dom";
import axios from 'axios'

import logout from "../../assets/images/logout.svg"
import listIcon from "../../assets/images/list_icon.svg"
import clock from "../../assets/images/clock.svg"
import goldPlus from "../../assets/images/goldPlus.svg"

const Home = () => {
    const [isAddingItem, setIsAddingItem] = useState(false);
    let [items, setItems] = useState([]);
    const [failAddMessage, setFailAddMessage] = useState("Could not add item");
    const [allFoodItems, setAllFoodItems] = useState([]);
    const [addSuccessful, setAddSuccessful] = useState(false);
    const [delSuccessful, setDelSuccessful] = useState(false);
    const [addUnsuccessful, setAddUnsuccessful] = useState(false);
    const [delUnsuccessful, setDelUnsuccessful] = useState(false);
    const [delFailMessage, setDelFailMessage] = useState("Could not delete item");
    const [itemName, setItemName] = useState("");
    const [expiryDate, setExpiryDate] = useState(null);
    const [isSorted, setIsSorted] = useState(false);

    let foodItems = [];
    
    useEffect(() => {
        const jwt = JSON.parse(localStorage.getItem("access-token")) || "";
        if (jwt === "") {
            window.location.href = "/login";
        }
        const fetchItems = async () => {
            const response  = await fetch("http://localhost:5000/get_items", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            const data = await response.json();
            console.log()
            setItems(data);
            setAllFoodItems(items);
            console.log(items);
            foodItems = items.map(item => {
                return (
                    <Link to={`/dishes/${item.name}`} className="no-underline w-[90%] bg-[#2D2E30] rounded-xl mb-2 ">
                        <div key={item.id} className="flex flex-row justify-between px-4 py-4">
                            <div className="flex flex-col items-start justify-between w-[50%] ">
                                <h1 className="text-3xl text-white">{ item.name }</h1>
                                <span className="flex flex-row justify-start items-center w-[70%] mb-2">
                                    <img src={clock} alt={item.name} /> 
                                    <p className="ml-2 text-sm text-white mb-0">{item.expiryDate}</p>
                                </span>
                                <button className="bg-[#E8D28E] rounded-lg text-black px-3 py-1 mt-1">Remove</button>
                            </div>
                            <img className="w-[30%]" src={`https://www.themealdb.com/images/ingredients/${item.name}-small.png`} alt="" />
                        </div>
                    
                    </Link>
                )
            })
        }
        fetchItems();
    }, []);

    useEffect(() => {
        setAllFoodItems(items);
        console.log(items)
        foodItems = items.map(item => {
            return (
                <Link to={`/dishes/${item.name}`} className="no-underline w-[90%] bg-[#2D2E30] rounded-xl mb-2 ">
                    <div key={item.id} className="flex flex-row justify-between px-4 py-4">
                        <div className="flex flex-col items-start justify-between w-[50%] ">
                            <h1 className="text-3xl text-white">{ item.name }</h1>
                            <span className="flex flex-row justify-start items-center w-[70%] mb-2">
                                <img src={clock} alt={item.name} /> 
                                <p className="ml-2 text-sm text-white mb-0">{item.expiryDate}</p>
                            </span>
                            <button className="bg-[#E8D28E] rounded-lg text-black px-3 py-1 mt-1">Remove</button>
                        </div>
                        <img className="w-[30%]" src={`https://www.themealdb.com/images/ingredients/${item.name}-small.png`} alt="" />
                    </div>
                
                </Link>
            )
        })
    }, [items])

    const sortItems = () => {
        if (isSorted) {
            // Sort items by ID in increasing order
            const sortedItems = [...items].sort((a, b) => a.id - b.id);
            setItems(sortedItems);
            setIsSorted(false);
        } else {
            // Sort items by expiryDate in ascending order
            const sortedItems = [...items].sort((a, b) => new Date(parseInt(a.date.split('/')[2], 10), parseInt(a.date.split('/')[1], 10) - 1, parseInt(a.date.split('/')[0], 10)) - new Date(parseInt(b.date.split('/')[2], 10), parseInt(b.date.split('/')[1], 10) - 1, parseInt(b.date.split('/')[0], 10)));
            setItems(sortedItems);
            setIsSorted(true);
        }
    }

    const submitItem = async () => {
        console.log(itemName, expiryDate);
        const expiringDate = new Date(expiryDate);
        const curDate = new Date();
        console.log(expiringDate < curDate)
        if (expiringDate <= curDate) {
            setFailAddMessage("Expiry date must be after current date");
            setIsAddingItem(false);
            setAddUnsuccessful(true);
        } else {
            const dmy = expiryDate.split('-');
            console.log(dmy);
            let expiryDateToBeSent = dmy[2] + "/" + dmy[1] + "/" + dmy[0];
            const itemBody = {
                name: itemName,
                date: expiryDateToBeSent,
            }
    
            const jwt = JSON.parse(localStorage.getItem('access-token'));
            console.log(jwt);
    
            // const response = await fetch("http://localhost:5000/add_event", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${localStorage.getItem('access-token')}`,
            //     },
            //     body: JSON.stringify(itemBody)
            // })
    
            // const response = await axios.post("http://localhost:5000/add_event", {
            //         data: itemBody, 
            //         headers: {
            //             "Content-Type": "application/json",
            //             'Authorization': `Bearer ${jwt}`,
            //         },
            //     })
    
            const response = await fetch("http://localhost:5000/add_event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(itemBody)
            })
    
            const data = await response.json();
            const status = response.status;
            console.log(status);
            if (response.ok) {
                // setAddUnsuccessful(false);
                setAddSuccessful(true);
                setTimeout(() => {
                    window.location.reload();
                }, 2300)
            } else {
                // setAddSuccessful(false);
                setFailAddMessage(data.message)
                setAddUnsuccessful(true);
            }
        }
        
    }

    const deleteItem = async (item_id) => {
        console.log(item_id)
        
        const itemBody = {
            id: item_id
        }

        const jwt = JSON.parse(localStorage.getItem('access-token'));
        console.log(jwt)

        // const response = await axios.delete("http://localhost:5000/delete_event",
        //     itemBody, 
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //             'Authorization': `Bearer ${jwt}`,
        //         },
        //     })

        const response = await fetch("http://localhost:5000/delete_event", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(itemBody),
        });

        const data = await response.json();
        const status = response.status;
        console.log(status);
        if (response.ok) {
            setDelSuccessful(true);
            setTimeout(() => {
                window.location.reload();
            }, 2300)
        } else {
            setDelFailMessage(data.message);
            setDelSuccessful(true);
        }
    }

    // items = [
    //     {id: 1, name: "Apples", expiryDate: "2024-05-10"},
    //     {id: 2, name: "Banana", expiryDate: "2024-05-10"},
    // ]

    const logOut = () => {
        localStorage.removeItem('access-token');
        localStorage.removeItem('username');
        window.location.href = "/login";
    }

    return (
        <div className="pt-16 overflow-y-auto bg-[#131313]">
            <section className="h-[15vh] px-10 flex flex-row justify-between items-start">
                <div className="w-[50%] flex flex-col items-start justify-between">
                    <h1 className="text-3xl mb-2">Hi { JSON.parse(localStorage.getItem('username')) || 'User'}</h1>
                    <p className="w-[100%] text-sm text-left">We hope you are in a good mood for saving food</p>
                </div>
                <img src={logout} alt="" className="rounded-lg w-[20%]" onClick={logOut}/>
            </section>
            <hr />
            <section className="pt-10">
                <div className="px-10 flex flex-row justify-between items-center mb-2">
                    <h1 className="text-3xl">Ingredients <small className="text-[#E8D28E] text-sm">{ items.length }</small></h1>
                    <img src={listIcon} alt="" />
                </div>
                <div className=" flex flex-row items-center ml-auto mr-auto w-[80%] justify-between">
                    <button className="rounded-lg bg-[#2D2E30] flex flex-row ml-auto mr-auto items-center w-[35%] py-2 px-3 justify-around" onClick={() => {setIsAddingItem(true)}}> <img src={goldPlus} alt="gold plus" /> <p className="mb-0">Add Item</p> </button>
                    <button className="rounded-lg bg-[#2D2E30] flex flex-row ml-auto mr-auto items-center w-[35%] py-2 px-3 justify-around" onClick={sortItems}> <img src={goldPlus} alt="gold plus" /> <p className="mb-0">{!isSorted ? "Sort" : "Reset"}</p> </button>
                </div>
                <div className="flex flex-col items-center mt-8">
                    { items.length > 0 ? items.map(item => {
                return (
                    <Link to={`/dishes/${item.name}`} className="no-underline w-[90%] bg-[#2D2E30] rounded-xl mb-2 ">
                        <div key={item.id} className="flex flex-row justify-between px-4 py-4">
                            <div className="flex flex-col items-start justify-between w-[50%] ">
                                <h1 className="text-3xl text-white text-left">{ item.name }</h1>
                                <span className="flex flex-row justify-start items-center w-[70%] mb-2">
                                    <img src={clock} alt={item.name} /> 
                                    <p className="ml-2 text-sm text-white mb-0">{item.date}</p>
                                </span>
                                <button className="bg-[#E8D28E] rounded-lg text-black px-3 py-1 mt-1" onClick={(e) => {
                                    e.preventDefault();
                                    deleteItem(item.id)}}
                                >
                                    Remove
                                </button>
                            </div>
                            <img className="w-[30%]" src={`https://www.themealdb.com/images/ingredients/${item.name}-small.png`} alt="" />
                        </div>
                    
                    </Link>
                )
            }) : <h1>No items added yet.</h1>}
                </div>
            </section>
            

            <Modal centered show={isAddingItem} onHide={() => {setIsAddingItem(false)}} dialogClassName="modal-80h py-4">
                <Modal.Header closeButton>
                    <Modal.Title>New item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <label htmlFor="item-name">Item name:</label>
                    <input name="item-name" className="border-[2px] border-solid border-[#225175] rounded-lg p-2" 
                        type="text" 
                        placeholder="Item name" 
                        onChange={(e) => {setItemName(e.target.value)}}    
                    required/>
                    <label htmlFor="expiry-date" className="mr-10">Expiry date:</label>
                    <input name="expiry-date" type="date" 
                        placeholder="Expiry date" 
                        onChange={(e) => {setExpiryDate(e.target.value)}}    
                    required/>
                </Modal.Body>

                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setIsAddingItem(false)}}>
                    Close
                </Button>
                <Button variant="success" onClick={() => {submitItem()}}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>

            <AddItemFail 
                state={addUnsuccessful}
                toggle={setAddUnsuccessful}
                message={failAddMessage}
            />
            <AddItemSuccess 
                state={addSuccessful}
                toggle={setAddSuccessful}
            />
            <DeleteItemSuccess 
                state={delSuccessful}
                toggle={setDelSuccessful}
            />
            <DeleteItemFail 
                state={delUnsuccessful}
                toggle={setDelUnsuccessful}
                message={delFailMessage}
            />

        </div>
    )
}

export default Home;