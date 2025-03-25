import type React from "react"
import { createContext, useState, useContext } from "react"

type User = {
  id: string | undefined
  name: string | undefined
  email: string | undefined
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

