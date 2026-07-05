import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../configure/firebase";

export const createpost = createAsyncThunk(
  "feed/createpost",
  async (post, { rejectWithValue }) => {
    try {
      const collectionRef = collection(db, "posts");
      const docRef = await addDoc(collectionRef, {
        ...post,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      // return the full post with the generated id
      return {
        id: docRef.id,
        ...post,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getpost = createAsyncThunk(
  "feed/getpost",
  async (_, { rejectWithValue }) => {
    try {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      const docs = await getDocs(q);
      return docs.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt:
          d.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }));
    } catch (error) {
      // fallback without ordering if index not ready
      try {
        const collectionRef = collection(db, "posts");
        const docs = await getDocs(collectionRef);
        return docs.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt:
            d.data().createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        }));
      } catch (e) {
        return rejectWithValue(e.message);
      }
    }
  },
);

export const deletepost = createAsyncThunk(
  "feed/deletepost",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updatepost = createAsyncThunk(
  "feed/updatepost",
  async (post, { rejectWithValue }) => {
    try {
      const { id, ...rest } = post;
      await updateDoc(doc(db, "posts", id), rest);
      return post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const likepost = createAsyncThunk(
  "feed/likepost",
  async ({ postId, userId, liked }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "posts", postId);
      if (liked) {
        await updateDoc(docRef, { likes: arrayRemove(userId) });
      } else {
        await updateDoc(docRef, { likes: arrayUnion(userId) });
      }
      return { postId, userId, liked };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addComment = createAsyncThunk(
  "feed/addComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, { comments: arrayUnion(comment) });
      return { postId, comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: [],
    updatePost: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUpdatePost: (state, action) => {
      state.updatePost = action.payload;
    },
    clearUpdatePost: (state) => {
      state.updatePost = null;
    },
  },
  extraReducers: (builder) => {
    // createpost
    builder.addCase(createpost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createpost.fulfilled, (state, action) => {
      state.loading = false;
      state.feed = [action.payload, ...state.feed];
    });
    builder.addCase(createpost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // getpost
    builder.addCase(getpost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getpost.fulfilled, (state, action) => {
      state.loading = false;
      state.feed = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(getpost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.feed = [];
    });

    // deletepost
    builder.addCase(deletepost.fulfilled, (state, action) => {
      state.feed = state.feed.filter((post) => post.id !== action.payload);
    });

    // updatepost
   // updatepost
builder.addCase(updatepost.fulfilled, (state, action) => {
  state.feed = state.feed.map((post) =>
    post.id === action.payload.id ? { ...post, ...action.payload } : post,
  );
  state.updatePost = null;
});

    // likepost – optimistic update
    builder.addCase(likepost.fulfilled, (state, action) => {
      const { postId, userId, liked } = action.payload;
      const post = state.feed.find((p) => p.id === postId);
      if (post) {
        if (liked) {
          post.likes = (post.likes || []).filter((uid) => uid !== userId);
        } else {
          post.likes = [...(post.likes || []), userId];
        }
      }
    });

    // addComment – optimistic update
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.feed.find((p) => p.id === postId);
      if (post) {
        post.comments = [...(post.comments || []), comment];
      }
    });
  },
});

export const { setUpdatePost, clearUpdatePost } = feedSlice.actions;
export default feedSlice.reducer;
