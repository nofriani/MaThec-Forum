import { Link } from 'react-router-dom';

const BoxTag = ({ name }) => {
  // function getRandomColor() {
  //   const classColor = ['alert-success', 'alert-warning', 'alert-info'];
  //   const randomIndex = Math.floor(Math.random() * classColor.length);
  //   const valueClass = classColor[randomIndex];
  //   return valueClass;
  // }
  // const randomClass = getRandomColor();
  return (
    <Link
      to={'/tag/' + name}
      className={`alert alert-success`}
      style={{
        // border: '1px solid rgba(226, 49, 255, 1)',
        height: '100%',
        textDecoration: 'none',
        // color: 'rgba(226, 49, 255, 1)',
        // background: 'rgba(226, 49, 255, .2)',
        borderRadius: '5px',
        padding: '2px 10px',
        marginTop: '10px',
        marginRight: '10px',
      }}
    >
      #{name}
    </Link>
  );
};

export default BoxTag;
