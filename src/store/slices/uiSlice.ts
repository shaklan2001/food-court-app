import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  customizationVisible: boolean;
}

const initialState: UIState = {
  customizationVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCustomizationVisible: (state, action: PayloadAction<boolean>) => {
      state.customizationVisible = action.payload;
    },
  },
});

export const { setCustomizationVisible } = uiSlice.actions;

export default uiSlice.reducer;
