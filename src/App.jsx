import React,{useEffect,useState} from 'react'
import Search from './components/Search'



const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm , setSearchTerm] = React.useState('')
  const [movieList, setmovieList] = useState([]);
  const [errorMessage, seterrorMessage] = useState('');
  const [isLoading, setisLoading] = useState(false)


  const fetchMovies = async() => {
  setisLoading(true);
  seterrorMessage('');

  try {
    const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS);
    const data = await response.json();

    // Check if the response indicates an error
    if (data.success === false || data.status_code) {
      seterrorMessage(data.status_message || 'Something went wrong');
      setmovieList([]);
    } else {
      // Most movie APIs return 'results' array
      setmovieList(data.results || []);
      seterrorMessage('');
    }
    console.log(data);
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    seterrorMessage('Failed to fetch movies');
    setmovieList([]);
  } finally {
    setisLoading(false);
  }
}

  useEffect(() => {
   fetchMovies();
  
  },[])
  
  return (
    <div className='wrapper'>
        <h1>Movie App</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h1>{searchTerm}</h1>
        <ul className="flex flex-wrap gap-5 list-none p-0 m-0">
  {movieList.map((movie) => (
    <li key={movie.id} className="flex-[0_0_calc(25%-15px)] min-w-[200px]">
      <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
      <img 
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'} 
        alt={movie.title}
        className="w-full h-auto rounded-lg"
      />
      <p className="mt-2 text-sm line-clamp-3">
        {movie.overview}
      </p>
    </li>
  ))}
</ul>
    </div>
  )
}

export default App