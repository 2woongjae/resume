const AWS = require("aws-sdk");
AWS.config = {region: 'ap-northeast-2'};
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const client = new AWS.DynamoDB.DocumentClient();

const getMovies = () => {

  /*
  {
    "operation": "getMovies"
  }
  */

  return Promise.resolve()
                .then(getAllMovies);

}

const getMovie = (payload) => {

  /*
  {
    "operation": "getMovie",
    "payload": {
      "mid": "1"
    }
  }
  */

  return Promise.resolve(payload.mid)
                .then(getItem);

}

const setMovie = (payload) => {

  /*
  {
    "operation": "setMovie",
    "payload": {
      "title" : "그날의분위기 0118",
      "reg_date" : "20160118105032",
      "reg_id" : "jaro@vtouch.kr",
      "reg_ip" : "222.106.113.253",
      "poster_url" : "http://public.vtouchinc.com/lotte/poster/8f1cd386c40a3226994168466399b6a7.jpg",
      "video_url" : "http://public.vtouchinc.com/lotte/movie/29ff8c637d75e86f248204ee54bbf4aa.wmv"
    }
  }
  */

  return Promise.resolve()
                .then(getAllMovies)
                .then(data => {

                  const movie = payload;

                  movie.mid = (data.length > 0) ? (data[0].mid + 1) : 1;
           
                  return Promise.resolve({
                                           TableName: 'lotte_movie',
                                           Item: movie
                                         });

                })
                .then(putItem);

}

const searchMovies = (payload) => {

  /*
  {
    "operation": "searchMovies",
    "payload": {
      "text" : "그"
    }
  }
  */

  return Promise.resolve(payload.text)
                .then(searchAllMovies);

}

const getAllMovies = () => {

  const params = {
    TableName: 'lotte_movie',
  };

  return new Promise((resolve, reject) => {

    client.scan(params, function(err, data) {
   
       if (err) reject(err);
       else {

         const movies = data.Items;

         movies.sort((left, right) => {
    
           return right.mid - left.mid;
  
         }); 

         resolve(movies);

       }
    
    });

  });

}

const putItem = (e) => {

  return new Promise((resolve, reject) => {

    client.put(e, (err, data) => {
      
      if (err) reject(err);
      else resolve(e.Item);

    });

  });

}

const getItem = (mid) => {

  const params = {
    TableName: 'lotte_movie',
    KeyConditionExpression: 'mid = :mid',
    ExpressionAttributeValues: {
      ':mid': Number(mid),
    },
    Select: 'ALL_ATTRIBUTES'
  };

  return new Promise((resolve, reject) => {

    client.query(params, (err, data) => {

      if (err) reject(err);
      else {

        if (data.Items.length > 0) resolve(data.Items[0]);
        else resolve({});

      }

    });

  });

}

const searchAllMovies = (text) => {

  const params = {
    TableName: 'lotte_movie',
    ScanFilter: {
      title: {
        ComparisonOperator: 'CONTAINS',
        AttributeValueList: [text]
      }
    },
    Select: 'ALL_ATTRIBUTES'
  };

  return new Promise((resolve, reject) => {

    client.scan(params, function(err, data) {
   
       if (err) reject(err);
       else {

         const movies = data.Items;

         movies.sort((left, right) => {
    
           return right.mid - left.mid;
  
         }); 

         resolve(movies);

       }
    
    });

  });

}

export {getMovies, getMovie, setMovie, searchMovies};