import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import Link from 'next/link'
import { getUser } from "../services/authService.js";
import Head from 'next/head'
import Image from 'next/image'
import leagueStyles from '../css/modules/betting/league.module.css';
import matchStyles from '../css/modules/betting/match.module.css';
import Back from "../components/back.js";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
 
function StageLeague ({data}) {

    const [nav, setNav] = useState("oversigt");
    const [favorit, setFavorit] = useState(false);

    const [statistikker, setStatistikker] = useState({
        "goals": [],
        "cards": []
    })
    const [kampe, setKampe] = useState({
        "kommende": [],
        "seneste": []
    })
    const [leagueData, setLeagueData] = useState({
        league_id: 0,
        name: "",
        league: {
            data: {
                id: 0,
                logo_path: "",
                name: "",
                current_season_id: 0,
                country_id: 0
            }
        }
    })

    //Tjek om ligaen er favorit
    useEffect(() => {
        if (favorit === true) {
            document.getElementById("favorit").classList.add("favorit-active");
            document.getElementById("favorit-o").classList.remove("display");
            document.getElementById("favorit").classList.add("display");
        }
    }, [favorit])

    //API Call til liga
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        fetch("https://soccer.sportmonks.com/api/v2.0/seasons/" + urlParams.get('id') + "?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=cardscorers,cardscorers.player,cardscorers.team,assistscorers,goalscorers,goalscorers.team,goalscorers.player,league,stages,groups,results,fixtures.localTeam,fixtures.visitorTeam,fixtures:order(starting_at|desc)&tz=Europe/Copenhagen")
        .then(response => response.json())
        .then(function (data) {
            console.log("Sportmonks Liga: ", data);
            setLeagueData(data.data)

            if (typeof window !== 'undefined') {
                //Tjek om liga er favorit
                var favorit2 = [];
                if (localStorage.getItem("favoritter")) {
                    favorit2 = JSON.parse(localStorage.getItem("favoritter"));
                } else {
                    favorit2 = [];
                }
                for (var q in favorit2) {
                    if (favorit2[q].id === leagueData.league.data.current_season_id) {
                        setFavorit(true);
                    }
                }

                //Array for statistikker
                var topscorerArray = data.data.goalscorers.data;
                var assistArray = data.data.assistscorers.data;
                var cardArray = data.data.cardscorers.data;
                var mostgoalsArray = [];
                var mostAssistsArray = [];
                var mostCardsArray = [];
                for (var e in topscorerArray) {
                    if (topscorerArray[e].type === "goals") {
                        var mostGoalsIndex = mostgoalsArray.findIndex(obj => obj.player.data.fullname === topscorerArray[e].player.data.fullname);
                        if (mostGoalsIndex === -1) {
                            mostgoalsArray.push(topscorerArray[e]);
                        } else {
                            mostgoalsArray[mostGoalsIndex].goals = mostgoalsArray[mostGoalsIndex].goals + topscorerArray[e].goals;
                            mostgoalsArray[mostGoalsIndex].penalty_goals = mostgoalsArray[mostGoalsIndex].penalty_goals + topscorerArray[e].penalty_goals;
                        }
                    }
                }
                mostgoalsArray.sort((a, b) => {
                    return b.goals - a.goals;
                });
                for (var e in cardArray) {
                    if (cardArray[e].type === "cards") {
                        var mostCardsIndex = mostCardsArray.findIndex(obj => obj.player.data.fullname === cardArray[e].player.data.fullname);
                        if (mostCardsIndex === -1) {
                            mostCardsArray.push(cardArray[e]);
                        } else {
                            mostCardsArray[mostCardsIndex].yellowcards = mostCardsArray[mostCardsIndex].yellowcards + cardArray[e].yellowcards;
                            mostCardsArray[mostCardsIndex].redcards = mostCardsArray[mostCardsIndex].redcards + cardArray[e].redcards;
                        }
                    }
                }
                mostCardsArray.sort((a, b) => {
                    return b.yellowcards - a.yellowcards;
                });
                for (var q in assistArray) {
                    var mostAssistsIndex = mostAssistsArray.findIndex(obj => obj.player_id === assistArray[q].player_id);
                    if (mostAssistsIndex === -1) {
                        mostAssistsArray.push(assistArray[q]);
                    } else {
                        mostAssistsArray[mostAssistsIndex].assists = mostAssistsArray[mostAssistsIndex].assists + assistArray[q].assists;
                    }
                }
                for (var t in mostAssistsArray) {
                    var mostArrayIndex = mostgoalsArray.findIndex(obj => obj.player_id === mostAssistsArray[t].player_id);
                    if (mostArrayIndex !== -1) {
                        if (mostAssistsArray[t].assists === undefined) {
                            mostgoalsArray[mostArrayIndex].assists = 0;
                        } else {
                            mostgoalsArray[mostArrayIndex].assists = mostAssistsArray[t].assists;
                        }
                    }
                }
                setStatistikker({
                    "goals": mostgoalsArray,
                    "cards": mostCardsArray
                })

                //Tjek om kampen har været spillet, eller er en kommende kamp
                var timePar = (new Date().getTime()) / 1000;
                var senesteArray = [];
                var kommendeArray = [];
                for (var x in data.data.fixtures.data) {
                    if (data.data.fixtures.data[x].time.starting_at.timestamp < timePar) {
                        senesteArray.push(data.data.fixtures.data[x]);
                    } else {
                        kommendeArray.push(data.data.fixtures.data[x]);
                    }
                }
                senesteArray.sort((a, b) => {
                    return b.time.starting_at.timestamp - a.time.starting_at.timestamp;
                });
                kommendeArray.sort((a, b) => {
                    return a.time.starting_at.timestamp - b.time.starting_at.timestamp;
                });
                setKampe({
                    "kommende": kommendeArray,
                    "seneste": senesteArray
                })
                setLoading(false)
            }
        })
        .catch(error => console.log('error', error));
    }, [])


    const [loading, setLoading] = useState(true)

    const [tabelO, setTabelO] = useState([]);
    const [tabelOUsed, setTabelOUsed] = useState(false);

    function getTabel() {
        setTabelOUsed(true);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        fetch("https://soccer.sportmonks.com/api/v2.0/standings/season/"+urlParams.get("id")+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=standings.league,standings.team,")
        .then(response => response.json())
        .then(function (result) {
            console.log("Sportmonks Tabel: ", result);
            setTabelO(result.data);
        })
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        if (nav === "tabel" && !tabelOUsed) {
            getTabel();
            setTabelOUsed(true);
        }
    }, [nav])

    function getGroups() {
        if (tabelOUsed) {
            return tabelO.map((item) => {
                var liga = "";
                if (item.name === "Regular Season") {
                    liga = item.standings.data[0].league.data.name;
                } else {
                    liga = item.standings.data[0].league.data.name + " - " + item.name;
                }
                return (
                    <li key={item.season_id}>
                        <Link href={"/betting/league?id=" + item.season_id}>
                            <div className="tabel-top">
                                <p className="tabel-top-h1">{liga}</p>
                                <div className="tabel-top-right">
                                    <div className="tabel-ends">
                                        <p className="tabel-3 tabel-h1">KS</p>
                                        <p className="tabel-3 tabel-h1">V</p>
                                        <p className="tabel-3 tabel-h1">U</p>
                                        <p className="tabel-3 tabel-h1">T</p>
                                        <p className="tabel-3 tabel-h1">M</p>
                                        <p className="tabel-3 tabel-h1">P</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="tabel-container">
                            <ul>
                                {item.standings.data.map((fres) => {

                                    return (
                                        <li key={fres.round_id + "-" + fres.team_name}>
                                            <Link href={"/betting/team?team=" + fres.team.data.id}>
                                                <div className={"tabel-element"} style={{borderLeft: "4px solid var(--primary)", paddingLeft: "11px"}}>
                                                    <div className="tabel-ends">
                                                        <p className="tabel-1 tabel-p">{fres.position}</p>
                                                        <Image height={18} width={18} src={fres.team.data.logo_path} alt="" className="tabel-img" />
                                                        <p className="tabel-2 tabel-h1" style={{paddingLeft: "10px"}}>{fres.team_name}</p>
                                                    </div>
                                                    <div className="tabel-top-right">
                                                        <div className="tabel-ends">
                                                            <p className="tabel-3 tabel-p">{fres.overall.games_played}</p>
                                                            <p className="tabel-3 tabel-p">{fres.overall.won}</p>
                                                            <p className="tabel-3 tabel-p">{fres.overall.draw}</p>
                                                            <p className="tabel-3 tabel-p">{fres.overall.lost}</p>
                                                            <p className="tabel-3 tabel-p">{fres.overall.goals_scored}:{fres.overall.goals_against}</p>
                                                            <p className="tabel-3 tabel-h1">{fres.points}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    </li>
                );
            })
        } else {
            return (
                <>
                    <div className={matchStyles.skeletonWrapper}>
                        <div className={matchStyles.skeletonElement}>
                            <Skeleton height="20px" />
                        </div>
                        <div className={matchStyles.skeletonElement}>
                            <Skeleton height="40px" />
                        </div>
                        <div className={matchStyles.skeletonElement}>
                            <Skeleton height="40px" />
                        </div>
                        <div className={matchStyles.skeletonElement}>
                            <Skeleton height="40px" />
                        </div>
                        <div className={matchStyles.skeletonElement}>
                            <Skeleton height="40px" />
                        </div>
                    </div>
                </>
            )
        }
    }

    function setFavoritter() {
        if (getUser()) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            var leagueId = parseInt(urlParams.get("id"));
            if (favorit === false && document.getElementById("favorit")) {
                document.getElementById("favorit").classList.add("favorit-active");
                document.getElementById("favorit-o").classList.remove("display");
                document.getElementById("favorit").classList.add("display");
                if (localStorage.getItem("favoritter")) {
                    var storage = JSON.parse(localStorage.getItem("favoritter"));
                    const elementPush = {
                        "id": leagueData.league.data.current_season_id,
                        "image": leagueData.league.data.logo_path,
                        "name": leagueData.league.data.name,
                        "liga": leagueData.league.data.name,
                        "type": "liga"
                    };
                    storage.push(elementPush);
                    localStorage.setItem("favoritter", JSON.stringify(storage));
    
                    const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        const requestBody = {
                            "data": storage,
                            "email": getUser().email
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                } else {
                    var storageDiv = [];
                    const elementPush = {
                        "id": leagueData.league.data.current_season_id,
                        "image": leagueData.league.data.logo_path,
                        "name": leagueData.league.data.name,
                        "liga": leagueData.league.data.name
                    };
                    storageDiv.push(elementPush);
                    localStorage.setItem("favoritter", JSON.stringify(storageDiv));
    
                    const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        const requestBody = {
                            "data": storageDiv,
                            "email": getUser().email
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                }
                setFavorit(true);
            } else if (document.getElementById("favorit")) {
                if (localStorage.getItem("favoritter")) {
                    var storage = JSON.parse(localStorage.getItem("favoritter"));
                    for (var u in storage) {
                        if (storage[u].id + "" === leagueId + "") {
                            storage.splice(u);
                        }
                    }
                    localStorage.setItem("favoritter", JSON.stringify(storage));
    
                    const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        const requestBody = {
                            "data": storage,
                            "email": getUser().email
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                }
                document.getElementById("favorit").classList.remove("favorit-active");
                document.getElementById("favorit-o").classList.add("display");
                document.getElementById("favorit").classList.remove("display");
                setFavorit(false);
            }
        } else {
            window.open("/login", "_self")
        }
    }

    function favoritHover() {
        document.getElementById("favorit-o").classList.remove("display");
        document.getElementById("favorit").classList.add("display");
    }

    function favoritUnHover() {
        if (favorit === false) {
            document.getElementById("favorit-o").classList.add("display");
            document.getElementById("favorit").classList.remove("display");
        }
    }

    return (
        <>
            <Head>
                <title>Liga - Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="match-figure">
                <div className="info-figure1"></div>
                <div className="info-figure2"></div>
            </div>
            <div className={matchStyles.container}>
                <Back />
                <div className={matchStyles.matchInfo}>
                    {leagueData.league.data.name !== "" && <div className="favorit-container" onClick={() => setFavoritter()} onMouseOver={() => favoritHover()} onMouseLeave={() => favoritUnHover()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="favorit display" id="favorit-o" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="favorit" id="favorit" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                    </div>}
                    <div className={leagueStyles.team__container}>
                        <div className={leagueStyles.team__info}>
                            <h1 className="match-h1">{leagueData.league.data.name}</h1>
                            <p className="match-p team-p">{leagueData.name}</p>
                            <div className="match-img-con">
                                {leagueData.league.data.logo_path && <Image height={95} width={95} src={leagueData.league.data.logo_path} alt="" className="match-img" />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="match-info-con" id="team_match">
                    <div className="match-info-half-4">
                        <div className="match-odds-nav">
                            {nav === "oversigt" && <><button className="oddsspil-element-active" onClick={() => {setNav("oversigt")}} id="popularN">Oversigt</button>
                            <button className="oddsspil-element" onClick={() => {setNav("resultater")}} id="kortN">Resultater</button>
                            <button className="oddsspil-element" onClick={() => {setNav("kommende")}} id="spillereN">Kommende</button>
                            <button className="oddsspil-element" onClick={() => {setNav("tabel")}} id="cornerN">Tabel</button>
                            <button className="oddsspil-element" onClick={() => {setNav("statistikker")}} id="goalN">Statistikker</button></>}
                            {nav === "resultater" && <><button className="oddsspil-element" onClick={() => {setNav("oversigt")}} id="popularN">Oversigt</button>
                            <button className="oddsspil-element-active" onClick={() => {setNav("resultater")}} id="kortN">Resultater</button>
                            <button className="oddsspil-element" onClick={() => {setNav("kommende")}} id="spillereN">Kommende</button>
                            <button className="oddsspil-element" onClick={() => {setNav("tabel")}} id="cornerN">Tabel</button>
                            <button className="oddsspil-element" onClick={() => {setNav("statistikker")}} id="goalN">Statistikker</button></>}
                            {nav === "kommende" && <><button className="oddsspil-element" onClick={() => {setNav("oversigt")}} id="popularN">Oversigt</button>
                            <button className="oddsspil-element" onClick={() => {setNav("resultater")}} id="kortN">Resultater</button>
                            <button className="oddsspil-element-active" onClick={() => {setNav("kommende")}} id="spillereN">Kommende</button>
                            <button className="oddsspil-element" onClick={() => {setNav("tabel")}} id="cornerN">Tabel</button>
                            <button className="oddsspil-element" onClick={() => {setNav("statistikker")}} id="goalN">Statistikker</button></>}
                            {nav === "tabel" && <><button className="oddsspil-element" onClick={() => {setNav("oversigt")}} id="popularN">Oversigt</button>
                            <button className="oddsspil-element" onClick={() => {setNav("resultater")}} id="kortN">Resultater</button>
                            <button className="oddsspil-element" onClick={() => {setNav("kommende")}} id="spillereN">Kommende</button>
                            <button className="oddsspil-element-active" onClick={() => {setNav("tabel")}} id="cornerN">Tabel</button>
                            <button className="oddsspil-element" onClick={() => {setNav("statistikker")}} id="goalN">Statistikker</button></>}
                            {nav === "statistikker" && <><button className="oddsspil-element" onClick={() => {setNav("oversigt")}} id="popularN">Oversigt</button>
                            <button className="oddsspil-element" onClick={() => {setNav("resultater")}} id="kortN">Resultater</button>
                            <button className="oddsspil-element" onClick={() => {setNav("kommende")}} id="spillereN">Kommende</button>
                            <button className="oddsspil-element" onClick={() => {setNav("tabel")}} id="cornerN">Tabel</button>
                            <button className="oddsspil-element-active" onClick={() => {setNav("statistikker")}} id="goalN">Statistikker</button></>}
                        </div>
                        {nav === "oversigt" && <ul className="match-odds-contain">
                            <div className="team-indhold-side">
                                <div className="team-kampe-section" id="seneste">
                                    <p className="team-kampe-h1">Resultater</p>
                                    <div className="stage-kampe" id="latest">
                                        <ul>
                                            {!loading && <>
                                                {kampe["seneste"].slice(0,5).length <= 0 && <p className={matchStyles.nogames}>Der kunne ikke findes nogen kampe for {leagueData.league.data.name}...</p>}
                                                {kampe["seneste"].slice(0,5).map(item => {
                                                    var starting_at = item.time.starting_at.timestamp * 1000;
                                                    var starting_at_date = new Date(starting_at).getDate();
                                                    var starting_at_date_str = starting_at_date.toString();
                                                    var starting_at_month = new Date(starting_at).getMonth() + 1;
                                                    var starting_at_month_str = starting_at_month.toString();
                                                    if ((starting_at_month.toString()).length === 1) {
                                                        starting_at_month_str = "0" + starting_at_month;
                                                    }
                                                    if ((starting_at_date.toString()).length === 1) {
                                                        starting_at_date_str = "0" + starting_at_date;
                                                    }

                                                    var isAnotherYear = false;
                                                if (new Date(starting_at).getFullYear() !== new Date().getFullYear()) {
                                                    isAnotherYear = true;
                                                }

                                                    return (
                                                    <li key={item.id}>
                                                        <div className="stage-match">
                                                            <div className="stage-kampe-top">
                                                                {item.time.status === "LIVE" &&
                                                                    <div className="stage-live-pulse"></div>
                                                                }
                                                                {item.time.status === "HT" &&
                                                                    <div className="stage-live-pulse"></div>
                                                                }
                                                            </div>
                                                            <div className="stage-indhold-down">
                                                                <Link href={"/betting/match?id=" + item.id} className="stage-kampe-hold">
                                                                    {item.time.status === "LIVE" &&
                                                                        <div className="stage-live">
                                                                            <div className="stage-live-con">
                                                                                <p className="stage-kampe-minut stage-kampe-minut-active">{item.time.minute}</p>
                                                                                <p className="stage-blink">&apos;</p>
                                                                            </div>
                                                                            <div className="stage-live-scores">
                                                                                <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "HT" &&
                                                                        <div className="stage-live">
                                                                            <div className="stage-live-con">
                                                                                <p className="stage-kampe-minut stage-kampe-minut-active">Pause</p>
                                                                            </div>
                                                                            <div className="stage-live-scores">
                                                                                <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "NS" &&
                                                                        <div className={matchStyles.stage__time__small__closed}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "FT" &&
                                                                        <>
                                                                            <div className={matchStyles.stage__time__small}>
                                                                                <div className={matchStyles.stage__time__con}>
                                                                                    <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                    {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                                </div>
                                                                                <div className="stage-time-scores">
                                                                                    {item.winner_team_id === item.localteam_id && <>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                    {item.winner_team_id === item.visitorteam_id && <>
                                                                                        <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                    {item.winner_team_id === null && <>
                                                                                        <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {item.time.status === "AET" &&
                                                                        <>
                                                                            <div className={matchStyles.stage__time__small}>
                                                                                <div className={matchStyles.stage__time__con}>
                                                                                    <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                    {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                                </div>
                                                                                <div className="stage-time-scores">
                                                                                    {item.winner_team_id === item.localteam_id && <>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                    {item.winner_team_id === item.visitorteam_id && <>
                                                                                        <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {item.time.status === "FT_PEN" &&
                                                                        <>
                                                                            <div className={matchStyles.stage__time__small}>
                                                                                <div className={matchStyles.stage__time__con}>
                                                                                    <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                    {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                                </div>
                                                                                <div className="stage-time-scores">
                                                                                    {item.winner_team_id === item.localteam_id && <>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                    {item.winner_team_id === item.visitorteam_id && <>
                                                                                        <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                        <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                    </>}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {item.time.status === "POSTP" &&
                                                                        <>
                                                                            <div className={matchStyles.stage__time__small}>
                                                                                <div className={matchStyles.stage__time__con}>
                                                                                    <p className="stage-kampe-minut">Udskudt</p>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    <div className="stage-kampe-hold-div">
                                                                        <div className="stage-kampe-team">
                                                                            <div className="stage-img">
                                                                                <Image width={18} height={18} alt="." src={item.localTeam.data.logo_path} />
                                                                            </div>
                                                                            {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p-fat">{item.localTeam.data.name}</p>}
                                                                            {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                            {!item.winner_team_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                        </div>
                                                                        <div className="stage-kampe-team">
                                                                            <div className="stage-img">
                                                                                <Image width={18} height={18} alt="." src={item.visitorTeam.data.logo_path} />
                                                                            </div>
                                                                            {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                            {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p-fat">{item.visitorTeam.data.name}</p>}
                                                                            {!item.winner_team_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <div className="stage-kampe-odds-fix"></div>
                                                            </div>
                                                        </div>
                                                    </li>);
                                                })}
                                            </>}
                                            {loading && <div className={matchStyles.skeletonWrapper}>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                            </div>}
                                        </ul>
                                        {!loading && <div className="stage-indhold-down">
                                            <div className="team-kampe-hold" onClick={() => {setNav("resultater");window.scrollTo(0,0)}}>
                                                <p className="team-kampe-p">Se alle resultater</p>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div className="team-kampe-section" id="kommende">
                                    <p className="team-kampe-h1">Kommende</p>
                                    <div className="stage-kampe" id="latest">
                                        <ul>
                                            {!loading && <>
                                                {kampe["kommende"].slice(0,5).length <= 0 && <p className={matchStyles.nogames}>Der kunne ikke findes nogen kommende kampe for {leagueData.league.data.name}...</p>}
                                                {kampe["kommende"].slice(0,5).map(item => {
                                                    var starting_at = item.time.starting_at.timestamp * 1000;
                                                    var starting_at_date = new Date(starting_at).getDate();
                                                    var starting_at_date_str = starting_at_date.toString();
                                                    var starting_at_month = new Date(starting_at).getMonth() + 1;
                                                    var starting_at_month_str = starting_at_month.toString();
                                                    if ((starting_at_month.toString()).length === 1) {
                                                        starting_at_month_str = "0" + starting_at_month;
                                                    }
                                                    if ((starting_at_date.toString()).length === 1) {
                                                        starting_at_date_str = "0" + starting_at_date;
                                                    }

                                                    var isAnotherYear = false;
                                                if (new Date(starting_at).getFullYear() !== new Date().getFullYear()) {
                                                    isAnotherYear = true;
                                                }

                                                    return (
                                                    <li key={item.id}>
                                                        <div className="stage-match">
                                                            <div className="stage-kampe-top">
                                                                {item.time.status === "LIVE" &&
                                                                    <div className="stage-live-pulse"></div>
                                                                }
                                                                {item.time.status === "HT" &&
                                                                    <div className="stage-live-pulse"></div>
                                                                }
                                                            </div>
                                                            <div className="stage-indhold-down">
                                                                <Link href={"/betting/match?id=" + item.id} className="stage-kampe-hold">
                                                                    {item.time.status === "LIVE" &&
                                                                        <div className="stage-live">
                                                                            <div className="stage-live-con">
                                                                                <p className="stage-kampe-minut stage-kampe-minut-active">{item.time.minute}</p>
                                                                                <p className="stage-blink">&apos;</p>
                                                                            </div>
                                                                            <div className="stage-live-scores">
                                                                                <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "HT" &&
                                                                        <div className="stage-live">
                                                                            <div className="stage-live-con">
                                                                                <p className="stage-kampe-minut stage-kampe-minut-active">Pause</p>
                                                                            </div>
                                                                            <div className="stage-live-scores">
                                                                                <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "NS" &&
                                                                        <div className={matchStyles.stage__time__small__closed}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "POSTP" &&
                                                                        <>
                                                                            <div className={matchStyles.stage__time__small}>
                                                                                <div className={matchStyles.stage__time__con}>
                                                                                    <p className="stage-kampe-minut">Udskudt</p>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    <div className="stage-kampe-hold-div">
                                                                        <div className="stage-kampe-team">
                                                                            <div className="stage-img">
                                                                                <Image width={18} height={18} alt="." src={item.localTeam.data.logo_path} />
                                                                            </div>
                                                                            {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p-fat">{item.localTeam.data.name}</p>}
                                                                            {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                            {!item.winner_team_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                        </div>
                                                                        <div className="stage-kampe-team">
                                                                            <div className="stage-img">
                                                                                <Image width={18} height={18} alt="." src={item.visitorTeam.data.logo_path} />
                                                                            </div>
                                                                            {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                            {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p-fat">{item.visitorTeam.data.name}</p>}
                                                                            {!item.winner_team_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <div className="stage-kampe-odds-fix"></div>
                                                            </div>
                                                        </div>
                                                    </li>);
                                                })}
                                            </>}
                                            {loading && <div className={matchStyles.skeletonWrapper}>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                                <div className={matchStyles.skeletonElement}>
                                                    <Skeleton height="50px" />
                                                </div>
                                            </div>}
                                        </ul>
                                        {!loading && <div className="stage-indhold-down">
                                            <div className="team-kampe-hold" onClick={() => {setNav("kommende");window.scrollTo(0,0)}}>
                                                <p className="team-kampe-p">Se alle kommende</p>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </ul>}
                        {nav === "resultater" && <ul className="match-odds-contain">
                            <div className="team-kampe-section" id="seneste">
                                <p className="team-kampe-h1">Resultater</p>
                                <div className="stage-kampe" id="latest">
                                    <ul>
                                        {!loading && <>
                                            {kampe["seneste"].length <= 0 && <p className={matchStyles.nogames}>Der kunne ikke findes nogen kampe for {leagueData.league.data.name}...</p>}
                                            {kampe["seneste"].map(item => {
                                                var starting_at = item.time.starting_at.timestamp * 1000;
                                                var starting_at_date = new Date(starting_at).getDate();
                                                var starting_at_date_str = starting_at_date.toString();
                                                var starting_at_month = new Date(starting_at).getMonth() + 1;
                                                var starting_at_month_str = starting_at_month.toString();
                                                if ((starting_at_month.toString()).length === 1) {
                                                    starting_at_month_str = "0" + starting_at_month;
                                                }
                                                if ((starting_at_date.toString()).length === 1) {
                                                    starting_at_date_str = "0" + starting_at_date;
                                                }

                                                var isAnotherYear = false;
                                                if (new Date(starting_at).getFullYear() !== new Date().getFullYear()) {
                                                    isAnotherYear = true;
                                                }

                                                return (
                                                <li key={item.id}>
                                                    <div className="stage-match">
                                                        <div className="stage-kampe-top">
                                                            {item.time.status === "LIVE" &&
                                                                <div className="stage-live-pulse"></div>
                                                            }
                                                            {item.time.status === "HT" &&
                                                                <div className="stage-live-pulse"></div>
                                                            }
                                                        </div>
                                                        <div className="stage-indhold-down">
                                                            <Link href={"/betting/match?id=" + item.id} className="stage-kampe-hold">
                                                                {item.time.status === "LIVE" &&
                                                                    <div className="stage-live">
                                                                        <div className="stage-live-con">
                                                                            <p className="stage-kampe-minut stage-kampe-minut-active">{item.time.minute}</p>
                                                                            <p className="stage-blink">&apos;</p>
                                                                        </div>
                                                                        <div className="stage-live-scores">
                                                                            <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                            <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "HT" &&
                                                                    <div className="stage-live">
                                                                        <div className="stage-live-con">
                                                                            <p className="stage-kampe-minut stage-kampe-minut-active">Pause</p>
                                                                        </div>
                                                                        <div className="stage-live-scores">
                                                                            <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                            <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "NS" &&
                                                                    <div className={matchStyles.stage__time__small__closed}>
                                                                        <div className={matchStyles.stage__time__con}>
                                                                            <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                            {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "FT" &&
                                                                    <>
                                                                        <div className={matchStyles.stage__time__small}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                            </div>
                                                                            <div className="stage-time-scores">
                                                                                {item.winner_team_id === item.localteam_id && <>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                                {item.winner_team_id === item.visitorteam_id && <>
                                                                                    <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                                {item.winner_team_id === null && <>
                                                                                    <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                {item.time.status === "AET" &&
                                                                    <>
                                                                        <div className={matchStyles.stage__time__small}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                            </div>
                                                                            <div className="stage-time-scores">
                                                                                {item.winner_team_id === item.localteam_id && <>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                                {item.winner_team_id === item.visitorteam_id && <>
                                                                                    <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                {item.time.status === "FT_PEN" &&
                                                                    <>
                                                                        <div className={matchStyles.stage__time__small}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                                {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                            </div>
                                                                            <div className="stage-time-scores">
                                                                                {item.winner_team_id === item.localteam_id && <>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                                {item.winner_team_id === item.visitorteam_id && <>
                                                                                    <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                                    <p className="stage-stilling-p-fat">{item.scores.visitorteam_score}</p>
                                                                                </>}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                {item.time.status === "POSTP" &&
                                                                    <>
                                                                        <div className={matchStyles.stage__time__small}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">Udskudt</p>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                <div className="stage-kampe-hold-div">
                                                                    <div className="stage-kampe-team">
                                                                        <div className="stage-img">
                                                                            <Image width={18} height={18} alt="." src={item.localTeam.data.logo_path} />
                                                                        </div>
                                                                        {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p-fat">{item.localTeam.data.name}</p>}
                                                                        {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                        {!item.winner_team_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                    </div>
                                                                    <div className="stage-kampe-team">
                                                                        <div className="stage-img">
                                                                            <Image width={18} height={18} alt="." src={item.visitorTeam.data.logo_path} />
                                                                        </div>
                                                                        {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                        {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p-fat">{item.visitorTeam.data.name}</p>}
                                                                        {!item.winner_team_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <div className="stage-kampe-odds-fix"></div>
                                                        </div>
                                                    </div>
                                                </li>);
                                            })}
                                        </>}
                                        {loading && <div className={matchStyles.skeletonWrapper}>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                        </div>}
                                    </ul>
                                </div>
                            </div>
                        </ul>}
                        {nav === "kommende" && <ul className="match-odds-contain">
                            <div className="team-kampe-section" id="kommende">
                                <p className="team-kampe-h1">Kommende</p>
                                <div className="stage-kampe" id="latest">
                                    <ul>
                                        {!loading && <>
                                            {kampe["kommende"].length <= 0 && <p className={matchStyles.nogames}>Der kunne ikke findes nogen kommende kampe for {leagueData.league.data.name}...</p>}
                                            {kampe["kommende"].map(item => {
                                                var starting_at = item.time.starting_at.timestamp * 1000;
                                                var starting_at_date = new Date(starting_at).getDate();
                                                var starting_at_date_str = starting_at_date.toString();
                                                var starting_at_month = new Date(starting_at).getMonth() + 1;
                                                var starting_at_month_str = starting_at_month.toString();
                                                if ((starting_at_month.toString()).length === 1) {
                                                    starting_at_month_str = "0" + starting_at_month;
                                                }
                                                if ((starting_at_date.toString()).length === 1) {
                                                    starting_at_date_str = "0" + starting_at_date;
                                                }

                                                var isAnotherYear = false;
                                                if (new Date(starting_at).getFullYear() !== new Date().getFullYear()) {
                                                    isAnotherYear = true;
                                                }

                                                return (
                                                <li key={item.id}>
                                                    <div className="stage-match">
                                                        <div className="stage-kampe-top">
                                                            {item.time.status === "LIVE" &&
                                                                <div className="stage-live-pulse"></div>
                                                            }
                                                            {item.time.status === "HT" &&
                                                                <div className="stage-live-pulse"></div>
                                                            }
                                                        </div>
                                                        <div className="stage-indhold-down">
                                                            <Link href={"/betting/match?id=" + item.id} className="stage-kampe-hold">
                                                                {item.time.status === "LIVE" &&
                                                                    <div className="stage-live">
                                                                        <div className="stage-live-con">
                                                                            <p className="stage-kampe-minut stage-kampe-minut-active">{item.time.minute}</p>
                                                                            <p className="stage-blink">&apos;</p>
                                                                        </div>
                                                                        <div className="stage-live-scores">
                                                                            <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                            <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "HT" &&
                                                                    <div className="stage-live">
                                                                        <div className="stage-live-con">
                                                                            <p className="stage-kampe-minut stage-kampe-minut-active">Pause</p>
                                                                        </div>
                                                                        <div className="stage-live-scores">
                                                                            <p className="stage-stilling-p">{item.scores.localteam_score}</p>
                                                                            <p className="stage-stilling-p">{item.scores.visitorteam_score}</p>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "NS" &&
                                                                    <div className={matchStyles.stage__time__small__closed}>
                                                                        <div className={matchStyles.stage__time__con}>
                                                                            <p className="stage-kampe-minut">{starting_at_date_str}.{starting_at_month_str}</p>
                                                                            {isAnotherYear && <p className="stage-kampe-minut">{new Date(starting_at).getFullYear()}</p>}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {item.time.status === "POSTP" &&
                                                                    <>
                                                                        <div className={matchStyles.stage__time__small}>
                                                                            <div className={matchStyles.stage__time__con}>
                                                                                <p className="stage-kampe-minut">Udskudt</p>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                <div className="stage-kampe-hold-div">
                                                                    <div className="stage-kampe-team">
                                                                        <div className="stage-img">
                                                                            <Image width={18} height={18} alt="." src={item.localTeam.data.logo_path} />
                                                                        </div>
                                                                        {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p-fat">{item.localTeam.data.name}</p>}
                                                                        {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                        {!item.winner_team_id && <p className="stage-kampe-p">{item.localTeam.data.name}</p>}
                                                                    </div>
                                                                    <div className="stage-kampe-team">
                                                                        <div className="stage-img">
                                                                            <Image width={18} height={18} alt="." src={item.visitorTeam.data.logo_path} />
                                                                        </div>
                                                                        {item.winner_team_id === item.localteam_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                        {item.winner_team_id === item.visitorteam_id && <p className="stage-kampe-p-fat">{item.visitorTeam.data.name}</p>}
                                                                        {!item.winner_team_id && <p className="stage-kampe-p">{item.visitorTeam.data.name}</p>}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <div className="stage-kampe-odds-fix"></div>
                                                        </div>
                                                    </div>
                                                </li>);
                                            })}
                                        </>}
                                        {loading && <div className={matchStyles.skeletonWrapper}>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                            <div className={matchStyles.skeletonElement}>
                                                <Skeleton height="50px" />
                                            </div>
                                        </div>}
                                    </ul>
                                </div>
                            </div>
                        </ul>}
                        {nav === "tabel" && <ul className="match-odds-contain">
                            <div className="team-kampe-section" id="seneste">
                                {getGroups()}
                            </div>
                        </ul>}
                        {nav === "statistikker" && <ul className="match-odds-contain">
                            <div className="team-indhold-side">
                                <div className="team-kampe-section" id="startopstilling-div">
                                    <div className="stat-top">
                                        <p className="team-kampe-h1">Topscorere</p>
                                        <div className="stat-ends">
                                            <p className="stat-p-p">M</p>
                                            <p className="stat-p-p">S</p>
                                            <p className="stat-p-p">A</p>
                                        </div>
                                    </div>
                                    <div className="stage-kampe" id="latest">
                                        <ul>
                                        {statistikker["goals"].slice(0,20).map((item, index) => {
                                            var assists = item.assists;
                                            if (assists === undefined) {
                                                assists = 0;
                                            }
                                            return (
                                                <li key={item.player.data.player_id + item.player.data.fullname}>
                                                    <Link href={"/betting/spiller?id=" + item.player.data.player_id}>
                                                        <div className="stat-player-element">
                                                            <div className="stat-player">
                                                                <p className="stat-player-h1">{index + 1}.</p>
                                                                <Image width={18} height={18} src={item.player.data.image_path} alt="" className="bench-img-image" />
                                                                <Image width={18} height={18} src={item.team.data.logo_path} alt="" className="top-img-logo" />
                                                                <div className="bench-info" style={{paddingLeft: "11px"}}>
                                                                    <p className="bench-h1">{item.player.data.display_name}</p>
                                                                    <p className="bench-h2">{item.player.data.nationality}</p>
                                                                </div>
                                                            </div>
                                                            <div className="stat-int">
                                                                <div className="stat-text">
                                                                    <p className="stat-player-p">{item.goals}</p>
                                                                    <p className="stat-player-p">{"(" + item.penalty_goals + ")"}</p>
                                                                    <p className="stat-player-p">{assists}</p>
                                                                </div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="team-icon" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    </div>
                                </div>
                                <div className="team-kampe-section" id="startopstilling-div">
                                    <div className="stat-top">
                                        <p className="team-kampe-h1">Uddelte kort</p>
                                        <div className="stat-ends">
                                            <p className="stat-p-p">G</p>
                                            <p className="stat-p-p">R</p>
                                        </div>
                                    </div>
                                    <div className="stage-kampe" id="latest">
                                        <ul>
                                        {statistikker["cards"].slice(0,20).map((item, index) => {
                                            return (
                                                <li key={item.player.data.player_id + item.player.data.fullname}>
                                                    <Link href={"/betting/spiller?id=" + item.player.data.player_id}>
                                                        <div className="stat-player-element">
                                                            <div className="stat-player">
                                                                <p className="stat-player-h1">{index + 1}.</p>
                                                                <Image width={18} height={18} src={item.player.data.image_path} alt="" className="bench-img-image" />
                                                                <Image width={18} height={18} src={item.team.data.logo_path} alt="" className="top-img-logo" />
                                                                <div className="bench-info" style={{paddingLeft: "11px"}}>
                                                                    <p className="bench-h1">{item.player.data.display_name}</p>
                                                                    <p className="bench-h2">{item.player.data.nationality}</p>
                                                                </div>
                                                            </div>
                                                            <div className="stat-int">
                                                                <div className="stat-text">
                                                                    <p className="stat-player-p">{item.yellowcards}</p>
                                                                    <p className="stat-player-p">{item.redcards}</p>
                                                                </div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="team-icon" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        </ul>}
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ res, req, query }) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=58, stale-while-revalidate=59'
    )
    const sendRedirectLocation = (location) => {
        res.writeHead(302, {
            Location: location,
        });
        res.end();
        return { props: {} };
    };
    // if (!req.cookies.auth) {
    //     sendRedirectLocation('/signup')
    // }
    return {
        props: { },
    }
}
 
export default StageLeague;