import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { createpost } from "../../redux/slices/feedSlice";

function Postmodel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);

  const post = useSelector((store) => store.feedSlice.updatepost);

  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
    }
  }, [post]);

  const createposthandler = () => {
    console.log("Title: ", title);
    console.log("Description: ", description);
    let postdata = {
      title,
      description,
    };
    console.log("post button clicked");
    dispatch(createpost({ ...postdata }));
  };
  return (
    <>
      <div onClick={handleShow}>
        <IoAdd size={30} /> Create Post Here
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Post Heading</Form.Label>
              {/* ----------------title----------- */}
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter post Heading"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Type your post</Form.Label>
              {/* ----------------description------------------ */}
              <Form.Control
                value={description}
                as="textarea"
                rows={3}
                placeholder="write your post here"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createposthandler}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Postmodel;
