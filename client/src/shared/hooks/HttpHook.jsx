import { useState, useEffect, useCallback,useRef } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback( async (
        url,
        method = "GET",
        headers= {},
        body= null
    )=> {

        try{
            setIsLoading(true);
            const httpAbortController = new AbortController();
            activeHttpRequest.current.push(httpAbortController);

            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal // to cancel connected request
            });

            const responseData = await response.json();

            //remove active http requests when successful render
            activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortController);

            if(!response.ok){
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;

        }catch(err){
            setIsLoading(false);
            setError(err.message);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(()=>{

        return()=>{
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
        }

    }, []);

    return { isLoading, error, sendRequest, clearError }
};