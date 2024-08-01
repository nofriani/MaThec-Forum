import { useEffect } from "react";
import BoxTag from "../components/BoxTag";
import useTagStore from "../zustand/tagStore";

const Tag = () => {
  // const [data, setData] = useState();
  // const [isLoading, setIsLoading] = useState(false);
  const {
    data,
    isLoading,
    filterData,
    fetchData,
    countPage,
    page,
    row,
    setPage,
    setCountPage,
  } = useTagStore();
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <select className="btn btn-light p-1 card" onChange={handleChange}>
            <option value="5">5</option>
            <option value="10" selected>
              10
            </option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-light ms-1 card"
            onClick={() => filterData("tag_new")}
          >
            New
          </button>
          <button
            type="button"
            class="btn btn-light ms-1 card"
            onClick={() => filterData("tag_long")}
          >
            Long
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="vh-100 d-flex align-items-center justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {/* Content */}
      <div className="row mt-4">
        {data.length > 0 ?
          (data
            .filter(
              (_, index) => index >= page * row - row && index < page * row
            )
            .map((d) => (
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <BoxTag name={d.tag_name} />
                    <h4
                      className="mt-2"
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {d.title}
                    </h4>
                    <p
                      className="text-start"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {d.body.length > 100
                        ? d.body.substring(0, 90) + "..."
                        : d.body}
                    </p>
                  </div>
                </div>
              </div>
            ))) : (
              <h1 className="text-center">Data Not Found</h1>
            )}
      </div>

      <div className="d-flex gap-1">
        <div
          className="bg-white py-3 p-4 rounded"
          style={{ cursor: "pointer" }}
          onClick={handleDown}
        >
          {"<"}
        </div>
        {Array.from(
          { length: countPage !== 0 ? countPage : 1 },
          (_, index) => index + 1
        ).map((_, index) => (
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
        ))}
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

export default Tag;
