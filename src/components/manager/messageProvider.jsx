import React, { createContext, useReducer } from 'react';

const initialState = {
  total: 0,
  message: 0,
  notification: 0,
};

export function MessageReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [action.payload.type]:
          state[action.payload.type] + action.payload.count,
        total: state.total + action.payload.count,
      };
    case 'decrement':
      return {
        ...state,
        [action.payload.type]:
          state[action.payload.type] + action.payload.count,
        total: state.total - action.payload.count,
      };
    case 'reset':
      return { ...initialState };
    default:
      return { ...state };
  }
}

export const MessageStatisticsContent = createContext();

export function MessageStatistics(props) {
  const [state, dispatch] = useReducer(MessageReducer, initialState);
  return (
    <MessageStatisticsContent.Provider value={{ state, dispatch }}>
      {props.children}
    </MessageStatisticsContent.Provider>
  );
}

