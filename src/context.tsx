import { FC, ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { CategoryI, ReviewI } from "./interfaces";
import { getData } from "./services/services";

interface ContextProviderProps {
    children: ReactNode
}

export const CategoriesContext = createContext<CategoryI[]>([]);
export const ReviewsContext = createContext<ReviewI[]>([]);

const ContextProvider: FC<ContextProviderProps> = ({children}) => {
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [reviews, setReviews] = useState<ReviewI[]>([]);
  
    useEffect(() => {
        const fetchData = async () => {
            await getData('/reviews')
                .then((data: ReviewI[]) => setReviews(data));

            await getData('/categories?empty_filter=true')
                .then((data: CategoryI[]) => setCategories(data));
        }


        fetchData()
    }, [])
    
    return (
        <ReviewsContext.Provider value={reviews}>
            <CategoriesContext.Provider value={categories}>
                {children}
            </CategoriesContext.Provider>
        </ReviewsContext.Provider>
    );
}
 
export default ContextProvider;