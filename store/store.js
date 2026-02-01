import { useEffect, useState } from "react";


let globalState = {
    donors: [],
    news: [],
};
let actions = {};
let listeners = [];


const useStore = (shouldRender = true) =>
{
    const setState = useState(globalState)[1];

    const dispatch = (type, payload) =>
    {
        
        let newState = actions[type](payload, globalState);
        globalState = {...globalState, ...newState};
        listeners.forEach(listener => {
            listener(globalState)
        });
    }
    
    useEffect(() =>
    {
        if (shouldRender)
            listeners.push(setState);
        return () => {
            if (shouldRender)
                listeners = listeners.filter((listener) => listener !== setState);
        }

    }, [setState, shouldRender])
    
    return [globalState, dispatch];
}


export const initState = (action, initialState) =>
{
    if(initialState)
    {
        globalState = {...globalState, ...initialState};
    }
    actions = {...actions, ...action};
}


export default useStore;