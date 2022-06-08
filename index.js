import { mediaType, timeWindow } from "./home.js";
import { renderMovie} from "./movie.js";
import { renderTV } from "./tv.js";
import { renderPerson } from "./person.js";


/* url */
var url = `https://api.themoviedb.org/3/trending/` +
            `${mediaType}/` +
            `${timeWindow}` +
            `?api_key=${api_key}`;

/*api key */
var api_key = `0a9ba32e5caaf2ec25fc6e0d6baf30c5`




   


/*call function to save the genre ids with their 
respective names in the localstorage */
getGenres();



//get genre list and save it in localStorage once
function getGenres() {
    if(mediaType === 'all') {
        url = `https://api.themoviedb.org/3/` +
            `genre/` +
            `movie/` +
            `list` +
            `?api_key=${api_key}` +
            `&language=en-US`;
    }
    else {
        url = `https://api.themoviedb.org/3/` +
            `genre/` +
            `${mediaType}/` +
            `list` +
            `?api_key=${api_key}` +
            `&language=en-US`;
    }
    

    fetch(url)
    .then(response => response.json())
    .then(data => saveGenres(data))
    .catch(error => renderError(error));
}




export function load(url, render){
    
    fetch(url)
    .then(response => response.json())
    .then(data => render(data))
    .catch(error => renderError(error));
}



function renderError(error) {
    console.log(error);
    document.getElementById('error-alert').style.display = 'block';
    var body = `
    <div class="alert alert-danger">
        <strong>Error!</strong> ${error}.
    </div>`
    document.getElementById("error-alert").innerHTML = body;
}


/*takes response of genres list and saves it in localStorage */
function saveGenres(response) {
    var genres = response.genres;
    for (const genre of genres) {
        localStorage.setItem(genre.id, genre.name);
    }
}



