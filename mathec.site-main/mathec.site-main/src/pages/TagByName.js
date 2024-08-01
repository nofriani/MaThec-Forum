import { useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionsData from "../components/QuestionsData";
import useTagStore from "../zustand/tagStore";

const TagByName = () => {
  const { name } = useParams();
  const {
    questions,
    getQuestionByTag,
    isLoading,
    onLike,
    onDislike,
    onSaved,
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
    getQuestionByTag(name);
  }, [getQuestionByTag, name]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h4>
            Tag <span className="text-primary">#{name}</span>
          </h4>
        </div>
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
      </div>
      {isLoading ? (
        <div className="vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        questions.length > 0 ? (
          questions
            .filter((_, index) => index >= page * row - row && index < page * row)
            .map((question, index) => (
              <QuestionsData
                key={index}
                question={question}
                onLike={onLike}
                onDislike={onDislike}
                onSave={onSaved}
                name={name}
              />
            ))
        ) : (
          <h1 className="text-center">Data Not Found</h1>
        )
      )}

      <div className="d-flex gap-1">
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

export default TagByName;
