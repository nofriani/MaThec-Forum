import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar';
import SidebarRight from '../components/SidebarRight';
import { useEffect, useState } from 'react';
import useAuthStore from '../zustand/authStore';
import BottomBar from '../components/BottomBar/BottomBar';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { isLogin, checkLogin } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      checkLogin();
    }, 11000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (checkLogin()) {
      if (['/auth'].includes(location.pathname)) {
        navigate('/');
      }
    }
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [checkLogin, isLogin, location.pathname, navigate]);

  if (loading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (
    ['/auth'].includes(location.pathname) ||
    location.pathname.includes('/forgot-password') ||
    location.pathname.includes('/kuesioner')
  ) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }
  return (
    <>
      <div>
        <div
          className='container-fluid pb-5'
          style={{
            height: '100%',
          }}
        >
          <div
            className='row'
            style={{ position: 'sticky', top: '0px', zIndex: 20 }}
          >
            <Navbar />
          </div>
          <div className='row mt-4 justify-content-center'>
            {location.pathname !== '/addquestion' && (
              <div
                className='col-md-2 col-md-1  md:hidden'
                style={{ position: 'sticky', top: '140px' }}
              >
                <Sidebar />
              </div>
            )}
            {['/addquestion', '/profile', '/editprofile'].includes(
              location.pathname
            ) || location.pathname.includes('/userinfo') ? (
              <main className='col-md-10'>{children}</main>
            ) : (
              <main className='col-md-8'>{children}</main>
            )}

            {!['/addquestion', '/profile', '/editprofile'].includes(
              location.pathname
            ) &&
              !location.pathname.includes('/userinfo') && (
                <div
                  className='col-lg-2 col-md-4 md:hidden'
                  style={{ position: 'sticky', top: '140px' }}
                >
                  <SidebarRight />
                </div>
              )}
          </div>
        </div>
        <footer
          className='px-5 d-flex justify-content-center text-center w-100'
          style={{ backgroundColor: '#fff', paddingTop: '.8em' }}
        >
          <div
            style={{
              width: '600px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
              }}
            >
              Mathematics and Technology discussion forum
              <br />
              Universitas Nahdlatul Ulama Al Ghazali Cilacap
              <br />
              Jl. Kemerdekaan Barat No.17, Kesugihan Kidul, Kec.Kesugihan,
              Kabupaten Cilacap, Jawa Tengah
            </span>
            <br />
            <div
              style={{
                fontSize: '12px',
                marginTop: '10px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              MaThec @2023
            </div>
          </div>
        </footer>
        <BottomBar />
      </div>
    </>
  );
}
