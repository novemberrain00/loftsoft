import { FC, ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { CategoryI, UserI } from "./interfaces";
import { getData } from "./services/services";

interface ContextProviderProps {
    children: ReactNode
}

export const CategoriesContext = createContext<CategoryI[]>([]);
export const UserContext = createContext<UserI | null>(null);

const ContextProvider: FC<ContextProviderProps> = ({children}) => {
    const [categories, setCategories] = useState<CategoryI[]>([]);
  
    useEffect(() => {
        const fetchData = async () => {
        await getData('/categories?empty_filter=true')
            .then((data: CategoryI[]) => setCategories(data));
        }


        fetchData()
    }, [])
    
    return (
        <CategoriesContext.Provider value={categories}>
            {children}
        </CategoriesContext.Provider>
    );
}
 
export default ContextProvider;