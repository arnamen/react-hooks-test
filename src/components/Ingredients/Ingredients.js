import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ingredient) => {
        return ingredient.id !== action.id;
      });
    default:
      throw new Error(`shouldn't get here!`);
  }

}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.error
      };
    case 'ERROR_HANDLED':
    return {
      ...curHttpState,
      error: false
    };
    default:
      throw new Error(`Shouldn't be reached`);
  }
}


const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})

  const addIngredienthandler = useCallback(async (ingredient) => {
    try {
      dispatchHttp({type: 'SEND'})
      let response = await fetch('https://react-hooks-test-72d09.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type' : 'application/json' }
      });

      let responseData = await response.json();
      dispatchHttp({type: 'RESPONSE'})
      dispatch({
        type: 'ADD',
        ingredient: {id: responseData.name, ...ingredient}
      })
    } catch (error) {
      dispatchHttp({type: 'ERROR', error: error})
    }

  }, [])

  const clearError = () => {
    dispatchHttp({type: 'ERROR_HANDLED'})
  }
  

  const removeIngredientHandler = async (id) => {

      try {
        dispatchHttp({type: 'SEND'})
        await fetch(`https://react-hooks-test-72d09.firebaseio.com/ingredients/${id}.json`, {
        method: 'DELETE'
        });
        dispatchHttp({type: 'RESPONSE'})
        dispatch({
          type: 'DELETE',
          id: id
        })
      } catch (error) {
        dispatchHttp({type: 'ERROR', error: error})
      }
  }
  

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
  }, [])
  return (
    <div className="App">

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error.message}</ErrorModal>}

      <IngredientForm isLoading={httpState.loading} onAddIngredient={(ingredient) => addIngredienthandler(ingredient)}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} 
          onRemoveItem={(id) => {
            removeIngredientHandler(id)
          }
        }/>
    </section>
    </div>
  );
}

export default Ingredients;
