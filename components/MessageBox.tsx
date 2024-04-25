export const MessageBox = ({name,text}:{name:String,text:String})=>{
    return (
        <>
            <div>
                <div className={" inline-block my-2"}>
                    <p className={"text-xs text-gray-500 mx-5"}>{name}</p>
                    <p className={"  mx-2 min-w-1/4 max-w-full h-auto px-2 py-1 border-2 border-black rounded-full text-wrap break-all"}>{text}</p>
                </div>
            </div>
        </>
    )
}