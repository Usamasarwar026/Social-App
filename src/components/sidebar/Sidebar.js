import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineRssFeed } from "react-icons/md";
import { FaStore, FaUserFriends, FaUsers, FaVideo } from "react-icons/fa";
import { fetchFriends } from "../../redux/slices/friendSlice";
import { fetchAllUsers } from "../../redux/slices/usersSlice";
import Avatar from "../avatar/Avatar";
import "./sidebar.css";

const NAV_ITEMS = [
  { Icon: MdOutlineRssFeed, label: "Feed" },
  { Icon: FaUserFriends, label: "Friends" },
  { Icon: FaVideo, label: "Videos" },
  { Icon: FaStore, label: "Store" },
  { Icon: FaUsers, label: "Groups" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.authSlice?.user);
  const uid = currentUser?.uid;

  const { list: users } = useSelector((state) => state.usersSlice);
  const { friends } = useSelector((state) => state.friendSlice);

  useEffect(() => {
    dispatch(fetchAllUsers());
    if (uid) {
      dispatch(fetchFriends(uid));
    }
  }, [dispatch, uid]);

 
  const usersByUid = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.uid] = u;
      return acc;
    }, {});
  }, [users]);

  return (
    <div className="sidebar">
      <div className="sidebarwrapper">
        <ul className="sidebarlist">
          {NAV_ITEMS.map(({ Icon, label }) => {
            const path =
              label === "Feed" ? "/" : label === "Friends" ? "/people" : "#";
            return (
              <li key={label} className="sidebarlistitem">
                <Link to={path} className="sidebarlink">
                  <Icon className="sidebaricon" />
                  <span className="sidebarlistitemtext">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="sidebarhr" />

        <span className="sidebar-friends-title">Friends</span>

        <ul className="sidebarfriendlist">
          {friends.length === 0 ? (
            <li className="sidebarfriend-empty">No friends yet</li>
          ) : (
            friends.map((f) => {
              const friendUser = usersByUid[f.uid];
              const name = friendUser?.username || "Unknown";
              return (
                <li key={f.uid} className="sidebarfriend">
                  <Avatar name={name} size={32} fontSize={13} />
                  <span className="sidebarfriendname">{name}</span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
