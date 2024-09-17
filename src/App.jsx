import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Modal, Row, Table, Form } from 'react-bootstrap';

const App = () => {
  const [student, setStudent] = useState({});
  const [list, setList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedList = JSON.parse(sessionStorage.getItem('list')) || [];
    setList(storedList);
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleValidation = () => {
    let tempErrors = {};
    if (!student.userName) tempErrors.userName = "User Name required";
    if (!student.email) tempErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(student.email)) tempErrors.email = "Invalid Email";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length !== 0;
  };

  const submitForm = () => {
    if (handleValidation()) return;
    const newList = editIndex >= 0 ? list.map((item, index) => index === editIndex ? student : item) : [...list, student];
    setList(newList);
    sessionStorage.setItem('list', JSON.stringify(newList));
    setStudent({});
    setErrors({});
    setEditIndex(-1);
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setStudent(list[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const filteredList = list.filter((_, i) => i !== index);
    setList(filteredList);
    sessionStorage.setItem('list', JSON.stringify(filteredList));
  };

  return (
    <Container className='py-4'>
      <Row className='mb-4 justify-content-around'>
        <Col md={4}>
          <Form onSubmit={(e) => e.preventDefault()} className="border rounded-3 px-3 py-2">
            <h3>User Form</h3>
            <Form.Group className="mb-3">
              <Form.Control type="text" name="userName" placeholder="Enter name" value={student.userName || ""} onChange={handleInput} />
              {errors.userName && <div className="text-danger">{errors.userName}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="email" name="email" placeholder="Enter email" value={student.email || ""} onChange={handleInput} />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </Form.Group>
            <Button variant="success" onClick={submitForm}>Submit</Button>
          </Form>
        </Col>
        <Col md={6}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((val, index) => (
                <tr key={index}>
                  <td>{val.userName}</td>
                  <td>{val.email}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" name="userName" value={student.userName || ""} onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={student.email || ""} onChange={handleInput} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={submitForm}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;
