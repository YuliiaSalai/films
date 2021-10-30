import { createContext, useContext, useState, useCallback } from "react";
import { prop, sortWith, ascend, descend } from "ramda";
import api from "api";

export const FilmsStateContext = createContext();
export const FilmsDispatchContext = createContext();

const sortFilms = (films) =>
  sortWith([descend(prop("featured")), ascend(prop("title"))], films);

export const FilmsContextProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  return (
    <FilmsStateContext.Provider value={films}>
      <FilmsDispatchContext.Provider value={setFilms}>
        {children}
      </FilmsDispatchContext.Provider>
    </FilmsStateContext.Provider>
  );
};

export const useStateFilms = () => {
  const films = useContext(FilmsStateContext);
  if (!films)
    throw Error("useStateFilms must be call withing FilmsContextProvider");

  return films;
};

export const useDispatchFilms = () => {
  const setFilms = useContext(FilmsDispatchContext);
  if (!setFilms)
    throw Error("useDispatchFilms must be call withing FilmsContextProvider");

  return setFilms;
};

export const useLoadFilms = () => {
  const setFilms = useDispatchFilms();
  const loadFilms = useCallback(() => {
    return api.films.fetchAll().then((films) => setFilms(sortFilms(films)));
  }, [setFilms]);
  return loadFilms;
};

export const useAddFilm = () => {
  const setFilms = useDispatchFilms();
  return function (filmData) {
    return api.films
      .create(filmData)
      .then((film) => setFilms((films) => sortFilms([...films, film])));
  };
};

export const useUpdateFilm = () => {
  const setFilms = useDispatchFilms();
  return function (filmData) {
    return api.films
      .update(filmData)
      .then((film) =>
        setFilms((films) =>
          sortFilms(films.map((f) => (f._id === film._id ? film : f)))
        )
      );
  };
};

export const useSaveFilm = () => {
  const addFilm = useAddFilm();
  const updateFilm = useUpdateFilm();
  return function (film) {
    return film._id ? updateFilm(film) : addFilm(film);
  };
};

export const useDeleteFilm = () => {
  const setFilms = useDispatchFilms();
  return function (film) {
    api.films
      .delete(film)
      .then(() =>
        setFilms((films) => sortFilms(films.filter((f) => f._id !== film._id)))
      );
  };
};

export const useToggleFeatured = () => {
  const updateFilm = useUpdateFilm();
  return function (film) {
    updateFilm({ ...film, featured: !film.featured });
  };
};
