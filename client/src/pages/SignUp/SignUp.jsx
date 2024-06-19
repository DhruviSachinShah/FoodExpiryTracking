import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import SignUpSuccess from "../../components/SignUpSuccess/SignUpSuccess";
import SignUpFail from "../../components/SignUpFail/SignUpFail";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [failMessage, setFailMessage] = useState("Could not sign up");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
    const [isSignUpUnsuccessful, setIsSignUpUnsuccessful] = useState(false);

    const submit = async () => {
        if (!username || !password || !confirmPassword) {
            alert("Please fill in all required fields.");
            return;
        }

        const reqBody = {
            username: username,
            password: password,
            confirmPassword: confirmPassword
        }
        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            });
            const data = await response.json();
            const status = response.status;
            console.log(status);
            if (response.ok) {
                setIsSignUpUnsuccessful(false);
                setIsSignUpSuccessful(true);
                setTimeout(() => {
                    window.location.href = '/login'
                }, [2900]);
            } else  {
                setFailMessage(data.message);
                setIsSignUpSuccessful(false);
                setIsSignUpUnsuccessful(true);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    return (
        <div className="flex flex-col items-center pt-16">
            <h1 className="text-6xl text-white">Sign Up</h1>
            <div className="flex flex-col justify-around items-center w-[85%] h-[50vh]">
                <input placeholder="Username" name="username" type="text" className="w-full ml-auto mr-auto bg-[#2D2E30] text-white px-4 py-4 rounded-lg mr-10" value={username} onChange={(e) => {
                    setUsername(e.target.value);
                }} required={true}/>
                <input autoComplete="off" placeholder="Password" name="username" type="password" className="w-full ml-auto mr-auto bg-[#2D2E30] text-white px-4 py-4 rounded-lg mr-10" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} required={true}/>
                <input autoComplete="off" placeholder="Confirm password" name="username" type="password" className="text-white w-full ml-auto mr-auto bg-[#2D2E30] text-black px-4 py-4 rounded-lg mr-10" value={confirmPassword} onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }} required={true}/>
                <button onClick={submit} className="bg-[#E8D28E] text-black rounded-lg px-6 py-2 text-lg">Sign Up</button>
            </div>

            <small className="text-red-600 text-center">{ password !== confirmPassword ? "Password and confirmation password do not match" : ""}</small>

            <p><span>Already have an account? Click <a href="/login" className="no-underline text-[#E8D28E]" >here</a> to login</span></p>

            <SignUpSuccess 
                isSignUpSuccessful={isSignUpSuccessful}
                toggle={setIsSignUpSuccessful}
            />
            <SignUpFail 
                state={isSignUpUnsuccessful}
                toggle={setIsSignUpUnsuccessful}
                message={failMessage}
            />
        </div>
    )
}

export default SignUp;