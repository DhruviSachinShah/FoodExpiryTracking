import { useState } from "react";
import LoginFail from "../../components/LoginFail/LoginFail";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFail, setLoginFail] = useState(false);
    const [failMessage, setFailMessage] = useState("Could not log in");

    const submit = async () => {
        if (!username || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        const reqBody = {
            username: username,
            password: password,
        }
        console.log(reqBody);
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            });
            // if (!response.ok) {
            //   throw new Error('Failed to fetch data');
            // }
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access-token', JSON.stringify(data.access_token))
                localStorage.setItem("username", JSON.stringify(data.username));
                window.location.href = "/home";    
            } else {
                setFailMessage(data.message);
                setLoginFail(true);
                console.log(loginFail);
            }
            // const status = response.status;
            // console.log(data)
            // if (status >= 200 && status < 300) {
            //     localStorage.setItem('access-token', JSON.stringify(data.access_token))
            //     window.location.href = "/home";
            // } else  {
            //     setLoginFail(true);
            //     console.log(loginFail);
            // }   
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    return (
        <div className="flex flex-col items-center pt-16">
            <h1 className="text-6xl text-white mb-4">Login</h1>
            <div className="flex flex-col justify-around items-center w-[85%] h-[30vh]">
                <input placeholder="Username" name="username" type="text" className="w-full ml-auto mr-auto bg-[#2D2E30] text-white p-4 rounded-lg mr-10" value={username} onChange={(e) => {
                    setUsername(e.target.value);
                }} required/>
                <input autoComplete="off" placeholder="Password" name="username" type="password" className="ml-auto w-[full] mr-auto bg-[#2D2E30] text-white p-4 rounded-lg mr-10" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} required/>
                <button className="bg-[#E8D28E] text-black rounded-lg px-6 py-2 text-lg" onClick={submit}>Login</button>
            </div>

            <p className="mt-2"><span>Don't have an account? Click <a href="/sign-up" className="no-underline text-[#E8D28E]">here</a> to sign up</span></p>

            <LoginFail 
                state={loginFail}
                toggle={setLoginFail}
                message={failMessage}
            />
        </div>
    )
}

export default Login;