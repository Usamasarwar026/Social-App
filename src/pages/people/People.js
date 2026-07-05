import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slices/usersSlice";
import FriendRequestButton from "../../components/friendRequestButton/FriendRequestButton";
import Avatar from "../../components/avatar/Avatar";
import {
  fetchFriends,
  fetchFriendRequests,
} from "../../redux/slices/friendSlice";
import "./people.css";

const People = () => {
  const dispatch = useDispatch();
  const {
    list: users,
    loading,
    error,
  } = useSelector((state) => state.usersSlice);
  const currentUser = useSelector((state) => state.authSlice?.user);
  const { uid } = currentUser || {};
  const {
    friends,
    requests,
    loading: friendLoading,
    error: friendError,
  } = useSelector((state) => state.friendSlice);

  useEffect(() => {
    dispatch(fetchAllUsers());
    if (uid) {
      dispatch(fetchFriends(uid));
      dispatch(fetchFriendRequests(uid));
    }
  }, [dispatch, uid]);

  const usersByUid = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.uid] = u;
      return acc;
    }, {});
  }, [users]);

  const incoming = requests.filter(
    (r) => r.toUid === uid && r.status === "pending",
  );

  if (loading || friendLoading) {
    return (
      <div className="people-container">
        <div className="people-state">Loading people...</div>
      </div>
    );
  }

  if (error || friendError) {
    return (
      <div className="people-container">
        <div className="people-state people-state--error">
          Error: {error || friendError}
        </div>
      </div>
    );
  }

  return (
    <div className="people-container">
      <section className="people-section">
        <h2 className="people-section__title">People you may know</h2>
        {users.length === 0 ? (
          <p className="people-empty">No other users yet.</p>
        ) : (
          <div className="people-grid">
            {users.map((user) => (
              <div key={user.uid} className="person-card">
                <Avatar name={user.username} size={56} fontSize={22} />
                <h3 className="person-card__name">{user.username}</h3>
                <FriendRequestButton targetUid={user.uid} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="people-section">
        <h2 className="people-section__title">Your friends</h2>
        {friends.length === 0 ? (
          <p className="people-empty">You have no friends yet.</p>
        ) : (
          <div className="people-grid">
            {friends.map((f) => {
              const friendUser = usersByUid[f.uid];
              return (
                <div key={f.uid} className="person-card">
                  <Avatar name={friendUser?.username} size={56} fontSize={22} />
                  <h3 className="person-card__name">
                    {friendUser?.username || f.uid}
                  </h3>
                  <span className="person-card__tag">Friend</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="people-section">
        <h2 className="people-section__title">Pending requests</h2>
        {incoming.length === 0 ? (
          <p className="people-empty">No pending requests.</p>
        ) : (
          <div className="request-list">
            {incoming.map((req) => {
              const requester = usersByUid[req.fromUid];
              return (
                <div key={req.id} className="request-item">
                  <div className="request-item__info">
                    <Avatar
                      name={requester?.username}
                      size={44}
                      fontSize={18}
                    />
                    <p className="request-item__text">
                      <strong>{requester?.username || req.fromUid}</strong>{" "}
                      wants to be your friend
                    </p>
                  </div>
                  <FriendRequestButton targetUid={req.fromUid} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default People;
