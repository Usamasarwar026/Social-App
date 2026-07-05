import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../configure/firebase";

export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async ({ fromUid, toUid }, { rejectWithValue }) => {
    try {
      const reqRef = doc(collection(db, "friend_requests"));
      await setDoc(reqRef, {
        fromUid,
        toUid,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return { id: reqRef.id, fromUid, toUid, status: "pending" };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const respondFriendRequest = createAsyncThunk(
  "friend/respondFriendRequest",
  async (
    { requestId, fromUid, toUid, accept },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const reqDoc = doc(db, "friend_requests", requestId);
      const batch = writeBatch(db);
      batch.update(reqDoc, { status: accept ? "accepted" : "rejected" });
      if (accept) {
        const friendA = doc(collection(db, "friends", fromUid, "list"));
        const friendB = doc(collection(db, "friends", toUid, "list"));
        batch.set(friendA, { uid: toUid, createdAt: serverTimestamp() });
        batch.set(friendB, { uid: fromUid, createdAt: serverTimestamp() });
      }
      await batch.commit();
      // Refresh current user's friends list so UI updates instantly
      if (accept) {
        dispatch(fetchFriends(toUid));
      }
      return { requestId, accept };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchFriendRequests = createAsyncThunk(
  "friend/fetchFriendRequests",
  async (uid, { rejectWithValue }) => {
    try {
      const incomingQ = query(
        collection(db, "friend_requests"),
        where("toUid", "==", uid),
        where("status", "==", "pending"),
      );
      const outgoingQ = query(
        collection(db, "friend_requests"),
        where("fromUid", "==", uid),
        where("status", "==", "pending"),
      );

      const [incomingSnap, outgoingSnap] = await Promise.all([
        getDocs(incomingQ),
        getDocs(outgoingQ),
      ]);

      const incoming = incomingSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      const outgoing = outgoingSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // De-duplicate by id in case a doc somehow matches both queries
      const merged = [...incoming, ...outgoing].reduce((acc, r) => {
        acc[r.id] = r;
        return acc;
      }, {});

      return Object.values(merged);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (uid, { rejectWithValue }) => {
    try {
      const colRef = collection(db, "friends", uid, "list");
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    requests: [],
    friends: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(respondFriendRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.requests = state.requests.filter((r) => r.id !== requestId);
      });
  },
});

export default friendSlice.reducer;
