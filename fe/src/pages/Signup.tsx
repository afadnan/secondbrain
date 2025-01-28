import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function Signup() {

    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    async function signup(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        await axios.post(BACKEND_URL+"/api/v1/signup",{
            username,
            password
            
        })
        alert("You have signed up!")
    }



    return (
        <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
            <div className="bg-white rounded-xl p-10 border min-w-48">
                <Input placeholder="Username" />
                <Input placeholder="Password" />
                <div className="flex justify-center pt-4 ">
                <Button onClick={signup} variant="primary" text="Signup" fullWidth={true} loading={false} />
                </div>
            </div>

        </div>
    )
}