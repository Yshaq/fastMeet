import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({})

function UserContextProvider(props) {
    const [userObject, setUserObject] = useState({});
    useEffect(() => {
        console.log("context");
        axios.get("http://localhost:3000/getUser/", { withCredentials: true }).then((res) => {
            if (res.data) {
                setUserObject(res.data);
            } else {
                setUserObject({});
            }
        }).catch((error) => { console.log(error); });
    }, []);
    
    return (
        <UserContext.Provider value={userObject}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;