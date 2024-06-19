import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
            <button className="w-[36%] py-2 mb-2 border-[2px] border-violet-400 rounded-md hover:scale-125 duration-200 no-underline"><Link to={'/login'}>Login</Link></button>
            <button className="w-[36%] py-2 mt-2 border-[2px] border-violet-400 rounded-md hover:scale-125 duration-200 no-underline"><Link to={'/sign-up'}>Sign Up</Link></button>
        </div>
    )
}

export default Landing;