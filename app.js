const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();
app.use(express.json());

let database = null;

const intializeDbAndServer = async () => {
  try {
    database = await open({
      fileName: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => console.log("server running"));
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

intializeDbAndServer();

const convertMovieObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDirectorObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
     SELECT
     movie_name
     FROM
     movie;`;
  const moviesArray = await database.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({
      movieName: eachMovie.movie_name,
    }))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
    INSERT INTO
    movie(director_id, movie_name, lead_actor)
    VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

