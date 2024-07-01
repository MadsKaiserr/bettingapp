import { useState, useEffect } from 'react';
import axios from "axios";
import { getUser } from "../services/authService.js";
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { getKupon, getString } from "../services/algo.js";
import gruppespilStyles from '../css/modules/gruppespil/gruppespil.module.css';
import cookie from 'js-cookie'
 
function StageGruppespil ({data}) {

    useEffect(() => {
        if (cookie.get("activeGame")) {
            setActiveGame(true);
        }
        if (data) {
            if (data.admin === "") {
                setAdminUser(true)
            }
            setGruppesessionData(data)
        }
        setBrugernavn("")
    }, [])

    const [activeGame, setActiveGame] = useState(false)
    const [brugernavn, setBrugernavn] = useState("")
    const [adminUser, setAdminUser] = useState(false)
    const [gruppesessionData, setGruppesessionData] = useState({
        id: "undefined",
        data: {
            beskeder: [],
            ligaer: [],
            players: [],
            restrictions: []
        },
        info: {
            admin: "",
            synlighed: "",
            exp: 0,
            iat: 0,
            name: ""
        },
        eco: {
            startAmount: 0,
            maxAmount: 0,
            minAmount: 0,
            indskydelseAmount: 0,
            indskydelseInt: 0
        }
    })

    //Chat listeners
    useEffect(() => {
        if (document.getElementById("chat_input")) {
            const pass = document.getElementById("chat_input");
            pass.addEventListener('focusin', (event) => {
                if (document.getElementById("chat-under")) {
                    document.getElementById("chat-under").classList.add("opacity-1");
                }
            });
                
            pass.addEventListener('focusout', (event) => {
                if (document.getElementById("chat-under")) {
                    document.getElementById("chat-under").classList.remove("opacity-1");
                }
            });
        }
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // if (urlParams.get("stilling")) {
        //     if (document.getElementById("stilling")) {
        //         document.getElementById("stilling").scrollIntoView();
        //     }
        // }
        // if (urlParams.get("kuponer")) {
        //     if (document.getElementById("kuponer")) {
        //         document.getElementById("kuponer").scrollIntoView();
        //     }
        // }
    })





    const [forbrug, setForbrug] = useState(0);

    const [correct, setCorrect] = useState(0);
    const [sidetal, setSidetal] = useState(1);

    const [gevinstStat, setGevinstStat] = useState(0);

    const [playerOdds, setPlayerOdds] = useState([]);

    const [time, setTime] = useState(false);
    const [timeText, setTimeText] = useState("");

    const [tableArray, setTableArray] = useState([]);

    const [totForbrug, setTotForbrug] = useState("Indlæser...");
    const [first, setFirst] = useState("Indlæser...");
    const [kuponer, setKuponer] = useState("Indlæser...");
    const [startAm, setStartAm] = useState(0);
    const [gameName, setGameName] = useState("");
    const [beskeder, setBeskeder] = useState([]);
    const [transaktioner, setTransaktioner] = useState([]);
    const [beskederLength, setBeskederLength] = useState(0);

    const [beskedText, setBeskedText] = useState("");

    const [gameAdmin, setGameAdmin] = useState("");
    const [gameType, setGameType] = useState("");

    const [loadingText, setLoadingText] = useState("Indlæser...");
    const [transakShow, setTransakShow] = useState(false);
    
    useEffect(() => {
        if (loadingText !== "Indlæser...") {
            if (document.getElementById("stage-loader1")) {
                document.getElementById("stage-loader1").classList.remove("display");
            }
            if (document.getElementById("stage-loader2")) {
                document.getElementById("stage-loader2").classList.remove("display");
            }
        }
    }, [loadingText])

    useEffect(() => {
        if (time === true) {
            setTimeout(function (){
                setTime(false);
                setTimeText("")
            }, 15000);
        }
    }, [time])

    function getTopN(arr, n) {
        var clone = arr.slice(0);
        clone.sort(function(x, y) {
            if (x.info.money === y.info.money) return 0;
            else if (parseInt(x.info.money) < parseInt(y.info.money)) return 1;
            else return -1;
        });
        return clone.slice(0, n);
    }

    // useEffect(() => {
    //     console.log("AWS - Gruppespil:", data)
    //     if (gruppesessionData.info.admin !== undefined && gruppesessionData.info.admin !== null) {
    //         var newTableArray = [];
    //         var myPlayer = [];
    //         for (var k in gruppesessionData.data.players) {
    //             if (data.players[k].player === "") {
    //                 myPlayer = data.players[k].odds;
    //                 setGameAdmin(data.admin);
    //                 setTransaktioner(data.players[k].info.transaktioner)
    //                 setGameType(data.synlighed);
    //                 localStorage.setItem("notifikationer", data.players[k].info.notifikationer.length);
    //                 var forbrugInt = 0;

    //                 var correctInt = 0;

    //                 var gevinstInt = 0;
    //                 for (var q in data.players[k].odds) {
    //                     forbrugInt = forbrugInt + data.players[k].odds[q].indsats;
    //                     if (data.players[k].odds[q].vundet === 2) {
    //                         correctInt = correctInt + 1;
    //                         gevinstInt = gevinstInt + (data.players[k].odds[q].indsats * data.players[k].odds[q].fullProb);
    //                     }
    //                 }
    //                 setForbrug(forbrugInt)
    //                 setCorrect(correctInt)
    //                 setGevinstStat(gevinstInt)
    //             }
    //         }
    //         setBeskeder(data.beskeder);
    //         setBeskederLength(data.beskeder.length);
    //         myPlayer.sort((a, b) => {
    //             return a.iat - b.iat;
    //         });
    //         setPlayerOdds(myPlayer.reverse());
    //         setGameName(data.name);
    //         setStartAm(data.start_amount);

    //         var antalKuponer = 0;
    //         var forbrugVar = 0;
    //         for (var i in data.players) {
    //             var playerKuponer = data.players[i].odds.length;
    //             antalKuponer = antalKuponer + playerKuponer;
    //             var finalKuponer = antalKuponer + "";
    //             for (var y in data.players[i].odds) {
    //                 forbrugVar = forbrugVar + data.players[i].odds[y].indsats;
    //             }
    //         }
    //         setTotForbrug(forbrugVar);
    //         setKuponer(finalKuponer);

    //         var n = data.players.length;
    //         var topScorers = getTopN(data.players, n);
    //         topScorers.forEach(function(item, index) {
    //             if (index === 0) {
    //                 setFirst(item.username+"");
    //             }
    //             setTableArray(newTableArray => [...newTableArray, item]);
    //         });
    //         setLoadingText("")
    //         if (data.admin === "") {
    //             setAdminUser(true);
    //         }
    //     } else {
    //         if (cookie.get("activeGame")) {
    //             document.getElementById("main-error").classList.add("display-flex");
    //             document.getElementById("main-error-p").innerHTML = "Dit aktive spil er suspenderet.";
    //             localStorage.setItem("aktive-spil-suspend", "true");
    //         }
    //     }
    // }, [])

    const sendBesked = event => {
        event.preventDefault();
        if (beskedText !== "" && time !== true) {
            setTimeText("")
            const URL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/besked";

            const requestConfig = {
                headers: {
                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                }
            }
    
            const auth = JSON.parse(JSON.stringify(getUser()));

            var beskedArray = beskeder;
            beskedArray.push({
                name: auth.username,
                besked: beskedText,
                iat: new Date().getTime()
            })
            setBeskederLength(beskederLength + 1);
            setBeskeder(beskedArray);
    
            const verifyBody = {
                beskedA: {
                    name: auth.username,
                    besked: beskedText
                },
                game: cookie.get("activeGame")
            }

    
            axios.patch(URL, verifyBody, requestConfig).then(response => {
                console.log("AWS - Besked:", response);
                setBeskedText("");
            }).catch(error => {
                console.log(error);
            })
            setTime(true);
        } else if (beskedText === "") {
            setTimeText("Din besked kan ikke være tom.")
        } else {
            setTimeText("Der skal gå minimum 15 sekunder mellem hver besked.")
        }
    }

    function getBeskeder() {
        if (beskederLength >= 5) {
            return beskeder.slice(beskederLength - 5,beskederLength).map((item) => {
            var nameVar = "chat-name";
            if (item.name === "") {
                nameVar = "chat-name-active";
            }

            var dato_string = "";
            var dato_time_string = "";
            var dato_day;
            var dato_month;
            var dato_year;

            var dato_minutes;
            var dato_hours;
            if (item.iat !== undefined) {
                dato_minutes = new Date(parseInt(item.iat)).getMinutes();
                dato_hours = new Date(parseInt(item.iat)).getHours();
                if ((dato_minutes.toString()).length === 1) {
                     dato_time_string = dato_hours + ":0" + dato_minutes;
                } else {
                    dato_time_string = dato_hours + ":" + dato_minutes;
                }

                var today_day = new Date().getDate();
                var today_month = new Date().getMonth();
                var today_year = new Date().getFullYear();
                dato_day = new Date(parseInt(item.iat)).getDate();
                dato_month = new Date(parseInt(item.iat)).getMonth();
                dato_year = new Date(parseInt(item.iat)).getFullYear();
                if (today_day === dato_day && today_month === dato_month && today_year === dato_year) {
                    dato_string = "I dag, " + dato_time_string;
                } else if ((today_day - 1) === dato_day && today_month === dato_month && today_year === dato_year) {
                    dato_string = "I går, " + dato_time_string;
                } else if ((today_day - 2) === dato_day && today_month === dato_month && today_year === dato_year) {
                    dato_string = "I forgårs, " + dato_time_string;
                } else {
                    dato_string = dato_day + "/" + dato_month + " - " + dato_time_string;
                }
            }

            return (
                <li key={item.iat}>
                    <div className="chat-element">
                        <div className="chat-top">
                            <div className="chat-top-left">
                                <div className="chat-pic"></div>
                                <p className={nameVar}>{item.name}</p>
                                <p className="chat-dato">{dato_string}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="chat-int" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                            </svg>
                        </div>
                        <p className="chat-p">{item.besked}</p>
                    </div>
                </li>
                );
            }
        )} else {
            return beskeder.slice(0,5).map((item) => {
                var nameVar = "chat-name";
                if (item.name === "") {
                    nameVar = "chat-name-active";
                }
    
                var dato_string = "";
                var dato_time_string = "";
                var dato_day;
                var dato_month;
                var dato_year;
    
                var dato_minutes;
                var dato_hours;
                if (item.iat !== undefined) {
                    dato_minutes = new Date(parseInt(item.iat)).getMinutes();
                    dato_hours = new Date(parseInt(item.iat)).getHours();
                    if ((dato_minutes.toString()).length === 1) {
                         dato_time_string = dato_hours + ":0" + dato_minutes;
                    } else {
                        dato_time_string = dato_hours + ":" + dato_minutes;
                    }
    
                    var today_day = new Date().getDate();
                    var today_month = new Date().getMonth();
                    var today_year = new Date().getFullYear();
                    dato_day = new Date(parseInt(item.iat)).getDate();
                    dato_month = new Date(parseInt(item.iat)).getMonth();
                    dato_year = new Date(parseInt(item.iat)).getFullYear();
                    if (today_day === dato_day && today_month === dato_month && today_year === dato_year) {
                        dato_string = "I dag, " + dato_time_string;
                    } else if ((today_day - 1) === dato_day && today_month === dato_month && today_year === dato_year) {
                        dato_string = "I går, " + dato_time_string;
                    } else if ((today_day - 2) === dato_day && today_month === dato_month && today_year === dato_year) {
                        dato_string = "I forgårs, " + dato_time_string;
                    } else {
                        dato_string = dato_day + "/" + dato_month + " - " + dato_time_string;
                    }
                }
    
                return (
                    <li key={item.iat}>
                        <div className="chat-element">
                            <div className="chat-top">
                                <div className="chat-top-left">
                                    <div className="chat-pic"></div>
                                    <p className={nameVar}>{item.name}</p>
                                    <p className="chat-dato">{dato_string}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="chat-int" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                </svg>
                            </div>
                            <p className="chat-p">{item.besked}</p>
                        </div>
                    </li>
                    );
                }
            )
        }
    }

    return (
        <>
            <Head>
                <title>Mit Gruppespil - Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className={gruppespilStyles.container}>
                {!activeGame && <div className={gruppespilStyles.gruppespilSection}>
                    <div className={gruppespilStyles.gruppespilTitle}>
                        <h1 className={gruppespilStyles.gruppespilH1}>Velkommen, {brugernavn}</h1><br></br>
                        <p className={gruppespilStyles.infoP}>Du har ikke noget aktivt gruppespil.</p><br />
                        <Link href="/betting/aktive-spil">
                            <button className={gruppespilStyles.tdBtn}>Vælg spil</button>
                        </Link>
                    </div>
                    <div className="info-figure">
                        <div className="info-figure1"></div>
                        <div className="info-figure2"></div>
                    </div>
                </div>}
                {activeGame && <div className={gruppespilStyles.gruppespilSection}>
                        <div className={gruppespilStyles.gruppespilInfo}>
                            <div className={gruppespilStyles.gruppespilTitle} style={{display: "flex", alignItems: "center", gap:"10px"}}>
                                <h1 className={gruppespilStyles.gruppespilH1}>{data.name}</h1>
                                <Link href="/stage/aktive-spil">
                                    <button className={gruppespilStyles.gruppespilCtaBtn}>Skift gruppespil</button>
                                </Link>
                                {adminUser && <Link href={"/stage/gruppespil/indstillinger?id=" + gruppesessionData.id}>
                                    <button className={gruppespilStyles.gruppespilCtaBtn}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14.5" height="14.5" fill="#fff" viewBox="0 0 16 16">
                                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                                        </svg>
                                    </button>
                                </Link>}
                            </div>
                            <div className={gruppespilStyles.gruppespilInfoInfo}>
                                <div className={gruppespilStyles.gruppespilInfoElement}>
                                    <p className={gruppespilStyles.gruppespilInfoElementP}>Total Forbrug</p>
                                    <p className={gruppespilStyles.gruppespilInfoElementH1}>{parseInt(totForbrug)} kr.</p>
                                </div>
                                <div className={gruppespilStyles.gruppespilInfoElement}>
                                    <p className={gruppespilStyles.gruppespilInfoElementP}>Førende</p>
                                    <p className={gruppespilStyles.gruppespilInfoElementH1}>{first}</p>
                                </div>
                                <div className={gruppespilStyles.gruppespilInfoElement}>
                                    <p className={gruppespilStyles.gruppespilInfoElementP}>Totale Kuponer</p>
                                    <p className={gruppespilStyles.gruppespilInfoElementH1}>{kuponer}</p>
                                </div>
                            </div>
                            <div className="gruppespil-cta">
                                <button className="gruppespil-cta-outline" onClick={() => {if (document.getElementById("kuponer")) {
                                    document.getElementById("kuponer").scrollIntoView();
                                }}}>Se kuponer</button>
                                <button className="gruppespil-cta-outline" onClick={() => {if (document.getElementById("stilling")) {
                                    document.getElementById("stilling").scrollIntoView();
                                }}}>Se stilling</button>
                            </div>
                        </div>
                        <div className={gruppespilStyles.gruppespilInfo}>
                            <div className="ant-container">
                                <div className="ant-element">
                                    {forbrug >= 0 && <>
                                        <div className="ant-visual">
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar-red" style={{height: "60%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar-red" style={{height: "70%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar-red" style={{height: "50%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar-red" style={{height: "30%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar-red" style={{height: "15%"}}></div>
                                            </div>
                                        </div>
                                    </>}
                                    <div className="ant-info">
                                        <p className="ant-h2">Dit forbrug</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{forbrug} kr.</p>
                                        </div>
                                        <p className="ant-p">Dit <span className="ant-p-a">forbrug</span> fra gruppespillets <br />start</p>
                                    </div>
                                </div>
                                <div className="ant-element">
                                    {correct >= 0 && <>
                                        <div className="ant-visual">
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "20%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "35%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "50%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "80%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "100%"}}></div>
                                            </div>
                                        </div>
                                    </>}
                                    <div className="ant-info">
                                        <p className="ant-h2">Antal korrekte</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{correct}</p>
                                        </div>
                                        <p className="ant-p">Antal <span className="ant-p-a">korrekte</span> fra gruppespillets <br />start</p>
                                    </div>
                                </div>
                                <div className="ant-element">
                                    {gevinstStat >= 0 && <>
                                        <div className="ant-visual">
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "20%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "35%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "50%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "80%"}}></div>
                                            </div>
                                            <div className="ant-visual-element">
                                                <div className="ant-visual-bar" style={{height: "100%"}}></div>
                                            </div>
                                        </div>
                                    </>}
                                    <div className="ant-info">
                                        <p className="ant-h2">Din gevinst</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{gevinstStat} kr.</p>
                                        </div>
                                        <p className="ant-p">Din <span className="ant-p-a">gevinst</span> fra gruppespillets <br />start</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={gruppespilStyles.gruppespilInfo}>
                            <div className="gruppespil-title">
                                <h1 className="gruppespil-h1">Chat</h1>
                            </div>
                            <div className="chat-container">
                                <ul>
                                    {getBeskeder()}
                                    {beskeder.length === 0 && <>
                                        <div className="chat-empty">
                                            <div className="chat-empty-element" style={{marginLeft: "-25px"}}>
                                                <div className="chat-empty-element-left">
                                                    <div className="chat-empty-img-bg">
                                                        <div className="chat-empty-img"></div>
                                                    </div>
                                                </div>
                                                <div className="chat-empty-element-right">
                                                    <div className="chat-empty-p"></div>
                                                    <div className="chat-empty-p" style={{width: "60%"}}></div>
                                                </div>
                                            </div>
                                            <div className="chat-empty-element" style={{marginLeft: "25px", marginTop: "-7px"}}>
                                                <div className="chat-empty-element-left">
                                                    <div className="chat-empty-img-bg">
                                                        <div className="chat-empty-img"></div>
                                                    </div>
                                                </div>
                                                <div className="chat-empty-element-right">
                                                    <div className="chat-empty-p"></div>
                                                    <div className="chat-empty-p" style={{width: "60%"}}></div>
                                                </div>
                                            </div>
                                            <p className="chat-empty-h1">Vær den første til at skrive</p>
                                        </div>
                                    </>}
                                </ul>
                                <form className="chat-input" onSubmit={sendBesked}>
                                    <input id="chat_input" type="text" className="chat-field" value={beskedText} placeholder="Skriv en besked" autoComplete='off' onChange={event => setBeskedText(event.target.value)} onSubmit={sendBesked} />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="chat-send" onClick={sendBesked} viewBox="0 0 16 16">
                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                                    </svg>
                                </form>
                                <p className="chat-under-h1" id="chat-under">brug @ for at tagge folk</p>
                                <p className="chat-error">{timeText}</p>
                            </div>
                        </div>
                        <div className={gruppespilStyles.gruppespilInfo} id="stilling">
                            <div className="gruppespil-title" id="stilling">
                                <h2 className="gs-h2">Spildeltagere</h2>
                                <p className="gs-h4">Klik for at se mere info</p>
                            </div>
                            <div className="tabel-top" style={{padding: "10px 5px", marginTop: "10px"}}>
                                <div className="tabel-top-right">
                                    <div className="tabel-ends">
                                        <p className="tabel-h1" id="gs-pos"></p>
                                        <p className="tabel-h1" id="gs-navn">Navn</p>
                                    </div>
                                </div>
                                <div className="tabel-top-right">
                                    <div className="tabel-ends">
                                        <p className="tabel-h1" id="gs-kuponer">Væddemål</p>
                                        <p className="tabel-h1" id="gs-kapital">Kapital</p>
                                        <p className="tabel-h1" id="gs-aktive">Aktive væddemål</p>
                                    </div>
                                </div>
                            </div>
                            <div className="tabel-container">
                                <ul>
                                    {tableArray.map((item, index) => {
                                        var profit = parseInt(item.info.money) - startAm;
                                        var kapital = item.info.money;
                                        var profitHtml = <></>;
                                        if (profit >= 0) {
                                            profitHtml = <p className="gruppespil-table-p gruppetable-kapital gruppetable-win"><svg xmlns="http://www.w3.org/2000/svg" className="gruppetable-icon-win" viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>{profit},00 kr.<span className="gruppetable-span">({parseInt(kapital)},00 kr.)</span></p>;
                                        } else {
                                            profitHtml = <p className="gruppespil-table-p gruppetable-kapital gruppetable-loss"><svg xmlns="http://www.w3.org/2000/svg" className="gruppetable-icon-loss" viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>{profit},00 kr.<span className="gruppetable-span">({parseInt(kapital)},00 kr.)</span></p>;
                                        }

                                        var aktive = 0;
                                        for (var w in item.odds) {
                                            if (item.odds[w].calculated === "false") {
                                                aktive = aktive + 1;
                                            }
                                        }

                                        var trueMe = "";
                                        if (getUser()) {
                                            if ("" === item.player) {
                                                trueMe = "tabel-correct";
                                            }
                                        }

                                        if (tableArray.length > 10) {
                                            if (index >= ((sidetal - 1) * 7) && index < (sidetal * 7) && index < (tableArray.length - 3)) {
                                                return (
                                                    <li key={item.player}>
                                                        <Link href={"/stage/gruppespil/spiller?spiller="+item.player+"&game="+activeGame}>
                                                            <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                        <p className="tabel-h1" id="gs-navn">{item.username && <>{item.username}</>}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-kuponer">{item.odds.length}</p>
                                                                        <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                        <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            }
                                            if ("" === item.player && index > 7 && index < (tableArray.length - 3)) {
                                                return (<>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <li key={item.player}>
                                                        <Link href={"/stage/gruppespil/spiller?spiller="+item.player+"&game="+activeGame}>
                                                            <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                        <p className="tabel-h1" id="gs-navn">{item.username && <>{item.username}</>}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-kuponer">{item.odds.length}</p>
                                                                        <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                        <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                </>
                                                );
                                            } else if (index === tableArray.length - 3) {
                                                return (<>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <li key={item.player}>
                                                        <Link href={"/stage/gruppespil/spiller?spiller="+item.player+"&game="+activeGame}>
                                                            <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                        <p className="tabel-h1" id="gs-navn">{item.username && <>{item.username}</>}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-kuponer">{item.odds.length}</p>
                                                                        <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                        <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                </>
                                                );
                                            } else if (index > tableArray.length - 3) {
                                                return (<>
                                                    <li key={item.player}>
                                                        <Link href={"/stage/gruppespil/spiller?spiller="+item.player+"&game="+activeGame}>
                                                            <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                        <p className="tabel-h1" id="gs-navn">{item.username && <>{item.username}</>}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="tabel-top-right">
                                                                    <div className="tabel-ends">
                                                                        <p className="tabel-p" id="gs-kuponer">{item.odds.length}</p>
                                                                        <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                        <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                </>
                                                );
                                            }
                                        } else {
                                            return (
                                                <li key={item.player}>
                                                    <Link href={"/stage/gruppespil/spiller?spiller="+item.player+"&game="+activeGame}>
                                                        <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                    <p className="tabel-h1" id="gs-navn">{item.username && <>{item.username}</>}</p>
                                                                </div>
                                                            </div>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-kuponer">{item.odds.length}</p>
                                                                    <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                    <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        }
                                        }
                                    )}
                                </ul>
                            </div>
                            <div className="tabel-pagination">
                                <p className="tabel-page-p" onClick={() => {if(sidetal > 1){setSidetal(sidetal - 1)}}}>Forrige side</p>
                                <p className="tabel-page-h1">Side {sidetal} af {Math.ceil((tableArray.length - 3) / 7) < 1 ? <>1</> : Math.ceil((tableArray.length - 3) / 7)}</p>
                                <p className="tabel-page-p" onClick={() => {if(sidetal < Math.ceil((tableArray.length - 3) / 7)){setSidetal(sidetal + 1)}}}>Næste side</p>
                            </div>
                        </div>
                        <div className={gruppespilStyles.gruppespilInfo} id="inviteInfo">
                            <div className="gruppespil-title">
                                <h1 className="gruppespil-h1">Inviter venner</h1>
                                <p className="gruppespil-scroll">Klik for at kopiere</p>
                            </div>
                            <div className="inv-container">
                                <div className="inv-element-a" onClick={() => {
                            if (activeGame && activeGame !== null && activeGame !== undefined) {navigator.clipboard.writeText("https://www.Fantasybetting.dk/gruppesession?game=" + activeGame + "&type=invite"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
            document.getElementById("copied").classList.add("display-not")
        }, 1000);} else {
            navigator.clipboard.writeText("https://www.Fantasybetting.dk/"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
            document.getElementById("copied").classList.add("display-not")
        }, 1000);
        }}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="var(--primary)" viewBox="0 0 16 16">
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                    </svg>
                                    <p className="inv-p-a">{gruppesessionData.id}</p>
                                    <div className="invite-copied display-not" id="copied">Kopieret</div>
                                </div>
                                <div className="inv-element" onClick={() => {
                            if (activeGame && activeGame !== null && activeGame !== undefined) {navigator.clipboard.writeText("https://www.Fantasybetting.dk/gruppesession?game=" + activeGame + "&type=invite"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
            document.getElementById("copied").classList.add("display-not")
        }, 1000);} else {
            navigator.clipboard.writeText("https://www.Fantasybetting.dk/"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
            document.getElementById("copied").classList.add("display-not")
        }, 1000);
        }}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--softBlack)" viewBox="0 0 16 16">
                                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                                    </svg>
                                    <p className="inv-p">Del invitationslink</p>
                                </div>
                            </div>
                        </div>
                </div>}
                <div className={gruppespilStyles.gruppespilSection} style={{border: "0px", marginTop: "20px"}}>
                    <p className="find-h1">Opret et gruppespil</p>
                        <p className="find-p">Opret dit eget gruppespil, og inviter familie og venner til kamp.</p>
                        <Link href="/betting/opret"><button className="find-btn">Opret gruppespil</button></Link>
                    <div className="td-divider">
                        <div className="td-line"></div>
                            <p className="td-or">Eller</p>
                        <div className="td-line"></div>
                    </div>
                    <p className="find-h1">Find nye gruppespil</p>
                    <p className="find-p">Tilmeld dig offentlige eller private gruppespil, og spil mod familie og venner.</p>
                    <Link href="/gruppespil"><button className="find-btn">Find nyt gruppespil</button></Link>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res }) {
    const sendRedirectLocation = (location) => {
        res.writeHead(302, {
            Location: location,
        });
        res.end();
        return { props: {} };
    };
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=11'
    )
    if (!req.cookies.auth) {
        sendRedirectLocation('/login')
    }
    const requestConfig = {
        headers: {
            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
        }
    }
    var resp;
    var data = null;
    if (req.cookies.activeGame) {
        resp = await axios.get("https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession?game=" + req.cookies.activeGame, requestConfig);
        data = resp.data;
    }
    return {
        props: { data },
    }
}
 
export default StageGruppespil;