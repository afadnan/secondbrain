import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "../components/Input";

//controlled component
export function CreateContentModal({open,onClose}:any){
    

     return <div>
        {open &&  <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-60 flex justify-center">
            <div className="flex flex-col justify-center">
                <span className="bg-white p-4 rounded-md">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    <div>
                        <Input placeholder={"Title"} />
                        <Input placeholder={"Link"} />
                    </div>
                    <div className="flex justify-center">
                        <Button variant="primary" text="Submit" />
                    </div>
                </span>
            </div>
        </div> }
     </div>
}

