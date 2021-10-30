import { useParams } from "react-router-dom";
import { FullSpinner } from "styles/app";
import { useFetchFilm } from "hooks/films";

const FilmsDetails = () => {
  const { id } = useParams();
  const {data:film, isLoading, isSuccess, isError} = useFetchFilm(id);

  return (
    <>
      {isLoading ? (
        <FullSpinner />
      ) : isError ? (
        <p>Error</p>
      ) : isSuccess ? (
        <div className="ui grid">
          <div className="four wide column">
            <img src={film.img} alt={film.title} />
          </div>

          <div className="ten wide column">
            <h3 className="header">{film.title}</h3>
            <p>{film.description}</p>
            <p>
              <i className="icon users" /> Director: {film.director}
            </p>
            <p>
              <i className="icon hourglass" /> Duration: {film.duration} min
            </p>
            <p>
              <i className="icon dollar sign" />
              Price: $ {film.price}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FilmsDetails;
