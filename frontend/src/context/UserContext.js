import { createContext, useState } from 'react';

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    const value = {userInfo, setUserInfo}
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}