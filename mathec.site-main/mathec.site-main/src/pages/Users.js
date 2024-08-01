import { useEffect } from "react";
import Card from "../components/CardUser";
import useUserStore from "../zustand/usersStore";

const Users = () => {
  const {
    fetchDataUser,
    data,
    isLoading,
    filterData,
    countPage,
    page,
    row,
    setPage,
    setCountPage,
  } = useUserStore();

  const handleUp = () => {
    const total = page + 1;
    if (total <= countPage) {
      setPage(total);
    }
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleDown = () => {
    const total = page - 1;
    if (total >= 1) {
      setPage(total);
    }
  };

  const handleChange = (e) => {
    setCountPage(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <select className="btn btn-light p-1 card" onChange={handleChange}>
            <option defaultValue="5">5</option>
            <option defaultValue="10" selected>
              10
            </option>
            <option defaultValue="20">20</option>
            <option defaultValue="30">30</option>
            <option defaultValue="40">40</option>
            <option defaultValue="50">50</option>
          </select>
        </div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-light ms-1 card"
            onClick={() => filterData("new")}
          >
            New Users
          </button>
          <button
            type="button"
            className="btn btn-light ms-1 card"
            onClick={() => filterData("long")}
          >
            Long Users
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        // <div className='p-4 mt-5 rounded-3'>
        // </div>
        <div className="row mt-5 w-100 m-0 justify-content-between">
          {data.length > 0 ?
            (data
              .filter(
                (_, index) => index >= page * row - row && index < page * row
              )
              .map((user) => <Card key={user.id} info={user} />)) : (
              <p className="text-center">Data Not Found</p>
              )}
        </div>
      )}

      <div className="d-flex gap-1 mt-3">
        <div
          className="bg-white py-3 p-4 rounded"
          style={{ cursor: "pointer" }}
          onClick={handleDown}
        >
          {"<"}
        </div>
        {Array.from({ length: countPage }, (_, index) => index + 1).map(
          (_, index) => (
            <div
              key={index}
              className={`${
                index + 1 === page ? "bg-primary text-white" : "bg-white"
              } py-3 p-4 rounded`}
              style={{ cursor: "pointer" }}
              onClick={() => handlePage(index + 1)}
            >
              {index + 1}
            </div>
          )
        )}
        <div
          className="bg-white py-3 p-4 rounded"
          style={{ cursor: "pointer" }}
          onClick={handleUp}
        >
          {">"}
        </div>
      </div>
    </>
  );
};

export default Users;
