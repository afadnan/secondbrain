import { ReactElement } from "react";

export function Sidebar({text,icon}:{
    text: string;
    icon: ReactElement;
}) {
    return <div className="flex">
        {icon} {text}
    </div>
}