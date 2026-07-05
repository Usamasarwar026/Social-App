import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../configure/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const login = createAsyncThunk(
  "auth/login",
  async (user, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );
      const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
      return docSnap.data() || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (user, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );
      const saveUserTodb = {
        username: user.username,
        email: user.email,
        phone: user.phone,
        uid: userCredential.user.uid,
      };
      await setDoc(doc(db, "users", userCredential.user.uid), saveUserTodb);
      return saveUserTodb;
    } catch (error) {
      // Provide clearer message for Firestore permission errors
      if (error.code === "permission-denied") {
        return rejectWithValue(
          "Missing or insufficient permissions. Check your Firestore security rules.",
        );
      }
      return rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  loading: true, // true until Firebase resolves auth state on mount
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
