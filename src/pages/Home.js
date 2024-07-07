import React from "react";
import CategoryContent from "../components/CategoryContent";
import ProductsContent from "../components/ProductsContent";

function Home(){
    return(
        <div>
            <CategoryContent/>
            <ProductsContent/>
        </div>
    );
}

export default Home;