import React from "react";

export function reducer(state, action){
    switch(action.type){
        case 'increment':
            return ;
        case 'decrement':
            return;
        case 'reset':
            return;
        default:
            throw new Error();
    }
}