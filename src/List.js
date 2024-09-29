import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import { MdEdit, MdDelete } from "react-icons/md";
import { nanoid } from "nanoid";



export default function List( {list, lists, editList, delList} ) {

  const [editTitle, setEditTitle] = useState(false);
  const [inputText, setInputText] = useState("");
  const [editInputText, setEditInputText] = useState("");
  const [editId, setEditId] = useState("");
  const [showEditItem, setShowEditItem] = useState(false);

  let title;

  function addItem( ) {
    if(inputText.trim() !== "") {
      title = list.title || "New List";
      editList(list.id, title, list.items.concat(
        {
          id: nanoid(),
          text: inputText,
          finished: false
        }
      ))
    }

    setInputText("");
  }

  function enterInput(e) {
    if(e.key === "Enter") {
      addItem();
    }
  }

  function cloneItems() {
    return JSON.parse(JSON.stringify(list.items));
  }

  function addListTitle(e) {
    if(e.target.value.trim() !== "") {
      title = e.target.value;
    } else {
      title = (list.title || "New List");
    }

    editList( list.id, title, list.items );
    setEditTitle(false);
  }

  function finishItem(id) {
    const newItems = cloneItems();
    newItems.forEach( item => {
      if(item.id === id) {
        item.finished = !item.finished;
      }
    } );

    editList(list.id, list.title, newItems);

  }

  function editItem(id) {
    setEditId(id);
    setShowEditItem(true);
  }

  function addEditItem(id) {
    if(editInputText.trim() !== "") {
      const newItems = cloneItems();

      newItems.forEach( item => {
        if(item.id === id) {
          item.text = editInputText;
        }
      } )

      editList( list.id, list.title, newItems );
      setEditInputText("");
      setShowEditItem(false);
    }
  }

  function enterEditInput(e, id) {
    if(e.key === "Enter") {
      addEditItem(id);
    }
  }

  function delItem(id) {
    const newItems = cloneItems();
    editList(list.id, list.title, newItems.filter( item => item.id !== id ));
  }

  function newList() {
    editList(nanoid(), "", []);
  }

  function deleteList(id) {
    delList(id);
    newList();
  }

  return (
    <Col md={7} lg={8} className="mh-100">
      {
        editTitle ?
          (
            <Col sm={8} className="mx-auto">
              <Form.Control 
                type="text"
                placeholder={list.title || "Type the List Title"}
                className="border-info text-center mb-3"
                onBlur={ addListTitle }
                onKeyDown={ (e) => (e.key === "Enter") && addListTitle(e) }
                autoFocus
              />
            </Col>
          ) :
          <div className="mb-3 text-center fw-bolder" onClick={ () => setEditTitle(true) }>{ list.title || "Click To Type List Title" }</div>
      }
      <Stack className="mb-3" direction="horizontal" gap={3}>
        <Form.Control 
          placeholder="Type your item here..."
          value={inputText}
          onChange={ (e) => setInputText(e.target.value) }
          onKeyDown={enterInput}
        />
        <Button variant="primary" onClick={addItem}>Add</Button>
      </Stack>
      <ListGroup as="ul" className="flex-column-reverse mb-3" variant="flush" numbered>
        {
          list.items.map( (item) => {
            return (
              <ListGroup.Item key={item.id} as="li" className="border border-0 border-bottom d-flex justify-content-between" action>
                <div 
                  className="me-auto" 
                  style={{ cursor: "pointer", textDecoration: item.finished ? "line-through" : "none" }}
                  onClick={ () => finishItem(item.id) }
                >{item.text}</div>
                <Stack direction="horizontal">
                  <MdEdit 
                    className="text-primary me-2" 
                    style={{ cursor: "pointer" }}
                    onClick={ () => editItem(item.id) }
                  />
                  <MdDelete 
                    className="text-danger" 
                    style={{ cursor: "pointer" }} 
                    onClick={ () => delItem(item.id) }
                  />
                </Stack>
              </ListGroup.Item>
            )
          } )
        }
      </ListGroup>
        { showEditItem &&
          <Modal show={showEditItem} onHide={() => { setShowEditItem(false); setEditInputText(""); }}>
            <Modal.Body>
              <Stack direction="horizontal" gap={3}>
                <Form.Control
                  placeholder={list.items.find( item => item.id === editId ).text}
                  value={editInputText}
                  onChange={ (e) => setEditInputText(e.target.value) }
                  onKeyDown={ (e) => enterEditInput(e, editId) }
                  autoFocus
                />
                <Button variant="primary" onClick={ () => addEditItem(editId) }>Save</Button>
              </Stack>
            </Modal.Body>
          </Modal>
        }
      <Stack direction="horizontal" className="justify-content-evenly mb-3" gap={3}>
        <Button variant="primary" onClick={ newList }>New List</Button>
        <Button variant="outline-danger" onClick={() => deleteList(list.id)}>Delete List</Button>
      </Stack>
    </Col>
  )
}
