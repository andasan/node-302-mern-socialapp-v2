const initState = {
    isLoggedIn: false,
    userId: null,
    userPlaces: []
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
        case 'PLACE_DELETED':
            return{
                ...state,
                userPlaces: state.userPlaces.filter(place => place._id !== action.payload)
            }
        case 'LOAD_PLACES':
            return{
                ...state,
                userPlaces: [...state.userPlaces, action.payload]
            }
        default:
            return state;
    }
}

export default rootReducer;