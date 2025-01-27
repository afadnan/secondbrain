export function Input ({onChange, placeholder}: {placeholder:string; onChange: () => void}){
    return <div>
        <input placeholder={placeholder} type={"text"} className="px-4 py-2 border-2 rounded-md m-2 " onChange={onChange} ></input>
    </div>
}