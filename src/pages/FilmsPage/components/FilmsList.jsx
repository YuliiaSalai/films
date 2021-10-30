import { memo, useState, useEffect } from "react";
import FilmCard from "pages/FilmsPage/components/FilmCard";
import Message from "components/Message";
import { useStateFilms, useLoadFilms } from "contexts/FilmContext";
import { FullSpinner } from "styles/app";

const FilmsList = () => {
  const [loading, setLoading] = useState(true);
  const films = useStateFilms();
  const loadFilms = useLoadFilms();

  useEffect(() => {
    async function load() {
      await loadFilms();
      setLoading(false);
    }
    load();
  }, [loadFilms]);

  if (loading) {
    return <FullSpinner />;
  }

  return (
    <div className="ui four cards">
      {films.length === 0 ? (
        <Message>No fims yet in our database</Message>
      ) : (
        films.map((film) => <FilmCard key={film._id} film={film} />)
      )}
    </div>
  );
};

FilmsList.defaultProps = {
  films: [],
};

export default memo(FilmsList);
