import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";

//controlled component
export function CreateContentModal({open,onClose}:any){

     return <div>
        {open &&  <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-60 flex justify-center">
            <div className="flex flex-col justify-center">
                <span className="bg-white p-4 rounded-md">
                    <div className="flex justify-end">
                        <CrossIcon />

                    </div>

                </span>
            </div>
        </div> }
     </div>
}