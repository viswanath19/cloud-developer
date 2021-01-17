import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/filteredimage/", async (req, res) => {
    try {
      let { image_url } = req.query;
      let { lower } = req.query;
      let { upper } = req.query;

      // Check if the user has entered any query parameter
      if (!image_url) {
        return res.status(422)
          .send({error: 'Please specify image_url as query parameter'});
      }

      // If we have a query parameter, check if it is a valid url
      if(!validUrl.isUri(image_url)){
        return res.status(415).send({error: 'Please enter a valid url'});
      }

      // Process the image
      let imgPath = await filterImageFromURL(image_url);
      if(imgPath) {
        const newPath = await findEdges(imgPath, lower, upper);
        res.on('finish', () => deleteLocalFiles([imgPath, newPath.trim()]));
        return res.status(200).sendFile(newPath.trim());
      } else {
        return res.status(500).send({error: 'Unable to elaborate your image'});
      }
    } catch {
      return res.status(500).send({error: 'Unable to process your request'})
    }
  });
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
