import { ca } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { set } from "zod";

const useFetch = (callback)=>{
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);


    
    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try{
            const response = await callback(...args);
            setData(response);
            setError(null);
            
        }catch(error){
            setError(error);
            toast.error("Something went wrong!");
        }finally{
            setLoading(false);
        }
    }
    return { data, loading, error, fn, setData}
};

export default useFetch;

