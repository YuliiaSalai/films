import { useState, useEffect } from "react";
import _find from "lodash/find";
import { Link, useHistory, useParams, Redirect } from "react-router-dom";
import UploadImage from "components/UploadImage";
import FormMessage from "components/FormMessage";
import setFormObj, {setFormErr} from "components/FormUtils";
import { useStateFilms, useSaveFilm } from "contexts/FilmContext";
import { useUserState } from "contexts/UserContext";

const initialData = {
  _id: null,
  title: "",
  img: "",
  description: "",
  director: "",
  price: "",
  duration: "",
  featured: false,
};

const FilmForm = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { _id } = useParams();

  const films = useStateFilms();
  const saveFilm = useSaveFilm();
  const user = useUserState();

  const isAdmin = user.token && user.role === "admin";

  useEffect(() => {
    const film = _find(films, { _id }) || {};
    if (film._id && film._id !== data._id) {
      setData(film);
      setErrors({});
    }
    if (!film._id && data._id) {
      setData(initialData);
      setErrors({})
    }
  }, [_id, data._id, films]);

  const updatePhoto = (img) => {
    setData((data) => ({ ...data, img }));
    setErrors((errors) => ({ ...errors, img: "" }));
  };

  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/[\+e-]/.test(keyValue)) e.preventDefault();
  };

  const validate = (data) => {
    const errors = {};
    if (!data.title) errors.title = "Title cannot be blank";
    if (!data.img) errors.img = "img cannot be blank";
    if (!data.description) errors.description = "description cannot be blank";
    if (!data.director) errors.director = "director cannot be blank";
    if (!data.duration) errors.duration = "duration cannot be blank";
    if (!data.price) errors.price = "price cannot be blank";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(data);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      saveFilm(data)
        .then(() => history.push("/films"))
        .catch((err) => {
          setErrors(err.response.data.errors);
          setLoading(false);
        });
    }
  };

  if (!isAdmin) {
    return <Redirect to="/films" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="film-form"
      data-testid="film-form"
      className={`ui form ${loading && "loading"}`}
    >
      <div className="ui grid mb-3">
        {/* two column row START */}
        <div className="two column row">
          {/* left  column  START */}
          <div className="ten wide column">
            {/* title START */}
            <div className={`field ${errors.title ? "error" : ""}`}>
              <label htmlFor="title">Film title</label>
              <input
                value={data.title}
                onChange={setFormObj(data, setData)}
                onInput={setFormErr(errors, setErrors)}
                type="text"
                name="title"
                id="title"
                placeholder="film title"
              />
              {errors.title && <FormMessage>{errors.title}</FormMessage>}
            </div>
            {/* title END */}
            {/* image field START */}
            <div className={`field img-grid ${errors.img ? "error" : ""}`}>
              <label htmlFor="img">Image</label>
              <input
                value={data.img}
                onChange={setFormObj(data, setData)}
                onInput={setFormErr(errors, setErrors)}
                name="img"
                id="img"
              />
              {errors.img && <FormMessage>{errors.img}</FormMessage>}
            </div>
            {/* image field END */}
            {/* description field START */}
            <div
              className={`column row field ${
                errors.description ? "error" : ""
              }`}
            >
              <label htmlFor="description">Film description</label>
              <textarea
                value={data.description}
                onChange={setFormObj(data, setData)}
                onInput={setFormErr(errors, setErrors)}
                name="description"
                id="description"
                placeholder="film description"
              ></textarea>
              {errors.description && (
                <FormMessage>{errors.description}</FormMessage>
              )}
            </div>
            {/* description field END */}
          </div>
          {/* left  column  END */}
          {/*  right column START */}
          <div className="six wide column">
            <UploadImage img={data.img} updatePhoto={updatePhoto} />
          </div>
          {/*  right column END */}
        </div>
        {/* two column row END */}

        {/* three column row START */}
        <div className="three column row">
          {/* director START */}
          <div className={`column field ${errors.director ? "error" : ""}`}>
            <label htmlFor="director">Director</label>
            <input
              value={data.director}
              onChange={setFormObj(data, setData)}
              onInput={setFormErr(errors, setErrors)}
              type="text"
              name="director"
              id="director"
              placeholder="film director"
            />
            {errors.director && <FormMessage>{errors.director}</FormMessage>}
          </div>
          {/* director END*/}
          {/* duration START */}
          <div className={`column field ${errors.duration ? "error" : ""}`}>
            <label htmlFor="duration">Duration</label>
            <input
              value={data.duration}
              onChange={setFormObj(data, setData)}
              onInput={setFormErr(errors, setErrors)}
              onKeyPress={handleKeyPress}
              min="1"
              step="0.01"
              type="number"
              name="duration"
              id="duration"
              placeholder="Duration"
            />
            {errors.duration && <FormMessage>{errors.duration}</FormMessage>}
          </div>
          {/* duration END */}
          {/* price START */}
          <div className={`column field ${errors.price ? "error" : ""}`}>
            <label htmlFor="price">Price</label>
            <input
              value={data.price}
              onChange={setFormObj(data, setData)}
              onInput={setFormErr(errors, setErrors)}
              onKeyPress={handleKeyPress}
              min="1"
              step="0.01"
              type="number"
              name="price"
              id="price"
              placeholder="price"
            />
            {errors.price && <FormMessage>{errors.price}</FormMessage>}
          </div>
          {/* price END */}
        </div>
        {/* three column row END */}

        {/* featured START */}
        <div className="six wide column inline field">
          <label htmlFor="featured">Featured</label>
          <input
            checked={data.featured}
            onChange={setFormObj(data, setData)}
            onInput={setFormErr(errors, setErrors)}
            type="checkbox"
            name="featured"
            id="featured"
          />
        </div>
        {/* featured END */}

        {/* Buttons START */}
        <div className="ui fluid buttons">
          <button className="ui button primary" type="submit">
            Save
          </button>
          <div className="or"></div>
          <Link to="/films" className="ui button">
            Hide form
          </Link>
        </div>
        {/* Buttons END */}
      </div>
      {/* END ui grid */}
    </form>
  );
};

export default FilmForm;
