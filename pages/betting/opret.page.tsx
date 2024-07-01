import * as React from 'react';
import { useState, useEffect } from 'react';
import opretStyles from '../css/modules/gruppespil/opret.module.css';
import { getUser } from "../services/authService.js";
import axios from "axios";
import { Router, useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { getSearch } from '../services/search';
 
function Opret ({ }) {

    const [FD, setFD] = useState("0")
    const [FM, setFM] = useState("0")
    const [FY, setFY] = useState("0")
    const [minSetting, setMinSetting] = useState(false);
    const [maksSetting, setMaksSetting] = useState(false);
    const [indskydelseSetting, setIndskydelseSetting] = useState(true);
    const [leagueSetting, setLeagueSetting] = useState(false);
    const [nav, setNav] = useState("generelt");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [ligasearchStr, setLigaSearchStr] = useState("");

    const [items, setItems] = useState(getSearch());
    const [favorites, setFavorites] = useState([]);

    const [spilNavn, setSpilNavn] = useState("");
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [indskydelse, setIndskydelse] = useState(150);
    const [spilStart, setStart] = useState(1000);
    const [spilMin, setMin] = useState(0);
    const [spilMax, setMax] = useState(0);
    const [spilSynlighed, setSynlighed] = useState("offentlig");

    const opretHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession";
        const gruppespilConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        const gruppespilBody = {
            data: {
                info: {
                    synlighed: spilSynlighed,
                    exp: new Date(FY + "-" + FM + "-" + FD).getTime(),
                    name: spilNavn
                },
                eco: {
                    startAmount: spilStart,
                    maxAmount: spilMax,
                    minAmount: spilMin,
                    indskydelseAmount: indskydelse,
                },
                password: undefined
            },
            user: "",
            username: ""
        }

        if (spilSynlighed === "privat") {
            gruppespilBody.data.password = password;
        }

        axios.post(signupURL, gruppespilBody, gruppespilConfig).then(result => {
            console.log("AWS - Gruppespil:", result);
            window.open("/betting", "_self");
        }).catch(error => {
            console.error(error);
            setLoading(false)
        })
    }

    function addFavorite(id, name, image, liga, type) {
        if (favorites.findIndex(obj => obj.id === id) >= 0) {
            var duppel = favorites;
            duppel.splice((favorites.findIndex(obj => obj.id === id)), 1);
            setFavorites(duppel);
            document.getElementById("klub-" + id + type).classList.remove("setup-checkbox-active");
            document.getElementById("icon-" + id + type).classList.remove("display");
        } else {
            setFavorites([...favorites, {
                "id": id,
                "name": name,
                "image": image,
                "liga": liga,
                "type": type
            }]);
            document.getElementById("klub-" + id + type).classList.add("setup-checkbox-active");
            document.getElementById("icon-" + id + type).classList.add("display");
        }
    }

    function getFD() {
        var lastDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
        var days = ["dag",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
        var antalDage = lastDays[FM]
        if (antalDage > 0) {
            return (
                <>
                    {days.slice(0,antalDage + 1).map((dag) => {
                        return (
                            <option value={dag} key={dag}>{dag}</option>
                        )
                    })}
                </>
            )
        } else {
            return (
                <>
                    {days.map((dag) => {
                        return (
                            <option value={dag} key={dag}>{dag}</option>
                        )
                    })}
                </>
            )
        }
    }

    function getFM() {
        var months = ["måned", 1,2,3,4,5,6,7,8,9,10,11,12]
        return (
            <>
                {months.map((month) => {
                    return (
                        <option value={month} key={month}>{month}</option>
                    )
                })}
            </>
        )
    }

    function getFY() {
        var years = ["år"]
        var todayYear = new Date().getFullYear();
        for (var i=todayYear;i < todayYear+5;i++){
            years.push("" + i)
        }
        return (
            <>
                {years.map((year) => {
                    return (
                        <option value={year} key={year}>{year}</option>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Opret gruppespil - Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="match-figure" style={{top: "200px"}}>
                <div className="info-figure1"></div>
                <div className="info-figure2"></div>
            </div>
            <div className={opretStyles.container}>
                <div className={opretStyles.gruppespilSection}>
                    <p className={opretStyles.opretH1}>Opret nyt gruppespil</p>
                    <p className={opretStyles.opretH2}>Lav dit eget gruppespil og invitér venner</p>
                    <div className={opretStyles.opretForm}>
                        <div className={opretStyles.element}>
                            <p className={opretStyles.dataH2}>Generelt</p>
                            <p className={opretStyles.dataH3}>Gruppespillets navn</p>
                            <input type="text" value={spilNavn} className={opretStyles.input} onChange={event => setSpilNavn(event.target.value)} placeholder="Navn" />
                            <p className={opretStyles.dataH3}>Slutdato</p>
                            <div className={opretStyles.multiInput}>
                                <select className={opretStyles.input} onChange={event => setFD(event.target.value)}>
                                    {getFD()}
                                </select>
                                <select className={opretStyles.input} onChange={event => setFM(event.target.value)}>
                                    {getFM()}
                                </select>
                                <select className={opretStyles.input} onChange={event => setFY(event.target.value)}>
                                    {getFY()}
                                </select>
                            </div>
                            <p className={opretStyles.dataH3}>Synlighed</p>
                            <div className={opretStyles.multiInput}>
                                <select className={opretStyles.input} onChange={event => setSynlighed(event.target.value)}>
                                    <option value="offentlig">Offentlig</option>
                                    <option value="privat">Privat</option>
                                </select>
                            </div>
                            {spilSynlighed === "privat" && <>
                            <p className={opretStyles.dataH3}>Kodeord til tilmelding</p>
                                <input type="password" value={password} className={opretStyles.input} onChange={event => setPassword(event.target.value)} autoComplete='off' />
                                <p className={opretStyles.dataH3}>Gentag kodeord</p>
                                <input type="password" value={repPassword} className={opretStyles.input} onChange={event => setRepPassword(event.target.value)} autoComplete='off' />
                            </>}
                        </div>
                        <div className={opretStyles.element}>
                            <p className={opretStyles.dataH2}>Økonomi</p>
                            <p className={opretStyles.dataH3}>Startbeløb</p>
                            <input type="number" value={spilStart} className={opretStyles.input} onChange={event => setStart(parseInt(event.target.value))} placeholder="1000" />
                            <p className={opretStyles.dataH3}>Minimumsbeløb (Sæt 0 for at fjerne minimumsbeløb)</p>
                            <input type="number" value={spilMin} className={opretStyles.input} onChange={event => setMin(parseInt(event.target.value))} placeholder="0" />
                            <p className={opretStyles.dataH3}>Maksbeløb (Sæt 0 for at fjerne maksbeløb)</p>
                            <input type="number" value={spilMax} className={opretStyles.input} onChange={event => setMax(parseInt(event.target.value))} placeholder="0" />
                            <p className={opretStyles.dataH3}>Ugentlig indskydelse (Sæt 0 for at fjerne indskydelse)</p>
                            <input type="number" value={indskydelse} className={opretStyles.input} onChange={event => setIndskydelse(parseInt(event.target.value))} placeholder="0" />
                        </div>
                        {/* <div className="op-form-element">
                            <p className="op-form-p">Specielle ligaer</p>
                            <div className="op-box" style={{marginTop: "10px"}} onClick={() => {if (leagueSetting){setLeagueSetting(false)}else{setLeagueSetting(true)}}}>
                                {!leagueSetting && <div className="op-input-tick-active"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                    </svg></div>}
                                {leagueSetting && <div className="op-input-tick"></div>}
                                <p className="op-form-p" style={{fontWeight: "400", fontSize: "14px"}}>Alle ligaer</p>
                            </div>
                        </div>
                        {leagueSetting && <div className="setup-element">
                            <p className="op-form-p" style={{padding: "10px 0px"}}>Ligaer</p>
                            <div className="setup-search">
                                <input type="text" placeholder="Søg" className="setup-input" onChange={event => setLigaSearchStr(event.target.value)} />
                            </div>
                            <ul className="setup-hits">
                                {items.map((item) => {
                                    if (item.type === "liga") {
                                        if (ligasearchStr === "") {
                                            if (favorites.findIndex(obj => obj.id === item.id && obj.type === item.type) >= 0) {
                                                return (
                                                    <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                        <button id={"klub-" + item.id + item.type} className="setup-checkbox setup-checkbox-active">
                                                            <svg xmlns="http://www.w3.org/2000/svg" id={"icon-" + item.id + item.type} className="setup-icon display" viewBox="0 0 16 16">
                                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                            </svg>
                                                        </button>
                                                        <div className="setup-hit-wrapper">
                                                            <div className="setup-img">
                                                                <Image layout="fill" src={item.logo_path} />
                                                            </div>
                                                            <p className="setup-p">{item.name}</p>
                                                        </div>
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                        <button id={"klub-" + item.id + item.type} className="setup-checkbox" >
                                                            <svg xmlns="http://www.w3.org/2000/svg"  id={"icon-" + item.id + item.type} className="setup-icon" viewBox="0 0 16 16">
                                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                            </svg>
                                                        </button>
                                                        <div className="setup-hit-wrapper">
                                                            <div className="setup-img">
                                                                <Image layout="fill" src={item.logo_path} />
                                                            </div>
                                                            <p className="setup-p">{item.name}</p>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        } else {
                                            if ((item.name.toLowerCase()).includes(ligasearchStr.toLowerCase())) {
                                                if (favorites.findIndex(obj => obj.id === item.id && obj.type === item.type) >= 0) {
                                                    return (
                                                        <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                            <button id={"klub-" + item.id + item.type} className="setup-checkbox setup-checkbox-active">
                                                                <svg xmlns="http://www.w3.org/2000/svg" id={"icon-" + item.id + item.type} className="setup-icon display" viewBox="0 0 16 16">
                                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                                </svg>
                                                            </button>
                                                            <div className="setup-hit-wrapper">
                                                                <div className="setup-img">
                                                                    <Image layout="fill" src={item.logo_path} />
                                                                </div>
                                                                <p className="setup-p">{item.name}</p>
                                                            </div>
                                                        </li>
                                                    );
                                                } else {
                                                    return (
                                                        <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                            <button id={"klub-" + item.id + item.type} className="setup-checkbox" >
                                                                <svg xmlns="http://www.w3.org/2000/svg"  id={"icon-" + item.id + item.type} className="setup-icon" viewBox="0 0 16 16">
                                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                                </svg>
                                                            </button>
                                                            <div className="setup-hit-wrapper">
                                                                <div className="setup-img">
                                                                    <Image layout="fill" src={item.logo_path} />
                                                                </div>
                                                                <p className="setup-p">{item.name}</p>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                            }
                                        }
                                    }
                                })}
                            </ul>
                        </div>} */}
                    </div>
                    <button className="wc-btn" onClick={opretHandler}>{loading && <div className="loader" id="loader"></div>}{!loading && <>Opret Gruppespil</>}</button>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ res, req, query }) {
    const sendRedirectLocation = (location) => {
        res.writeHead(302, {
            Location: location,
        });
        res.end();
        return { props: {} };
    };
    if (!req.cookies.auth) {
        sendRedirectLocation('/login')
    }
    return {
        props: { },
    }
}
 
export default Opret;