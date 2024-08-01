import { Link } from 'react-router-dom';
import homeIcon from '../images/home-outline.svg';
import chatBubbleIcon from '../images/chatbubble-outline.svg';

import personCircleIcon from '../images/person-circle-outline.svg';
import hashtag from '../images/hashtag.svg';
import savePostIcon from '../images/savePost.svg';
import { useEffect, useState } from 'react';
import useAuthStore from '../zustand/authStore';

const Sidebar = () => {
  const [popularTags, setPopularTags] = useState();
  const { isLogin } = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/tag/populer`, {
        headers: {
          'Content-Type': 'application/json'
          
        }});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setPopularTags(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div style={{ position: 'sticky', top: '140px' }}>
      <div className='card mb-3'>
        <div className='card-body px-4 py-4'>
          <div className='d-flex gap-4 flex-column'>
            <div className='d-flex gap-2 align-items-center'>
              <Link to={'/'} className='d-flex justify-content-center align-items-center gap-2' style={{ color: '#000', textDecoration: 'none' }}>
                <img className='icon-home' alt='Icon home' src={homeIcon} style={{ height: '30px' }} />

                <div
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  Home
                </div>
              </Link>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <Link to={'/allquestion'} className='d-flex justify-content-center align-items-center gap-2' style={{ color: '#000', textDecoration: 'none' }}>
                <img className='icon-home' alt='Icon home' src={chatBubbleIcon} style={{ height: '30px', marginLeft: '2px' }} />
                <div
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  Question
                </div>
              </Link>
            </div>

            {isLogin && (
              <div className='d-flex gap-2 align-items-center'>
                <Link to={'/users'} className='d-flex gap-2 align-items-center' style={{ color: '#000', textDecoration: 'none' }}>
                  <img className='icon-home' alt='Icon home' src={personCircleIcon} style={{ height: '30px', marginLeft: '4px' }} />
                  <div
                    style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Users
                  </div>
                </Link>
              </div>
            )}
            <div className='d-flex gap-2 align-items-center'>
              <Link to={'/tag'} className='d-flex gap-2 align-items-center' style={{ color: '#000', textDecoration: 'none' }}>
                <img className='icon-home' alt='Icon home' src={hashtag} style={{ height: '30px', marginLeft: '6px' }} />
                <div
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  Tag
                </div>
              </Link>
            </div>

            {isLogin && (
              <div className='d-flex gap-3 align-items-center'>
                <Link to={'/saved'} className='d-flex gap-2 align-items-center' style={{ color: '#000', textDecoration: 'none' }}>
                  <img className='icon-home' alt='Icon home' src={savePostIcon} style={{ height: '30px', marginLeft: '10px' }} />
                  <div
                    style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Saved
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='card mb-3'>
        <div className='card-body px-4 py-4'>
          <div className='d-flex gap-4 flex-column'>
            <div className='d-flex flex-column'>
              <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>Popular Tags</div>
              {popularTags &&
                popularTags.data.map((popularTag, index) => (
                  <div className='mb-3' key={index}>
                    <h5
                      className='mb-0'
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      # {popularTag.tag_name}
                    </h5>
                    <span
                      className='text-success'
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {popularTag.tag_count} Question
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
