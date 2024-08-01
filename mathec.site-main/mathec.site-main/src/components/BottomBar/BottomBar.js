import './BottomBar.css';
import { BsHouseDoor, BsPerson, BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const BottomBar = () => {
  return <div className='bottom-bar'>
    <div className="tile-bar">
      <Link to={'/'}>
        <BsHouseDoor size={35} />
      </Link>
    </div>
    <div className="tile-bar">
      <Link to={'/addquestion'}>

        <BsPlus size={50} />
      </Link>
    </div>
    <div className="tile-bar">
      <Link to={'/profile'}>

        <BsPerson size={35} />
      </Link>
    </div>
  </div>;
};

export default BottomBar;
