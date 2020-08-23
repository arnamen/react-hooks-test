import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  useEffect(() => {
    const timerInstance = setTimeout(() => {
      if(enteredFilter === inputRef.current.value)
      (async () => {
        const query = enteredFilter.length === 0 ?
        '' : 
        `?orderBy="title"&equalTo="${enteredFilter}"`;
        let response = await fetch('https://react-hooks-test-72d09.firebaseio.com/ingredients.json' + query);
        let responseData = await response.json();
        const fetchedIngredients = [];
        for (const key in responseData) {
          fetchedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }
        onLoadIngredients(fetchedIngredients)
      })()
    }, 500)
    return () => {
      clearTimeout(timerInstance);
    }
    
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
