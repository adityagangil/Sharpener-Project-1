import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchMoviesHandler() {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Fetch Movies'}
        </button>
      </section>
      <section>
        {isLoading && <p>Loading...</p>}
        {!isLoading && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
