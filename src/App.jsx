import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const App = () => {
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);

  // Load data from local storage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data')) || [];
    setData(storedData);
  }, []);

  // Save data to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const handleAdd = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;

    if (name && email) {
      const newItem = { id: data.length + 1, name, email };
      setData([...data, newItem]);
      clearForm();
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    nameRef.current.value = item.name;
    emailRef.current.value = item.email;
  };

  const handleUpdate = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;

    if (name && email) {
      const updatedData = data.map((item) =>
        item.id === editItem.id ? { ...item, name, email } : item
      );
      setData(updatedData);
      setEditItem(null);
      clearForm();
    }
  };

  const handleDelete = (id) => {
    const filteredData = data.filter((item) => item.id !== id);
    setData(filteredData);
  };

  const clearForm = () => {
    nameRef.current.value = '';
    emailRef.current.value = '';
  };

  return (
    <div className='container mt-5'>
      <div className="row">
        <div className="col-6 fw-bold">
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control className='border border-3 my-2' type="text" name="name" ref={nameRef} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control className='border border-3 my-2' type="email" name="email" ref={emailRef} />
            </Form.Group>
            <Button
              variant="primary" className='mt-3 fw-bold'
              onClick={editItem ? handleUpdate : handleAdd}
            >
              {editItem ? 'Update' : 'Add'}
            </Button>
            {editItem && (
              <Button variant="secondary" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
            )}
          </Form>
        </div>
        <div className="col-6">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <Button variant="warning" className='fw-bold mx-2' onClick={() => handleEdit(item)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" className='fw-bold mx-2' onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default App;