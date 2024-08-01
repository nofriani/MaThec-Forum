import { FiBookmark } from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";
import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaThumbsDown,
  FaRegThumbsDown,
} from "react-icons/fa";

const Action = ({
  type,
  question,
  onLike,
  onDislike,
  onSaved,
  className,
  name,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const checkSave = () => {
    if (user) {
      const filter = question.action.filter(
        (item) =>
          item.user_id === parseInt(user.data.user_id) &&
          item.type_judge === "saved",
      );
      if (filter.length !== 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const checkLike = () => {
    if (user) {
      const filter = question.action.filter(
        (item) =>
          item.user_id === parseInt(user.data.user_id) &&
          item.type_judge === "like",
      );
      if (filter.length !== 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const checkDislike = () => {
    if (user) {
      const filter = question.action.filter(
        (item) =>
          item.user_id === parseInt(user.data.user_id) &&
          item.type_judge === "dislike",
      );
      if (filter.length !== 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  if (type === "like") {
    return (
      <div
        className={"d-flex gap-1 " + className}
        style={{ cursor: "pointer" }}
        onClick={name ? () => onLike(question, name) : () => onLike(question)}
      >
        {checkLike() ? (
          <>
            <FaThumbsUp size={20} className="text-primary" />
            {question.like}
          </>
        ) : (
          <>
            <FaRegThumbsUp size={20} />
            {question.like}
          </>
        )}
      </div>
    );
  }

  if (type === "dislike") {
    return (
      <div
        className="d-flex gap-1"
        style={{ cursor: "pointer" }}
        onClick={
          name ? () => onDislike(question, name) : () => onDislike(question)
        }
      >
        {checkDislike() ? (
          <>
            <FaThumbsDown size={20} className="text-danger" />
            {question.dislike}
          </>
        ) : (
          <>
            <FaRegThumbsDown size={20} />
            {question.dislike}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="d-flex gap-1"
      style={{ cursor: "pointer" }}
      onClick={name ? () => onSaved(question, name) : () => onSaved(question)}
    >
      {checkSave() ? (
        <>
          <BsFillBookmarkFill size={20} />
          {question.vote_count}
        </>
      ) : (
        <>
          <FiBookmark size={20} />
          {question.vote_count}
        </>
      )}
    </div>
  );
};

export default Action;
