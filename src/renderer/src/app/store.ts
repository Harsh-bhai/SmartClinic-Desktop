import {configureStore} from "@reduxjs/toolkit"
import prescriptionReducer from "@/features/prescription/prescriptionSlice"
const store = configureStore({
    reducer:{
        prescription: prescriptionReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch