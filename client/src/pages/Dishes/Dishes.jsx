import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import back from "../../assets/images/back.svg"
import listIcon from "../../assets/images/list_icon.svg"
import plus from "../../assets/images/plus.svg"

const Dishes = () => {
    const [dishes, setDishes] = useState([]);
    const mainIngredient = useParams().ingredient;
    
    let recipes = [];
    
    useEffect(() => {
        const jwt = JSON.parse(localStorage.getItem("access-token")) || "";
        if (jwt === "") {
            window.location.href = "/login";
        }
        const getDishes = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
                const data = await response.json();
                console.log(data);
                if (data.meals) {
                    setDishes(data.meals);
                    console.log(dishes);
                } else {
                    console.log("No meals found.");
                }
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        }
    
        getDishes();
    }, []);


    return (
        <div className="pt-16 overflow-y-auto bg-[#131313]">
            <div className="w-full flex flex-row justify-between items-center px-6 mb-10">
                <img className="w-[8%]" src={back} alt="back button" onClick={() => {window.history.back()}}/>
                <h1 className="text-3xl">Dishes <small className="text-[#E8D28E] text-sm">{ dishes.length }</small></h1>
                <img className="w-[8%]" src={listIcon} alt="list icon" />
            </div>
            <div className="flex flex-col items-center">
                { dishes.map(dish => {
                    return (
                        <div key={parseInt(dish.idMeal)} className="flex flex-row justify-between items-center bg-[#2D2E30] pb-4 w-[90%] rounded-lg py-3 px-2 mb-2">
                            <div className="flex flex-col items-start justify-around w-[50%] h-full">
                                <h1 className="text-2xl text-left">{ dish.strMeal }</h1>
                                <Link className="no-underline" to={`/recipes/${dish.idMeal}`}>
                                    <button className="bg-[#E8D28E] rounded-md text-black px-3 py-1 flex flex-row items-center"><img className="mr-2" src={plus} alt="" /> <p className="mb-0 text-lg">See more</p></button>
                                </Link>
                            </div>
                            <img className="w-[40%] rounded-xl" src={`${dish.strMealThumb}`} alt="" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Dishes;