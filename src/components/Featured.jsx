import PropTypes from "prop-types";
import { useToggleFeatured } from "contexts/FilmContext";

const Featured = ({ film }) => {
  const toggle = useToggleFeatured();
  const cls = film.featured ? "yellow" : "empty";

  return (
    <span onClick={() => toggle(film)} className="ui right corner label">
      <i className={`star icon ${cls}`} />
    </span>
  );
};

Featured.propTypes = {
  film: PropTypes.object.isRequired,
};

Featured.defaultProps = {
  film: {},
};

export default Featured;
