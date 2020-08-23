import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()

  const { isLoading, data, error, sendRequest, clear } = useHttp()

  useEffect(() => {
    const timerInstance = setTimeout(() => {
      if(enteredFilter === inputRef.current.value)
      (async () => {
        const query = enteredFilter.length === 0 ?
        '' : 
        `?orderBy="title"&equalTo="${enteredFilter}"`;
        const url = 'https://react-hooks-test-72d09.firebaseio.com/ingredients.json' + query;
        sendRequest(url, 'GET')
      })()
    }, 500)
    return () => {
      clearTimeout(timerInstance);
    }
    
  }, [enteredFilter, onLoadIngredients, inputRef, sendRequest])
  
  useEffect(() => {
    if(!isLoading && !error && data){
      const fetchedIngredients = [];
    for (const key in data) {
      fetchedIngredients.push({
        id: key,
        title: data[key].title,
        amount: data[key].amount
      })
    }
    onLoadIngredients(fetchedIngredients)
    }
  }, [data, onLoadIngredients, isLoading, error])

  return (
    <section className="search">

      {error && <ErrorModal onClose={clear}>{error.message}</ErrorModal>}

      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading ? <span>Loading...</span> : null}
          <input 
          type="text" 
          ref={inputRef}
          defaultValue={enteredFilter} 
          onChange={(event) => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
