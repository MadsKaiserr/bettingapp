import * as React from 'react';
import matchStyles from '../css/modules/betting/match.module.css';
import Head from 'next/head'
import { getMatchStatus, getMonthAbr, getLabel } from "../services/algo.js";
import { getUser } from "../services/authService.js";
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import axios from "axios";
import Back from "../components/back.js";

function Match({data}) {

    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    const [oddNav, setOddNav] = useState("popular");
    const [nav, setNav] = useState("statistics");
    const [restTime, setRestTime] = useState("");
    const [notUsableBtn, setNotUsableBtn] = useState([]);
    const [matchAllowed, setMatchAllowed] = useState(true);

    const [availableOdds, setAvailableOdds] = useState({
        "popular": [],
        "handicap": [],
        "kort": [],
        "corner": [],
        "goal": [],
        "specials": [],
        "minutter": [],
        "build": []
    });

    const [result, setResult] = useState({
        league: {
            data: {
                current_season_id: 0,
                name: "",
                country: {
                    data: {
                        image_path: "",
                        name: ""
                    }
                }
            }
        },
        round: {
            data: {
                name: ""
            }
        },
        localTeam: {
            data: {
                id: 0,
                name: "",
                logo_path: ""
            }
        },
        visitorTeam: {
            data: {
                id: 0,
                name: "",
                logo_path: ""
            }
        },
        standings: {
            localteam_position: 0,
            visitorteam_position: 0
        },
        time: {
            status: "",
            minute: 0,
            starting_at: {
                date_time: "",
                time: "",
                timestamp: 0
            }
        },
        referee: {
            data: {
                fullname: ""
            }
        },
        venue: {
            data: {
                name: ""
            }
        },
        odds: {
            data: [

            ]
        },
        id: 0
    })

    function checkExpired(timestamp) {
        var nowDate = new Date().getTime();
        var nowMiliDate = parseInt((nowDate.toString()).slice(0, -3));
        if (nowMiliDate > timestamp) {
            setMatchAllowed(false);
            var buttonshere3 = document.querySelectorAll(".match-odds-offer-element-3");
            var buttonshere2 = document.querySelectorAll(".match-odds-offer-element-2");
            if (notUsableBtn.length > 0) {
                var notUsableArray = notUsableBtn;
                for (var q = 0; q < buttonshere3.length; q++) {
                    if (buttonshere3[q] !== undefined) {
                        notUsableArray.push(buttonshere3[q].id);
                        buttonshere3[q].classList.add("odd-used");
                    }
                }
                for (var y = 0; y < buttonshere2.length; y++) {
                    if (buttonshere2[y] !== undefined) {
                        notUsableArray.push(buttonshere2[y].id);
                        buttonshere2[y].classList.add("odd-used");
                    }
                }
                setNotUsableBtn(notUsableArray);
                sessionStorage.setItem("notUsableBtn", JSON.stringify(notUsableArray));
            }
        }
    }

    const [favorit, setFavorit] = useState(false);
    const [favorit2, setFavorit2] = useState(false);
    function favoritHover(n) {
        if (n === 1) {
            if (document.getElementById("favorit")) {
                document.getElementById("favorit-o").classList.remove("display");
                document.getElementById("favorit").classList.add("display");
            }
        } else {
            if (document.getElementById("favorit2")) {
                document.getElementById("favorit-o2").classList.remove("display");
                document.getElementById("favorit2").classList.add("display");
            }
        }
    }

    function favoritUnHover(n) {
        if (n === 1) {
            if (favorit === false) {
                if (document.getElementById("favorit")) {
                    document.getElementById("favorit-o").classList.add("display");
                    document.getElementById("favorit").classList.remove("display");
                }
            }
        } else {
            if (favorit2 === false) {
                if (document.getElementById("favorit2")) {
                    document.getElementById("favorit-o2").classList.add("display");
                    document.getElementById("favorit2").classList.remove("display");
                }
            }
        }
    }

    function setFavoritter(n) {
        if (getUser()) {
            if (n === 1) {
                if (favorit === false && document.getElementById("favorit")) {
                    document.getElementById("favorit").classList.add("favorit-active");
                    document.getElementById("favorit-o").classList.remove("display");
                    document.getElementById("favorit").classList.add("display");
                    if (localStorage.getItem("favoritter")) {
                        var storage = JSON.parse(localStorage.getItem("favoritter"));
                        // const elementPush = {
                        //     "id": parseInt(homeTeamId),
                        //     "image": homelogo,
                        //     "name": homeTeam,
                        //     "liga": league
                        // };
                        const elementPush = {};
                        storage.push(elementPush);
                        localStorage.setItem("favoritter", JSON.stringify(storage));
    
                        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        //""
                        const requestBody = {
                            "data": storage,
                            "email": ""
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                    } else {
                        var storageDiv = [];
                        // const elementPush = {
                        //     "id": parseInt(homeTeamId),
                        //     "image": homelogo,
                        //     "name": homeTeam,
                        //     "liga": league
                        // };
                        const elementPush = {};
                        storageDiv.push(elementPush);
                        localStorage.setItem("favoritter", JSON.stringify(storageDiv));
    
                        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        //""
                        const requestBody = {
                            "data": storageDiv,
                            "email": ""
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
                            if (storage[u].id === result.localTeam.data.id) {
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
    
                        //""
                        const requestBody = {
                            "data": storage,
                            "email": ""
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
                if (favorit2 === false && document.getElementById("favorit2")) {
                    document.getElementById("favorit2").classList.add("favorit-active");
                    document.getElementById("favorit-o2").classList.remove("display");
                    document.getElementById("favorit2").classList.add("display");
                    if (localStorage.getItem("favoritter")) {
                        var storage = JSON.parse(localStorage.getItem("favoritter"));
                        // const elementPush = {
                        //     "id": parseInt(visitorTeamId),
                        //     "image": visitorlogo,
                        //     "name": visitorTeam,
                        //     "liga": league
                        // };
                        const elementPush = {};
                        storage.push(elementPush);
                        localStorage.setItem("favoritter", JSON.stringify(storage));
    
                        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        //""
                        const requestBody = {
                            "data": storage,
                            "email": ""
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                    } else {
                        var storageDiv = [];
                        // const elementPush = {
                        //     "id": parseInt(visitorTeamId),
                        //     "image": visitorlogo,
                        //     "name": visitorTeam,
                        //     "liga": league
                        // };
                        const elementPush = {};
                        storageDiv.push(elementPush);
                        localStorage.setItem("favoritter", JSON.stringify(storageDiv));
    
                        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";
    
                        const requestConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
    
                        //""
                        const requestBody = {
                            "data": storageDiv,
                            "email": ""
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                    setFavorit2(true);
                } else if (document.getElementById("favorit2")) {
                    if (localStorage.getItem("favoritter")) {
                        var storage = JSON.parse(localStorage.getItem("favoritter"));
                        for (var u in storage) {
                            if (storage[u].id === result.visitorTeam.data.id) {
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
    
                        //""
                        const requestBody = {
                            "data": storage,
                            "email": ""
                        }
                        axios.post(signupURL, requestBody, requestConfig).then(response => {
                            console.log("AWS - Favoritter:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                    document.getElementById("favorit2").classList.remove("favorit-active");
                    document.getElementById("favorit-o2").classList.add("display");
                    document.getElementById("favorit2").classList.remove("display");
                    setFavorit2(false);
                }
            }
        } else {
            window.open("/login", "_self")
        }
    }

    function chooseOdd(btnId, type, row, result, label) {
        // if (getUser()) {
        //     if (matchAllowed === false) {
        //         // setNotiMessage("error", "Kamp er gået i gang", "Du kan ikke spille på en kamp, som allerede er gået i gang, eller er spillet færdig.")
        //     }
        //     if (!notUsableBtn.includes(btnId) && matchAllowed !== false && odds.length < 5) {
        //         document.getElementById(btnId).classList.add("odd-used");
        //         setNotUsableBtn([...notUsableBtn, btnId]);
        //         sessionStorage.setItem("notUsableBtn", JSON.stringify([...notUsableBtn, btnId]));
        
        //         var mstime = new Date().getTime();
        //         var randomNumber = Math.floor(Math.random() * 512);
        //         var randomId = mstime+"-"+randomNumber;
        //         const jsonNote = {
        //             "id": randomId,
        //             "match": parseInt(matchID),
        //             "hometeam": homeTeam,
        //             "visitorteam": visitorTeam,
        //             "probability": result,
        //             "odds_type": type,
        //             "odds_result": row,
        //             "odds_date": Number(matchdate),
        //             "label": label
        //         }
        
        //         setOdds([...odds, jsonNote]);
        
        //         for (var o in odds) {
        //             setReturnOdds(returnOdds * odds[o].probability);
        //         }
        //         setReturnOdds(returnOdds * jsonNote.probability);
        //         if (udbetaling === 0) {
        //             setUdbetaling((jsonNote.probability * indsats));
        //         } else {
        //             setUdbetaling((returnOdds * jsonNote.probability) * indsats);
        //         }
        //         setKuponBtn("kupon-btn");
        //         sessionStorage.setItem("odds", JSON.stringify([...odds, jsonNote]))
        //     } else if (odds.length > 5) {
        //         setNotiMessage("error", "For mange væddemål", "Du har allerede 6 ud af 6 mulige væddemål pr. kupon.")
        //     } else if (notUsableBtn.includes(btnId)) {
        //         rem3wayBet(parseInt(matchID), type, row);
        //     }
        // } else {
        //     window.open("/login", "_self")
        // }
    }

    //Disable earlier odds
    useEffect(() => {
        if (new Date().getTime() > result.time.starting_at.timestamp * 1000) {
            var slides = document.getElementsByClassName("odd-used");
            for (var i = 0; i < slides.length; i++) {
                slides[i].classList.add("odd-off");
            }
        }
    })

    //Hent kamp
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        //API call
        fetch("https://soccer.sportmonks.com/api/v2.0/fixtures/"+urlParams.get("id")+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=odds,goals,referee,league.country,aggregate,stats,substitutions,bench,bench.player,lineup,lineup.player,localTeam,localTeam.squad,localTeam.squad.player,visitorTeam.squad,visitorTeam.squad.player,league,visitorTeam,localCoach,visitorCoach,venue,events,group,round&bookmakers=2&tz=Europe/Copenhagen")
        .then(response => response.json())
        .then(function (result) {
            console.log("Sportmonks - Fixture:", result);
            setResult(result.data)

            if (result.data.stats.data.length > 0) {
                if (result.data.stats.data[0].team_id === result.data.localteam_id) {
                    setStatsL(result.data.stats.data[0]);
                } else {
                    setStatsL(result.data.stats.data[1]);
                }
                if (result.data.stats.data[1].team_id === result.data.visitorteam_id) {
                    setStatsV(result.data.stats.data[1]);
                } else {
                    setStatsV(result.data.stats.data[0]);
                }
            }

            //Tjek om kampen er igang
            var isStarted = false;
            if (result.data.time.status === "LIVE" || result.data.time.status === "HT") {
                isStarted = true;
            }

            //Nedtælling til start af kamp
            if (result.data.time.status === "NS") {
                var countDownDate = new Date((result.data.time.starting_at.timestamp*1000)).getTime();
                var x1 = setInterval(function() {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;

                    var days = "" + Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = "" + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = "" + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = "" + Math.floor((distance % (1000 * 60)) / 1000);

                    if (days.length === 1) {
                        days = "0" + days;
                    }
                    if (hours.length === 1) {
                        hours = "0" + hours;
                    }
                    if (minutes.length === 1) {
                        minutes = "0" + minutes;
                    }
                    if (seconds.length === 1) {
                        seconds = "0" + seconds;
                    }

                    setRestTime(days + ":" + hours + ":" + minutes + ":" + seconds);

                    if (distance < 0 && isStarted === false) {
                        setRestTime("Starter nu...");
                        checkExpired(result.data.time.starting_at.timestamp);
                    }
                }, 1000);
            } else {
                setRestTime(getMatchStatus(result.data.time.status))
            }
            //Tjek om kampen er igang -> Disable odds
            checkExpired(result.data.time.starting_at.timestamp);

            //Indhent odds til markederne efter ønske
            const wants = ["3Way Result", "Over/Under", "10 Minute Result", "Team To Score First", "Double Chance", "Highest Scoring Half", "Both Teams To Score", "Exact Goals Number", "Clean Sheet - Home", "Clean Sheet - Away", "3Way Result 1st Half", "Team To Score Last", "3Way Result 2nd Half", "Double Chance - 2nd Half", "Odd/Even", "Correct Score"];
            var availOddsReplica = [];
            for (var r in wants) {
                if (result.data.odds.data.length > 0) {
                    for (var m in result.data.odds.data) {
                        if (result.data.odds.data[m].name === wants[r]) {
                            var dataBody = {
                                data: [],
                                type: result.data.odds.data[m].name
                            };
                            dataBody.data = result.data.odds.data[m].bookmaker.data[0].odds.data;
                            availOddsReplica.push(dataBody);
                        }
                    }
                }
            }
            var availPopular2 = [];
            var availHandicap2 = [];
            var availKort2 = [];
            var availCorner2 = [];
            var availGoal2 = [];
            var availSpecials2 = [];
            var availMinutter2 = [];
            for (var y in availOddsReplica) {
                if (availOddsReplica[y].type === "3Way Result" || availOddsReplica[y].type === "Correct Score" || availOddsReplica[y].type === "Exact Goals Number" || availOddsReplica[y].type === "Double Chance" || availOddsReplica[y].type === "Team To Score First" || availOddsReplica[y].type === "Over/Under") {
                    availPopular2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type === "Handicap Result" || availOddsReplica[y].type === "1st Half Handicap") {
                    availHandicap2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type === "3Way Result 1st Half" || availOddsReplica[y].type === "1st Half Handicap" || availOddsReplica[y].type === "Goals Over/Under 1st Half" || availOddsReplica[y].type === "Over/Under 2nd Half" || availOddsReplica[y].type === "Highest Scoring Half" || availOddsReplica[y].type === "3Way Result 2nd Half" || availOddsReplica[y].type === "Double Chance - 1st Half" || availOddsReplica[y].type === "Double Chance - 2nd Half") {
                    availMinutter2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type === "First Card Received" || availOddsReplica[y].type === "Player to be Sent Off" || availOddsReplica[y].type === "Player to be Booked" || availOddsReplica[y].type.slice(0,10) === "Team Cards" || availOddsReplica[y].type === "A Red Card in the Match" || availOddsReplica[y].type === "Both Teams To Receive 2+ Cards" || availOddsReplica[y].type === "Both Teams To Receive A Card") {
                    availKort2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type.slice(0,12) === "Team Corners" || availOddsReplica[y].type === "Alternative Total Corners" || availOddsReplica[y].type === "Total Corners" ||availOddsReplica[y].type === "First Match Corner" || availOddsReplica[y].type === "Last Match Corner" || availOddsReplica[y].type === "Corner Match Bet" || availOddsReplica[y].type === "Time Of First Corner") {
                    availCorner2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type === "Clean Sheet - Home" || availOddsReplica[y].type === "Clean Sheet - Away") {
                    availSpecials2.push(availOddsReplica[y]);
                }
                if (availOddsReplica[y].type === "Team To Score Last" || availOddsReplica[y].type === "Alternative Total Goals" || availOddsReplica[y].type === "Correct Score" || availOddsReplica[y].type === "Team Goalscorer" || availOddsReplica[y].type === "Multi Scorers" || availOddsReplica[y].type === "Goalscorer"|| availOddsReplica[y].type === "Early Goal" || availOddsReplica[y].type === "1st Goal Method" || availOddsReplica[y].type === "Team To Score First" || availOddsReplica[y].type === "Both Teams To Score" || availOddsReplica[y].type === "Highest Scoring Half" || availOddsReplica[y].type === "Own Goal" || availOddsReplica[y].type === "Exact Goals Number" || availOddsReplica[y].type === "Odd/Even") {
                    availGoal2.push(availOddsReplica[y]);
                }
            }
            var availableOddsArray = {
                "popular": availPopular2,
                "handicap": availHandicap2,
                "kort": availKort2,
                "corner": availCorner2,
                "goal": availGoal2,
                "specials": availSpecials2,
                "minutter": availMinutter2,
                "build": availOddsReplica
            };
            setAvailableOdds(availableOddsArray);
        })
        .catch(error => console.log('error', error));
    }, [])

    const [statsL, setStatsL] = useState([]);
    const [statsV, setStatsV] = useState([]);

    function getStats() {
        var statistics = ["possessiontime","shotstotal","shotsongoal","attacksattacks","attacksdangerous_attacks","saves", "corners","free_kick","offsides","yellowcards","redcards","throw_in"];
        var localStatArray = statsL;
        var visitorStatArray = statsV;
        return (
            <div className="stats-container">
                {statistics.map(item => {
                    var itemName = "Ukendt";
                    if (item === "possessiontime") {
                        itemName = "Boldbesiddelse";
                    } else if (item === "shotstotal") {
                        itemName = "Skud";
                    } else if (item === "shotsongoal") {
                        itemName = "Skud på mål";
                    } else if (item === "attacksattacks") {
                        itemName = "Angreb";
                    } else if (item === "attacksdangerous_attacks") {
                        itemName = "Farlige angreb";
                    } else if (item === "saves") {
                        itemName = "Redninger";
                    } else if (item === "corners") {
                        itemName = "Hjørnespark";
                    } else if (item === "free_kick") {
                        itemName = "Frispark";
                    } else if (item === "offsides") {
                        itemName = "Offsides";
                    } else if (item === "yellowcards") {
                        itemName = "Gule kort";
                    } else if (item === "redcards") {
                        itemName = "Røde kort";
                    } else if (item === "throw_in") {
                        itemName = "Indkast";
                    }
                    if (item.slice(0,5) === "shots") {
                        if (localStatArray["shots"] && visitorStatArray["shots"]) {
                            return (
                                <li key={item} className="stats-element">
                                    <div className="stats-top">
                                        <p className="stats-p">{localStatArray["shots"][item.substring(5)]}</p>
                                        <p className="stats-h1">{itemName}</p>
                                        <p className="stats-p">{visitorStatArray["shots"][item.substring(5)]}</p>
                                    </div>
                                    <div className="stats-stat">
                                        <div className="stats-left" style={{width: ((localStatArray["shots"][item.substring(5)] / (localStatArray["shots"][item.substring(5)] + visitorStatArray["shots"][item.substring(5)])) * 100) + "%"}}>
                                        </div>
                                        <div className="stats-right" style={{width: ((visitorStatArray["shots"][item.substring(5)] / (localStatArray["shots"][item.substring(5)] + visitorStatArray["shots"][item.substring(5)])) * 100) + "%"}}>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else return;
                    } else if (item.slice(0,7) === "attacks") {
                        if (localStatArray["attacks"] && visitorStatArray["attacks"]) {
                            return (
                                <li key={item} className="stats-element">
                                    <div className="stats-top">
                                        <p className="stats-p">{localStatArray["attacks"][item.substring(7)]}</p>
                                        <p className="stats-h1">{itemName}</p>
                                        <p className="stats-p">{visitorStatArray["attacks"][item.substring(7)]}</p>
                                    </div>
                                    <div className="stats-stat">
                                        <div className="stats-left" style={{width: ((localStatArray["attacks"][item.substring(7)] / (localStatArray["attacks"][item.substring(7)] + visitorStatArray["attacks"][item.substring(7)])) * 100) + "%"}}>
                                        </div>
                                        <div className="stats-right" style={{width: ((visitorStatArray["attacks"][item.substring(7)] / (localStatArray["attacks"][item.substring(7)] + visitorStatArray["attacks"][item.substring(7)])) * 100) + "%"}}>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else return;
                    } else {
                        if (localStatArray[item]) {
                            return (
                                <li key={item} className="stats-element">
                                    <div className="stats-top">
                                        <p className="stats-p">{localStatArray[item]}</p>
                                        <p className="stats-h1">{itemName}</p>
                                        <p className="stats-p">{visitorStatArray[item]}</p>
                                    </div>
                                    <div className="stats-stat">
                                        <div className="stats-left" style={{width: ((localStatArray[item] / (localStatArray[item] + visitorStatArray[item])) * 100) + "%"}}>
                                        </div>
                                        <div className="stats-right" style={{width: ((visitorStatArray[item] / (localStatArray[item] + visitorStatArray[item])) * 100) + "%"}}>
                                        </div>
                                    </div>
                                </li>
                            );
                        }
                    }
                })}
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Betting - Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/kontakt" />
                <meta name="description" content="Kontaktside for Fantasybetting - Få svar på spørgsmål du ikke finder på siden, anmeld fejl eller kom i kontakt med os." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="Fantasybetting kontakt, kontakt,kontakt Fantasybetting,Fantasybetting hjælp,kontaktside" />
                <meta itemProp="name" content="Fantasybetting Kontakt" />
                <meta itemProp="description" content="Kontaktside for Fantasybetting - Få svar på spørgsmål du ikke finder på siden, anmeld fejl eller kom i kontakt med os." />
                <meta property="og:title" content="Kontakt - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/kontakt" />
                <meta property="og:description" content="Kontaktside for Fantasybetting - Få svar på spørgsmål du ikke finder på siden, anmeld fejl eller kom i kontakt med os." />
            </Head>
            <div className="match-figure">
                <div className="info-figure1"></div>
                <div className="info-figure2"></div>
            </div>
            <div className={matchStyles.container}>
                <Back />
                <div className={matchStyles.matchInfo}>
                    <Link href={"/betting/league?id=" + result.league.data.current_season_id}>
                        <div className="match-league">
                            {result.league.data.country.data.image_path && <Image height={18} width={18} src={result.league.data.country.data.image_path} alt="" className="match-league-i" />}
                            <p className="match-league-p"><span className="match-league-light">{result.league.data.country.data.name && result.league.data.country.data.name} - </span>{result.league.data.name && result.league.data.name}{result.round !== undefined && <> | Runde {result.round.data.name}</>}</p>
                        </div>
                    </Link>
                    <div className={matchStyles.matchTitle}>
                        <div className={matchStyles.matchTeam}>
                            <div className={matchStyles.favoritWrapper} onClick={() => setFavoritter(1)} onMouseOver={() => favoritHover(1)} onMouseLeave={() => favoritUnHover(1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.favorit + " display"} id="favorit-o" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.favorit} id="favorit" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </div>
                            <Link href={"/betting/team?team=" + result.localTeam.data.id}>
                                <div className={matchStyles.matchTeamWrapper}>
                                    <div className={matchStyles.titleText}>
                                        <h1 className={matchStyles.matchH1}>{result.localTeam.data.name && result.localTeam.data.name}</h1>
                                        <p className={matchStyles.matchP}>{result.standings.localteam_position && <>{result.standings.localteam_position}. PLADS</>}</p>
                                    </div>
                                    <div className={matchStyles.matchImgCon}>
                                        {result.localTeam.data.logo_path && <Image height={95} width={95} src={result.localTeam.data.logo_path} alt="" className={matchStyles.matchImg} />}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className={matchStyles.matchStilling}>
                            <div className="match-2nd-info">
                                <div className="live-match-con">
                                    {getMatchStatus(result.time.status) && <>
                                        {result.time.status !== "NS" && result.time.status !== "LIVE" ? <p className="match-stilling-p1">{getMatchStatus(result.time.status)}</p> : <>
                                            {result.time.status === "NS" && <p className="match-stilling-p1">{restTime}</p>}
                                            {result.time.status === "LIVE" && <p className="match-stilling-p1-live">{
                                                result.time.minute <= 45 ? <>1. HALVLEG - {result.time.minute}</>
                                                :
                                                <>2. HALVLEG - {result.time.minute}</>
                                            }</p>}
                                            {result.time.status === "LIVE" && <p className="stage-blink">&apos;</p>}
                                        </>}
                                    </>}
                                </div>
                                {result.time.status === "AET" && <p className="match-stilling-p" style={{letterSpacing: "30px", marginRight: "-30px"}}>{result["scores"].ft_score && <>{result["scores"].ft_score}</>}</p>}
                                {result.time.status === "FT" && <p className="match-stilling-p" style={{letterSpacing: "30px", marginRight: "-30px"}}>{result["scores"].ft_score && <>{result["scores"].ft_score}</>}</p>}
                                {result.time.status === "LIVE" && <p className="match-stilling-p" style={{letterSpacing: "30px", marginRight: "-30px"}}>{result["scores"].localteam_score}-{result["scores"].visitorteam_score}</p>}
                                {result.time.status === "HT" && <p className="match-stilling-p" style={{letterSpacing: "30px", marginRight: "-30px"}}>{result["scores"].localteam_score}-{result["scores"].visitorteam_score}</p>}
                                {result.time.status === "FT_PEN" && <p className="match-stilling-p" style={{letterSpacing: "30px", marginRight: "-30px"}}>{result["scores"].ft_score && <>{result["scores"].ft_score}</>}</p>}
                                {result.time.status === "POSTP" && <p className="match-stilling-p">Udskudt</p>}
                                {result.time.status === "NS" && <p className="match-stilling-p">{(result.time.starting_at.time.slice(0,-3)).replace(":",".")}</p>}
                                {result.time.status === "AET" && <p className="match-stilling-box">Efter forlænget spilletid: ({result["scores"].et_score})</p>}
                                {result.time.status === "FT_PEN" && <p className="match-stilling-box">Efter straffespark: ({result["scores"].ps_score})</p>}
                                {result["aggregate"] && <p className="match-stilling-box">Resultat af første kamp ({result["aggregate"].data.result})</p>}
                                {!result["aggregate"] && <>{result["weather_report"] && <p className="match-stilling-box">Temperatur - {result["weather_report"].temperature_celcius.temp}°</p>}</>}
                                {!result["aggregate"] && <>{!result["weather_report"] && <>{result["round"] && <p className="match-stilling-box">Runde {result["round"].data.name}</p>}</>}</>}
                            </div>
                        </div>
                        <div className={matchStyles.matchTeam}>
                            <Link href={"/betting/team?team=" + result.visitorTeam.data.id}>
                                <div className={matchStyles.matchTeamWrapper}>
                                    <div className={matchStyles.titleText}>
                                        <h1 className={matchStyles.matchH1}>{result.visitorTeam.data.name && result.visitorTeam.data.name}</h1>
                                        <p className={matchStyles.matchP}>{result.standings.visitorteam_position && <>{result.standings.visitorteam_position}. PLADS</>}</p>
                                    </div>
                                    <div className={matchStyles.matchImgCon}>
                                        {result.visitorTeam.data.logo_path && <Image height={95} width={95} src={result.visitorTeam.data.logo_path} alt="" className={matchStyles.matchImg} />}
                                    </div>
                                </div>
                            </Link>
                            <div className={matchStyles.favoritWrapper} onClick={() => setFavoritter(2)} onMouseOver={() => favoritHover(2)} onMouseLeave={() => favoritUnHover(2)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.favorit + " display"} id="favorit-o2" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.favorit} id="favorit2" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={matchStyles.matchExtra}>
                        <div className={matchStyles.matchExtraDesktop}>
                            {result.time.starting_at.date_time && <div className={matchStyles.matchExtraElement}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.matchExtraIcon} viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                <p className={matchStyles.matchExtraP}>{new Date(result.time.starting_at.timestamp * 1000).getDate() + " " + getMonthAbr(new Date(result.time.starting_at.timestamp * 1000).getMonth()) + ". " + new Date(result.time.starting_at.timestamp * 1000).getFullYear() + " - " + new Date(result.time.starting_at.timestamp * 1000).getHours().toString().padStart(2, '0') + ":" + new Date(result.time.starting_at.timestamp * 1000).getMinutes().toString().padStart(2, '0')}</p>
                            </div>}
                            {result.venue && <div className={matchStyles.matchExtraElement}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.matchExtraIcon} viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>
                                    <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"/>
                                </svg>
                                <p className={matchStyles.matchExtraP}>{result.venue.data.name}</p>
                            </div>}
                            {result.referee && <div className={matchStyles.matchExtraElement}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={matchStyles.matchExtraIcon} viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                </svg>
                                <p className={matchStyles.matchExtraP}>{result.referee.data.fullname}</p>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="match-info-con">
                    <div className="match-info-half nopadding">
                        <div className="match-odds-con">
                            <div className="match-odds-nav-fix">
                                <div className="match-odds-nav" style={{paddingTop: "10px"}}>
                                    {oddNav === "popular" && <button className="oddsspil-element-active" onClick={() => {setOddNav("popular")}}>Populære</button>}
                                    {oddNav !== "popular" && <button className="oddsspil-element" onClick={() => {setOddNav("popular")}}>Populære</button>}
                                    {oddNav === "build" && <button className="oddsspil-element-active" onClick={() => {setOddNav("build")}}>Byg væddemål</button>}
                                    {oddNav !== "build" && <button className="oddsspil-element" onClick={() => {setOddNav("build")}}>Byg væddemål</button>}
                                    {oddNav === "handicap" && <button className="oddsspil-element-active" onClick={() => {setOddNav("handicap")}}>Handicap</button>}
                                    {oddNav !== "handicap" && <button className="oddsspil-element" onClick={() => {setOddNav("handicap")}}>Handicap</button>}
                                    {oddNav === "minutter" && <button className="oddsspil-element-active" onClick={() => {setOddNav("minutter")}}>Halvleg</button>}
                                    {oddNav !== "minutter" && <button className="oddsspil-element" onClick={() => {setOddNav("minutter")}}>Halvleg</button>}
                                    {oddNav === "kort" && <button className="oddsspil-element-active" onClick={() => {setOddNav("kort")}}>Kort</button>}
                                    {oddNav !== "kort" && <button className="oddsspil-element" onClick={() => {setOddNav("kort")}}>Kort</button>}
                                    {oddNav === "corner" && <button className="oddsspil-element-active" onClick={() => {setOddNav("corner")}}>Hjørnespark</button>}
                                    {oddNav !== "corner" && <button className="oddsspil-element" onClick={() => {setOddNav("corner")}}>Hjørnespark</button>}
                                    {oddNav === "goal" && <button className="oddsspil-element-active" onClick={() => {setOddNav("goal")}}>Mål</button>}
                                    {oddNav !== "goal" && <button className="oddsspil-element" onClick={() => {setOddNav("goal")}}>Mål</button>}
                                    {oddNav === "specials" && <button className="oddsspil-element-active" onClick={() => {setOddNav("specials")}}>Specials</button>}
                                    {oddNav !== "specials" && <button className="oddsspil-element" onClick={() => {setOddNav("specials")}}>Specials</button>}
                                </div>
                            </div>
                            <div className="match-odds-show">
                                <div className="match-odds-container">
                                    <div className="match-odds-section">
                                        {result.odds.data.length <= 0 && <p className="match-odds-error">Odds ikke opdateret</p>}
                                        {oddNav === "popular" && <ul className="match-odds-cont">
                                            <li key="pupular-popular" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("popular-popular").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Populære</p>
                                                    <p className="match-odds-id-p">{availableOdds["popular"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="popular-popular">
                                                    {availableOdds["popular"].map((item) => {
                                                        if (item.type === "Exact Goals Number") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.floor(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.floor(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.floor(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Correct Score") {
                                                            var maxHome = 0;
                                                            var maxAway = 0;
                                                            const homeScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1));
                                                                } else return 0;
                                                            });
                                                            const awayScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1));
                                                                } else return 0;
                                                            });
                                                            maxHome = Math.max.apply(null,homeScores)
                                                            maxAway = Math.max.apply(null,awayScores)

                                                            var activeCS = 0;
                                                            if (item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore) >= 0) {
                                                                activeCS = item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore);
                                                            }

                                                            var nowDate = new Date().getTime();
                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                            var oddofforon = "match-odds-offer-element";
                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                oddofforon = "match-odds-offer-element odd-used";
                                                            } else {
                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + activeCS);
                                                                    if (repliceIndex >= 0) {
                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special" style={{justifyContent: "space-between", alignItems: "center"}}>
                                                                            <div className="match-raisers">
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.localTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore > 0){setHomeScore(homeScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{homeScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore < maxHome){ setHomeScore(homeScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.visitorTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore > 0){setAwayScore(awayScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{awayScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore < maxAway){ setAwayScore(awayScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="match-raiser-odds">
                                                                                <div key={item.type + result.id + "-" + activeCS} className={oddofforon} style={{justifyContent: "center"}} id={item.type + result.id + "-" + activeCS} onClick={() => chooseOdd(item.type + result.id + "-" + activeCS, item.type, activeCS, item.data[activeCS].value, getLabel(item, activeCS, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h2">{item.data[activeCS].value}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <ul className="match-odds-offer">
                                                                            {item.data.map((odd, index) => {
                                                                                var nowDate = new Date().getTime();
                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                var oddofforon = "match-odds-offer-element";
                                                                                var counted = 100;
                                                                                if (item.data.length === 2 || item.data.length > 3) {
                                                                                    counted = 50;
                                                                                } else if (item.data.length === 3) {
                                                                                    counted = 33;
                                                                                }
                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                } else {
                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                        const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                        if (repliceIndex >= 0) {
                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return (
                                                                                    <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                        <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                        <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                        {oddNav === "build" && <div className="match-odds-cont">
                                            <li key="build-resultat" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("build-resultat").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Resultat</p>
                                                    <p className="match-odds-id-p">1</p>
                                                </div>
                                                <ul className="match-odds-id-con" id="build-resultat">
                                                    {availableOdds["build"].map((item) => {
                                                        if (item.type === "3Way Result") {
                                                            const fuldtid = availableOdds["build"][availableOdds["build"].findIndex(obj => obj.type === "3Way Result")];
                                                            const halvleg1 = availableOdds["build"][availableOdds["build"].findIndex(obj => obj.type === "3Way Result 1st Half")];
                                                            const halvleg2 = availableOdds["build"][availableOdds["build"].findIndex(obj => obj.type === "3Way Result 2nd Half")];
                                                            const winner10 = availableOdds["build"][availableOdds["build"].findIndex(obj => obj.type === "10 Minute Result")];
                                                            item.data.sort((a, b) => {
                                                                return parseInt(a.value) - parseInt(b.value);
                                                            });
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-offer-id">
                                                                            <div className="match-id-right">
                                                                                <p className="match-row-id-h1">{result.localTeam.data.name}</p>
                                                                                <p className="match-row-id-h1">Uafgjort</p>
                                                                                <p className="match-row-id-h1">{result.visitorTeam.data.name}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                <li key="kamp">
                                                                                    <div className="match-hz">
                                                                                        <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                            <p className="match-odds-spiller-h1">Kamp</p>
                                                                                        </div>
                                                                                        <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                            {fuldtid.data.map((ting, index) => {
                                                                                                var nowDate = new Date().getTime();
                                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                                var oddofforon = "match-odds-offer-element";
                                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                                } else {
                                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                                        const repliceIndex = btnReplica.indexOf(fuldtid.type + result.id + "-" + index);
                                                                                                        if (repliceIndex >= 0) {
                                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                return (
                                                                                                    <li key={fuldtid.type + result.id + "-" + index} className={oddofforon} id={fuldtid.type + result.id + "-" + index} onClick={() => chooseOdd(fuldtid.type + result.id + "-" + index, fuldtid.type, index, ting.value, getLabel(fuldtid, index))}>
                                                                                                        <p className="match-odds-offer-h2">{ting.value}</p>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                </li>
                                                                                <li key="halvleg1">
                                                                                    <div className="match-hz">
                                                                                        <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                            <p className="match-odds-spiller-h1">1. Halvleg</p>
                                                                                        </div>
                                                                                        <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                            {halvleg1.data.map((ting, index) => {
                                                                                                var nowDate = new Date().getTime();
                                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                                var oddofforon = "match-odds-offer-element";
                                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                                } else {
                                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                                        const repliceIndex = btnReplica.indexOf(halvleg1.type + result.id + "-" + index);
                                                                                                        if (repliceIndex >= 0) {
                                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                return (
                                                                                                    <li key={halvleg1.type + result.id + "-" + index} className={oddofforon} id={halvleg1.type + result.id + "-" + index} onClick={() => chooseOdd(halvleg1.type + result.id + "-" + index, halvleg1.type, index, ting.value, getLabel(halvleg1, index))}>
                                                                                                        <p className="match-odds-offer-h2">{ting.value}</p>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                </li>
                                                                                <li key="halvleg2">
                                                                                    <div className="match-hz">
                                                                                        <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                            <p className="match-odds-spiller-h1">2. Halvleg</p>
                                                                                        </div>
                                                                                        <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                            {halvleg2.data.map((ting, index) => {
                                                                                                var nowDate = new Date().getTime();
                                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                                var oddofforon = "match-odds-offer-element";
                                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                                } else {
                                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                                        const repliceIndex = btnReplica.indexOf(halvleg2.type + result.id + "-" + index);
                                                                                                        if (repliceIndex >= 0) {
                                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                return (
                                                                                                    <li key={halvleg2.type + result.id + "-" + index} className={oddofforon} id={halvleg2.type + result.id + "-" + index} onClick={() => chooseOdd(halvleg2.type + result.id + "-" + index, halvleg2.type, index, ting.value, getLabel(halvleg2, index))}>
                                                                                                        <p className="match-odds-offer-h2">{ting.value}</p>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                </li>
                                                                                <li key="first10">
                                                                                    <div className="match-hz">
                                                                                        <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                            <p className="match-odds-spiller-h1">10 min. vinder</p>
                                                                                        </div>
                                                                                        <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                            {winner10.data.map((ting, index) => {
                                                                                                var nowDate = new Date().getTime();
                                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                                var oddofforon = "match-odds-offer-element";
                                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                                } else {
                                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                                        const repliceIndex = btnReplica.indexOf(winner10.type + result.id + "-" + index);
                                                                                                        if (repliceIndex >= 0) {
                                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                return (
                                                                                                    <li key={winner10.type + result.id + "-" + index} className={oddofforon} id={winner10.type + result.id + "-" + index} onClick={() => chooseOdd(winner10.type + result.id + "-" + index, winner10.type, index, ting.value, getLabel(winner10, index))}>
                                                                                                        <p className="match-odds-offer-h2">{ting.value}</p>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return
                                                        }
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                            <li key="build-corner" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("build-corner").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Hjørnespark</p>
                                                    <p className="match-odds-id-p">0</p>
                                                </div>
                                                <ul className="match-odds-id-con" id="build-corner">
                                                    {availableOdds["build"].map((item) => {
                                                        if (item.type === "Alternative Total Corners") {
                                                            item.data.sort((a, b) => {
                                                                return parseInt(a.value) - parseInt(b.value);
                                                            });
                                                            var singleCorners = [];
                                                            for (var u in item.data) {
                                                                if (item.data[u].label === "Over" && singleCorners.findIndex(obj => obj.total === item.data[u].total) < 0) {
                                                                    singleCorners.push(item.data[u])
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0v6zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5z"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="match-odds-offer-id">
                                                                            <div className="match-id-right">
                                                                                <p className="match-row-id-h1">Under</p>
                                                                                <p className="match-row-id-h1">Præcis</p>
                                                                                <p className="match-row-id-h1">Over</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                {singleCorners.map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var findex = item.data.findIndex(obj => obj.label === "Under" && obj.total === odd.total)
                                                                                    var lindex = item.data.findIndex(obj => obj.label === "Exactly" && obj.total === odd.total)
                                                                                    var aindex = item.data.findIndex(obj => obj.label === "Over" && obj.total === odd.total)
                                                                                    var oddofforon0 = "match-odds-offer-element";
                                                                                    var oddofforon1 = "match-odds-offer-element";
                                                                                    var oddofforon2 = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon0 = "match-odds-offer-element odd-used";
                                                                                        oddofforon1 = "match-odds-offer-element odd-used";
                                                                                        oddofforon2 = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceFIndex = btnReplica.indexOf(item.type + result.id + "-" + findex);
                                                                                            if (repliceFIndex >= 0) {
                                                                                                oddofforon0 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceLIndex = btnReplica.indexOf(item.type + result.id + "-" + lindex);
                                                                                            if (repliceLIndex >= 0) {
                                                                                                oddofforon1 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceAIndex = btnReplica.indexOf(item.type + result.id + "-" + aindex);
                                                                                            if (repliceAIndex >= 0) {
                                                                                                oddofforon2 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={odd.label + odd.total}>
                                                                                            <div className="match-hz">
                                                                                                <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                                    <p className="match-odds-spiller-h1">{odd.total} hjørnespark</p>
                                                                                                </div>
                                                                                                <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                                    <li key={item.type + result.id + "-" + findex} className={oddofforon0} id={item.type + result.id + "-" + findex} onClick={() => chooseOdd(item.type + result.id + "-" + findex, item.type, findex, item.data[findex].value, getLabel(item, findex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[findex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + lindex} className={oddofforon1} id={item.type + result.id + "-" + lindex} onClick={() => chooseOdd(item.type + result.id + "-" + lindex, item.type, lindex, item.data[lindex].value, getLabel(item, lindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[lindex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + aindex} className={oddofforon2} id={item.type + result.id + "-" + aindex} onClick={() => chooseOdd(item.type + result.id + "-" + aindex, item.type, aindex, item.data[aindex].value, getLabel(item, aindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[aindex].value}</p>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else return;
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                            <li key="build-halvleg" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("build-minutter").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Halvleg</p>
                                                    <p className="match-odds-id-p">{availableOdds["minutter"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con" id="build-minutter">
                                                    {availableOdds["minutter"].map((item) => {
                                                        return (
                                                            <li key={item.type}>
                                                                <div className="match-bet">
                                                                    <div className="match-bet-top">
                                                                        <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                    </div>
                                                                    <ul className="match-odds-offer">
                                                                        {item.data.map((odd, index) => {
                                                                            var nowDate = new Date().getTime();
                                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                            var oddofforon = "match-odds-offer-element";
                                                                            var counted = 100;
                                                                            if (item.data.length === 2 || item.data.length > 3) {
                                                                                counted = 50;
                                                                            } else if (item.data.length === 3) {
                                                                                counted = 33;
                                                                            }
                                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                            } else {
                                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                    if (repliceIndex >= 0) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    }
                                                                                }
                                                                            }
                                                                            return (
                                                                                <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                    <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                            <li key="build-goals"className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("build-goal").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Mål</p>
                                                    <p className="match-odds-id-p">1</p>
                                                </div>
                                                <ul className="match-odds-id-con" id="build-goal">
                                                    {availableOdds["goal"].map((item) => {
                                                        if (item.type === "Exact Goals Number") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.floor(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.floor(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.floor(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Goalscorer") {
                                                            return;
                                                        } else if (item.type === "1st Goal Method") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.floor(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.floor(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.floor(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Multi Scorers" || item.type === "Team Goalscorer") {
                                                            return;
                                                        } else if (item.type === "Correct Score") {
                                                            var maxHome = 0;
                                                            var maxAway = 0;
                                                            const homeScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1));
                                                                } else return 0;
                                                            });
                                                            const awayScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1));
                                                                } else return 0;
                                                            });
                                                            maxHome = Math.max.apply(null,homeScores)
                                                            maxAway = Math.max.apply(null,awayScores)

                                                            var activeCS = 0;
                                                            if (item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore) >= 0) {
                                                                activeCS = item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore);
                                                            }

                                                            var nowDate = new Date().getTime();
                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                            var oddofforon = "match-odds-offer-element";
                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                oddofforon = "match-odds-offer-element odd-used";
                                                            } else {
                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + activeCS);
                                                                    if (repliceIndex >= 0) {
                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special" style={{justifyContent: "space-between", alignItems: "center"}}>
                                                                            <div className="match-raisers">
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.localTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore > 0){setHomeScore(homeScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{homeScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore < maxHome){ setHomeScore(homeScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.visitorTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore > 0){setAwayScore(awayScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{awayScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore < maxAway){ setAwayScore(awayScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="match-raiser-odds">
                                                                                <div key={item.type + result.id + "-" + activeCS} className={oddofforon} style={{justifyContent: "center"}} id={item.type + result.id + "-" + activeCS} onClick={() => chooseOdd(item.type + result.id + "-" + activeCS, item.type, activeCS, item.data[activeCS].value, getLabel(item, activeCS, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h2">{item.data[activeCS].value}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Alternative Total Goals") {
                                                            item.data.sort((a, b) => {
                                                                return parseInt(a.value) - parseInt(b.value);
                                                            });
                                                            var singleCorners = [];
                                                            for (var u in item.data) {
                                                                if (item.data[u].label === "Over" && singleCorners.findIndex(obj => obj.total === item.data[u].total) < 0) {
                                                                    singleCorners.push(item.data[u])
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0v6zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5z"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="match-odds-offer-id">
                                                                            <div className="match-id-right">
                                                                                <p className="match-row-id-h1" style={{width: "50%"}}>Under</p>
                                                                                <p className="match-row-id-h1" style={{width: "50%"}}>Over</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                {singleCorners.map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var findex = item.data.findIndex(obj => obj.label === "Under" && obj.total === odd.total)
                                                                                    var aindex = item.data.findIndex(obj => obj.label === "Over" && obj.total === odd.total)
                                                                                    var oddofforon0 = "match-odds-offer-element";
                                                                                    var oddofforon2 = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon0 = "match-odds-offer-element odd-used";
                                                                                        oddofforon2 = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceFIndex = btnReplica.indexOf(item.type + result.id + "-" + findex);
                                                                                            if (repliceFIndex >= 0) {
                                                                                                oddofforon0 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceAIndex = btnReplica.indexOf(item.type + result.id + "-" + aindex);
                                                                                            if (repliceAIndex >= 0) {
                                                                                                oddofforon2 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={odd.label + odd.total}>
                                                                                            <div className="match-hz">
                                                                                                <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                                    <p className="match-odds-spiller-h1">{odd.total} mål</p>
                                                                                                </div>
                                                                                                <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                                    <li key={item.type + result.id + "-" + findex} className={oddofforon0} id={item.type + result.id + "-" + findex} onClick={() => chooseOdd(item.type + result.id + "-" + findex, item.type, findex, item.data[findex].value, getLabel(item, findex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[findex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + aindex} className={oddofforon2} id={item.type + result.id + "-" + aindex} onClick={() => chooseOdd(item.type + result.id + "-" + aindex, item.type, aindex, item.data[aindex].value, getLabel(item, aindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[aindex].value}</p>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else return;
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </div>}
                                        {oddNav === "handicap" && <div className="match-odds-cont">
                                            <li key="handicap-handicap" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("handicap-handicap").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Handicap</p>
                                                    <p className="match-odds-id-p">{availableOdds["handicap"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="handicap-handicap">
                                                    {availableOdds["handicap"].map((item) => {
                                                        return (
                                                            <li key={item.type}>
                                                                <div className="match-bet">
                                                                    <div className="match-bet-top">
                                                                        <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                    </div>
                                                                    <ul className="match-odds-offer">
                                                                        {item.data.map((odd, index) => {
                                                                            var nowDate = new Date().getTime();
                                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                            var oddofforon = "match-odds-offer-element";
                                                                            var counted = 100;
                                                                            if (item.data.length === 2 || item.data.length > 3) {
                                                                                counted = 50;
                                                                            } else if (item.data.length === 3) {
                                                                                counted = 33;
                                                                            }
                                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                            } else {
                                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                    if (repliceIndex >= 0) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    }
                                                                                }
                                                                            }
                                                                            return (
                                                                                <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                    <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </div>}
                                        {oddNav === "minutter" && <ul className="match-odds-cont">
                                            <li key="minutter-minutter" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("minutter-minutter").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Halvleg</p>
                                                    <p className="match-odds-id-p">{availableOdds["minutter"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="minutter-minutter">
                                                    {availableOdds["minutter"].map((item) => {
                                                        return (
                                                            <li key={item.type}>
                                                                <div className="match-bet">
                                                                    <div className="match-bet-top">
                                                                        <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                    </div>
                                                                    <ul className="match-odds-offer">
                                                                        {item.data.map((odd, index) => {
                                                                            var nowDate = new Date().getTime();
                                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                            var oddofforon = "match-odds-offer-element";
                                                                            var counted = 100;
                                                                            if (item.data.length === 2 || item.data.length > 3) {
                                                                                counted = 50;
                                                                            } else if (item.data.length === 3) {
                                                                                counted = 33;
                                                                            }
                                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                            } else {
                                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                    if (repliceIndex >= 0) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    }
                                                                                }
                                                                            }
                                                                            return (
                                                                                <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                    <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                        {oddNav === "goal" && <ul className="match-odds-cont">
                                            <li key="goal-goal" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("goal-goal").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Mål</p>
                                                    <p className="match-odds-id-p">{availableOdds["goal"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="goal-goal">
                                                    {availableOdds["goal"].map((item) => {
                                                        if (item.type === "Exact Goals Number") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.floor(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.floor(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.floor(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "1st Goal Method") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.floor(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.floor(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.floor(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.floor(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Multi Scorers" || item.type === "Team Goalscorer") {
                                                            return;
                                                        } else if (item.type === "Correct Score") {
                                                            var maxHome = 0;
                                                            var maxAway = 0;
                                                            const homeScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(0,1));
                                                                } else return 0;
                                                            });
                                                            const awayScores = item.data.map(object => {
                                                                if (parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1)) >= 0) {
                                                                    return parseInt((object.label.replace("Draw", "").replace("1 ", "").replace("2 ", "")).slice(-1));
                                                                } else return 0;
                                                            });
                                                            maxHome = Math.max.apply(null,homeScores)
                                                            maxAway = Math.max.apply(null,awayScores)

                                                            var activeCS = 0;
                                                            if (item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore) >= 0) {
                                                                activeCS = item.data.findIndex(obj => parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(0,1)) === homeScore && parseInt((obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "")).slice(-1)) === awayScore);
                                                            }

                                                            var nowDate = new Date().getTime();
                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                            var oddofforon = "match-odds-offer-element";
                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                oddofforon = "match-odds-offer-element odd-used";
                                                            } else {
                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + activeCS);
                                                                    if (repliceIndex >= 0) {
                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special" style={{justifyContent: "space-between", alignItems: "center"}}>
                                                                            <div className="match-raisers">
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.localTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore - 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore > 0){setHomeScore(homeScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{homeScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === (homeScore + 1) + ":" + awayScore) >= 0 && <div className="match-raiser-active" onClick={() => {if (homeScore < maxHome){ setHomeScore(homeScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="match-odds-raiser">
                                                                                    <p className="match-odds-raiser-p">{result.visitorTeam.data.name}</p>
                                                                                    <div className="match-odds-raiser-con">
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore - 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore > 0){setAwayScore(awayScore - 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        <p className="match-raiser-h1">{awayScore}</p>
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) < 0 && <div className="match-raiser">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                        {item.data.findIndex(obj => obj.label.replace("Draw ", "").replace("1 ", "").replace("2 ", "") === homeScore + ":" + (awayScore + 1)) >= 0 && <div className="match-raiser-active" onClick={() => {if (awayScore < maxAway){ setAwayScore(awayScore + 1)}}}>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                                                            </svg>
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="match-raiser-odds">
                                                                                <div key={item.type + result.id + "-" + activeCS} className={oddofforon} style={{justifyContent: "center"}} id={item.type + result.id + "-" + activeCS} onClick={() => chooseOdd(item.type + result.id + "-" + activeCS, item.type, activeCS, item.data[activeCS].value, getLabel(item, activeCS, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h2">{item.data[activeCS].value}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Alternative Total Goals") {
                                                            item.data.sort((a, b) => {
                                                                return parseInt(a.value) - parseInt(b.value);
                                                            });
                                                            var singleCorners = [];
                                                            for (var u in item.data) {
                                                                if (item.data[u].label === "Over" && singleCorners.findIndex(obj => obj.total === item.data[u].total) < 0) {
                                                                    singleCorners.push(item.data[u])
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0v6zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5z"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="match-odds-offer-id">
                                                                            <div className="match-id-right">
                                                                                <p className="match-row-id-h1" style={{width: "50%"}}>Under</p>
                                                                                <p className="match-row-id-h1" style={{width: "50%"}}>Over</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                {singleCorners.map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var findex = item.data.findIndex(obj => obj.label === "Under" && obj.total === odd.total)
                                                                                    var aindex = item.data.findIndex(obj => obj.label === "Over" && obj.total === odd.total)
                                                                                    var oddofforon0 = "match-odds-offer-element";
                                                                                    var oddofforon2 = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon0 = "match-odds-offer-element odd-used";
                                                                                        oddofforon2 = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceFIndex = btnReplica.indexOf(item.type + result.id + "-" + findex);
                                                                                            if (repliceFIndex >= 0) {
                                                                                                oddofforon0 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceAIndex = btnReplica.indexOf(item.type + result.id + "-" + aindex);
                                                                                            if (repliceAIndex >= 0) {
                                                                                                oddofforon2 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={odd.label + odd.total}>
                                                                                            <div className="match-hz">
                                                                                                <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                                    <p className="match-odds-spiller-h1">{odd.total} mål</p>
                                                                                                </div>
                                                                                                <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                                    <li key={item.type + result.id + "-" + findex} className={oddofforon0} id={item.type + result.id + "-" + findex} onClick={() => chooseOdd(item.type + result.id + "-" + findex, item.type, findex, item.data[findex].value, getLabel(item, findex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[findex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + aindex} className={oddofforon2} id={item.type + result.id + "-" + aindex} onClick={() => chooseOdd(item.type + result.id + "-" + aindex, item.type, aindex, item.data[aindex].value, getLabel(item, aindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[aindex].value}</p>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <ul className="match-odds-offer">
                                                                            {item.data.map((odd, index) => {
                                                                                var nowDate = new Date().getTime();
                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                var oddofforon = "match-odds-offer-element";
                                                                                var counted = 100;
                                                                                if (item.data.length === 2 || item.data.length > 3) {
                                                                                    counted = 50;
                                                                                } else if (item.data.length === 3) {
                                                                                    counted = 33;
                                                                                }
                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                } else {
                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                        const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                        if (repliceIndex >= 0) {
                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return (
                                                                                    <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                        <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                        <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                        {oddNav === "kort" && <ul className="match-odds-cont">
                                            <li key="kort-kort" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("kort-kort").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Kort</p>
                                                    <p className="match-odds-id-p">{availableOdds["kort"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="kort-kort">
                                                    {availableOdds["kort"].map((item) => {
                                                        if (item.type === "Player to be Booked") {
                                                            if (availableOdds["kort"].findIndex(obj => obj.type === "Player to be Sent Off") >= 0) {
                                                                const mscore = availableOdds["kort"][availableOdds["kort"].findIndex(obj => obj.type === "Player to be Sent Off")];
                                                                item.data.sort((a, b) => {
                                                                    return parseInt(a.value) - parseInt(b.value);
                                                                });
                                                                return (
                                                                    <li key={item.type}>
                                                                        <div className="match-bet">
                                                                            <div className="match-bet-top">
                                                                                <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                    <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0v6zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5z"/>
                                                                                </svg>
                                                                            </div>
                                                                            <div className="match-odds-offer-id">
                                                                                <div className="match-id-right">
                                                                                    <p className="match-row-id-h1" style={{width: "50%"}}>Advarsel</p>
                                                                                    <p className="match-row-id-h1" style={{width: "50%"}}>Udvist</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="match-odds-special">
                                                                                <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                    {item.data.map((odd, index) => {
                                                                                        var nowDate = new Date().getTime();
                                                                                        var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                        var findex = item.data.findIndex(obj => obj.label === odd.label)
                                                                                        var lindex = mscore.data.findIndex(obj => obj.label === odd.label)
                                                                                        var oddofforon0 = "match-odds-offer-element";
                                                                                        var oddofforon1 = "match-odds-offer-element";
                                                                                        if (result.time.starting_at.timestamp < thistime) {
                                                                                            oddofforon0 = "match-odds-offer-element odd-used";
                                                                                            oddofforon1 = "match-odds-offer-element odd-used";
                                                                                        } else {
                                                                                            if (sessionStorage.getItem("notUsableBtn")) {
                                                                                                const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                                const repliceFIndex = btnReplica.indexOf(item.type + result.id + "-" + findex);
                                                                                                if (repliceFIndex >= 0) {
                                                                                                    oddofforon0 = "match-odds-offer-element odd-used";
                                                                                                }
                                                                                                const repliceLIndex = btnReplica.indexOf(mscore.type + result.id + "-" + lindex);
                                                                                                if (repliceLIndex >= 0) {
                                                                                                    oddofforon1 = "match-odds-offer-element odd-used";
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        var teamSite = "";
                                                                                        // if (items["localTeam"].data.squad.data.findIndex(obj => obj.player.data.display_name === odd.label) >= 0) {
                                                                                        //     teamSite = "local"
                                                                                        // } else if (items["localTeam"].data.squad.data.findIndex(obj => obj.player.data.fullname === odd.label) >= 0) {
                                                                                        //     teamSite = "local"
                                                                                        // } else if (items["localTeam"].data.squad.data.findIndex(obj => obj.player.data.common_name === odd.label) >= 0) {
                                                                                        //     teamSite = "local"
                                                                                        // } else if (items["visitorTeam"].data.squad.data.findIndex(obj => obj.player.data.display_name === odd.label) >= 0) {
                                                                                        //     teamSite = "visitor"
                                                                                        // } else if (items["visitorTeam"].data.squad.data.findIndex(obj => obj.player.data.fullname === odd.label) >= 0) {
                                                                                        //     teamSite = "visitor"
                                                                                        // } else if (items["visitorTeam"].data.squad.data.findIndex(obj => obj.player.data.common_name === odd.label) >= 0) {
                                                                                        //     teamSite = "visitor"
                                                                                        // }
                                                                                        return (
                                                                                            <li key={odd.label}>
                                                                                                <div className="match-hz">
                                                                                                    <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                                        {/* {teamSite === "local" && <div className="match-odds-img"><Image src={homelogo} layout="fill" /></div>}
                                                                                                        {teamSite === "visitor" && <div className="match-odds-img"><Image src={visitorlogo} layout="fill" /></div>} */}
                                                                                                        <p className="match-odds-spiller-h1">{odd.label}</p>
                                                                                                    </div>
                                                                                                    <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                                        <li className={oddofforon0} id={item.type + result.id + "-" + findex} onClick={() => chooseOdd(item.type + result.id + "-" + findex, item.type, findex, odd.value, getLabel(item, findex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                            <p className="match-odds-offer-h2">{item.data[findex].value}</p>
                                                                                                        </li>
                                                                                                        <li className={oddofforon1} id={mscore.type + result.id + "-" + lindex} onClick={() => chooseOdd(mscore.type + result.id + "-" + lindex, mscore.type, lindex, mscore.data[lindex].value, getLabel(item, lindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                            <p className="match-odds-offer-h2">{mscore.data[lindex].value}</p>
                                                                                                        </li>
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </li>
                                                                                        );
                                                                                    })}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            } else return;
                                                        } else if (item.type === "Team Cards") {
                                                            var underArray = [];
                                                            var overArray = [];
                                                            for (var q in item.data) {
                                                                if (item.data[q].handicap.slice(0,4) === "Over") {
                                                                    overArray.push(item.data[q]);
                                                                } else {
                                                                    underArray.push(item.data[q]);
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {underArray.reverse().map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (<>
                                                                                            {odd.label === "1" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, odd.handicap + " " + result.localTeam.data.name)}>
                                                                                                <p className="match-odds-offer-h1">{odd.handicap + " " + result.localTeam.data.name}</p>
                                                                                                <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                            </li>}
                                                                                            {odd.label === "2" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, odd.handicap + " " + result.visitorTeam.data.name)}>
                                                                                                <p className="match-odds-offer-h1">{odd.handicap + " " + result.visitorTeam.data.name}</p>
                                                                                                <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                            </li>}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {overArray.reverse().map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <>
                                                                                        {odd.label === "1" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, odd.handicap + " " + result.localTeam.data.name)}>
                                                                                            <p className="match-odds-offer-h1">{odd.handicap + " " + result.localTeam.data.name}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>}
                                                                                        {odd.label === "2" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, odd.handicap + " " + result.visitorTeam.data.name)}>
                                                                                            <p className="match-odds-offer-h1">{odd.handicap + " " + result.visitorTeam.data.name}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>}
                                                                                    </>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Player to be Sent Off") {
                                                            return;
                                                        } else {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <ul className="match-odds-offer">
                                                                            {item.data.map((odd, index) => {
                                                                                var nowDate = new Date().getTime();
                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                var oddofforon = "match-odds-offer-element";
                                                                                var counted = 100;
                                                                                if (item.data.length === 2 || item.data.length > 3) {
                                                                                    counted = 50;
                                                                                } else if (item.data.length === 3) {
                                                                                    counted = 33;
                                                                                }
                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                } else {
                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                        const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                        if (repliceIndex >= 0) {
                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return (
                                                                                    <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                        <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                        <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                        {oddNav === "corner" && <ul className="match-odds-cont">
                                            <li key="corner-corner" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("corner-corner").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Hjørnespark</p>
                                                    <p className="match-odds-id-p">{availableOdds["corner"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="corner-corner">
                                                    {availableOdds["corner"].map((item) => {
                                                        if (item.type === "Total Corners") {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice(0, (Math.ceil(item.data.length/2))).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {item.data.slice((Math.ceil(item.data.length/2)), item.data.length).map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + (index + (Math.ceil(item.data.length/2))));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + (index + (Math.ceil(item.data.length/2)))} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.ceil(item.data.length/2))), item.type, (index + (Math.ceil(item.data.length/2))), odd.value, getLabel(item, (index + (Math.ceil(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                            <p className="match-odds-offer-h1">{getLabel(item, (index + (Math.ceil(item.data.length/2))), result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Team Corners") {
                                                            var underArray = [];
                                                            var overArray = [];
                                                            for (var q in item.data) {
                                                                if (item.data[q].handicap.slice(0,4) === "Over") {
                                                                    overArray.push(item.data[q]);
                                                                } else {
                                                                    underArray.push(item.data[q]);
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer">
                                                                                {underArray.reverse().map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (<>
                                                                                            {odd.label === "1" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, odd.handicap + " " + result.localTeam.data.name)}>
                                                                                                <p className="match-odds-offer-h1">{odd.handicap + " " + result.localTeam.data.name}</p>
                                                                                                <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                            </li>}
                                                                                            {odd.label === "2" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, odd.handicap + " " + result.visitorTeam.data.name)}>
                                                                                                <p className="match-odds-offer-h1">{odd.handicap + " " + result.visitorTeam.data.name}</p>
                                                                                                <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                            </li>}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                            <ul className="match-odds-offer">
                                                                                {overArray.reverse().map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var oddofforon = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label));
                                                                                            if (repliceIndex >= 0) {
                                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (<>
                                                                                        {odd.label === "1" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, odd.handicap + " " + result.localTeam.data.name)}>
                                                                                            <p className="match-odds-offer-h1">{odd.handicap + " " + result.localTeam.data.name}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>}
                                                                                        {odd.label === "2" && <li key={item.type + result.id + "-" + index} className={oddofforon} id={item.type + result.id + "-" + item.data.findIndex(obj => obj.handicap === odd.handicap && obj.label === odd.label)} onClick={() => chooseOdd(item.type + result.id + "-" + (index + (Math.floor(item.data.length/2))), item.type, (index + (Math.floor(item.data.length/2))), odd.value, odd.handicap + " " + result.visitorTeam.data.name)}>
                                                                                            <p className="match-odds-offer-h1">{odd.handicap + " " + result.visitorTeam.data.name}</p>
                                                                                            <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                        </li>}
                                                                                    </>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else if (item.type === "Alternative Total Corners") {
                                                            item.data.sort((a, b) => {
                                                                return parseInt(a.value) - parseInt(b.value);
                                                            });
                                                            var singleCorners = [];
                                                            for (var u in item.data) {
                                                                if (item.data[u].label === "Over" && singleCorners.findIndex(obj => obj.total === item.data[u].total) < 0) {
                                                                    singleCorners.push(item.data[u])
                                                                }
                                                            }
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                                                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0v6zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5z"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="match-odds-offer-id">
                                                                            <div className="match-id-right">
                                                                                <p className="match-row-id-h1">Under</p>
                                                                                <p className="match-row-id-h1">Præcis</p>
                                                                                <p className="match-row-id-h1">Over</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="match-odds-special">
                                                                            <ul className="match-odds-offer" style={{gap: "0px"}}>
                                                                                {singleCorners.map((odd, index) => {
                                                                                    var nowDate = new Date().getTime();
                                                                                    var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                    var findex = item.data.findIndex(obj => obj.label === "Under" && obj.total === odd.total)
                                                                                    var lindex = item.data.findIndex(obj => obj.label === "Exactly" && obj.total === odd.total)
                                                                                    var aindex = item.data.findIndex(obj => obj.label === "Over" && obj.total === odd.total)
                                                                                    var oddofforon0 = "match-odds-offer-element";
                                                                                    var oddofforon1 = "match-odds-offer-element";
                                                                                    var oddofforon2 = "match-odds-offer-element";
                                                                                    if (result.time.starting_at.timestamp < thistime) {
                                                                                        oddofforon0 = "match-odds-offer-element odd-used";
                                                                                        oddofforon1 = "match-odds-offer-element odd-used";
                                                                                        oddofforon2 = "match-odds-offer-element odd-used";
                                                                                    } else {
                                                                                        if (sessionStorage.getItem("notUsableBtn")) {
                                                                                            const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                            const repliceFIndex = btnReplica.indexOf(item.type + result.id + "-" + findex);
                                                                                            if (repliceFIndex >= 0) {
                                                                                                oddofforon0 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceLIndex = btnReplica.indexOf(item.type + result.id + "-" + lindex);
                                                                                            if (repliceLIndex >= 0) {
                                                                                                oddofforon1 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                            const repliceAIndex = btnReplica.indexOf(item.type + result.id + "-" + aindex);
                                                                                            if (repliceAIndex >= 0) {
                                                                                                oddofforon2 = "match-odds-offer-element odd-used";
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <li key={odd.label + odd.total}>
                                                                                            <div className="match-hz">
                                                                                                <div style={{display: "flex", alignItems: "center", gap: "5px", width: "50%", overflow: "hidden"}}>
                                                                                                    <p className="match-odds-spiller-h1">{odd.total} hjørnespark</p>
                                                                                                </div>
                                                                                                <ul className="match-hz-offer" style={{flexDirection: "row"}}>
                                                                                                    <li key={item.type + result.id + "-" + findex} className={oddofforon0} id={item.type + result.id + "-" + findex} onClick={() => chooseOdd(item.type + result.id + "-" + findex, item.type, findex, item.data[findex].value, getLabel(item, findex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[findex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + lindex} className={oddofforon1} id={item.type + result.id + "-" + lindex} onClick={() => chooseOdd(item.type + result.id + "-" + lindex, item.type, lindex, item.data[lindex].value, getLabel(item, lindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[lindex].value}</p>
                                                                                                    </li>
                                                                                                    <li key={item.type + result.id + "-" + aindex} className={oddofforon2} id={item.type + result.id + "-" + aindex} onClick={() => chooseOdd(item.type + result.id + "-" + aindex, item.type, aindex, item.data[aindex].value, getLabel(item, aindex, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                                        <p className="match-odds-offer-h2">{item.data[aindex].value}</p>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return (
                                                                <li key={item.type}>
                                                                    <div className="match-bet">
                                                                        <div className="match-bet-top">
                                                                            <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                        </div>
                                                                        <ul className="match-odds-offer">
                                                                            {item.data.map((odd, index) => {
                                                                                var nowDate = new Date().getTime();
                                                                                var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                                var oddofforon = "match-odds-offer-element";
                                                                                var counted = 100;
                                                                                if (item.data.length === 2 || item.data.length > 3) {
                                                                                    counted = 50;
                                                                                } else if (item.data.length === 3) {
                                                                                    counted = 33;
                                                                                }
                                                                                if (result.time.starting_at.timestamp < thistime) {
                                                                                    oddofforon = "match-odds-offer-element odd-used";
                                                                                } else {
                                                                                    if (sessionStorage.getItem("notUsableBtn")) {
                                                                                        const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                        const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                        if (repliceIndex >= 0) {
                                                                                            oddofforon = "match-odds-offer-element odd-used";
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return (
                                                                                    <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                        <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                        <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                        {oddNav === "specials" && <ul className="match-odds-cont">
                                            <li key="specials-specials" className="match-odds-id">
                                                <div className="match-odds-id-top" onClick={() => document.getElementById("specials-specials").classList.toggle("display")}>
                                                    <p className="match-odds-id-h1">Specials</p>
                                                    <p className="match-odds-id-p">{availableOdds["specials"].length}</p>
                                                </div>
                                                <ul className="match-odds-id-con display" id="specials-specials">
                                                    {availableOdds["specials"].map((item) => {
                                                        return (
                                                            <li key={item.type}>
                                                                <div className="match-bet">
                                                                    <div className="match-bet-top">
                                                                        <p className="match-odds-h1">{getLabel(item, -1, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                    </div>
                                                                    <ul className="match-odds-offer">
                                                                        {item.data.map((odd, index) => {
                                                                            var nowDate = new Date().getTime();
                                                                            var thistime = parseInt((nowDate.toString()).slice(0, -3));
                                                                            var oddofforon = "match-odds-offer-element";
                                                                            var counted = 100;
                                                                            if (item.data.length === 2 || item.data.length > 3) {
                                                                                counted = 50;
                                                                            } else if (item.data.length === 3) {
                                                                                counted = 33;
                                                                            }
                                                                            if (result.time.starting_at.timestamp < thistime) {
                                                                                oddofforon = "match-odds-offer-element odd-used";
                                                                            } else {
                                                                                if (sessionStorage.getItem("notUsableBtn")) {
                                                                                    const btnReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                                                                                    const repliceIndex = btnReplica.indexOf(item.type + result.id + "-" + index);
                                                                                    if (repliceIndex >= 0) {
                                                                                        oddofforon = "match-odds-offer-element odd-used";
                                                                                    }
                                                                                }
                                                                            }
                                                                            return (
                                                                                <li key={item.type + result.id + "-" + index} className={oddofforon} style={{maxWidth: counted + "%"}} id={item.type + result.id + "-" + index} onClick={() => chooseOdd(item.type + result.id + "-" + index, item.type, index, odd.value, getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name))}>
                                                                                    <p className="match-odds-offer-h1">{getLabel(item, index, result.localTeam.data.name, result.visitorTeam.data.name)}</p>
                                                                                    <p className="match-odds-offer-h2">{odd.value}</p>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="match-info-sections">
                        <div className="match-info-half-2 nopadding">
                            <div className="match-odds-con">
                                <div className="match-odds-nav" style={{paddingTop: "10px"}}>
                                    {nav === "statistics" && <button className="oddsspil-element-active" onClick={() => {setNav("statistics")}}>Statistikker</button>}
                                    {nav !== "statistics" && <button className="oddsspil-element" onClick={() => {setNav("statistics")}}>Statistikker</button>}
                                    {nav === "ontarget" && <button className="oddsspil-element-active" onClick={() => {setNav("ontarget")}}>Indenfor rammen</button>}
                                    {nav !== "ontarget" && <button className="oddsspil-element" onClick={() => {setNav("ontarget")}}>Indenfor rammen</button>}
                                    {nav === "target" && <button className="oddsspil-element-active" onClick={() => {setNav("target")}}>På mål</button>}
                                    {nav !== "target" && <button className="oddsspil-element" onClick={() => {setNav("target")}}>På mål</button>}
                                    {nav === "cards" && <button className="oddsspil-element-active" onClick={() => {setNav("cards")}}>Kort</button>}
                                    {nav !== "cards" && <button className="oddsspil-element" onClick={() => {setNav("cards")}}>Kort</button>}
                                    {nav === "goals" && <button className="oddsspil-element-active" onClick={() => {setNav("goals")}}>Mål</button>}
                                    {nav !== "goals" && <button className="oddsspil-element" onClick={() => {setNav("goals")}}>Mål</button>}
                                    {nav === "duels" && <button className="oddsspil-element-active" onClick={() => {setNav("duels")}}>Dueller</button>}
                                    {nav !== "duels" && <button className="oddsspil-element" onClick={() => {setNav("duels")}}>Dueller</button>}
                                    {nav === "rating" && <button className="oddsspil-element-active" onClick={() => {setNav("rating")}}>Rating</button>}
                                    {nav !== "rating" && <button className="oddsspil-element" onClick={() => {setNav("rating")}}>Rating</button>}
                                </div>
                            </div>
                            {nav === "statistics" && <div className="stat-indhold">
                                {getStats()}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Match;

export async function getServerSideProps({ req, res, query }) {
    const requestConfig = {
        headers: {
            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
        }
    }
    var resp;
    var data = {};
    if (req.cookies.activeGame) {
        resp = await axios.get("https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession?game=" + req.cookies.activeGame, requestConfig);
        data = resp.data;
    }
    if (!data) {
        return {
          notFound: true,
        }
    }
    return {
        props: { data },
    }
}