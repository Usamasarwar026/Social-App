import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchFriendRequests,
} from "../../redux/slices/friendSlice";
import FriendRequestButton from "../../components/FriendRequestButton";
import "./Friends.css";
import blurPic from "../../assets/blurpic.jpg";

const FriendsPage = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.authSlice?.user || {});
  const { friends, requests, loading, error } = useSelector(
    (state) => state.friendSlice,
  );

  useEffect(() => {
    if (uid) {
      dispatch(fetchFriends(uid));
      dispatch(fetchFriendRequests(uid));
    }
  }, [dispatch, uid]);

  if (!uid)
    return (
      <div className="friends-loading">Please log in to view friends.</div>
    );
  if (loading) return <div className="friends-loading">Loading...</div>;
  if (error) return <div className="friends-error">Error: {error}</div>;

  const incoming = requests.filter(
    (r) => r.toUid === uid && r.status === "pending",
  );

  return (
    <div className="friends-page glass-card">
      <h2 className="section-title">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="empty-state">You have no friends yet.</p>
      ) : (
        <div className="friend-grid">
          {friends.map((f) => (
            <div key={f.uid} className="friend-card">
              <img
                src={f.photoURL || blurPic}
                alt={f.uid}
                className="friend-avatar"
              />
              <p className="friend-name">{f.uid}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">Pending Requests</h2>
      {incoming.length === 0 ? (
        <p className="empty-state">No pending requests.</p>
      ) : (
        <div className="request-list">
          {incoming.map((req) => (
            <div key={req.id} className="request-item glass-card">
              <p className="request-text">
                {req.fromUid} wants to be your friend
              </p>
              <FriendRequestButton targetUid={req.fromUid} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
