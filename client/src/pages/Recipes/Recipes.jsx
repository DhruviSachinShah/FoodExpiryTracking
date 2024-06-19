import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// import Carousel from 'react-bootstrap/Carousel'

// import CarouselItem from "react-bootstrap/CarouselItem";
// import CarouselCaption from "react-bootstrap/CarouselCaption"

import { Carousel } from 'react-bootstrap'

import back from "../../assets/images/back.svg"
import listIcon from "../../assets/images/list_icon.svg"
import globe from "../../assets/images/globe.svg"



// import Carousel from 'react-simply-carousel'

// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';

const Recipes = () => {
    const mealId = useParams().id;
    let [recipe, setRecipe] = useState({});
    let ingredientsAndAmounts = {};
    let Recipe;
    let ingredientList = [];


    
    const [listOfIngredients, setListOfIngredients] = useState([]);

    // const lst = [1, 2, 3, 4]

    useEffect(() => {
        const jwt = JSON.parse(localStorage.getItem("access-token")) || "";
        if (jwt === "") {
            window.location.href = "/login";
        }
        const fetchRecipe = async () => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            if (data.meals) {
                Recipe = data.meals[0]
                setRecipe(data.meals[0]);
                // recipe = data.meals[0];
                // const updatedIngredientsAndAmounts = [];
                for(let i=1; i<=20; i++) {
                    if (Recipe[`strIngredient${i}`] === "") {
                        break;
                    } else {
                        // ingredientsAndAmounts[recipe[`strIngredient${i}`]] = recipe[`strMeasure${i}`];
                        ingredientList.push(Recipe[`strIngredient${i}`]);
                        ingredientsAndAmounts[Recipe[`strIngredient${i}`]] = Recipe[`strMeasure${i}`];
                        // updatedIngredientsAndAmounts.push({
                        //     [recipe[`strIngredient${i}`]]: recipe[`strMeasure${i}`]
                        // });
                    }
                }
                ingredientList = ingredientList.filter(item => item !== undefined);
                ingredientList = [...new Set(ingredientList)];
                const updatedListOfIngredients = ingredientList.map((item, index) => {
                    console.log(item, index)
                    return (
                    
                    <Carousel.Item key={index} className="h-[20vh] bg-[#232425] rounded-lg">
                        <div className="flex flex-row justify-center">
                            <img className="ml-auto mr-auto" src={`https://www.themealdb.com/images/ingredients/${item}-small.png`} alt="" />
                        </div>
                        <Carousel.Caption>
                            <h3 className="text-white">{item}</h3>
                            <p> className="text-white"{ ingredientsAndAmounts[item] }</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    // <div>
                    //     <h3>{ item }</h3>
                    //     <p>{ ingredientsAndAmounts[item] }</p>
                    // </div>
                )})
                // console.log(Recipe);
                // console.log(ingredientList)
                // console.log(ingredientsAndAmounts);
                // console.log(listOfIngredients);
                setListOfIngredients(updatedListOfIngredients)
                // console.log(updatedIngredientsAndAmounts)
                // setIngredientsAndAmounts(updatedIngredientsAndAmounts);

            } else {
                console.log("Unable to get recipe");
            }
        }
        fetchRecipe();
    }, [])


    useEffect(() => {
        for(let i=1; i<=20; i++) {
            if (recipe[`strIngredient${i}`] === "") {
                break;
            } else {
                // ingredientsAndAmounts[recipe[`strIngredient${i}`]] = recipe[`strMeasure${i}`];
                ingredientList.push(recipe[`strIngredient${i}`]);
                ingredientsAndAmounts[recipe[`strIngredient${i}`]] = recipe[`strMeasure${i}`];
                // updatedIngredientsAndAmounts.push({
                //     [recipe[`strIngredient${i}`]]: recipe[`strMeasure${i}`]
                // });
            }
        }
        ingredientList = ingredientList.filter(item => item !== undefined);
        ingredientList = [...new Set(ingredientList)];
        const updatedListOfIngredients = ingredientList.map((item, index) => {
            console.log(item, index)
            return (
            
            <Carousel.Item key={index} className="h-[25vh] bg-[#232425] rounded-lg">
                <div className="flex flex-row justify-center">
                    <img className="ml-auto mr-auto" src={`https://www.themealdb.com/images/ingredients/${item}-small.png`} alt="" />
                </div>
                <Carousel.Caption>
                    <h3 className="text-white">{item}</h3>
                    <p className="text-white">{ ingredientsAndAmounts[item] }</p>
                </Carousel.Caption>
            </Carousel.Item>
            // <div>
            //     <h3>{item}</h3>
            //     <p>{ ingredientsAndAmounts[item] }</p>
            // </div>
        )})
        setListOfIngredients(updatedListOfIngredients)
        console.log(recipe);
        console.log(ingredientList)
        console.log(ingredientsAndAmounts);
    }, [ingredientList, ingredientsAndAmounts])

    // let index = 1;
    // let carouselItems;
    // if (ingredientsAndAmounts) {
    //     carouselItems = ingredientsAndAmounts.map(item => {
    //         const key = Object.keys(item)[0];
    //         return(
    //             <Carousel.Item key={index}>
    //                 <Carousel.Caption>
    //                     <h3>{ key }</h3>
    //                     <p>{ item[key] }</p>
    //                 </Carousel.Caption>
    
    //             </Carousel.Item>
    //         )
    //     });
    // }

    // console.log(carouselItems);

    console.log(ingredientList);
    console.log(listOfIngredients);
    console.log(recipe)
    return (
        <div className="py-16 h-screen bg-[#131313] overflow-y-auto">
            <div className="flex flex-row justify-between items-start px-6 w-full">
                <img className="w-[8%] pt-1" src={back} alt="back button" onClick={() => {window.history.back()}}/>
                <div className="flex flex-col items-center w-[60%]">
                    <h1 className="text-2xl"> {recipe.strMeal} </h1>
                    <div className="flex flex-row items-center justify-center">
                        <img className="mr-2" src={globe} alt="" />
                        <p className="mb-0">{ recipe.strArea }</p>
                    </div>
                </div>
                <img className="w-[8%] pt-1" src={listIcon} alt="list icon" />
            </div>
            {recipe && 
            <div className="mt-10">
                <section className="flex flex-col items-center mb-12">
                    <img className="w-[80%] rounded-full shadow-md" src={recipe.strMealThumb} alt="" />

                    <div className="mt-10 px-4 mb-2">
                        <h1 className="text-center text-2xl">Instructions</h1>
                        <p className="text-center">
                            { recipe.strInstructions }
                        </p>
                    </div>

                    <div className="">
                        <p className="text-xl">Or</p>
                        <a target="_blank" href={recipe.strYoutube}>Watch it on YouTube</a>
                    </div>
                </section>

                <div className="border-black border-[2px] border-solid rounded-md h-[20vh] px-4 py-2">
                    <h1 className="text-2xl text-center">Ingredients</h1>
                    <Carousel className="h-[24vh] bg-[#131313] pb-4">

                        {/* {ingredientList.map((item, index) => {
                            console.log(ingredientList);
                            return (
                            <Carousel.Item key={index} className="bg-green-500">
                                <Carousel.Caption>
                                    <div className="text-white"> 
                                        <h3>{item}</h3>
                                        <p>{ingredientsAndAmounts[item]}</p>
                                    </div>

                                </Carousel.Caption>
                            </Carousel.Item>
                        )})} */}

                            {listOfIngredients.length > 0 ? listOfIngredients : <div>Loading...</div>}

                    </Carousel>





                </div>
            </div>
            
            }
        </div>
    )
}

export default Recipes;