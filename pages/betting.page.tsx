import * as React from 'react';
import bettingStyles from './css/modules/betting/betting.module.css';
import { getUser } from "./services/authService.js";
// import { getGameData } from "./services/algo";
import { getKupon, getString } from "./services/algo.js";
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import axios from "axios";
import cookie from 'js-cookie'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Betting({gruppespil_data, spiller_data}) {

    const [notUsableBtn, setNotUsableBtn] = useState([]);
    const [createModal, setCreateModal] = useState(false);
    const [createSuccessModal, setCreateSuccessModal] = useState(false);
    const [kuponBtn, setKuponBtn] = useState("kupon-btn odd-notusable");
    const [odds, setOdds] = useState([]);
    const [returnOdds, setReturnOdds] = useState(1);
    const [indsats, setIndsats] = useState(0);
    useEffect(() => {
        if (!indsats) {
            setIndsats(0);
        }
    }, [indsats])
    const [udbetaling, setUdbetaling] = useState(0);
    const [currentMoney, setCurrentMoney] = useState(0);

    function updateUdbetaling(type) {
        var indsatsValue = (document.getElementById("indsatsInput") as HTMLInputElement).value;
        if (!indsatsValue) {
            setUdbetaling(0);
        } else {
            setUdbetaling(returnOdds * parseInt(indsatsValue));
        }
    }

    function emptyBets() {
        setOdds([]);
        sessionStorage.setItem("odds", "");
        setReturnOdds(1);
        setIndsats(0);
        setUdbetaling(0);
        setKuponBtn("kupon-btn odd-notusable");

        setNotUsableBtn([]);
        sessionStorage.setItem("notUsableBtn", "");
        (document.getElementById("indsatsInput") as HTMLInputElement).value = "";
        if (sessionStorage.getItem("notUsableBtn") !== "" && sessionStorage.getItem("notUsableBtn") !== undefined && sessionStorage.getItem("notUsableBtn") !== null) {
            for (var l in notUsableBtn) {
                var removedPart = JSON.parse(sessionStorage.getItem("notUsableBtn"))[l].slice(11)
                const el = document.getElementById(removedPart);
                el.classList.remove("odd-used");
            }
        }
    }

    // Datoer
    useEffect(() => {
        window.addEventListener("scroll", function(){
            if (document.getElementById("md-container")) {
                var md = document.getElementById("md-container");
                md.classList.toggle("md-sticky", window.scrollY > 250);
            }
        })
    }, [])

    const [selected, setSelected] = useState(new Date());
    const [chosenDate, setChosenDate] = useState("I dag");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0,10))
    const [mainMenu, setMainMenu] = useState("anbefalet");

    const [usableTip, setUsableTip] = useState([]);
    const [loadingTip, setLoadingTip] = useState(true);
    const [tipTeamName, setTipTeamName] = useState("")

    const [items, setItems] = useState([]);
    const [loadingText, setLoadingText] = useState("Indlæser...");

    const [auth, setAuth] = useState({
        username: "",
        email: ""
    });
    const [activeGame, setActiveGame] = useState(false)
    const [activeGameName, setActiveGameName] = useState("")
    const [activeGameMoney, setActiveGameMoney] = useState(0)
    const [activeGamePosition, setActiveGamePosition] = useState(0)
    const [activeGamePlayerCount, setActiveGamePlayerCount] = useState(0)
    const [activeGameSlutdato, setActiveGameSlutdato] = useState("")

    //Get gruppespil
    useEffect(() => {
        console.log("AWS - Gruppespil:", gruppespil_data)
        if (gruppespil_data) {
            setActiveGameName(gruppespil_data.info.name);
            var slutStringDay = new Date(gruppespil_data.info.exp).getDate();
            var slutStringMonth = new Date(gruppespil_data.info.exp).getMonth() + 1;
            var slutStringYear = new Date(gruppespil_data.info.exp).getFullYear();
            setActiveGameSlutdato(slutStringDay + "/" + slutStringMonth + "/" + slutStringYear);

            for (var k in gruppespil_data.data.players) {
                // if (gruppespil_data.data.players[k].email === getUser().email) {
                //     // localStorage.setItem("notifikationer", gruppespil_data.players[k].info.notifikationer.length);
                // }
                //Calculate wins i gruppespillet
                for (var l in gruppespil_data.data.players[k].kuponer) {
                    // var calcUdbetaling = parseFloat(gruppespil_data.data.players[k].kuponer[l].fullProb) * parseFloat(gruppespil_data.players[k].odds[l].indsats);
                    // const newDate = new Date().getTime();
                    // if (gruppespil_data.players[k].odds[l].calculated === "false" && gruppespil_data.players[k].odds[l].last_date <  parseInt((newDate.toString()).slice(0, -3))) {
                    //     var odd_ids = "";
                    //     var checkArray = [];
                    //     for (var y in gruppespil_data.players[k].odds[l].bets) {
                    //         var oddId = gruppespil_data.players[k].odds[l].bets[y].game;
                    //         var resultId = gruppespil_data.players[k].odds[l].bets[y].result;
                    //         var type = gruppespil_data.players[k].odds[l].bets[y].betType;
                    //         var bettype = gruppespil_data.players[k].odds[l].type;
                    //         checkArray.push({
                    //             "game": oddId,
                    //             "result": resultId,
                    //             "type": type
                    //         })
                    //         if (odd_ids === "") {
                    //             odd_ids = oddId;
                    //         } else {
                    //             odd_ids = odd_ids + "," + oddId;
                    //         }
                    //     }
                    //     var kupon = gruppespil_data.players[k].odds[l];
                    //     multiFetch(l,checkArray,calcUdbetaling,odd_ids,k,kupon,bettype);
                    // }
                }
            }

            var n = gruppespil_data.data.players.length;
            setActiveGamePlayerCount(n);
            var weekCount = new Date().getTime() - gruppespil_data.info.iat;
            weekCount = weekCount / 1000 / 60 / 60 / 24 / 7;
            var topScorers = getTopN(gruppespil_data.data.players, n);
            topScorers.forEach(function(gameItem, index) {
                if (gameItem.email === getUser()["email"]) {
                    if (Math.floor(weekCount) <= gruppespil_data.eco.indskydelseInt) {
                        setActiveGameMoney(gameItem.info.money)
                    }
                    setActiveGamePosition(index + 1);
                }
            });

            if (Math.floor(weekCount) > gruppespil_data.eco.indskydelseInt) {
                var activeGame = cookie.get("activeGame");
                const betCalcURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/updateindskydelse";
        
                const winBody = {
                    game: activeGame + "",
                    amount: gruppespil_data.eco.indskydelseAmount,
                    players: gruppespil_data.data.players,
                    since: Math.floor(weekCount)
                }
                console.log("INDSKYDELSE", winBody)
    
                const requestConfig = {
                    headers: {
                        "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                    }
                }
                axios.patch(betCalcURL, winBody, requestConfig).then(responseTem => {
                    console.log("AWS - Indskydelse:", responseTem, winBody);
                    for (var i in responseTem.data.Item.Attributes.data.players) {
                        if (responseTem.data.Item.Attributes.data.players[i].email === getUser()["email"]) {
                            setActiveGameMoney(responseTem.data.players[i].info.money);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        } else {
            if (cookie.get("activeGame")) {
                document.getElementById("main-error").classList.add("display-flex");
                document.getElementById("main-error-p").innerHTML = "Dit aktive spil er suspenderet.";
                localStorage.setItem("aktive-spil-suspend", "true");
            }
        }
    }, [])

    function getTopN(arr, n) {
        var clone = arr.slice(0);
        // sort descending
        clone.sort(function(x, y) {
            if (x.info.money === y.info.money) return 0;
            else if (parseInt(x.info.money) < parseInt(y.info.money)) return 1;
            else return -1;
        });
        return clone.slice(0, n);
    }

    function multiFetch(l,checkArray, calcUdbetaling, odd_ids, k, kupon, type) {
        if (type === "kombination") {
            var activeGame = cookie.get("activeGame");
            const requestConfig = {
                headers: {
                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                }
            }
            fetch("https://soccer.sportmonks.com/api/v2.0/fixtures/multi/"+odd_ids+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=odds&bookmakers=2&tz=Europe/Copenhagen&per_page=150")
            .then(response => response.json())
            .then(function (result) {
                console.log("AWS - Kupon matches", result)
                var doneGames = 0;
                for (var o in result.data) {
                    if (result.data[o].time.status === "FT") {
                        doneGames = doneGames + 1;
                    }
                }
                var winning = 0;
                var winsArray = [];
                var winable = true;
                if (doneGames === result.data.length) {
                    console.log(checkArray, result.data)
                    for (var u in result.data) {
                        for (var t in checkArray) {
                            if (checkArray[t].game === result.data[u].id) {
                                if (result.data[u].odds.data[result.data[u].odds.data.findIndex(obj => obj.name === checkArray[t].type)].bookmaker.data[0].odds.data[parseInt(checkArray[t].result)].winning === true) {
                                    winning = winning + 1;
                                    winsArray.push(checkArray[t]);
                                } else if (result.data[u].odds.data[result.data[u].odds.data.findIndex(obj => obj.name === checkArray[t].type)].bookmaker.data[0].odds.data[parseInt(checkArray[t].result)].winning === null) {
                                    winable = false;
                                }
                            }
                        }
                    }
                    if (winning === parseInt(checkArray.length)) {
                        const betCalcURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/updatewin";
    
                        const winBody = {
                            game: activeGame,
                            playerIndex: parseInt(k),
                            udbetaling: Number(Number(parseFloat(calcUdbetaling)).toFixed(2)),
                            odds: parseInt(l),
                            kupon: kupon,
                            wins: winsArray
                        }
                        axios.patch(betCalcURL, winBody, requestConfig).then(responseTem => {
                            console.log("AWS - Win:", responseTem, winBody);
                        }).catch(error => {
                            console.log(error)
                        })
                    } else if (!winable) {
                        console.log("FEJL I KAMP")
                    } else {
                        const betCalcURL2 = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/updatelose";
    
                        const loseBody = {
                            game: activeGame,
                            playerIndex: parseInt(k),
                            odds: parseInt(l),
                            kupon: kupon,
                            wins: winsArray
                        }
                
                        axios.patch(betCalcURL2, loseBody, requestConfig).then(responseItem => {
                            console.log("AWS - Loss:", responseItem, loseBody);
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                }
            })
            .catch(error => console.log('error', error));
        }
    }

    //Auth, aktivt spil og odds
    useEffect(() => {
        // setAuth(getUser());
        if (cookie.get("activeGame")) {
            setActiveGame(true);
        }
        if (odds !== null && odds !== undefined) {
            if (sessionStorage.getItem("odds") !== "" && sessionStorage.getItem("odds") !== null && sessionStorage.getItem("odds") !== undefined) {
                var secreturn = JSON.parse(sessionStorage.getItem("odds"));
                var oddsreplice = 1;
                for (var u in secreturn) {
                    oddsreplice = oddsreplice * parseFloat(secreturn[u].bet.odds[secreturn[u].bet.guess].value);
                }
                setReturnOdds(oddsreplice);
                setOdds(JSON.parse(sessionStorage.getItem("odds")));
                setNotUsableBtn(JSON.parse(sessionStorage.getItem("notUsableBtn")));
                setKuponBtn("kupon-btn");
            }
        }
    }, [])

    function placeBet(matchData, buttonId, oddId) {
        oddId = parseInt(oddId)
        if (getUser()) {
            var fixture = matchData;
            if (!notUsableBtn.includes(buttonId) && odds.length < 12) {
                document.getElementById(buttonId).classList.add("odd-used");
                setNotUsableBtn([...notUsableBtn, "3Way Result"+buttonId]);
                sessionStorage.setItem("notUsableBtn", JSON.stringify([...notUsableBtn, "3Way Result"+buttonId]))
        
                var mstime = new Date().getTime();
                var randomNumber = Math.floor(Math.random() * 512);
                var randomId = mstime+"-"+randomNumber;
                fixture.id = randomId
                fixture.bet.guess = oddId
    
                if (oddId === 0) {
                    fixture.bet.label = fixture.match.localTeam.name;
                } else if (oddId === 1) {
                    fixture.bet.label = "Uafgjort";
                } else if (oddId === 2) {
                    fixture.bet.label = fixture.match.visitorTeam.name;
                }
        
                for (var o in odds) {
                    setReturnOdds(returnOdds * odds[o].probability);
                }
                setOdds([...odds, fixture]);
                console.log(odds, fixture)
                setReturnOdds(returnOdds * parseFloat(fixture.bet.odds[oddId].value));
                if (udbetaling === 0) {
                    setUdbetaling((parseFloat(fixture.bet.odds[oddId].value) * indsats));
                } else {
                    setUdbetaling((returnOdds * parseFloat(fixture.bet.odds[oddId].value)) * indsats);
                }
                setKuponBtn("kupon-btn");
                sessionStorage.setItem("odds", JSON.stringify([...odds, fixture]))
            } else if (odds.length >= 6) {
                // setNotiMessage("error", "For mange væddemål", "Du har allerede 12 ud af 12 mulige væddemål pr. kupon.")
            } else if (notUsableBtn.includes(buttonId)) {
                // rem3wayBet(fixture.id, "3Way Result", oddId);
            }
        } else {
            window.open("/login", "_self")
        }
    }

    function delBet(betId, matchId) {
        var returnOddsNew = 1;
        var udbetalingNew = 0;
        for (var y in odds) {
            if (odds[y].id === betId) {
                const betIdIndex = "3Way Result"+matchId+"-"+odds[y].bet.guess;

                var index = notUsableBtn.indexOf(betIdIndex);
                notUsableBtn.splice(index, 1);

                var storageReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                var indexRep = storageReplica.indexOf(betIdIndex);
                storageReplica.splice(indexRep, 1)
                sessionStorage.setItem("notUsableBtn", JSON.stringify(storageReplica));

                setOdds(odds.filter(item => item.id !== betId));
                var replica = odds.filter(item => item.id !== betId);
                sessionStorage.setItem("odds", JSON.stringify(replica));
            } else {
                returnOddsNew = returnOddsNew * odds[y].bet.odds[odds[y].bet.guess].value;
                udbetalingNew = returnOddsNew * indsats;
            }
        }
        setReturnOdds(returnOddsNew);
        setUdbetaling(udbetalingNew);
    }

    function remBet(matchId, matchType, guess) {
        var returnOddsNew = 1;
        var udbetalingNew = 0;
        var oddsSession = JSON.parse(sessionStorage.getItem("odds"));
        for (var y in oddsSession) {
            if (oddsSession[y].bet.guess !== guess) {
                returnOddsNew = returnOddsNew * parseFloat(oddsSession[y].bet.odds[odds[y].bet.guess].value);
                udbetalingNew = returnOddsNew * indsats;
            }
            if (oddsSession[y].match.id === matchId && oddsSession[y].bet.guess === guess) {
                const betIdIndex = matchType+matchId+"-"+oddsSession[y].bet.guess;

                var storageReplica = JSON.parse(sessionStorage.getItem("notUsableBtn"));
                var indexRep = storageReplica.indexOf(betIdIndex);
                storageReplica.splice(indexRep, 1);
                setNotUsableBtn(storageReplica);
                sessionStorage.setItem("notUsableBtn", JSON.stringify(storageReplica));

                var oddsSessionIndex = oddsSession.findIndex(item => item.match.id === matchId && item.bet.guess === guess && item.bet.type === matchType);
                oddsSession.splice(oddsSessionIndex, 1);
                setOdds(oddsSession);
                sessionStorage.setItem("odds", JSON.stringify(oddsSession));
            }
        }
        setReturnOdds(returnOddsNew);
        setUdbetaling(udbetalingNew);
    }

    var checkMonth = "" + (new Date().getMonth() + 1);
    if (checkMonth.length === 1) {
        checkMonth = "0" + checkMonth;
    }
    var checkDay = "" + new Date().getDate();
    if (checkDay.length === 1) {
        checkDay = "0" + checkDay;
    }
    var checkDay2 = "" + (new Date().getDate() + 1);
    if (checkDay2.length === 1) {
        checkDay2 = "0" + checkDay2;
    }

    var leagueQuery = "fixtures/date/"+ new Date().getFullYear() + "-" + checkMonth + "-" + checkDay;

    //Efter ny dato valgt
    useEffect(() => {
        var checkMonths = "" + (new Date(selected).getMonth() + 1);
        if (checkMonths.length === 1) {
            checkMonths = "0" + checkMonths;
        }
        var checkDays = "" + new Date(selected).getDate();
        if (checkDays.length === 1) {
            checkDays = "0" + checkDays;
        }
        var checkDay2s = "" + (new Date(new Date(selected).getTime() + (3600 * 1000 * 24)).getDate());
        if (checkDay2s.length === 1) {
            checkDay2s = "0" + checkDay2s;
        }
        var checkMonths2 = checkMonths;
        if (new Date(new Date(selected).getTime() + (3600 * 1000 * 24)).getDate() === 1) {
            checkMonths2 = "" + (new Date(selected).getMonth() + 2);
            if (checkMonths2.length === 1) {
                checkMonths2 = "0" + checkMonths2;
            }
        }
        if (new Date(selected).getDate() === new Date().getDate() && new Date(selected).toLocaleString("da-DK", {month: 'long'}) === new Date().toLocaleString("da-DK", {month: 'long'}) && new Date(selected).getFullYear === new Date().getFullYear) {
            setChosenDate("I dag");;
        } else if (new Date(selected).getDate() === new Date().getDate() + 1 && new Date(selected).toLocaleString("da-DK", {month: 'long'}) === new Date().toLocaleString("da-DK", {month: 'long'}) && new Date(selected).getFullYear === new Date().getFullYear) {
            setChosenDate("I morgen")
        } else if (new Date(selected).getDate() === new Date().getDate() - 1 && new Date(selected).toLocaleString("da-DK", {month: 'long'}) === new Date().toLocaleString("da-DK", {month: 'long'}) && new Date(selected).getFullYear === new Date().getFullYear) {
            setChosenDate("I går")
        } else {
            setChosenDate(new Date(selected).getDate() + " " + new Date(selected).toLocaleString("da-DK", {month: 'long'}))
        }
        leagueQuery = "fixtures/date/" + new Date(selected).getFullYear() + "-" + checkMonths + "-" + checkDays;
        
        var tMonth = (new Date(selected).getMonth() + 1) + "";
        if (tMonth.length === 1) {
            tMonth = "0" + tMonth;
        }
        var tDate = new Date(selected).getDate() + "";
        if (tDate.length === 1) {
            tDate = "0" + tDate;
        }
        setSelectedDate(new Date(selected).getFullYear() + "-" + tMonth + "-" + tDate);
        setLoadingText("Indlæser...");
    }, [selected])

    //Hent tips
    useEffect(() => {
        if (items.length > 0) {
            getTip()
        }
    }, [items])

    //Hent nye kampe efter ny dato valgt
    useEffect(() => {
        var isCancelled = false;
        var t0 = new Date().getTime();
        fetch("https://soccer.sportmonks.com/api/v2.0/"+leagueQuery+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=localTeam,visitorTeam,odds,league,league.country,league.round,localTeam.country,visitorTeam.country&bookmakers=2&tz=Europe/Copenhagen&per_page=150")
        .then(response => response.json())
        .then(function (result) {
            if (!isCancelled) {
                console.log("Sportmonks - Fixtures:", result);
                console.log("Første fetch: " + (new Date().getTime() - t0) + " ms")
                var th0 = new Date().getTime();
                if (result.meta.pagination.total > result.meta.pagination.count) {
                    fetch("https://soccer.sportmonks.com/api/v2.0/"+leagueQuery+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=localTeam,visitorTeam,odds,league,league.country,localTeam.country,visitorTeam.country&bookmakers=2&tz=Europe/Copenhagen&per_page=150&page=2")
                    .then(response => response.json())
                    .then(function (response) {
                        console.log("Sportmonks - Fixtures Page 2:", response);
                        console.log("Anden fetch: " + (new Date().getTime() - t0) + " ms - Call: " + (new Date().getTime() - th0) + " ms")
    
                        var pagesArray = [...result.data, ...response.data];
                        setItems(pagesArray);
                        setLoadingText("");
                    })
                    .catch(error => console.log('error', error));
                } else {
                    setItems(result.data);
                    setLoadingText("");
                }
            }
        })
        .catch(error => console.log('error', error));

        return () => {
            isCancelled = true;
        }
    }, [selected])

    function setDateActive(date) {
        const dates = ["date-bw-6", "date-bw-5", "date-bw-4", "date-bw-3", "date-bw-2", "date-bw-1", "date-0", "date-fw-1", "date-fw-2", "date-fw-3", "date-fw-4", "date-fw-5", "date-fw-6"]
        for (var q in dates) {
            document.getElementById(dates[q]).classList.remove("md-active");
        }
        document.getElementById(date).classList.add("md-active");
    }

    function getDates() {
        const today = new Date().getTime();
        var kommendeDates = [];
        var earlyDates = [];
        for(var i = 1; i < 7; i++){
            var dato = new Date(new Date(today).getTime() + (3600 * 1000 * 24 * i)).getDate() + "";
            if (dato.length === 1) {
                dato = "0" + dato;
            }
            var month = (new Date(new Date(today).getTime() + (3600 * 1000 * 24 * i)).getMonth() + 1) + "";
            if (month.length === 1) {
                month = "0" + month;
            }
            if (new Date(new Date(today).getTime() + (3600 * 1000 * 24 * i)).getDate() === new Date(new Date(today).getTime() + (3600 * 1000 * 24 * 1)).getDate() && (new Date(new Date(today).getTime() + (3600 * 1000 * 24 * i)).getMonth() + 1) === (new Date(new Date(today).getTime() + (3600 * 1000 * 24 * 1)).getMonth() + 1)) {
                kommendeDates.push({
                    date: "I morgen",
                    days: i
                });
            } else {
                kommendeDates.push({
                    date: dato + "." + month,
                    days: i
                });
            }
        }
        for(var i = 1; i < 7; i++){
            var dato = new Date(new Date(today).getTime() - (3600 * 1000 * 24 * i)).getDate() + "";
            if (dato.length === 1) {
                dato = "0" + dato;
            }
            var month = (new Date(new Date(today).getTime() - (3600 * 1000 * 24 * i)).getMonth() + 1) + "";
            if (month.length === 1) {
                month = "0" + month;
            }
            if (new Date(new Date(today).getTime() - (3600 * 1000 * 24 * i)).getDate() === new Date(new Date(today).getTime() - (3600 * 1000 * 24 * 1)).getDate() && (new Date(new Date(today).getTime() - (3600 * 1000 * 24 * i)).getMonth() + 1) === (new Date(new Date(today).getTime() - (3600 * 1000 * 24 * 1)).getMonth() + 1)) {
                earlyDates.push({
                    date: "I går",
                    days: i
                });
            } else {
                earlyDates.push({
                    date: dato + "." + month,
                    days: i
                });
            }
        }
        return (
            <ul className="md-wrapper" id="md-wrapper">
                {earlyDates.reverse().map((date) => {
                    return (
                        <li key={"date-bw-" + date.days} className="md-element" id={"date-bw-" + date.days} onClick={() => {setSelected(new Date(new Date(today).getTime() - (3600 * 1000 * 24 * date.days)));setDateActive("date-bw-" + date.days)}}>
                            <p className="md-p">{date.date}</p>
                        </li>
                    )
                })}
                <li key={"date-0"} className="md-element md-active" id="date-0" onClick={() => {setSelected(new Date(new Date(today).getTime()));setDateActive("date-0")}}>
                    <p className="md-p">I dag</p>
                </li>
                {kommendeDates.map((date) => {
                    return (
                        <li key={"date-fw-" + date.days} className="md-element" id={"date-fw-" + date.days} onClick={() => {setSelected(new Date(new Date(today).getTime() + (3600 * 1000 * 24 * date.days)));setDateActive("date-fw-" + date.days)}}>
                            <p className="md-p">{date.date}</p>
                        </li>
                    )
                })}
            </ul>
        );
    }

    function getMatches() {
        var normLeagues = [8, 271, 274, 2, 564, 82, 301, 384];
        var leagues = [];
        var newItems = items;
        if (newItems.length > 0) {
            for (var g in newItems) {
                var id3 = leagues.findIndex(obj => obj.id === newItems[g].league.data.id);
                if (id3 < 0) {
                    if (newItems[g].league.data.round !== undefined) {
                        leagues.push({
                            id: newItems[g].league.data.id,
                            name: newItems[g].league.data.name,
                            season: newItems[g].league.data.current_season_id,
                            round: newItems[g].league.data.round.data.name,
                            img: newItems[g].league.data.country.data.image_path
                        });
                    } else {
                        leagues.push({
                            id: newItems[g].league.data.id,
                            name: newItems[g].league.data.name,
                            season: newItems[g].league.data.current_season_id,
                            img: newItems[g].league.data.country.data.image_path
                        });
                    }
                    
                }
            }
        }
        leagues.sort((a, b) => {
            return a.id - b.id;
        });
        for (var o in normLeagues) {
            if (leagues.length > 0) {
                for (var p in leagues) {
                    var dupli = {};
                    if (normLeagues[o] === leagues[p].id) {
                        dupli = leagues[p];
                        var id = parseInt(p);
                        leagues.splice(id, 1);
                        leagues.unshift(dupli);
                    }
                }
            }
        }
        return (
            <ul>
                {loadingText === "" && <>
                    {items.length <= 0 && <p className={bettingStyles.nogames}>Der kunne ikke findes nogen kampe d. {new Date(selected).getDate()}/{new Date(selected).getMonth() + 1}/{new Date(selected).getFullYear()}...</p>}
                    {leagues.map(league => {
                        var leagueParse = league.id;
                        var dateParse = selectedDate;
                        var getType = items;
                        return (
                            <>
                                <li key={league.season + league.name} className="stage-kampe-section">
                                    <Link href={"/betting/league?id=" + league.season} className="stage-kampe-head">
                                        <p className="stage-league">
                                            <Image width={18} height={18} className="inline-img" src={league.img} alt="" />
                                            {league.name}{league.round !== undefined && <> | Runde {league.round}</>}
                                        </p>
                                    </Link>
                                    <div className="stage-kampe">
                                        <ul>
                                            {getType.map(item => {
                                                if (item.odds.data.findIndex(obj => obj.name === "3Way Result") >= 0 && (leagueParse !== 0 && item.league_id === leagueParse && item.time.starting_at.date === dateParse && item.odds.data.length > 0) || (leagueParse === 0 && item.league_id !== 2 && item.league_id !== 271 && item.league_id !== 8 && item.league_id !== 564 && item.league_id !== 301 && item.league_id !== 82 && item.league_id !== 573 && item.time.starting_at.date === dateParse && item.odds.data.length > 0) && (item.odds.data[0].bookmaker.data[0].odds.data[0].value && item.odds.data[0].bookmaker.data[0].odds.data[1].value && item.odds.data[0].bookmaker.data[0].odds.data[2].value)) {
                                                    var betButton1;
                                                    var betButton2;
                                                    var betButton3;
                                                    var matchData = {
                                                        match: {
                                                            id: item.id,
                                                            league_id: item.league_id,
                                                            starting_at: item.time.starting_at.timestamp,
                                                            localTeam: {
                                                                id: item.localteam_id,
                                                                name: item.localTeam.data.name
                                                            },
                                                            visitorTeam: {
                                                                id: item.visitorteam_id,
                                                                name: item.visitorTeam.data.name
                                                            }
                                                        },
                                                        bet: {
                                                            odds: item.odds.data[item.odds.data.findIndex(obj => obj.name === "3Way Result")].bookmaker.data[0].odds.data,
                                                            type: "3Way Result"
                                                        }
                                                    }
                                                    if (item.time.status === "NS") {
                                                        betButton1 = <button className="stage-kampe-odds-btn" id={item.id + "-" + "0"} onClick={() => placeBet(matchData, item.id + "-" + "0", 0)}><p className="odd-data-p">1</p><p className="odd-data-h1">{item.odds.data[item.odds.data.findIndex(obj => obj.name === "3Way Result")].bookmaker.data[0].odds.data[0].value}</p></button>;
                                                        betButton2 = <button className="stage-kampe-odds-btn" id={item.id + "-" + "1"} onClick={() => placeBet(matchData, item.id + "-" + "1", 1)}><p className="odd-data-p">X</p><p className="odd-data-h1">{item.odds.data[item.odds.data.findIndex(obj => obj.name === "3Way Result")].bookmaker.data[0].odds.data[1].value}</p></button>;
                                                        betButton3 = <button className="stage-kampe-odds-btn" id={item.id + "-" + "2"} onClick={() => placeBet(matchData, item.id + "-" + "2", 2)}><p className="odd-data-p">2</p><p className="odd-data-h1">{item.odds.data[item.odds.data.findIndex(obj => obj.name === "3Way Result")].bookmaker.data[0].odds.data[2].value}</p></button>;
                                                    }
                            
                                                    if (sessionStorage.getItem("notUsableBtn") !== "" && sessionStorage.getItem("notUsableBtn") !== null && sessionStorage.getItem("notUsableBtn") !== undefined) {
                                                        for (var p in JSON.parse(sessionStorage.getItem("notUsableBtn"))) {
                                                            var removedPart = JSON.parse(sessionStorage.getItem("notUsableBtn"))[p].slice(11)
                                                            if (removedPart === item.id + "-" + "0") {
                                                                betButton1 = <button className="stage-kampe-odds-btn odd-used" onClick={() => remBet(item.id, matchData.bet.type, 0)}><p className="odd-data-p">1</p><p className="odd-data-h1">{item.odds.data[0].bookmaker.data[0].odds.data[0].value}</p></button>;
                                                            }
                                                            if (removedPart === item.id + "-" + "1") {
                                                                betButton2 = <button className="stage-kampe-odds-btn odd-used" onClick={() => remBet(item.id, matchData.bet.type, 1)}><p className="odd-data-p">X</p><p className="odd-data-h1">{item.odds.data[0].bookmaker.data[0].odds.data[1].value}</p></button>;
                                                            }
                                                            if (removedPart === item.id + "-" + "2") {
                                                                betButton3 = <button className="stage-kampe-odds-btn odd-used" onClick={() => remBet(item.id, matchData.bet.type, 2)}><p className="odd-data-p">2</p><p className="odd-data-h1">{item.odds.data[0].bookmaker.data[0].odds.data[2].value}</p></button>;
                                                            }
                                                        }
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
                                                                        <div className="stage-time-small">
                                                                            <div className="stage-time-con">
                                                                                <p className="stage-kampe-minut">{new Date(item.time.starting_at.timestamp*1000).getHours().toString().padStart(2, '0') + ":" + new Date(item.time.starting_at.timestamp*1000).getMinutes().toString().padStart(2, '0')}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {item.time.status === "FT" &&
                                                                        <>
                                                                            <div className="stage-time-small">
                                                                                <div className="stage-time-con">
                                                                                    <p className="stage-kampe-minut">FT</p>
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
                                                                            <div className="stage-time-small">
                                                                                <div className="stage-time-con">
                                                                                    <p className="stage-kampe-minut">EFS</p>
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
                                                                            <div className="stage-time-small">
                                                                                <div className="stage-time-con">
                                                                                    <p className="stage-kampe-minut">Str.</p>
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
                                                                            <div className="stage-time-small">
                                                                                <div className="stage-time-con">
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
                                                                {item.time.status === "NS" && <div className="stage-kampe-odds">
                                                                        {betButton1}
                                                                        {betButton2}
                                                                        {betButton3}
                                                                </div>}
                                                                {item.time.status !== "NS" && <div className="stage-kampe-odds-fix"></div>}
                                                            </div>
                                                        </div>
                                                    </li>);
                                                } else return;
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            </>
                        );
                    })}
                </>}
                {loadingText !== "" && <div className={bettingStyles.skeletonWrapper}>
                    <div className={bettingStyles.skeletonElement}>
                        <Skeleton height="20px" />
                        <Skeleton height="50px" />
                    </div>
                    <div className={bettingStyles.skeletonElement}>
                        <Skeleton height="20px" />
                        <Skeleton height="50px" />
                    </div>
                    <div className={bettingStyles.skeletonElement}>
                        <Skeleton height="20px" />
                        <Skeleton height="50px" />
                    </div>
                </div>}
            </ul>
        );
    }

    function getTeams() {
        var teamsArr = [];
        for (var q in items) {
            if (teamsArr.findIndex(obj => obj.name === items[q].localTeam.data.name) < 0) {
                teamsArr.push(items[q].localTeam.data)
            }
            if (teamsArr.findIndex(obj => obj.name === items[q].visitorTeam.data.name) < 0) {
                teamsArr.push(items[q].visitorTeam.data)
            }
        }
        teamsArr.sort((a, b) => {
            return a.id - b.id;
        });
        return (
            <div className={bettingStyles.sidemenuWrapper}>
                {teamsArr.map((team) => {
                    return (
                        <Link href={"/betting/team?team=" + team.id} key={team.id} className={bettingStyles.sidemenuElement}>
                            <div className={bettingStyles.sidemenuImg}>
                                <Image width={26} height={26} src={team.logo_path} alt="" />
                            </div>
                            <div className={bettingStyles.sidemenuInfo}>
                                <p className={bettingStyles.sidemenuH2}>{team.name}</p>
                                <p className={bettingStyles.sidemenuP}>{team.country.data.name}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    }

    function createTip() {
        var usables = usableTip;
        if (usables.length < 1 && !loadingTip) {
            return (
                <ul className={bettingStyles.tipContainer}>
                    <p className={bettingStyles.nogames}>Der kunne ikke findes nogen anbefalede væddemål for {tipTeamName}</p>
                </ul>
            )
        } else if (!loadingTip) {
            return (
                <ul className={bettingStyles.tipContainer}>
                    {usables.map((tip) => {
                        var betButton;
                        if (tip.match.starting_at * 1000 > new Date().getTime()) {
                            betButton = <button className={bettingStyles.tipBtn} id={tip.match.id + "-" + tip.bet.guess} onClick={() => placeBet(tip, tip.match.id + "-" + tip.bet.guess, tip.bet.guess)}>{tip.bet.odds[tip.bet.guess].value}</button>
                        }

                        if (sessionStorage.getItem("notUsableBtn") !== "" && sessionStorage.getItem("notUsableBtn") !== null && sessionStorage.getItem("notUsableBtn") !== undefined) {
                            for (var p in JSON.parse(sessionStorage.getItem("notUsableBtn"))) {
                                var removedPart = JSON.parse(sessionStorage.getItem("notUsableBtn"))[p].slice(11)
                                if (removedPart === tip.match.id + "-" + tip.bet.guess) {
                                    betButton = <button className={bettingStyles.tipBtnUsed} onClick={() => remBet(tip.match.id, tip.bet.type, tip.bet.guess)}>{tip.bet.odds[tip.bet.guess].value}</button>;
                                }
                            }
                        }
                        return (
                            <li key={tip.id} className={bettingStyles.tipElement}>
                                <div className={bettingStyles.tipContent}>
                                    <div>
                                        <p className={bettingStyles.tipH1}>{tip.match.localTeam.name} - {tip.match.visitorTeam.name}</p>
                                        <p className={bettingStyles.tipH3}>{tip.bet.guessText}</p>
                                    </div>
                                    <div className={bettingStyles.tipOdds}>
                                        {betButton}
                                    </div>
                                </div>
                                <p className={bettingStyles.tipP}>{tip.bet.text}</p>
                            </li>
                        )
                    })}
                </ul>
            );
        }
    }

    function getTip() {
        setLoadingTip(true)
        var teams = [];
        for (var t in items) {
            teams.push(items[t].localteam_id)
            teams.push(items[t].visitorteam_id)
        }
        var teamid = teams[Math.floor(Math.random() * teams.length)];
        fetch("https://soccer.sportmonks.com/api/v2.0/teams/"+teamid+"?api_token="+"kvgDywRFDSqPhS9iYQynEci42JvyVtqLpCXBJlBHrH5v8Br8RtrEayi94Ybf"+"&include=latest,latest.&bookmakers=2&tz=Europe/Copenhagen&per_page=150")
        .then(response => response.json())
        .then(function (result) {
            console.log("Sportmonks - Tip:", result);
            var latest = result.data.latest.data;
            latest.sort((b, a) => {
                return a.time.starting_at.timestamp - b.time.starting_at.timestamp;
            });
            var latest5 = latest.slice(0,5);
            var unbeaten = 0;
            var won = 0;
            var lost = 0;
            var draw = 0;
            var morethan1goal = 0;
            var morethan2goal = 0;
            for (var q in latest5) {
                var whoami = "";
                if (latest5[q].visitorteam_id === teamid) {
                    whoami = "visitor"
                } else if (latest5[q].localteam_id === teamid) {
                    whoami = "local"
                } else {
                    whoami = null;
                }
                if (whoami === "local") {
                    if (latest5[q].winner_team_id !== latest5[q].visitorteam_id) {
                        unbeaten = unbeaten + 1
                    }
                    if (latest5[q].winner_team_id === latest5[q].localteam_id) {
                        won = won + 1
                    }
                    if (latest5[q].winner_team_id === latest5[q].visitorteam_id) {
                        lost = lost + 1
                    }
                    if (latest5[q].winner_team_id !== latest5[q].localteam_id && latest5[q].winner_team_id !== latest5[q].visitorteam_id) {
                        draw = draw + 1
                    }
                    if (latest5[q].scores.localteam_score > 1) {
                        morethan1goal = morethan1goal + 1
                    }
                    if (latest5[q].scores.localteam_score > 2) {
                        morethan2goal = morethan2goal + 1
                    }
                } else if (whoami === "visitor") {
                    if (latest5[q].winner_team_id !== latest5[q].localteam_id) {
                        unbeaten = unbeaten + 1
                    }
                    if (latest5[q].winner_team_id === latest5[q].visitorteam_id) {
                        won = won + 1
                    }
                    if (latest5[q].winner_team_id === latest5[q].localteam_id) {
                        lost = lost + 1
                    }
                    if (latest5[q].winner_team_id !== latest5[q].localteam_id && latest5[q].winner_team_id !== latest5[q].visitorteam_id) {
                        draw = draw + 1
                    }
                    if (latest5[q].scores.visitorteam_score > 1) {
                        morethan1goal = morethan1goal + 1
                    }
                    if (latest5[q].scores.visitorteam_score > 2) {
                        morethan2goal = morethan2goal + 1
                    }
                }
            }
            var usables = [];
            var foundmatch = items[items.findIndex(obj => obj.localTeam.data.id === teamid || obj.visitorTeam.data.id === teamid)]
            if (foundmatch) {
                var teamname = "undefined"
                var teamtype = "undefined"
                if (foundmatch.localteam_id === teamid) {
                    teamname = foundmatch.localTeam.data.name
                    teamtype = "local"
                } else if (foundmatch.visitorteam_id === teamid) {
                    teamname = foundmatch.visitorTeam.data.name
                    teamtype = "visitor"
                }
                setTipTeamName(teamname)

                var matchData = {
                    match: {
                        id: foundmatch.id,
                        league_id: foundmatch.league_id,
                        starting_at: foundmatch.time.starting_at.timestamp,
                        localTeam: {
                            id: foundmatch.localteam_id,
                            name: foundmatch.localTeam.data.name
                        },
                        visitorTeam: {
                            id: foundmatch.visitorteam_id,
                            name: foundmatch.visitorTeam.data.name
                        }
                    },
                    bet: {
                        odds: foundmatch.odds.data[foundmatch.odds.data.findIndex(obj => obj.name === "3Way Result")].bookmaker.data[0].odds.data,
                        type: "3Way Result",
                        guess: 0,
                        label: "undefined",
                        text: "undefined",
                        guessText: "undefined"
                    },
                    id: foundmatch.id + "-"
                }

                if (unbeaten >= 4) {
                    var returnresult = "0"
                    if (teamtype === "local") {
                        returnresult = "0"
                    } else if (teamtype === "visitor") {
                        returnresult = "2"
                    }
                    matchData.bet.guess = parseInt(returnresult)
                    matchData.bet.text = teamname + " er ubesejret i " + unbeaten + " af seneste 5 kampe"
                    matchData.bet.guessText = teamname + " vinder"
                    if (usables.findIndex(obj => obj.id + returnresult === foundmatch.id + "-" + returnresult) < 0) {
                        usables.push(matchData)
                    }
                }
                if (won >= 3) {
                    var returnresult = "0"
                    if (teamtype === "local") {
                        returnresult = "0"
                    } else if (teamtype === "visitor") {
                        returnresult = "2"
                    }
                    matchData.bet.guess = parseInt(returnresult)
                    matchData.bet.text = teamname + " har vundet " + won + " af seneste 5 kampe"
                    matchData.bet.guessText = teamname + " vinder"
                    if (usables.findIndex(obj => obj.id + returnresult === foundmatch.id + "-" + returnresult) < 0) {
                        usables.push(matchData)
                    }
                }
                if (draw >= 3) {
                    var returnresult = "1"
                    matchData.bet.guess = parseInt(returnresult)
                    matchData.bet.text = teamname + " har spillet " + draw + " uafgjort af seneste 5 kampe"
                    matchData.bet.guessText = "Uafgjort"
                    if (usables.findIndex(obj => obj.id + returnresult === foundmatch.id + "-" + returnresult) < 0) {
                        usables.push(matchData)
                    }
                }
                setUsableTip(usables);
                setLoadingTip(false)
            } else {
                setUsableTip([])
                setLoadingTip(false)
            }
            setLoadingTip(false)
        })
        .catch(error => {console.log('error', error);setLoadingTip(false)});
    }

    function createBet() {
        if (odds.length <= 0) {
            return
        } else if (!cookie.get("activeGame")) {
            return
        } else if (new Date().getTime() > new Date(gruppespil_data.varighed).getTime()) {
            return
        } else if (indsats <= 0) {
            return
        } else if (indsats < 10) {
            return
        } else if (indsats > 3000) {
            return
        }

        var newDiv = JSON.parse(sessionStorage.getItem("odds"));
        var valueArr = newDiv.map(function(item){ return item.id });
        var isDuplicate = valueArr.some(function(item, idx){ 
            return valueArr.indexOf(item) != idx 
        });
        if (isDuplicate) {
            return
        }
        for (var p in odds) {
            if (odds[p].match.starting_at * 1000 < new Date().getTime()) {
                return
            }
        }

        var betData = {
            gruppespil: cookie.get("activeGame"),
            player: getUser().email,
            updateValue: {
                data: {
                    calculated: false,
                    status: "afventer",
                    indsats: indsats,
                    vundet: undefined,
                    iat: new Date().getTime()
                },
                bets: [...odds]
            }
        }

        const placeBetUrl = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/bet";
        const betConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        axios.patch(placeBetUrl, betData, betConfig).then(response => {
            console.log("AWS - Oprettet:", betData, response)
            setCurrentMoney(currentMoney - indsats);
            emptyBets();
            setCreateModal(false)
            setCreateSuccessModal(true)
        }).catch(error => {
            console.log(error, betData);
        })
    }

    function placeBetClick() {
        if (getUser()) {
            // MANGLER Tjek om der er odds
            setCreateModal(true)
        } else {
            window.open("/login", "_self")
        }
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
            {createModal && <div className={bettingStyles.modalBg}>
                <div className={bettingStyles.modalContainer}>
                    <p className={bettingStyles.modalH1}>Vil du placere din kupon?</p>
                    <p className={bettingStyles.modalP}>Når du accepterer, vil du placere din kupon i gruppespillet <span style={{fontWeight: "600"}}>Kaisergames</span></p>
                    <div className={bettingStyles.modalCTA}>
                        <button className={bettingStyles.modal2ndBtn} onClick={() => setCreateModal(false)}>Fortryd</button>
                        <button className={bettingStyles.modal1stBtn} onClick={() => createBet()}>Placér bet</button>
                    </div>
                </div>
            </div>}
            {createSuccessModal && <div className={bettingStyles.modalBg}>
                <div className={bettingStyles.modalContainer}>
                    <p className={bettingStyles.modalH1}>Din kupon blev placeret</p>
                    <p className={bettingStyles.modalP}>Find din nye kupon i gruppespillet <span style={{fontWeight: "600"}}>Kaisergames</span></p>
                    <div className={bettingStyles.modalCTA}>
                        <button className={bettingStyles.modal1stBtn} onClick={() => setCreateSuccessModal(false)}>Okay</button>
                    </div>
                </div>
            </div>}
            <div className={bettingStyles.container}>
                <div className={bettingStyles.middle}>
                    {auth ? <>
                        {activeGame ? <div className={bettingStyles.ctaSection}>
                            <p className="info-h1">Velkommen, {auth && <>{auth.username}</>}</p>
                            <p className="info-p">Valgte spil: <span className="info-p-span">{activeGameName}</span></p><br />
                            <p className="info-p">Kapital: <span className="info-p-span">{activeGameMoney},00 kr.</span></p><br />
                            <p className="info-p">Placering: <span className="info-p-span">{activeGamePosition}</span> af <span className="info-p-span">{activeGamePlayerCount}</span><Link href="/stage/gruppespil?stilling=true"><span className="stilling-p">Se stilling</span></Link></p><br />
                            <p className="info-p" style={{paddingBottom: "10px"}}>Slutdato: <span className="info-p-span">{activeGameSlutdato}</span></p>
                            <br />
                            <Link href="/stage/aktive-spil">
                                <button className="gruppespil-cta-btn" style={{marginTop: "0px"}}>Skift gruppespil</button>
                            </Link>
                            <div className="info-figure">
                                <div className="info-figure1"></div>
                                <div className="info-figure2"></div>
                            </div>
                        </div> 
                        : <div className={bettingStyles.ctaSection}>
                            <p className="info-h1">Velkommen, {auth && <>{auth.username}</>}</p>
                            <p className="info-p" style={{fontSize: "16px", color: "#333"}}>Du har ikke noget aktivt gruppespil.</p><br />
                            <Link href="/betting/aktive-spil">
                                <button className="td-btn" style={{marginTop: "10px"}}>Vælg gruppespil</button>
                            </Link>
                            <div className="info-figure">
                                <div className="info-figure1"></div>
                                <div className="info-figure2"></div>
                            </div>
                        </div>}
                    </> : <div className={bettingStyles.ctaSection}>
                        <p className={bettingStyles.ctaH1}>Opret dit første gruppespil</p>
                        <p className={bettingStyles.ctaP}>Log ind på knappen nedenfor for at oprette et gruppespil.</p><br />
                        <Link href="/login">
                            <button className={bettingStyles.ctaBtn}>Log ind</button>
                        </Link>
                        <div className="info-figure">
                            <div className="info-figure1"></div>
                            <div className="info-figure2"></div>
                        </div>
                    </div>}
                    {/* <div className={bettingStyles.kampeSection}>
                        <div className={bettingStyles.sideContainer}>
                            <div>
                                <p className={bettingStyles.favH1}>Top turneringer</p>
                                <div className={bettingStyles.sidemenuWrapper}>
                                    <Link href="/betting/league?id=2">
                                        <a className={bettingStyles.sidemenuElement}>
                                            <div className={bettingStyles.sidemenuImg}>
                                                <Image src="https://cdn.sportmonks.com/images/soccer/leagues/2.png" layout="fill" />
                                            </div>
                                            <div className={bettingStyles.sidemenuInfo}>
                                                <p className={bettingStyles.sidemenuH2}>Champions League</p>
                                                <p className={bettingStyles.sidemenuP}>Europe</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href="/betting/league?id=271">
                                        <a className={bettingStyles.sidemenuElement}>
                                            <div className={bettingStyles.sidemenuImg}>
                                                <Image src="https://cdn.sportmonks.com/images/soccer/leagues/271.png" layout="fill" />
                                            </div>
                                            <div className={bettingStyles.sidemenuInfo}>
                                                <p className={bettingStyles.sidemenuH2}>Superliga</p>
                                                <p className={bettingStyles.sidemenuP}>Danmark</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href="/betting/league?id=8">
                                        <a className={bettingStyles.sidemenuElement}>
                                            <div className={bettingStyles.sidemenuImg}>
                                                <Image src="https://cdn.sportmonks.com/images/soccer/leagues/8/8.png" layout="fill" />
                                            </div>
                                            <div className={bettingStyles.sidemenuInfo}>
                                                <p className={bettingStyles.sidemenuH2}>Premier League</p>
                                                <p className={bettingStyles.sidemenuP}>England</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href="/betting/league?id=564">
                                        <a className={bettingStyles.sidemenuElement}>
                                            <div className={bettingStyles.sidemenuImg}>
                                                <Image src="https://cdn.sportmonks.com/images/soccer/leagues/564.png" layout="fill" />
                                            </div>
                                            <div className={bettingStyles.sidemenuInfo}>
                                                <p className={bettingStyles.sidemenuH2}>La Liga</p>
                                                <p className={bettingStyles.sidemenuP}>Spanien</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href="/betting/league?id=9">
                                        <a className={bettingStyles.sidemenuElement}>
                                            <div className={bettingStyles.sidemenuImg}>
                                                <Image src="https://cdn.sportmonks.com/images/soccer/leagues/9.png" layout="fill" />
                                            </div>
                                            <div className={bettingStyles.sidemenuInfo}>
                                                <p className={bettingStyles.sidemenuH2}>Championship</p>
                                                <p className={bettingStyles.sidemenuP}>England</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <p className={bettingStyles.favH1}>Hold</p>
                                {getTeams()}
                            </div>
                        </div>
                        <div className={bettingStyles.mainKampe}>
                            <div className={bettingStyles.mainMenu}>
                                <div className={bettingStyles.mainNav} style={{gap: "10px"}}>
                                    {mainMenu === "anbefalet"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("anbefalet")}>
                                            <p className="md-p">Anbefalet</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("anbefalet")}>
                                            <p className="md-p">Anbefalet</p>
                                        </div>
                                    }
                                    {mainMenu === "dato"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("dato")}>
                                            <p className="md-p">Dato</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("dato")}>
                                            <p className="md-p">Dato</p>
                                        </div>
                                    }
                                    {mainMenu === "top"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("top")}>
                                            <p className="md-p">Top kampe</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("top")}>
                                            <p className="md-p">Top kampe</p>
                                        </div>
                                    }
                                </div>
                                {mainMenu === "dato" && <div className={bettingStyles.dateHeader} id="md-container">
                                    {getDates()}
                                </div>}
                            </div>
                            <div id="stage-main2">
                                <div className={bettingStyles.kampeTop}>
                                    <p className={bettingStyles.kampeH1}>Kampe {chosenDate}</p>
                                </div>
                                {items.length <= 0 && <p className={bettingStyles.nogames}>Der kunne ikke findes nogen kampe d. {new Date(selected).getDate()}/{new Date(selected).getMonth() + 1}/{new Date(selected).getFullYear()}...</p>}
                                {getMatches()}
                            </div>
                        </div>
                    </div> */}
                    <div className={bettingStyles.kampeSection}>
                        <div className={bettingStyles.mainKampe}>
                            <div className={bettingStyles.mainMenu}>
                                <div className={bettingStyles.mainNav} style={{gap: "10px"}}>
                                    {mainMenu === "anbefalet"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("anbefalet")}>
                                            <p className="md-p">Anbefalet</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("anbefalet")}>
                                            <p className="md-p">Anbefalet</p>
                                        </div>
                                    }
                                    {mainMenu === "dato"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("dato")}>
                                            <p className="md-p">Dato</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("dato")}>
                                            <p className="md-p">Dato</p>
                                        </div>
                                    }
                                    {mainMenu === "top"
                                        ? <div className="md-element md-active" style={{padding: "0px 10px"}} onClick={() => setMainMenu("top")}>
                                            <p className="md-p">Top kampe</p>
                                        </div>
                                        : <div className="md-element" style={{padding: "0px 10px"}} onClick={() => setMainMenu("top")}>
                                            <p className="md-p">Top kampe</p>
                                        </div>
                                    }
                                </div>
                                {mainMenu === "dato" && <div className={bettingStyles.dateHeader} id="md-container">
                                    {getDates()}
                                </div>}
                            </div>
                            <div id="stage-main2">
                                <div className={bettingStyles.kampeTop}>
                                    <p className={bettingStyles.kampeH1}>Kampe {chosenDate}</p>
                                </div>
                                {getMatches()}
                            </div>
                        </div>
                        <div className={bettingStyles.sideContainer}>
                            <div>
                                <p className={bettingStyles.favH1}>Top turneringer</p>
                                <div className={bettingStyles.sidemenuWrapper}>
                                    <Link href="/betting/league?id=21638" className={bettingStyles.sidemenuElement}>
                                        <div className={bettingStyles.sidemenuImg}>
                                            <Image width={26} height={26} src="https://cdn.sportmonks.com/images/soccer/leagues/2.png" alt="" />
                                        </div>
                                        <div className={bettingStyles.sidemenuInfo}>
                                            <p className={bettingStyles.sidemenuH2}>Champions League</p>
                                            <p className={bettingStyles.sidemenuP}>Europe</p>
                                        </div>
                                    </Link>
                                    <Link href="/betting/league?id=21644" className={bettingStyles.sidemenuElement}>
                                        <div className={bettingStyles.sidemenuImg}>
                                            <Image width={26} height={26} src="https://cdn.sportmonks.com/images/soccer/leagues/271.png" alt="" />
                                        </div>
                                        <div className={bettingStyles.sidemenuInfo}>
                                            <p className={bettingStyles.sidemenuH2}>Superliga</p>
                                            <p className={bettingStyles.sidemenuP}>Danmark</p>
                                        </div>
                                    </Link>
                                    <Link href="/betting/league?id=21646" className={bettingStyles.sidemenuElement}>
                                        <div className={bettingStyles.sidemenuImg}>
                                            <Image width={26} height={26} src="https://cdn.sportmonks.com/images/soccer/leagues/8/8.png" alt="" />
                                        </div>
                                        <div className={bettingStyles.sidemenuInfo}>
                                            <p className={bettingStyles.sidemenuH2}>Premier League</p>
                                            <p className={bettingStyles.sidemenuP}>England</p>
                                        </div>
                                    </Link>
                                    <Link href="/betting/league?id=21694" className={bettingStyles.sidemenuElement}>
                                        <div className={bettingStyles.sidemenuImg}>
                                            <Image width={26} height={26} src="https://cdn.sportmonks.com/images/soccer/leagues/564.png" alt="" />
                                        </div>
                                        <div className={bettingStyles.sidemenuInfo}>
                                            <p className={bettingStyles.sidemenuH2}>La Liga</p>
                                            <p className={bettingStyles.sidemenuP}>Spanien</p>
                                        </div>
                                    </Link>
                                    <Link href="/betting/league?id=21689" className={bettingStyles.sidemenuElement}>
                                        <div className={bettingStyles.sidemenuImg}>
                                            <Image width={26} height={26} src="https://cdn.sportmonks.com/images/soccer/leagues/9.png" alt="" />
                                        </div>
                                        <div className={bettingStyles.sidemenuInfo}>
                                            <p className={bettingStyles.sidemenuH2}>Championship</p>
                                            <p className={bettingStyles.sidemenuP}>England</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <p className={bettingStyles.favH1}>Hold</p>
                                {getTeams()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={bettingStyles.infoSection}>
                    <div className={bettingStyles.kuponContainer}>
                        <div className="kupon-top-match">
                            <svg xmlns="http://www.w3.org/2000/svg" id="kuponRev" className="kupon-minimize deg180" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            <p className="kupon-header-p">Kombination</p>
                            <p className="kupon-blue-match-p" onClick={() => emptyBets()}>Ryd alle</p>
                        </div>
                        <div className="kupon-type">
                            <div className="kupon-type-element kupon-type-element-active" id="kombination">Kombination</div>
                        </div>
                        <ul className={bettingStyles.betContainer}>
                            {odds.map(bet => {
                                return (
                                    <li key={bet.id}>
                                        <div className={bettingStyles.betWrapper}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={bettingStyles.kuponClose} onClick={() => delBet(bet.id, bet.match.id)} viewBox="0 0 16 16">
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                            <p className={bettingStyles.kuponH1}>{getKupon(bet.bet.type,bet.match.localTeam.name,bet.match.visitorTeam.name)} - <span className={bettingStyles.kuponH1B}>{bet.bet.label}</span></p>
                                            <p className={bettingStyles.kuponH2}>{bet.match.localTeam.name} - {bet.match.visitorTeam.name}</p>
                                            <p className={bettingStyles.kuponH3}>{bet.bet.odds[bet.bet.guess].value}</p>
                                            {/* <p className={bettingStyles.betOdd}>{bet.bet.odds[bet.bet.guess].value}</p> */}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className={bettingStyles.kuponInfo}>
                            <div className={bettingStyles.indsatsContainer}>
                                <input type="number" id="indsatsInput" className={bettingStyles.kuponInput} autoComplete="off" onChange={event => {setIndsats(parseInt(event.target.value)); updateUdbetaling("kombination")}} />
                                <p className={bettingStyles.indsatsP}>Indsats</p>
                            </div>
                            <div className={bettingStyles.kuponInfoWrapper}>
                                <div className={bettingStyles.kuponWrapper}>
                                    <p className={bettingStyles.kuponP}>Total odds:</p>
                                    <p className={bettingStyles.kuponB}>{returnOdds.toFixed(2)}</p>
                                </div>
                                <div className={bettingStyles.kuponWrapper}>
                                    <p className={bettingStyles.kuponP}>Udbetaling:</p>
                                    <p className={bettingStyles.kuponB}>{udbetaling.toFixed(2)} kr.</p>
                                </div>
                            </div>
                            <button className={bettingStyles.kuponBtn} onClick={() => placeBetClick()}><span>Placér bet</span></button>
                        </div>
                    </div>
                    <div className={bettingStyles.sectionContainer}>
                        <div className={bettingStyles.sectionTop}>
                            <p className={bettingStyles.sidemenuH1} style={{margin: "0px"}}>Anbefalede væddemål</p>
                            <div className={bettingStyles.sectionTopRight} onClick={() => getTip()}>
                                <p className={bettingStyles.sectionTopA}>Opdater</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className={bettingStyles.sectionIcon} viewBox="0 0 16 16">
                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                </svg>
                            </div>
                        </div>
                        {createTip()}
                        {loadingTip && <div className="betting-loader" style={{margin: "20px 0px"}}></div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ req, res }) {
    const requestConfig = {
        headers: {
            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
        }
    }
    var gruppespil_resp;
    var gruppespil_data = null;
    if (req.cookies.activeGame) {
        gruppespil_resp = await axios.get("https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession?game=" + req.cookies.activeGame, requestConfig);
        gruppespil_data = gruppespil_resp.data;
    }

    var spiller_resp;
    var spiller_data = null;
    if (req.cookies.auth) {
        spiller_resp = await axios.get("https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/user?user=" + JSON.parse(req.cookies.auth).email, requestConfig);
        spiller_data = spiller_resp.data;
    }

    return {
        props: { gruppespil_data,spiller_data },
    }
}

export default Betting;