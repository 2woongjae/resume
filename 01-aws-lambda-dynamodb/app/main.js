import * as movie from './movie';
import * as wall from './wall';

function main(event, context) {

  Promise.resolve(event)
         .then(e => {

           const operation = e.operation;
           const payload = e.payload;

           if (operation === 'setMovie') return movie.setMovie(payload);
           else if (operation === 'getMovie') return movie.getMovie(payload);
           else if (operation === 'getMovies') return movie.getMovies(); 
           else if (operation === 'searchMovies') return movie.searchMovies(payload); 
           else if (operation === 'setWall') return wall.setWall(payload); 
           else if (operation === 'getWalls') return wall.getWalls(); 
           else if (operation === 'getLastWall') return wall.getLastWall(); 
         
         })
         .then(context.succeed)
         .catch(context.fail);

}

export default main;