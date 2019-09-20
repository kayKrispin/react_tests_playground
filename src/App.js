import React from 'react';
import axios from 'axios';
export const dataReducer = (state, action) => {
  if (action.type === 'SET_ERROR') {
    return { ...state, list: [], error: true };
  }
  if (action.type === 'SET_LIST') {
    return { ...state, list: action.list, error: null };
  }
  throw new Error();
};
const initialData = {
  list: [],
  error: null,
};

export const setList = list => ({
    type: "SET_LIST",
    list
});

export const add =(a, b) => {
  return a + b;
};

export const App = ({ output = 5 }) => {
  const [counter, setCounter] = React.useState(0);
  const [data, dispatch] = React.useReducer(dataReducer, initialData);
  React.useEffect(() => {
      let isSubscribed = true;

      axios
        .get('http://hn.algolia.com/api/v1/search?query=react')
        .then(response => {
          dispatch({ type: 'SET_LIST', list: response.data.hits });
        })
        .catch(() => {
          dispatch({ type: 'SET_ERROR' });
        });
      return () => (data.list.length);

  }, []);


  return (
      <div>
        <h1>hello bous</h1>
        <Counter counter={counter} />
        <button type="button" onClick={() => setCounter(counter + 1)}>
          Increment
        </button>
        <button type="button" onClick={() => setCounter(counter - 1)}>
           Decrement
        </button>
        <h2>My Async Data</h2>
        {data.error && <div className="error">Error</div>}
        <ul>
          {data.list.map(item => (
              <li key={item.objectID}>{item.title}</li>
          ))}
        </ul>
        <span id="output">{output}</span>
      </div>
  );
};
export const Counter = ({ counter }) => (
    <div>
      <p>{counter}</p>
    </div>
);


export default App;
