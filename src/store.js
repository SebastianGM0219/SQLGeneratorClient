import { configureStore  } from "@reduxjs/toolkit";
import databaseReducer from './slices/database'
import tableReducer from './slices/table'
import utilityReducer from './slices/utility'
import queryReducer from './slices/query'
import savedataReducer from './slices/savedata'
import unionReducer from './slices/union'

const reducer = {
  database: databaseReducer,
  table: tableReducer,
  utility: utilityReducer,
  query: queryReducer,
  savedata: savedataReducer,
  union: unionReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true
})

export default store;