import { useReducer, useCallback } from "react";

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
      case 'SEND':
        return {
          loading: true,
          error: null,
          data: null,
          extra: null,
          identifier: action.identifier
        };
      case 'RESPONSE':
        return {
          ...curHttpState,
          loading: false,
          data: action.responseData,
          extra: action.extra
        };
      case 'ERROR':
        return {
            ...curHttpState,
          loading: false,
          error: action.error
        };
      case 'ERROR_HANDLED':
      return {
        ...curHttpState,
        error: null,
        loading: false,
        data: null,
        extra: null
      };
      default:
        throw new Error(`Shouldn't be reached`);
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null, data: null, extra: null})

    const sendRequest = useCallback(async (url, method, body, reqExtra, identifier) => {
        dispatchHttp({type: 'SEND', identifier: identifier})
        try {
            const response = await fetch(url, {
            method: method,
            body: body,
            headers: {
                'Application-Type':'application/json',
                }
            });
            const responseData = await response.json();
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: reqExtra})

          } catch (error) {
            dispatchHttp({type: 'ERROR', error: error})
          }
    }, [])
    
    const clear = () => {
        dispatchHttp({type: 'ERROR_HANDLED'})
    }
    

    return {
        isLoading: httpState.loading, 
        data: httpState.data, 
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    }
}

export default useHttp;