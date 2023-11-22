import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const [newMovie, setNewMovie] = useState({
    title: '',
    openingText: '',
    releaseDate: '',
  });

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Something went wrong... Retrying');
      setRetrying(true);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const cancelRetry = useCallback(() => {
    setRetrying(false);
  }, [setRetrying]);

  const moviesList = useMemo(() => <MoviesList movies={movies} />, [movies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const addMovieHandler = () => {
    console.log('New Movie Object:', newMovie);

    // Here you can send the new movie data to the backend or update the movies state.
    // For simplicity, we are just logging it to the console.
  };

  return (
    <React.Fragment>
      <section>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newMovie.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="openingText">Opening Text:</label>
          <input
            type="text"
            id="openingText"
            name="openingText"
            value={newMovie.openingText}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="releaseDate">Release Date:</label>
          <input
            type="text"
            id="releaseDate"
            name="releaseDate"
            value={newMovie.releaseDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button onClick={addMovieHandler}>Add Movie</button>
        </div>
      </section>
      <section>
        <button onClick={fetchMovies} disabled={isLoading || retrying}>
          {isLoading ? 'Fetching...' : 'Fetch Movies'}
        </button>
        {retrying && (
          <button onClick={cancelRetry} style={{ marginLeft: '10px' }}>
            Cancel Retry
          </button>
        )}
        {error && <p>{error}</p>}
      </section>
      <section>
        {isLoading && <p>Loading...</p>}
        {!isLoading && movies.length === 0 && <p>No movies found.</p>}
        {!isLoading && movies.length > 0 && moviesList}
      </section>
    </React.Fragment>
  );
}

export default App;
