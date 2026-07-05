import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../configure/firebase";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const currentUid = getState().authSlice?.user?.uid;
      return snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== currentUid);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (uid, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error("User not found");
      return { uid, ...snapshot.data() };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
