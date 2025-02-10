import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signin() {
        const username = usernameRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const email = emailRef.current?.value || "";

        console.log("Sending request:", { username,email, password });

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                userName:username,
                email,
                password
            });
            const jwt = response.data.token;
            localStorage.setItem("token",jwt);
            navigate("/dashboard");
            
        } catch (error :any) {
            console.error("Signin failed:", error.response?.data || error.message);
            alert("Signin failed! Check console.");
        }
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={emailRef} placeholder="email" />
            <Input reference={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
                <Button onClick={signin} loading={false} variant="primary" text="Signin" fullWidth={true} />
            </div>
        </div>
    </div>
}