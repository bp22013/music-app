import React from "react";


interface ButtonProps {
    text: string;
    onClick: () => void; // Match the type from the parent component
}


const Button:React.FC<ButtonProps> = ({text,onClick})=>{
    return (
        <>
            <button onClick={onClick} className={"px-2 py-1 bg-white border border-black hover:bg-black hover:text-white"} >{text}</button>
        </>
    )
}
export default Button