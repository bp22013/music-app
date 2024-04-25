export const Conversation = ({text}:{text:String})=>{
    return (
        <>
            <div
                className={"w-full h-[35px] border-black border hover:bg-black hover:text-white  cursor-pointer text-black mb-2 text-center flex justify-center items-center text-lg"}>{text}
            </div>
        </>
    )
}