import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

export function Sidebar(){
    return (
    <div className="h-screen w-72 border-r fixed left-0 top-0 pl-4">
        <div className="flex text-2xl pt-6 font-bold items-center pt-4">
            <div className="pr-3 text-purple-600">
            <Logo />
            </div>
            Second Brain
        </div>
        <div className="pt-5 ">
            <div className="pl-4 py-4">
            <SidebarItem text="Twitter" icon={<TwitterIcon />} />
            <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
            </div>
        </div>
    </div>
    )
}