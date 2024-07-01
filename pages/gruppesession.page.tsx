import * as React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { getUser } from "./services/authService.js";
import axios from "axios";
import cookie from 'js-cookie'
import { useRouter } from 'next/router'
import Back from './components/back';
import gruppesessionStyles from './css/modules/gruppespil/gruppesession.module.css';
 
function Gruppesession ({data, allowed}) {
    const router = useRouter()
    const [tableArray, setTableArray] = useState([]);
    const [sidetal, setSidetal] = useState(1);

    const [activeGame, setActiveGame] = useState([]);
    const [password, setPassword] = useState("");

    const [isTilmeldt, setIsTilmeldt] = useState(false);
    const [kuponer, setKuponer] = useState("Indlæser...");

    const [forbrug, setForbrug] = useState(0);
    const [winRate, setWinRate] = useState(0);

    const [loading, setLoading] = useState(false);

    function getPlayer(player) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (cookie.get("auth")) {
            window.open("/betting/gruppespil/spiller?spiller="+player+"&game="+urlParams.get('game'), "_self")
        } else {
            window.open("/login", "_self")
        }
    }

    function getTopN(arr, n) {
        var clone = arr.slice(0);
        clone.sort(function(x, y) {
            if (x.info.money === y.info.money) return 0;
            else if (parseInt(x.info.money) < parseInt(y.info.money)) return 1;
            else return -1;
        });
        return clone.slice(0, n);
    }

    useEffect(() => {
        console.log("AWS - Gruppesession:", data)
        if (allowed) {
            setActiveGame(data);
    
            var n = data.data.players.length;
            var topScorers = getTopN(data.data.players, n);
            topScorers.forEach(function(item) {
                setTableArray(tableArray => [...tableArray, item]);
            });
    
            var startValue = parseInt(data.eco.startAmount);
            var gevinstVar = 0;
            var antalKuponer = 0;
            var antalVundet = 0;
            var getForbrug = 0;
            var validTilmeld = false;
            for (var i in data.data.players) {
                var kapital = data.data.players[i].data.money;
                gevinstVar = gevinstVar + (kapital - startValue);
    
                var playerKuponer = data.data.players[i].kuponer.length;
                antalKuponer = antalKuponer + playerKuponer;
                var finalKuponer = antalKuponer + "";
                if (cookie.get("email")) {
                    if (data.data.players[i].email === cookie.get("email")) {
                        validTilmeld = true;
                    }
                }
                for (var q in data.data.players[i].kuponer) {
                    if (data.data.players[i].kuponer[q].vundet === 2) {
                        antalVundet = antalVundet + 1;
                    }
                    getForbrug = getForbrug + data.data.players[i].kuponer[q].data.indsats;
                }
            }
            if (validTilmeld) {
                setIsTilmeldt(true);
            }
            setWinRate((antalVundet/antalKuponer)*100)
            setKuponer(finalKuponer);
            setForbrug(getForbrug);
        }
    }, [])

    function tilmeld() {
        setLoading(true);
        if ((data.info.synlighed === "privat" && password !== "") || (data.info.synlighed === "offentlig" || data.info.synlighed === "dyst")) {
            if (cookie.get("auth")) {
                var yourIndex = data.data.players.findIndex(obj => obj.player === cookie.get("email"));
                var varighedDate = new Date(data.info.exp).getTime();
                var nowDate = new Date().getTime();

                if (data.info.synlighed === "privat") {
                    const loginURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppespillogin";
                    const requestConfig = {
                        headers: {
                            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                        }
                    }
            
                    const requestBody = {
                        game: data.id,
                        password: data.password
                    }
            
                    axios.post(loginURL, requestBody, requestConfig).then(response => {
                        console.log("AWS - Gruppespil Login:", response);
                        //&& getUser().rolle
                        if ((yourIndex === -1 && varighedDate > nowDate)) {
                            console.log(activeGame)
                            const tilmeldUrl = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession";
                
                            const tilmeldConfig = {
                                headers: {
                                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                                }
                            }
                
                            var moneys = data.eco.startAmount;
                            var medlemsskab;
                            var userEmail;
                            var username;

                            medlemsskab = "none";
                            userEmail = "Ukendt";
                            username = "Ukendt";
                            
                            // if (getUser().rolle) {
                            //     medlemsskab = getUser().rolle;
                            //     userEmail = cookie.get("email");
                            //     username = "";
                            // } else {
                            //     medlemsskab = "none";
                            //     userEmail = "Ukendt";
                            //     username = "Ukendt";
                            // }
                            var fbLogo = "";
                            if (cookie.get("fbLogin")) {
                                fbLogo = JSON.parse(cookie.get("fbLogin")).id;
                            }
                
                            const tilmeldBody = {
                                "tilmeldId": data.id,
                                "updateItValue": {
                                    "player": userEmail,
                                    "username": username,
                                    "fb_logo_id": fbLogo,
                                    "info": {
                                        "money": moneys,
                                        "notifikationer": [],
                                        "medlemsskab": medlemsskab
                                    }, 
                                    "odds": []
                                }
                            }
                
                            axios.patch(tilmeldUrl, tilmeldBody, tilmeldConfig).then(response => {
                                console.log("AWS - Gruppespil:", response)
                                cookie.set("activeGame", data.id, {expires: 7});
                                localStorage.setItem("activeGame", data.id);
                                const queryString = window.location.search;
                                const urlParams = new URLSearchParams(queryString);
                                var GetRes = urlParams.get("res");
                                if (GetRes) {
                                    router.push("/stage/setup?rel=page2");
                                } else {
                                    router.push("/stage");
                                }
                            }).catch(error => {
                                console.log(error);
                            })
                        } else {
                            setLoading(false);
                            if (yourIndex !== -1) {
                                // setNotiMessage("error", "Deltager allerede", "Det ser ud til, at du allerede deltager i dette gruppespil.");
                            } else if (varighedDate < nowDate) {
                                // setNotiMessage("error", "Gruppespil slut", "Gruppespil er desværre allerede færdiggjort");
                            }
                            // else if (!getUser().rolle) {
                            //     router.push("/login");
                            // }
                        }
                    }).catch(error => {
                        console.log(error);
                        // setNotiMessage("error", "Forkert kodeord", "Administratoren af gruppespillet har sat et kodeord på gruppespillet, til at tilmelde sig. Den indtastede kode matcher ikke gruppespillets kode.");
                        setLoading(false);
                    })
                } else {
                    if (yourIndex === -1 && varighedDate > nowDate) {
                        console.log(activeGame)
                        const tilmeldUrl = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession";
            
                        const tilmeldConfig = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
            
                        var moneys = data.eco.startAmount;
                        var medlemsskab;
                        var userEmail;
                        var username;

                        medlemsskab = "none";
                        userEmail = "Ukendt";
                        username = "Ukendt";
                        
                        // if (getUser().rolle) {
                        //     medlemsskab = getUser().rolle;
                        //     userEmail = cookie.get("email");
                        //     username = "";
                        // } else {
                        //     medlemsskab = "none";
                        //     userEmail = "Ukendt";
                        //     username = "Ukendt";
                        // }
                        var fbLogo = "";
                        if (cookie.get("fbLogin")) {
                            fbLogo = JSON.parse(cookie.get("fbLogin")).id;
                        }
            
                        const tilmeldBody = {
                            "tilmeldId": data.id,
                            "updateItValue": {
                                "player": userEmail,
                                "username": username,
                                "fb_logo_id": fbLogo,
                                "info": {
                                    "money": moneys,
                                    "notifikationer": [],
                                    "medlemsskab": medlemsskab
                                }, 
                                "odds": []
                            }
                        }
            
                        axios.patch(tilmeldUrl, tilmeldBody, tilmeldConfig).then(response => {
                            console.log("AWS - Gruppespil:", response)
                            cookie.set("activeGame", data.id, {expires: 7});
                            localStorage.setItem("activeGame", data.id);
                            const queryString = window.location.search;
                            const urlParams = new URLSearchParams(queryString);
                            var GetRes = urlParams.get("res");
                            if (GetRes) {
                                router.push("/stage/setup?rel=page2");
                            } else {
                                router.push("/stage");
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    } else {
                        setLoading(false);
                        if (yourIndex !== -1) {
                        } else if (varighedDate < nowDate) {
                        }
                    }
                }
            } else {
                router.push("/login");
            }
        } else {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Gruppespil - Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className={gruppesessionStyles.gs__container}>
                <Back />
                <div>
                    <div className={gruppesessionStyles.gruppespil__section__primary}>
                        <h1 className={gruppesessionStyles.gruppespil__h1}>{data.info.name}</h1>
                        <div className={gruppesessionStyles.gruppespil__info}>
                            <div className={gruppesessionStyles.gruppespil__info__element}>
                                <p className={gruppesessionStyles.gruppespil__info__element__p}>Startbeløb</p>
                                <p className={gruppesessionStyles.gruppespil__info__element__h1}>{data.eco.startAmount} kr.</p>
                            </div>
                            <div className={gruppesessionStyles.gruppespil__info__element}>
                                <p className={gruppesessionStyles.gruppespil__info__element__p}>Spillere</p>
                                <p className={gruppesessionStyles.gruppespil__info__element__h1}>{data.data.players.length}</p>
                            </div>
                            <div className={gruppesessionStyles.gruppespil__info__element}>
                                <p className={gruppesessionStyles.gruppespil__info__element__p}>Slutdato</p>
                                <p className={gruppesessionStyles.gruppespil__info__element__h1}>{new Date(data.info.exp).getDate().toString().padStart(2, '0') + "/" + (new Date(data.info.exp).getMonth() + 1).toString().padStart(2, '0') + "/" + new Date(data.info.exp).getFullYear().toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                        {isTilmeldt && <>
                            <Link href="/stage"><button className={gruppesessionStyles.main__btn}>Gå til betting</button></Link>
                            <p className={gruppesessionStyles.gruppespil__info__element__p2}>Du er allerede tilmeldt dette gruppespil.</p>
                        </>}
                        {!isTilmeldt && <>
                            {data.info.synlighed === "privat" && <>
                                <input type="password" value={password} onChange={event => setPassword(event.target.value)} className={gruppesessionStyles.input} placeholder='Gruppespillets kodeord' /><br />
                                {password !== "" && <button className={gruppesessionStyles.main__btn} style={{marginBottom: "10px"}} onClick={() => {tilmeld()}}>{loading && <div className="loader" id="loader"></div>}{!loading && <>Tilmeld</>}</button>}
                                {password === "" && <button className={gruppesessionStyles.main__btn__off}>Tilmeld</button>}
                                <p className={gruppesessionStyles.gruppespil__info__element__p2}>Gruppespillet er privat, og kræver derfor en adgangskode, som er sat af administratoren, for at du kan tilmelde dig.</p>
                            </>}
                            {data.info.synlighed !== "privat" && <button className={gruppesessionStyles.main__btn} onClick={() => {tilmeld()}}>{loading && <div className="loader" id="loader"></div>}{!loading && <>Tilmeld</>}</button>}
                        </>}
                    </div>
                    {/* {synlighed === "dyst" && <>
                        <div className="dyst-section">
                            <p className="dy-h1">Pengepræmier af 1000 kr.</p>
                            <p className="dy-h2">Top 3 ved slutdatoen modtager gavekort til Intersport af værdi op til 500 kr!</p>
                        </div>
                    </>}
                    {synlighed === "dyst" && <>
                        <div className="gruppespil-section" style={{border: "0px", marginTop: "20px", justifyContent: "center", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
                            <div className="top-container">
                                <div className="top-element">
                                    <div className="top-img">2</div>
                                    <p className="top-h1">350 kr. til Intersport</p>
                                    <p className="top-h2">Andenplads</p>
                                </div>
                                <div className="top-element-big">
                                    <div className="top-img">1</div>
                                    <p className="top-h1">500 kr. til Intersport</p>
                                    <p className="top-h2">Førsteplads</p>
                                </div>
                                <div className="top-element">
                                    <div className="top-img">3</div>
                                    <p className="top-h1">150 kr. til Intersport</p>
                                    <p className="top-h2">Tredjeplads</p>
                                </div>
                            </div>
                            <div className="top-container-mobile">
                                <div className="top-element">
                                    <div className="top-img">1</div>
                                    <p className="top-h1">500 kr. til Intersport</p>
                                    <p className="top-h2">Førsteplads</p>
                                </div>
                                <div className="top-element">
                                    <div className="top-img">2</div>
                                    <p className="top-h1">350 kr. til Intersport</p>
                                    <p className="top-h2">Andenplads</p>
                                </div>
                                <div className="top-element">
                                    <div className="top-img">3</div>
                                    <p className="top-h1">150 kr. til Intersport</p>
                                    <p className="top-h2">Tredjeplads</p>
                                </div>
                            </div>
                        </div>
                    </>} */}
                    <div className={gruppesessionStyles.gruppespil__section}>
                        <h2 className={gruppesessionStyles.main__h2}>{data.info.name}</h2>
                        <h3 className={gruppesessionStyles.main__h3}><p>{data.info.synlighed === "dyst" && <>Præmiedyst</>}{data.info.synlighed !== "dyst" && <>{data.info.synlighed}</>}</p><div className={gruppesessionStyles.main__h3__divider}></div><p>Pulje</p></h3>
                        <div className="gruppespil-info" style={{paddingTop: "30px"}}>
                            <div className="ant-container">
                                <div className="ant-element">
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
                                    <div className="ant-info">
                                        <p className="ant-h2">Antal kuponer</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{kuponer}</p>
                                        </div>
                                        <p className="ant-p">Samlet antal <span className="ant-p-a">kuponer</span> fra gruppespillets <br />medlemmer</p>
                                    </div>
                                </div>
                                <div className="ant-element">
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
                                    <div className="ant-info">
                                        <p className="ant-h2">Samlet forbrug</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{forbrug} kr.</p>
                                        </div>
                                        <p className="ant-p">Samlet <span className="ant-p-a">forbrug</span> fra gruppespillets <br />medlemmer</p>
                                    </div>
                                </div>
                                <div className="ant-element">
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
                                    <div className="ant-info">
                                        <p className="ant-h2">Gevinst rate</p>
                                        <div className="ant-info-price">
                                            <p className="ant-h1">{!isNaN(winRate) && <>{winRate}</>}{isNaN(winRate) && <>0</>}%</p>
                                        </div>
                                        <p className="ant-p">Andel af <span className="ant-p-a">kuponer</span> som er vundet af <br />medlemmerne</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gruppespil-info" id="stilling">
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
                                        var profit = parseInt(item.data.money) - data.eco.startAmount;
                                        var kapital = item.data.money;
                                        var profitHtml = <></>;
                                        if (profit > 0) {
                                            profitHtml = <p className="gruppespil-table-p gruppetable-kapital gruppetable-win"><svg xmlns="http://www.w3.org/2000/svg" className="gruppetable-icon-win" viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>{profit},00 kr.<span className="gruppetable-span">({parseInt(kapital)},00 kr.)</span></p>;
                                        } else if (profit < 0) {
                                            profitHtml = <p className="gruppespil-table-p gruppetable-kapital gruppetable-loss"><svg xmlns="http://www.w3.org/2000/svg" className="gruppetable-icon-loss" viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>{profit},00 kr.<span className="gruppetable-span">({parseInt(kapital)},00 kr.)</span></p>;
                                        } else {
                                            profitHtml = <p className="gruppespil-table-p gruppetable-kapital gruppetable-stable"><div className="gruppetable-icon-stable"></div>{profit},00 kr.<span className="gruppetable-span">({parseInt(kapital)},00 kr.)</span></p>;
                                        }

                                        var aktive = 0;
                                        for (var w in item.odds) {
                                            if (item.odds[w].calculated === "false") {
                                                aktive = aktive + 1;
                                            }
                                        }

                                        var trueMe = "";
                                        var getEmail = "";
                                        if (getUser()) {
                                            if (cookie.get("email") === item.email) {
                                                trueMe = "tabel-correct";
                                                getEmail = cookie.get("email");
                                            }
                                        }

                                        if (tableArray.length > 10) {
                                            if (index >= ((sidetal - 1) * 7) && index < (sidetal * 7) && index < (tableArray.length - 3)) {
                                                return (
                                                    <li key={item.email} onClick={() => getPlayer(item.email)}>
                                                        <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                    <p className="tabel-h1" id="gs-navn">{item.info.username && <>{item.info.username}</>}</p>
                                                                </div>
                                                            </div>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-kuponer">{item.kuponer.length}</p>
                                                                    <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                    <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                            if (getEmail === item.email && index > 7 && index < (tableArray.length - 3)) {
                                                return (<>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <li key={item.email} onClick={() => getPlayer(item.email)}>
                                                        <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                    <p className="tabel-h1" id="gs-navn">{item.info.username && <>{item.info.username}</>}</p>
                                                                </div>
                                                            </div>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-kuponer">{item.kuponer.length}</p>
                                                                    <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                    <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </>
                                                );
                                            } else if (index === tableArray.length - 3) {
                                                return (<>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <div className="table-divider"></div>
                                                    <li key={item.email} onClick={() => getPlayer(item.email)}>
                                                        <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                    <p className="tabel-h1" id="gs-navn">{item.info.username && <>{item.info.username}</>}</p>
                                                                </div>
                                                            </div>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-kuponer">{item.kuponer.length}</p>
                                                                    <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                    <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </>
                                                );
                                            } else if (index > tableArray.length - 3) {
                                                return (<>
                                                    <li key={item.email} onClick={() => getPlayer(item.email)}>
                                                        <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                    <p className="tabel-h1" id="gs-navn">{item.info.username && <>{item.info.username}</>}</p>
                                                                </div>
                                                            </div>
                                                            <div className="tabel-top-right">
                                                                <div className="tabel-ends">
                                                                    <p className="tabel-p" id="gs-kuponer">{item.kuponer.length}</p>
                                                                    <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                    <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </>
                                                );
                                            }
                                        } else {
                                            return (
                                                <li key={item.email} onClick={() => getPlayer(item.email)}>
                                                    <div className={"tabel-element " + trueMe} style={{borderLeft: "4px solid var(--primary)", padding: "10px 1px"}}>
                                                        <div className="tabel-top-right">
                                                            <div className="tabel-ends">
                                                                <p className="tabel-p" id="gs-pos" style={{textAlign: "center"}}>{index + 1}</p>
                                                                <p className="tabel-h1" id="gs-navn">{item.data.username && <>{item.data.username}</>}</p>
                                                            </div>
                                                        </div>
                                                        <div className="tabel-top-right">
                                                            <div className="tabel-ends">
                                                                <p className="tabel-p" id="gs-kuponer">{item.kuponer.length}</p>
                                                                <p className="tabel-p" id="gs-kapital">{profitHtml && <>{profitHtml}</>}</p>
                                                                <p className="tabel-p" id="gs-aktive">{aktive && <>{aktive}</>}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }
                                        }
                                    )}
                                </ul>
                            </div>
                            <div className="tabel-pagination">
                                <p className="tabel-page-p" onClick={() => {if(sidetal > 1){setSidetal(sidetal - 1)}}}>Forrige side</p>
                                <p className="tabel-page-h1">Side {sidetal} af {Math.ceil((tableArray.length - 3) / 7)}</p>
                                <p className="tabel-page-p" onClick={() => {if(sidetal < Math.ceil((tableArray.length - 3) / 7)){setSidetal(sidetal + 1)}}}>Næste side</p>
                            </div>
                        </div>
                        {data.info.synlighed !== "privat" && <div className="gruppespil-info">
                            <div className="gruppespil-title">
                                <h2 className="gs-h2">Inviter venner</h2>
                                <p className="gs-h4">Klik for at kopiere</p>
                            </div>
                            <div className="inv-container">
                                <div className="inv-element-a" onClick={() => {
                                const queryString = window.location.search;
                                const urlParams = new URLSearchParams(queryString);
                                if (urlParams.get('game') && urlParams.get('game') !== null && urlParams.get('game') !== undefined) {navigator.clipboard.writeText("https://www.Fantasybetting.dk/gruppesession?game=" + urlParams.get('game') + "&type=invite"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
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
                                    <p className="inv-p-a">{data.id}</p>
                                    <div className="invite-copied display-not" id="copied">Kopieret</div>
                                </div>
                                <div className="inv-element" onClick={() => {
                                    const queryString = window.location.search;
                                    const urlParams = new URLSearchParams(queryString);
                                    navigator.clipboard.writeText("https://www.Fantasybetting.dk/gruppesession?game=" + urlParams.get('game') + "&type=invite"); document.getElementById("copied").classList.remove("display-not"); setTimeout(function (){
                                    document.getElementById("copied").classList.add("display-not")
                                }, 1000);}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--softBlack)" viewBox="0 0 16 16">
                                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                                    </svg>
                                    <p className="inv-p">Del invitationslink</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className={gruppesessionStyles.gruppespil__section}>
                        <p className="find-h1" style={{paddingTop: "15px"}}>Opret et gruppespil</p>
                        <p className="find-p">Opret dit eget gruppespil, og inviter familie og venner til kamp.</p>
                        <button className="find-btn">Opret gruppespil</button>
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
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=15, stale-while-revalidate=20'
    )
    const category = query.game;
    const requestConfig = {
        headers: {
            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
        }
    }
    var resp;
    var data;
    if (category) {
        resp = await axios.get("https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession?game=" + category, requestConfig);
        var data = resp.data;
    }
    if (!data) {
        return {
          notFound: true,
        }
    }
    var allowed = {hent: false};
    const sendRedirectLocation = (location) => {
        res.writeHead(302, {
            Location: location,
        });
        res.end();
        return { props: {data, allowed} };
    };
    if (req.cookies.auth) {
        for (var q in data.players) {
            if (data.players[q].player === JSON.parse(req.cookies.auth).email) {
                res.setHeader('set-cookie', ['activeGame=' + data.id])
                sendRedirectLocation('/stage/gruppespil');
            }
        }
    }
    allowed = {hent: true};
    return {
        props: { data, allowed },
    }
}
 
export default Gruppesession;