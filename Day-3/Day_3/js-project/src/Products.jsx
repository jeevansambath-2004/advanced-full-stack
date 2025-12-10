import React,{useEffect, useState} from 'react';

import axios from 'axios';

const Products =()=>{

  const [products, setProducts] = useState([]);
  useEffect(()=>{
    axios.get('https://fakestoreapi.com/products').then((res)=>{
      console.log(res.data)
      setProducts(res.data)   

  }).catch(err=>console.log(err));
  },[]);

return (
<div>
  <h2>
    Products List</h2>
    <div> {
      products.map((product)=>(
        <div key={product.id} style={{marginBottom:"20px"}}>
        <p>{product.title}</p>  
        <p> {product.price}</p>
       <p>{product.description}</p>   
        <p>{product.category }</p>   
          <img src={product.image} alt={product.title} width="100" height="100"/> 
        </div>
        ))
      }
      </div>
</div>  

);
};
export default Products;