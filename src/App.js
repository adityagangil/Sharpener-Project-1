import React, { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (retrying) {
      const retryInterval = setInterval(() => {
        console.log('Retrying...');
        fetchMovies();
      }, 5000);

      return () => clearInterval(retryInterval);
    }
  }, [retrying]);

  async function fetchMovies() {
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
  }

  function cancelRetry() {
    setRetrying(false);
  }

  return (
    <React.Fragment>
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
        {!isLoading && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
