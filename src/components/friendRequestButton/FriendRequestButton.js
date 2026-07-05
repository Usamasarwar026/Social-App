import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendFriendRequest,
  respondFriendRequest,
  fetchFriends,
} from "../../redux/slices/friendSlice";

const FriendRequestButton = ({ targetUid }) => {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const currentUid = useSelector((state) => state.authSlice?.user?.uid);
  const { friends, requests } = useSelector((state) => state.friendSlice);

  const isFriend = friends.some((f) => f.uid === targetUid);
  const sentRequest = requests.find(
    (r) =>
      r.fromUid === currentUid &&
      r.toUid === targetUid &&
      r.status === "pending",
  );
  const incomingRequest = requests.find(
    (r) =>
      r.fromUid === targetUid &&
      r.toUid === currentUid &&
      r.status === "pending",
  );

  const handleAdd = async () => {
    setActionLoading(true);
    await dispatch(
      sendFriendRequest({ fromUid: currentUid, toUid: targetUid }),
    );
    setActionLoading(false);
  };

  const handleAccept = async () => {
    setActionLoading(true);
    await dispatch(
      respondFriendRequest({
        requestId: incomingRequest.id,
        fromUid: incomingRequest.fromUid,
        toUid: incomingRequest.toUid,
        accept: true,
      }),
    );
    dispatch(fetchFriends(currentUid));
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    await dispatch(
      respondFriendRequest({
        requestId: incomingRequest.id,
        fromUid: incomingRequest.fromUid,
        toUid: incomingRequest.toUid,
        accept: false,
      }),
    );
    setActionLoading(false);
  };

  if (isFriend) {
    return (
      <button disabled className="friend-btn friend-btn--friends">
        Friends
      </button>
    );
  }

  if (sentRequest) {
    return (
      <button disabled className="friend-btn friend-btn--pending">
        Pending
      </button>
    );
  }

  if (incomingRequest) {
    return (
      <div className="friend-action-pair">
        <button
          className="friend-btn friend-btn--accept"
          onClick={handleAccept}
          disabled={actionLoading}
        >
          {actionLoading ? "..." : "Accept"}
        </button>
        <button
          className="friend-btn friend-btn--reject"
          onClick={handleReject}
          disabled={actionLoading}
        >
          {actionLoading ? "..." : "Reject"}
        </button>
      </div>
    );
  }

  return (
    <button
      className="friend-btn friend-btn--add"
      onClick={handleAdd}
      disabled={actionLoading}
    >
      {actionLoading ? "Sending..." : "Add Friend"}
    </button>
  );
};

export default FriendRequestButton;
