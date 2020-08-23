import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';
import useHttp from '../../hooks/http'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      console.log(action.ingredient)
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      console.log(currentIngredients)
      return currentIngredients.filter((ingredient) => {
        return ingredient.id !== action.id;
      });
    default:
      throw new Error(`shouldn't get here!`);
  }

}

const Ingredients = () => {
  
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifier, clear } = useHttp()

  const addIngredienthandler = useCallback(async (ingredient) => {
    sendRequest('https://react-hooks-test-72d09.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT')
  }, [sendRequest])

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://react-hooks-test-72d09.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT')
    // dispatchHttp({type: 'SEND'})
  }, [sendRequest])


  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
  }, [])

  useEffect(() => {
    if(!isLoading && data && reqIdentifier === 'ADD_INGREDIENT') {
      console.log('add ingredient', data)
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...reqExtra}
      })
    }
    else if(!isLoading && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({
        type: 'DELETE',
        id: reqExtra
      })
    } else if(!isLoading && reqIdentifier === 'GET_INGREDIENTS') {
      const dataArray = data ? Object.keys(data).map((key) => {
        return {id: key, ...data[key]}
      }) : null
      dispatch({
        type: 'SET',
        ingredients: dataArray
      })
    }
    
  }, [data, reqExtra, reqIdentifier, isLoading])

  const ingredientList = useMemo(() =>
    <IngredientList ingredients={userIngredients ? userIngredients : []}
      onRemoveItem={(id) => {
        removeIngredientHandler(id)
      }
      } />, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">

      {error && <ErrorModal onClose={clear}>{error.message}</ErrorModal>}

      <IngredientForm isLoading={isLoading} onAddIngredient={(ingredient) => addIngredienthandler(ingredient)} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
