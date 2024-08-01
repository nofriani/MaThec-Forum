const DetailData = ({ question }) => {
  const inputDate = new Date(question.posted_at);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return (
    <div className='card mb-4 w-100'>
      <div className='card-body'>
        <div className='d-flex gap-3  p-3'>
          <div className=''>
            <img
              style={{ width: '50px', height: '50px', borderRadius: '100%', objectFit: 'cover' }}
              src={question.profile_picture === null ? 'https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png' : process.env.REACT_APP_API_HOST + '/' + question.profile_picture}
              alt=''
            />
          </div>
          <div className=''>
            <h5>{question.title}</h5>
            <div className='d-flex gap-5'>
              <div>{question.uploader}</div>
              <div>{inputDate.toLocaleDateString('id-ID', options)}</div>
            </div>
            <div className='d-flex'>
              <div>{question.viewer_total} views</div>
            </div>
            <div className='d-flex gap-2 mt-2'>{question.tags && question.tags.map(tag => <button className='btn btn-outline-primary text-capitalize'>{tag.tag_name}</button>)}</div>
            <div className='mt-4'>
              {/* <p className="text-start">{parse(question.body)}</p> */}
              <div dangerouslySetInnerHTML={{ __html: question.body }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailData;
