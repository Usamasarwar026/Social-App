import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import gift from "../../assets/gift.png";
import Add from "../../assets/Cold, Smooth & Tasty (1).png";
import Avatar from "../avatar/Avatar";
import { fetchAllUsers } from "../../redux/slices/usersSlice";
import "./rightbar.css";

function Rightbar() {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="rightbar">
      <div className="rightbarwrapper">
        <div className="birthdaycontainer">
          <img src={gift} alt="git" className="birthdayimg" />
          <span className="birthdaytext">
            <b>Saim Ansari</b> and <b>and 2 other Friends</b> have a birthday
            today!
          </span>
        </div>

        <img src={Add} alt="Adds..." className="rightbaradd" />

        <h4 className="rightbartitle">All Users</h4>
        <ul className="rightbarfriendlist">
          {loading ? (
            <li className="rightbarfriend-empty">Loading users...</li>
          ) : users.length === 0 ? (
            <li className="rightbarfriend-empty">No other users yet</li>
          ) : (
            users.map((user) => (
              <li key={user.uid} className="rightbarfriend">
                <Link
                  to={`/profile/${user.uid}`}
                  className="rightbarfriend-link"
                >
                  <div className="rightbarprofileimg-wrapper">
                    <Avatar name={user.username} size={40} fontSize={16} />
                    <span className="rightbaronlinebadge" />
                  </div>
                  <span className="rightbarusername">{user.username}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Rightbar;
