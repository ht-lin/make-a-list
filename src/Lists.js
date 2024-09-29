import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { MdEdit, MdDelete } from "react-icons/md";

export default function Lists( {lists, delList, editList, editListTitle} ) {

  const [showEditTitle, setShowEditTitle] = useState(false);
  const [editId, setEditId] = useState("");
  const [editInputText, setEditInputText] = useState("");

  function selectedList(listId) {
    const {id, title, items} = lists.find( list => list.id === listId );
    editList(id, title, items);
  }

  function editTitle(id) {
    setEditId(id);
    setShowEditTitle(true);
  }

  function saveEditTitle(id) {
    if(editInputText.trim() !== "") {
      editListTitle(id, editInputText);
      setEditInputText("");
      setShowEditTitle(false);
    }
  }

  function enterEditInput(e, id) {
    if(e.key === "Enter") {
      saveEditTitle(id);
    }
  }

  return (
    <Col md={5} lg={4} >
      <div className="bg-secondary-subtle text-center p-2 fw-bolder">All Lists</div>
      <ListGroup>
        {(lists.length !== 0) &&
          lists.map( list => {
            return(
              <ListGroup.Item key={list.id} className="d-flex justify-content-between" action>
                <div className="me-auto" onClick={() => selectedList(list.id)} >{list.title}</div>
                <Stack direction="horizontal">
                  <MdEdit 
                    className="text-primary me-2" 
                    style={{ cursor: "pointer" }} 
                    onClick={ () => editTitle(list.id) }
                  />
                  <MdDelete 
                    className="text-danger" 
                    style={{ cursor: "pointer" }} 
                    onClick={ () => delList(list.id) }
                  />
                </Stack>
              </ListGroup.Item>
            )
          } )
        }
      </ListGroup>
      { showEditTitle &&
        <Modal show={showEditTitle} onHide={() => { setShowEditTitle(false); setEditInputText(""); }}>
          <Modal.Body>
            <Stack direction="horizontal" gap={3}>
              <Form.Control
                placeholder={lists.find( list => list.id === editId ).title}
                value={editInputText}
                onChange={ (e) => setEditInputText(e.target.value) }
                onKeyDown={ (e) => enterEditInput(e, editId) }
                autoFocus
              />
              <Button variant="primary" onClick={ () => saveEditTitle(editId) }>Save</Button>
            </Stack>
          </Modal.Body>
        </Modal>
      }
    </Col>
  )
}
