import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddQuestion from './pages/AddQuestion';
import AllQuestion from './pages/AllQuestion';
import Tag from './pages/Tag';
import Users from './pages/Users';
import Layout from './layouts/Layout';
import Profile from './pages/Profile';
import UserInfo from './pages/UserInfo';
import EditProfile from './pages/EditProfile';
import Saved from './pages/Saved';
import Auth from './pages/auth/Auth';
import DetailQuestion from './pages/DetailQuestion';
import TagByName from './pages/TagByName';
import EditQuestion from './pages/EditQuestion';
import Reset from './pages/Reset';
import ChanePassword from './pages/ChangePassword';
import EditAnswer from './pages/EditAnswer';
import Quesioner from './pages/Quesioner';

const App = () => {
  return (
    <Layout>
      <div style={{ height: '100%' }}>
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route path='/allquestion' element={<AllQuestion />}></Route>
          <Route path='/tag' element={<Tag />}></Route>
          <Route path='/reset' element={<Reset />}></Route>
          <Route path='/forgot-password' element={<ChanePassword />}></Route>
          <Route path='/tag/:name' element={<TagByName />}></Route>
          <Route path='/detailquestion/:id' element={<DetailQuestion />}></Route>
          <Route path='/auth' element={<Auth />}></Route>
          <Route path='/addquestion' element={<AddQuestion />}></Route>
          <Route path='/editquestion/:id' element={<EditQuestion />}></Route>
          <Route path='/users' element={<Users />}></Route>
          <Route path='/userinfo/:id' element={<UserInfo />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/editprofile' element={<EditProfile />}></Route>
          <Route path='/saved' element={<Saved />}></Route>
          <Route path='/editanswer/:id' element={<EditAnswer />}></Route>
          <Route path='/kuesioner' element={<Quesioner />}></Route>
        </Routes>
      </div>
    </Layout>
  );
};

export default App;
