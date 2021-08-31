import React, { useEffect, useState } from "react";
import Header from '../../common/header/Header'
import './home.css'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const Home = function (props) {
    const [movieName, setMovieName] = useState([]);
    const [upcomingmovies, setupcomingMovies] = useState([]);
    const [releasedmovies, setreleasedmovies] = useState([]);
    const [genres, setgeneres] = useState([]);
    const [genresList, setgeneresList] = useState([]);
    const [artists, setartists] = useState([]);
    const [artistsList, setartistsList] = useState([]);
    const [releaseDateStart, setreleaseDateStart] = useState('');
    const [releaseDateEnd, setreleaseDateEnd] = useState('');
    function loadUpcomingMovies() {
        fetch(props.baseUrl + "movies?status=PUBLISHED")
            .then(input => input.json())
            .then(data => setupcomingMovies(data.movies))
    }
    function loadReleasedMovies() {
        fetch(props.baseUrl + "movies?status=RELEASED")
            .then(input => input.json())
            .then(data => setreleasedmovies(data.movies))
    }
    function loadGenres() {
        fetch(props.baseUrl + "genres")
            .then(input => input.json())
            .then(data => setgeneresList(data.genres))
    }
    function loadArtist() {
        fetch(props.baseUrl + "artists")
            .then(input => input.json())
            .then(data => setartistsList(data.artists))
    }

    useEffect(() => {
        loadUpcomingMovies();
        loadReleasedMovies();
        loadGenres();
        loadArtist();
    }, [setreleasedmovies])
   
    function movieNameChangeHandler(e) {
        setMovieName(e.target.value);
    }

    function genreSelectHandler(e) {
        setgeneres(e.target.value);
    }

    function artistSelectHandler(e) {
        setartists(e.target.value);
    }

    function releaseDateStartHandler(e) {
        setreleaseDateStart(e.target.value);
    }

    function releaseDateEndHandler(e) {
        setreleaseDateEnd(e.target.value);
    }
    function filterApplyHandler() {
        debugger;
        let queryString = "?status=RELEASED";
        if (movieName !== "") {
            queryString += "&title=" + movieName;
        }
        if (genres.length > 0) {
            queryString += "&genres=" + genres.toString();
        }
        if (artists.length > 0) {
            queryString += "&artists=" + artists.toString();
        }
        if (releaseDateStart !== "") {
            queryString += "&start_date=" + releaseDateStart;
        }
        if (releaseDateEnd !== "") {
            queryString += "&end_date=" + releaseDateEnd;
        }

        fetch(props.baseUrl + "movies"+queryString)
            .then(input => input.json())
            .then(data => setreleasedmovies(data.movies))
    }

    function movieClickHandler(id){
        debugger;
        props.history.push('/movie/' + id);
    }
    return (
        <div>
            <Header baseUrl={props.baseUrl}></Header>
            <div className="heading">
                <span>Upcoming Movies</span>
            </div>
            <GridList cols={5} style={{ flexWrap: 'nowrap' }}>
                {upcomingmovies.map(movie => (
                    <GridListTile key={"upcoming" + movie.id}>
                        <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                        <GridListTileBar title={movie.title} />
                    </GridListTile>
                ))}
            </GridList>
            <div className="flex-container">
                <div className="left">
                    <GridList cellHeight={350} cols={4} className="gridListMain">
                        {releasedmovies.map(movie => (
                            <GridListTile onClick={()=>movieClickHandler(movie.id)} className="released-movie-grid-item" key={"grid" + movie.id}>
                                <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                                <GridListTileBar
                                    title={movie.title}
                                    subtitle={<span>Release Date: {new Date(movie.release_date).toDateString()}</span>}
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <div className="right">
                    <Card>
                        <CardContent>
                            <FormControl className="formControl">
                                <Typography className="title" color="textSecondary">
                                    FIND MOVIES BY:
                                </Typography>
                            </FormControl>

                            <FormControl className="formControl">
                                <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                                <Input id="movieName" onChange={movieNameChangeHandler} />
                            </FormControl>

                            <FormControl className="formControl">
                                <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                <Select
                                    multiple
                                    input={<Input id="select-multiple-checkbox-genre" />}
                                    renderValue={selected => selected.join(',')}
                                    value={genres}
                                    onChange={genreSelectHandler}
                                >
                                    {genresList.map(genre => (
                                        <MenuItem key={genre.id} value={genre.genre}>
                                            <Checkbox checked={genres.indexOf(genre.genre) > -1} />
                                            <ListItemText primary={genre.genre} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="formControl">
                                <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                <Select
                                    multiple
                                    input={<Input id="select-multiple-checkbox" />}
                                    renderValue={selected => selected.join(',')}
                                    value={artists}
                                    onChange={artistSelectHandler}>
                                    {artistsList.map(artist => (
                                        <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                            <Checkbox checked={artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                            <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="formControl">
                                <TextField
                                    id="releaseDateStart"
                                    label="Release Date Start"
                                    type="date"
                                    defaultValue=""
                                    InputLabelProps={{ shrink: true }}
                                    onChange={releaseDateStartHandler}
                                />
                            </FormControl>

                            <FormControl className="formControl">
                                <TextField
                                    id="releaseDateEnd"
                                    label="Release Date End"
                                    type="date"
                                    defaultValue=""
                                    InputLabelProps={{ shrink: true }}
                                    onChange={releaseDateEndHandler}
                                />
                            </FormControl>
                            <br /><br />
                            <FormControl className="formControl">
                                <Button onClick={filterApplyHandler} variant="contained" color="primary">
                                    APPLY
                                </Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Home