import { createContext, useContext, useReducer } from 'react';

const GlobalContext = createContext();

const initialState = {
  user: null,
  loading: false,
  dialog: false,
  actionType: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'OPEN_DIALOG':
      return {
        ...state,
        dialog: true,
        actionType: action.payload,
      };

    case 'CLOSE_DIALOG':
      return {
        ...state,
        dialog: false,
        actionType: '',
      };

    default:
      return state;
  }
}

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
