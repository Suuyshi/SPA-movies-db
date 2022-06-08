import { load} from "./index.js";
import { getDetails } from "./movie.js";
import { renderMovie } from "./movie.js";
import { renderTV } from "./tv.js";
import { renderPerson } from "./person.js";



/*default is to show all trending within the week */
export var mediaType = 'all';
export var timeWindow = 'week';

/*returns array of mediatype Els */
export var mediaTypeEls = document.getElementsByClassName('media-type');

/*returns array of timeWindow Els */
var timeWindowEls = document.getElementsByClassName('time-win')


/*number of items currently in the owl carousel */
var resultsNum =  0;


var results;

/*returns array of all medias in the current carousel */
export var mediaEls = document.getElementsByClassName('media-img');


/*images db url */
var imgUrldb = `https://image.tmdb.org/t/p/w500`;
/*api key */
var api_key = `0a9ba32e5caaf2ec25fc6e0d6baf30c5`;
/* url */
var url = `https://api.themoviedb.org/3/trending/` +
            `${mediaType}/` +
            `${timeWindow}` +
            `?api_key=${api_key}`;


     
onLoad();


/*owl carousel config */
var owl = $('.owl-carousel');
$(document).ready(function(){
    $(".owl-carousel").owlCarousel();
  });

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:30,
    // nav:true,
    autoplay: true,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    navText:" ",
    items: 4,
    // autoWidth:true
    // responsive:{
    //     0:{
    //         items:1
    //     },
    //     600:{
    //         items:3
    //     },
    //     1000:{
    //         items:5
    //     }
    // }
})


owl.click('.item',(e) => {
   
   //this is the whole item clicked
   const result = results.filter(item => {
       return item.id == e.target.id 
   })[0];
   //console.log(result.media_type);
   movieDetails(e, result.media_type)
});

function movieDetails(e, mediaType) {
    route(e, e.target.id);
    getDetails(e.target.id, mediaType);
    url = `https://api.themoviedb.org/3/` +
          `${mediaType}/` +
          `${e.target.id}` +
          `?api_key=${api_key}` +
          `&language=en-US`;
    console.log(url);
    switch(mediaType){
        case 'movie': load(url, renderMovie);
                      break;
        case 'tv': load(url, renderTV);
                   break;
        case 'person': load(url, renderPerson);
                       break;
    }
}
    

for (const mediaTypeEl of mediaTypeEls) {

    mediaTypeEl.addEventListener('click', (e) => {
        
        switch(e.target.innerText.toLowerCase()) {
            case 'home':        mediaType = 'all';
                                break;
            case 'movies':      mediaType = 'movie';
                                break;
            case 'tv-series':   mediaType = 'tv';
                                break;
            case 'celebrities': mediaType = 'person';
                                break;
        }
        

        localStorage.setItem('mediatype', mediaType);
        route(e, e.target.id);
        url = `https://api.themoviedb.org/3/trending/` +
              `${mediaType}/` +
              `${timeWindow}` +
              `?api_key=${api_key}`;
        
        clearCarousel();
        load(url, renderData);
    })
}

for (const timeWindowEl of timeWindowEls) {
    timeWindowEl.addEventListener('click', (e) => {
        console.log(e.target.innerText);
        timeWindow = e.target.innerText.toLowerCase();
        url = `https://api.themoviedb.org/3/trending/` +
        `${mediaType}/` +
        `${timeWindow}` +
        `?api_key=${api_key}`;
        clearCarousel();
        load(url, renderData);
    })
}


function clearCarousel() {
    //$('#popUpSlider').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
    for(var i=0; i<= resultsNum; i++) {
        $('.owl-carousel').trigger('remove.owl.carousel',0).trigger('refresh.owl.carousel');
    }
}


export function renderData(response) {
    document.getElementsByClassName('owl-carousel')[0].style.display = 'block';
    document.getElementById('media-container').style.display = 'none';
    document.getElementById("error-alert").style.display = 'none';


    switch(mediaType) {
        case 'movie':   renderMedias(response);
                        break;
        case 'tv': renderMedias(response);
                   break;
        case 'all': renderMedias(response);
                    break;
        
        case 'person':  renderPeople(response);
                        break;
        //default: renderMedias(response)
    }

    
}


function renderMedias(response) {
    
    document.getElementById("error-alert").style.display = 'none';
    results = response?.results;
    var resultsEl = '';


    // appends an item to the end
    if(results) {
        resultsNum = results.length;
        for (const result of results) {

            var posterImg = imgUrldb + '' + result.poster_path
            //var backdropImg = imgUrldb + '' + result.backdrop_path


        
            resultsEl = 
            `
            <div  id='${result.id}' class="item">
                <div class="medias">
                    <img class = "media-img" src='${posterImg}' id='${result.id}' alt='poster img' onerror="onImgError(this)"/>
                    
            `
            //badges part
            resultsEl += `
                    <div class='badges'>
                    `
            var genreNamesArr = []
            
            for(var i=0; i < result.genre_ids.length; i++) {
                genreNamesArr[i] = localStorage.getItem(result.genre_ids[i])
                switch(genreNamesArr[i]){
                    case 'Action', 'Adventure', 'Animation' :
                        resultsEl += 
                        `<div class="badge text-bg-warning">
                            ${genreNamesArr[i]}
                        </div>`;
                        break;
                    case 'Comedy', 'Crime', 'Documentary': 
                        resultsEl += 
                        `<div class="badge text-bg-primary">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                    case 'Drama', 'Family', 'Fantasy': 
                        resultsEl += 
                        `<div class="badge text-bg-success">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                    case 'History', 'Horror', 'Music': 
                        resultsEl += 
                        `<div class="badge text-bg-danger">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                    case 'Mystery', 'Romance', 'Science Fiction': 
                        resultsEl += 
                        `<div class="badge text-bg-info">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                    case 'TV Movie', 'Thriller': 
                        resultsEl += 
                        `<div class="badge text-bg-dark">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                    case 'War', 'Western': 
                        resultsEl += 
                        `<div class="badge text-bg-secondary">
                            ${genreNamesArr[i]}
                        </div>
                        `
                        break;
                }
                
            }

            //vote part
            if(result.vote_average === 0) {
                resultsEl += `
                        <div class='vote badge text-bg-danger'>
                            &#9733; Not Enough votes
                        </div>
                `
            }
            else {
                resultsEl += `
                        <div class='vote badge text-bg-danger'>
                            &#9733; ${result.vote_average}/10
                        </div>
                `
            }

            resultsEl +=
            `       </div>
                </div>
            </div>  
            `;

            owl.trigger('add.owl.carousel' , resultsEl).owlCarousel('update');
            // ANOTHER WAY TO APPEND: 
            // appends an item to the end of the owl carousel
            // $('.owl-carousel').owlCarousel('add', `${resultsEl}`).owlCarousel('update');
        }
    }

}

function renderPeople(response) {
    document.getElementById("error-alert").style.display = 'none';
    results = response?.results
    var resultsEl = '';


    // appends an item to the end
    if(results) {
        resultsNum = results.length;
        for (const result of results) {
            var posterImg = imgUrldb + '/' + result.profile_path
            //var backdropImg = imgUrldb + '' + result.backdrop_path

            resultsEl = 
            `
            <div class="item">
                <div class="person">
                    <img class="media-img" src='${posterImg}' id='${result.id}' media_type='${result.media_type}' alt='poster img' onerror="onImgError(this)"/>
                    
            `
            //name part
            resultsEl += `
                    <div class='person-name'>
                        <h3>${result.name}</h3>
                    </div>
                    `
           
            //badges part
            resultsEl += `
                    <div class='badges'>
                    `
            var genreNamesArr = []
            if(result.known_for.genre_ids) {
                for(var i=0; i < result.known_for.genre_ids.length; i++) {
                    genreNamesArr[i] = localStorage.getItem(result.known_for.genre_ids[i])
                    switch(genreNamesArr[i]){
                        case 'Action', 'Adventure', 'Animation' :
                            resultsEl += 
                            `<div class="badge text-bg-warning">
                                ${genreNamesArr[i]}
                            </div>`;
                            break;
                        case 'Comedy', 'Crime', 'Documentary': 
                            resultsEl += 
                            `<div class="badge text-bg-primary">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                        case 'Drama', 'Family', 'Fantasy': 
                            resultsEl += 
                            `<div class="badge text-bg-success">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                        case 'History', 'Horror', 'Music': 
                            resultsEl += 
                            `<div class="badge text-bg-danger">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                        case 'Mystery', 'Romance', 'Science Fiction': 
                            resultsEl += 
                            `<div class="badge text-bg-info">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                        case 'TV Movie', 'Thriller': 
                            resultsEl += 
                            `<div class="badge text-bg-dark">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                        case 'War', 'Western': 
                            resultsEl += 
                            `<div class="badge text-bg-secondary">
                                ${genreNamesArr[i]}
                            </div>
                            `
                            break;
                    }
                    
                }
            }
            

            //vote part
            if(result.popularity === 0) {
                resultsEl += `
                        <div class='vote badge text-bg-danger'>
                            &#9733; Not Enough votes
                        </div>
                `
            }
            else {
                resultsEl += `
                        <div class='vote badge text-bg-danger'>
                            &#9733; ${result.popularity}
                        </div>
                `
            }

            resultsEl +=
            `       </div>
                </div>
            </div>  
            `;

            owl.trigger('add.owl.carousel' , resultsEl).owlCarousel('update');
            // ANOTHER WAY TO APPEND: 
            // appends an item to the end of the owl carousel
            // $('.owl-carousel').owlCarousel('add', `${resultsEl}`).owlCarousel('update');
        }
    }

}

function onLoad() {
    localStorage.setItem('mediatype', mediaType);
    url = `https://api.themoviedb.org/3/trending/` +
            `${mediaType}/` +
            `${timeWindow}` +
            `?api_key=${api_key}`;
    
    //clearCarousel();
    load(url, renderData);
}

