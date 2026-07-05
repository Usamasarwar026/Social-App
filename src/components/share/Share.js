import React, { useState, useRef } from "react";
import "./share.css";
import { IoMdPhotos } from "react-icons/io";
import { MdLabel } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { createpost } from "../../redux/slices/feedSlice";
import { toast } from "sonner";
import Avatar from "../avatar/Avatar";

function Share() {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.authSlice?.user);
  const textRef = useRef(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Write something before posting!");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        createpost({
          description: text.trim(),
          username: user?.username || "Anonymous",
          uid: user?.uid || "",
          userEmail: user?.email || "",
        }),
      ).unwrap();
      setText("");
      toast.success("Post shared!");
    } catch (error) {
      toast.error("Failed to share post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="share">
      <div className="sharewrapper">
        <div className="sharetop">
          <Avatar name={user?.username} size={40} className="shareprofileimg" />
          <textarea
            ref={textRef}
            className="shareinput"
            placeholder={`What's on your mind, ${user?.username || "friend"}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
        </div>
        <hr className="sharehr" />
        <div className="sharebottom">
          <div className="shareoptions">
            <div className="shareoption">
              <IoMdPhotos color="tomato" size={22} />
              <span className="sharoptiontext">Photo/Video</span>
            </div>
            <div className="shareoption">
              <MdLabel color="#1775ee" size={22} />
              <span className="sharoptiontext">Tag</span>
            </div>
            <div className="shareoption">
              <FaLocationDot color="green" size={20} />
              <span className="sharoptiontext">Location</span>
            </div>
            <div className="shareoption">
              <MdOutlineEmojiEmotions color="orange" size={22} />
              <span className="sharoptiontext">Feeling</span>
            </div>
          </div>
          <button
            className="sharebutton"
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? <span className="share-spinner" /> : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Share;
