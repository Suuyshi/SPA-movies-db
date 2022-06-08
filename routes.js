

const route = (event, id) => {
    //console.log('start routing')
    
    event = event || window.event;
    //this will prevent the anchor from performing its default behavior
    //of navigating to the link in the url.
    event.preventDefault();
    //event.stopPropagation();
    //to update the url on the browser
    var media = localStorage.getItem('mediatype');
    //console.log(media);
    //console.log(history);
    if(id)  history.pushState(id, '', (media + '/' + id))
    if(!id) history.replaceState(null, '', '/' + media)
    
    
    
}


//will loop over this array to show the right markups
// const routes = [
//     {path : '/home' , class : Home },
//     {path: '/movies', class: Movies},
//     {path: '/tv-series', class: TVseries},
//     {path: '/Celeberities', class: People},
//     {path: '/MovieDetails', class: MovieDetails},
//     {path: '/TVSeriesDetails', class: TVseriesDetails},
//     {path: '/CelebertyDetails', class: CelebertyDetails},
// ]





window.route = route;