import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchUserById } from "../../redux/slices/usersSlice";
import FriendRequestButton from "../../components/friendRequestButton/FriendRequestButton";
import Avatar from "../../components/avatar/Avatar";
import "./Profile.css";

const Profile = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.usersSlice);
  const currentUser = useSelector((state) => state.authSlice?.user);
  const isOwnProfile = currentUser?.uid === uid;

  useEffect(() => {
    if (uid) {
      dispatch(fetchUserById(uid));
    }
  }, [dispatch, uid]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-state profile-state--error">Error: {error}</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-container glass-card">
        <div className="profile-cover" />

        <div className="profile-avatar-wrapper">
          <Avatar
            name={profile.username}
            size={110}
            fontSize={40}
            className="profile-avatar"
          />
        </div>

        <h2 className="profile-name">{profile.username}</h2>

        <div className="profile-details">
          {profile.email && (
            <p className="profile-detail-row">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{profile.email}</span>
            </p>
          )}
          {profile.phone && (
            <p className="profile-detail-row">
              <span className="profile-detail-label">Phone</span>
              <span className="profile-detail-value">{profile.phone}</span>
            </p>
          )}
        </div>

        {!isOwnProfile && (
          <div className="profile-action">
            <FriendRequestButton targetUid={profile.uid} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
