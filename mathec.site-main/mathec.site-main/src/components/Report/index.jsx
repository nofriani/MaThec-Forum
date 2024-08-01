import { useEffect, useState } from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ReportModal({ to, id, show, setShow }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    jenis_laporan: 'bersifat sara',
    deskripsi: '',
    bukti_laporan: '',
    pelapor_id: '',
  });
  const [file, setFile] = useState();
  const [showInput, setShowInput] = useState(false);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  const handleClose = () => {
    setShow(false);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    for (const key in form) {
      if (form[key] === 'other' && key === 'jenis_laporan') {
        if (form['jenis_pelanggaran'] !== undefined) {
          formData.append('jenis_laporan', form['jenis_pelanggaran']);
        }
      } else {
        formData.append(key, form[key]);
      }
    }

    if (file) {
      formData.append('file', file);
    }
    setLoading(true);
    const resp = await fetch(process.env.REACT_APP_API_HOST + '/api/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
      body: formData,
    });
    const response = await resp.json();
    if (response.success) {
      setTimeout(() => {
        setLoading(false);
        handleClose();
        setForm(prevstate => ({
          ...prevstate,
          jenis_laporan: 'bersifat sara',
          deskripsi: '',
        }));
        setFile(null);
      }, 500);
    } else {
      setLoading(false);
      setError(response.message);
    }
  };

  useEffect(() => {
    if (form.jenis_laporan === 'other') {
      setShowInput(prev => true);
    } else {
      setShowInput(prev => false);
    }
  }, [form]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (to === 'answer') {
        setForm(prevstate => {
          return { ...prevstate, pelapor_id: user.data.user_id, answer_id: id };
        });
      } else if (to === 'question') {
        setForm(prevstate => {
          return { ...prevstate, pelapor_id: user.data.user_id, question_id: id };
        });
      } else if (to === 'user') {
        setForm(prevstate => {
          return { ...prevstate, pelapor_id: user.data.user_id, terlapor_id: id };
        });
      }
    }
  }, [id, to]);

  if (!user) {
    return (
      <Modal show={show} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title id='contained-modal-title-vcenter'>Tidak dapat menambah laporan</Modal.Title>
        </Modal.Header>
        <Modal.Body>Anda belum melakukan login, Silahkan login terlebih dahulu</Modal.Body>
        <Modal.Footer>
          <button type='submit' className='btn btn-secondary' onClick={handleClose}>
            close
          </button>
          <Link to={'/auth'} className='btn btn-primary'>
            Login
          </Link>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title id='contained-modal-title-vcenter'>Form Pelaporan</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className='alert alert-warning'>{error}</div>}

          <Form.Group className='mb-3'>
            <Form.Label>Jenis Pelanggaran</Form.Label>
            <Form.Select
              aria-label='Default select example'
              onChange={e =>
                setForm(prevstate => {
                  return { ...prevstate, jenis_laporan: e.target.value };
                })
              }
              value={form.jenis_laporan}
            >
              <option>Pilih Jenis Pelanggaran</option>
              <option value='bersifat sara'>Bersifat Sara</option>
              <option value='bersifat pornografi'>Bersifat Pornografi</option>
              <option value='bersifat spam'>Bersifat Spam</option>
              <option value='bersifat politik'>Bersifat Politik</option>
              <option value='bersifat provokatif'>Bersifat Provokatif</option>
              <option value='other'>isi sendiri</option>
            </Form.Select>
          </Form.Group>
          {showInput && (
            <Form.Group className='mb-3' aria-label='Default select example'>
              <Form.Label>Jenis Pelanggaran</Form.Label>
              <Form.Control onChange={e => setForm(prev => ({ ...prev, jenis_pelanggaran: e.target.value }))} />
            </Form.Group>
          )}
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              onChange={e =>
                setForm(prevstate => {
                  return { ...prevstate, deskripsi: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Bukti</Form.Label>
            <Form.Control type='file' onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button type='submit' className='btn btn-primary'>
            {loading ? (
              <Spinner animation='border' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            ) : (
              'Laporkan'
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
