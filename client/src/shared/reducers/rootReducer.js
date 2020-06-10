const initState = {
    isLoggedIn: false,
    userId: null
}

const rootReducer = (state=initState, action) => {
    switch(action.type){
        case 'LOGIN':
            console.log('LOGGING IN');
            return{
                ...state,
                isLoggedIn: true,
                userId: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                isLoggedIn: false,
                userId: null
            }
        default:
            return state;
    }
}

export default rootReducer;