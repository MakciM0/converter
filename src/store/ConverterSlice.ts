import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { TCurrency } from "../types/types";


const ConverterSlice = createSlice({
  name: "converter",
  initialState: {
    currencies : [{
      name: '',
      priceUsd: 1,
      }] as TCurrency[],
  },

  reducers: {
    SetCurrencies: (state, action: PayloadAction<TCurrency[]>) => {
      state.currencies = action.payload;
      state.currencies.forEach((item, i) =>{
        state.currencies[i].priceUsd = Number(Number(item.priceUsd).toFixed(6));
      });
    },
   
  },
});

export const {
  SetCurrencies,

} = ConverterSlice.actions;
export const selectCount = (state: RootState) => state.converter;
export default ConverterSlice.reducer;
