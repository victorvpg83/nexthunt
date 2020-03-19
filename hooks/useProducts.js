import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase'

const useProducts = order => {
    const [products, saveProducts] = useState([])

    const {firebase} = useContext(FirebaseContext)
  
    useEffect(()=>{
      const obtainProducts = ()=>{
        firebase.db.collection('products').orderBy( order, 'desc').onSnapshot(manipulateSnapshot)
      }
      obtainProducts()
    }, [])
  
    function manipulateSnapshot(snapshot) {
      const products = snapshot.docs.map(doc=>{
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      saveProducts(products)
    }
    return {
        products
    }
};

export default useProducts;

