import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import 'bootstrap/dist/css/bootstrap.min.css';
import List from "./List";
import Lists from "./Lists";
import { nanoid } from "nanoid";


function getLocalStorage() {
  const localLists = localStorage.getItem("lists");

  return localLists ? JSON.parse(localLists) : [];
}

function App() {

  const [lists, setLists] = useState( getLocalStorage() );
  const [list, setList] = useState( {
    id: nanoid(),
    title: "",
    items: []
  } );

  useEffect( () => {
    if(list.title !== "") {
      lists.find( ele => ele.id === list.id ) 
        ? setLists( pre => pre.map( ele => ele.id === list.id ? list : ele ) )
        : setLists( pre => [...pre, list] );
    }
  }, [list] );

  useEffect( () => {
    localStorage.setItem("lists", JSON.stringify(lists));

    lists.find( item => item.id === list.id ) ?
      setList(lists.find(item => item.id === list.id)) :
      setList({ id: nanoid(), title: "", items: []});

  }, [lists] );

  function editList(id, title, items) {
    setList( { id, title, items });
  }

  function delList(id) {
    setLists( pre => pre.filter( list => list.id !== id ) );
  }

  function editListTitle(id, title) {
    setLists( pre => pre.map( list => (list.id === id) ? {...list, title} : list) );
  }

  return (
    <Container className="pt-5">
      <Row>
        <List 
          list={list}
          lists={lists}
          editList={editList}
          delList={delList}
        />
        <Lists
          lists={lists}
          editList={editList}
          delList={delList}
          editListTitle={editListTitle}
        />
      </Row>
    </Container>
  )
}

export default App;
