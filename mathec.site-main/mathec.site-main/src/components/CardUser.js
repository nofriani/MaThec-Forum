import { Link } from "react-router-dom";

export default function Card({ info }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="col-md-6 col-sm-12 col-xs-12">
      <Link
        to={user.data.user_id === info.id ? `/profile` : `/userinfo/${info.id}`}
        className="text-decoration-none"
      >
        <div
          className="card d-flex flex-row py-4 px-5 justify-content-start align-items-center gap-4 shadow p-3 mb-5"
          style={{ borderRadius: "3px" }}
        >
          <div>
            {info.Profile.profile_picture == null ? (
              <img
                src={
                  "https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png"
                }
                alt=""
                style={{ width: "80px", height: "80px", borderRadius: "100%" }}
              />
            ) : (
              <img
                src={`${process.env.REACT_APP_API_HOST}/${info.Profile.profile_picture}`}
                alt=""
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <div className="d-flex flex-column justify-content-center">
            <h5 className="mb-3">{info.name}</h5>
            {/* <p className='m-0 text-start text-secondary' style={{ fontSize: '14px' }}>
              {info.Profile.address}
            </p> */}
            <p
              className="m-0 text-start text-secondary fst-italic"
              style={{ fontSize: "14px" }}
            >
              {info.Questions.length} question
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
