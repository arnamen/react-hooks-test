import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';

const Ingredients = () => {

  const [userIngredients, setUserIngredients] = useState([])

  const addIngredienthandler = (ingredient) => {
    setUserIngredients((prevIngredients) => {
      return [...prevIngredients, {id: Math.random().toString(), ...ingredient}] 
    })
  }
  

  return (
    <div className="App">
      <IngredientForm onAddIngredient={(ingredient) => addIngredienthandler(ingredient)}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} 
          onRemoveItem={(id) => {
            const updatedIngredients = userIngredients.filter((ingredient) => {
              return ingredient.id !== id;
            })
            setUserIngredients(updatedIngredients);
          }
        }/>
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
