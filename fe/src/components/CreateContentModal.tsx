import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}


export function CreateContentModal({ open, onClose }: any) {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type, setType] = useState(ContentType.Youtube);
  

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const token = localStorage.getItem("token");
    console.log("Sending Token:", token);

    await axios.post(`${BACKEND_URL}/api/v1/content`,{
        link,
        title,
        type
    },{
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })

}
    

     return <div>
        {open && <div>  <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 opacity-60 flex justify-center">
            
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">

                <span className="bg-white p-4 rounded-md">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    <div>
                        <Input reference={titleRef} placeholder={"Title"} />
                        <Input reference={linkRef} placeholder={"Link"} />

                    </div>
                    <h1 className="p-1 font-semibold">Type</h1>

                    <div className="flex p-4 gap-2 justify-center">
                        <div className="">
                        <Button text="Youtube" variant={type === ContentType.Youtube ? "primary" : "secondary"} onClick={() => {setType(ContentType.Youtube)}}></Button>
                        </div>
                        <Button text="Twitter" variant={type === ContentType.Twitter ? "primary" : "secondary"} onClick={() => {setType(ContentType.Twitter)}}></Button>
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={addContent} variant="primary" text="Submit" />
                    </div>
                </span>
        
        </div> 
        </div>
        </div>}
     </div>
}

