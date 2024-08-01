import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { useParams } from 'react-router-dom';
import useAnswerStore from '../zustand/answerStore';

const EditQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState([]);
  const { id } = useParams();
  const { isLoading, dateQuestionEdit, fetchEdit } = useAnswerStore();

  useEffect(() => {
    fetchEdit(id);
  }, [fetchEdit, id]);

  useEffect(() => {
    if (dateQuestionEdit) {
      setTitle(dateQuestionEdit.question.title);
      setBody(dateQuestionEdit.question.body);
      const tags = dateQuestionEdit.question.tags.map((item) => item.tag_name);
      setSelected(tags);
    }
  }, [dateQuestionEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));

    const question = {
      tags: selected,
      title,
      body,
      user_id: user.data.user_id,
    };
    const response = await fetch(process.env.REACT_APP_API_HOST + '/api/questions/' + id, {
      method: 'PUT',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    const json = await response.json();

    if (json.success) {
      await fetchEdit(id);
      setSuccess(true);
    }
  };

  // console.log(body);

  if (isLoading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='row mt-4 gap-2 justify-content-center'>
      <div className='col-md-12'>
        <div className='card'>
          <div className='card-body px-5'>
            {success === true && (
              <div className='alert alert-success'>
                Successfully change the question! 
              </div>
            )}
            <form className='formQuestion' onSubmit={(e) => handleSubmit(e)}>
              {/* <input type="text" /> */}
              <label htmlFor=''>Title</label>
              <input
                type='text'
                placeholder='Title'
                style={{ borderRadius: '5px', width: '100%' }}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className='mb-3'
              />
              {/* Tag Input */}
              <label htmlFor=''>Tag</label>
              <TagsInput value={selected} onChange={setSelected} addOnBlur={true} />
              <label htmlFor='' className='mt-3'>
                Isi
              </label>

              <ReactQuill
                value={body}
                onChange={(value) => setBody(value)}
                modules={{
                  toolbar: [
                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ font: [] }],
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],
                    [{ header: 1 }, { header: 2 }], // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [
                      { align: 'justify' },
                      { align: '' },
                      { align: 'center' },
                      { align: 'right' },
                      { direction: 'rtl' },
                      { color: [] },
                      { background: [] },
                    ], // text direction // dropdown with defaults from theme
                    ['link', 'image', 'video'],
                  ],
                }}
                theme='snow'
                className='text-editor'
              />

              <button
                style={{
                  width: '100px',
                  marginTop: '10px',
                  borderRadius: '10px',
                  border: 'none',
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
