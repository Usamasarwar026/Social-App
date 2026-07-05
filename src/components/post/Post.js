import React, { useEffect, useState } from "react";
import { MdMoreVert, MdEdit, MdDelete, MdSend } from "react-icons/md";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deletepost,
  getpost,
  likepost,
  addComment,
  updatepost,
} from "../../redux/slices/feedSlice";
import { toast } from "sonner";
import "./post.css";
import Avatar from "../avatar/Avatar";

function timeAgo(isoString) {
  if (!isoString) return "";
  const now = new Date();
  const past = new Date(isoString);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Post() {
  const feed = useSelector((store) => store.feedSlice.feed);
  const feedLoading = useSelector((store) => store.feedSlice.loading);
  const currentUser = useSelector((store) => store.authSlice?.user);
  const dispatch = useDispatch();

  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  useEffect(() => {
    dispatch(getpost());
  }, [dispatch]);

  const handleLike = async (post) => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }
    const liked = (post.likes || []).includes(currentUser.uid);
    try {
      await dispatch(
        likepost({ postId: post.id, userId: currentUser.uid, liked }),
      ).unwrap();
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }
    const comment = {
      text,
      username: currentUser.username,
      uid: currentUser.uid,
      createdAt: new Date().toISOString(),
    };
    try {
      await dispatch(addComment({ postId, comment })).unwrap();
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await dispatch(deletepost(id)).unwrap();
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const openEdit = (post) => {
    setEditPostId(post.id);
    setEditTitle(post.title || "");
    setEditDesc(post.description || "");
    setMenuOpen({});
  };

  const handleEditSave = async () => {
    if (!editDesc.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    setEditLoading(true);
    try {
      await dispatch(
        updatepost({ id: editPostId, title: editTitle, description: editDesc }),
      ).unwrap();
      toast.success("Post updated!");
      setEditPostId(null);
    } catch {
      toast.error("Failed to update post");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComments = (id) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (feedLoading && feed.length === 0) {
    return (
      <div className="post-loading">
        <div className="post-spinner" />
        <p>Loading posts...</p>
      </div>
    );
  }

  if (!feedLoading && feed.length === 0) {
    return (
      <div className="post-empty">
        <p>No posts yet. Be the first to share something! </p>
      </div>
    );
  }

  return (
    <>
      {feed.map((post) => {
        const isLiked = (post.likes || []).includes(currentUser?.uid);
        const isOwner = currentUser?.uid === post.uid;
        const commentsArr = Array.isArray(post.comments) ? post.comments : [];

        return (
          <div className="post" key={post.id}>
            <div className="postwrapper">
              {/* Top */}
              <div className="posttop">
                <div className="posttopleft">
                  <Avatar
                    name={post.username}
                    size={40}
                    className="postprofileimg"
                  />
                  <div className="post-user-info">
                    <span className="postusername">
                      {post.username || "Unknown"}
                    </span>
                    <span className="postdate">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
                {isOwner && (
                  <div className="posttopright">
                    <button
                      className="post-menu-btn"
                      onClick={() => toggleMenu(post.id)}
                    >
                      <MdMoreVert size={20} />
                    </button>
                    {menuOpen[post.id] && (
                      <div className="post-dropdown">
                        <button
                          className="post-dropdown-item"
                          onClick={() => openEdit(post)}
                        >
                          <MdEdit size={15} /> Edit
                        </button>
                        <button
                          className="post-dropdown-item danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          <MdDelete size={15} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="postcenter">
                {post.title && <h4 className="post-title">{post.title}</h4>}
                <p className="post-desc">{post.description}</p>
              </div>

              {/* Actions */}
              <div className="postbottom">
                <div className="postbottomleft">
                  <button
                    className="post-action-btn like-btn"
                    onClick={() => handleLike(post)}
                  >
                    {isLiked ? (
                      <FaHeart color="#e74c3c" size={18} />
                    ) : (
                      <FaRegHeart size={18} />
                    )}
                    <span>{(post.likes || []).length}</span>
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() => toggleComments(post.id)}
                  >
                    <FaRegComment size={18} />
                    <span>{commentsArr.length}</span>
                  </button>
                </div>
              </div>

              {/* Comments section */}
              {showComments[post.id] && (
                <div className="comments-section">
                  {commentsArr.length > 0 && (
                    <div className="comments-list">
                      {commentsArr.map((c, i) => (
                        <div className="comment" key={i}>
                          <Avatar
                            name={c.username}
                            size={30}
                            fontSize={12}
                            className="comment-avatar"
                          />
                          <div className="comment-bubble">
                            <span className="comment-username">
                              {c.username}
                            </span>
                            <p className="comment-text">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="comment-input-row">
                    <Avatar
                      name={currentUser?.username}
                      size={30}
                      fontSize={12}
                      className="comment-avatar"
                    />
                    <input
                      className="comment-input"
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleComment(post.id)
                      }
                    />
                    <button
                      className="comment-send-btn"
                      onClick={() => handleComment(post.id)}
                      disabled={!(commentInputs[post.id] || "").trim()}
                    >
                      <MdSend size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Modal */}
            {editPostId === post.id && (
              <div
                className="edit-modal-overlay"
                onClick={() => setEditPostId(null)}
              >
                <div
                  className="edit-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="edit-modal-title">Edit Post</h3>
                  <input
                    className="edit-modal-input"
                    type="text"
                    placeholder="Post title (optional)"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="edit-modal-textarea"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                  <div className="edit-modal-actions">
                    <button
                      className="edit-cancel-btn"
                      onClick={() => setEditPostId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="edit-save-btn"
                      onClick={handleEditSave}
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <span className="share-spinner" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Post;
