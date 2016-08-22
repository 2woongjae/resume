const AWS = require("aws-sdk");
AWS.config = {region: 'ap-northeast-2'};
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const client = new AWS.DynamoDB.DocumentClient();

const getWalls = () => {

  /*
  {
    "operation": "getWalls"
  }
  */

  return Promise.resolve()
                .then(getAllWalls);

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

const getLastWall = () => {

  /*
  {
    "operation": "getLastWall"
  }
  */

  return Promise.resolve()
                .then(getAllWalls)
                .then(items => items[0]);

}

const setWall = (payload) => {

  /*
  {
    "operation": "setWall",
    "payload": {

    }
  }
  */

  return Promise.resolve()
                .then(getAllWalls)
                .then(data => {

                  const wall = payload;

                  wall.id = (data.length > 0) ? (data[0].id + 1) : 1;
           
                  return Promise.resolve({
                                           TableName: 'lotte_wall',
                                           Item: wall
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

const getAllWalls = () => {

  const params = {
    TableName: 'lotte_wall',
  };

  return new Promise((resolve, reject) => {

    client.scan(params, function(err, data) {
   
       if (err) reject(err);
       else {

         const items = data.Items;

         items.sort((left, right) => {
    
           return right.id - left.id;
  
         }); 

         resolve(items);

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

export {setWall, getLastWall, getWalls};