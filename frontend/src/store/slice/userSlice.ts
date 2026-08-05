import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface User {
    id: string,
    username: string,
    email: string
}



const initialState: { user: User | null } = {
user: null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        setAuth:(state , action :PayloadAction<{user:User}>)=>{
            state.user = action.payload.user
        },
        clearAuth:(state)=>{
            state.user=null
        }
    }
})

export const {setAuth, clearAuth} = authSlice.actions;
export default authSlice.reducer