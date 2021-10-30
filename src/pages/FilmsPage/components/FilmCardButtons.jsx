import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDeleteFilm } from "hooks/films"

const SelectButton = ({ film }) => {
  return (
    <Link to={`/films/edit/${film._id}`} className="ui green basic button">
      <i className="ui icon edit"></i>
    </Link>
  );
};

const DeleteButton = ({ film }) => {
  const mutation = useDeleteFilm();
  return (
    <span onClick={() => mutation.mutate(film)} className="ui red basic button">
      <i className="ui icon check" /> YES
    </span>
  );
};

const FilmCardButtons = ({ film }) => {
  const [show, setShow] = useState(false);

  const showConfirm = () => setShow(true);
  const hideConfirm = () => setShow(false);

  const buttons = (
    <div data-testid="admin-buttons" className="ui two buttons">
      <SelectButton film={film} />
      <span onClick={showConfirm} className="ui red basic button">
        <i className="ui icon trash"></i>
      </span>
    </div>
  );

  const confirmButtons = (
    <div className="ui two buttons">
      <DeleteButton film={film} />
      <span onClick={hideConfirm} className="ui grey basic button">
        <i className="ui icon close" /> NO
      </span>
    </div>
  );

  return show ? confirmButtons : buttons;
};

FilmCardButtons.propTypes = {
  film: PropTypes.object.isRequired,
};

export default FilmCardButtons;
