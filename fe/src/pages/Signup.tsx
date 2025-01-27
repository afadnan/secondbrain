import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Signup() {
    return (
        <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
            <div className="bg-white rounded-xl p-10 border min-w-48">
                <Input placeholder="Username" />
                <Input placeholder="Password" />
                <div className="flex justify-center pt-4 ">
                <Button variant="primary" text="Signup" fullWidth={true} loading={false} />
                </div>
            </div>

        </div>
    )
}