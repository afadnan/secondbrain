import { useState } from "react";

//controlled component
export function CreateContentModal({open,onClose}:any){

     return <div>
        {open &&  <div className="w-screen h-screen fixed top-0 left-0 bg-red-200 opacity-60">

        </div> }
     </div>
}