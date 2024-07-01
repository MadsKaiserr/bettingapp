import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import Image from 'next/image'
import Link from 'next/link'
import gruppespilStyles from './css/modules/gruppespil/gruppespil.module.css';
import Head from 'next/head'
 
function Gruppespil ({data, responseTime}) {
    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState("Indlæser...");
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState([]);

    //Get gruppespil
    useEffect(() => {
        const delayCheck = new Date().getTime()
        const betCalcURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppespil";
        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }
        axios.get(betCalcURL, requestConfig).then(result => {
            console.log("AWS - Gruppespil:", result);
            console.log("Delay - " + (new Date().getTime() - delayCheck) + "ms")
            var newArray = [];
            for (var q in result.data.newGruppespil) {
                if (result.data.newGruppespil[q].info.exp > new Date().getTime()) {
                    newArray.push(result.data.newGruppespil[q]);
                }
            }
            setItems(newArray);
            setSearch(newArray);
            setLoading("");
        }).catch(error => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        var dupli = items;
        var newDupli = [];
        if (query !== "") {
            for (var q in dupli) {
                if (dupli[q].info.name.includes(query)) {
                    newDupli.push(dupli[q]);
                }
            }
        } else {
            newDupli = dupli;
        }
        setSearch(newDupli);
    }, [query])

    function remSearch() {
        setQuery("");
        setSearch(items);
    }

    useEffect(() => {
        if (loading !== "Indlæser...") {
            if (document.getElementById("stage-loader1")) {
                document.getElementById("stage-loader1").classList.remove("display");
            }
        }
    }, [loading])

    const [mainNav, setMainNav] = useState("alle");

    return (
        <>
            <Head>
                <title>Find gruppespil og præmiedyster - Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/gruppespil" />
                <meta name="description" content="Find gruppespil og præmiedyster i Fantasybetting, og dyst gratis mod familie og venner i fodbold-betting med virtuelle penge." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="gruppespil,betting gruppespil" />
                <meta itemProp="name" content="Fantasybetting Gruppespil" />
                <meta itemProp="description" content="Find gruppespil og præmiedyster i Fantasybetting, og dyst gratis mod familie og venner i fodbold-betting med virtuelle penge." />
                <meta property="og:title" content="Find gruppespil og præmiedyster - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/gruppespil" />
                <meta property="og:description" content="Find gruppespil og præmiedyster i Fantasybetting, og dyst gratis mod familie og venner i fodbold-betting med virtuelle penge." />
            </Head>
            <div className={gruppespilStyles.container}>
                <div className={gruppespilStyles.hero}>
                    <div className={gruppespilStyles.heroWrapper}>
                        <h1 className={gruppespilStyles.heroH1}>Find det helt rette gruppespil.</h1>
                        <h2 className={gruppespilStyles.heroH2}>Søg efter venner og families gruppespil, eller find dit fortrukne offentlige gruppespil. Udforsk vores mange fan-baserede turneringer.</h2>
                    </div>
                    <div className={gruppespilStyles.heroMedia}>
                        <div className={gruppespilStyles.cta__container}>
                            <div className={gruppespilStyles.navmenu__container}>
                                {mainNav === "alle" && <button className={gruppespilStyles.navmenu__element__active} onClick={() => {setMainNav("alle")}}>Alle</button>}
                                {mainNav !== "alle" && <button className={gruppespilStyles.navmenu__element} onClick={() => {setMainNav("alle")}}>Alle</button>}
                                {mainNav === "offentlige" && <button className={gruppespilStyles.navmenu__element__active} onClick={() => {setMainNav("offentlige")}}>Offentlige</button>}
                                {mainNav !== "offentlige" && <button className={gruppespilStyles.navmenu__element} onClick={() => {setMainNav("offentlige")}}>Offentlige</button>}
                                {mainNav === "private" && <button className={gruppespilStyles.navmenu__element__active} onClick={() => {setMainNav("private")}}>Private</button>}
                                {mainNav !== "private" && <button className={gruppespilStyles.navmenu__element} onClick={() => {setMainNav("private")}}>Private</button>}
                                {mainNav === "dyst" && <button className={gruppespilStyles.navmenu__element__active} onClick={() => {setMainNav("dyst")}}>Præmiedyster</button>}
                                {mainNav !== "dyst" && <button className={gruppespilStyles.navmenu__element} onClick={() => {setMainNav("dyst")}}>Præmiedyster</button>}
                                <Link href="/login" className={gruppespilStyles.navmenu__element__primary}>Opret gruppespil</Link>
                            </div>
                            <div className={gruppespilStyles.navmenu__right__container}>
                                <div className={gruppespilStyles.search__container}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                    <input value={query} onChange={event => setQuery(event.target.value)} className={gruppespilStyles.input} placeholder='Søg efter gruppespil' />
                                    {query !== "" && <svg xmlns="http://www.w3.org/2000/svg" onClick={() => {remSearch()}} style={{cursor: "pointer", zIndex: "2"}} width="12" height="12" fill="#9999" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                    </svg>}
                                </div>
                            </div>
                        </div>
                        <div className={gruppespilStyles.modifier}>
                            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                                <div className={gruppespilStyles.modifierH1} id="td-navn">
                                    Navn
                                    <div className={gruppespilStyles.modifier__sort__container}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginBottom: "-1px"}} viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginTop: "-1px"}} viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={gruppespilStyles.modifierH1} id="td-synlighed">
                                    Synlighed
                                    <div className={gruppespilStyles.modifier__sort__container}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginBottom: "-1px"}} viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginTop: "-1px"}} viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={gruppespilStyles.modifierH1} id="td-spillere">
                                    Spillere
                                    <div className={gruppespilStyles.modifier__sort__container}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginBottom: "-1px"}} viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginTop: "-1px"}} viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={gruppespilStyles.modifierH1} id="td-admin">
                                    Slutdato
                                    <div className={gruppespilStyles.modifier__sort__container}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginBottom: "-1px"}} viewBox="0 0 16 16">
                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" fill="#6666" style={{marginTop: "-1px"}} viewBox="0 0 16 16">
                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className={gruppespilStyles.table}>
                            {/* {search.map((item) => {
                                const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni",
                                "Juli", "August", "September", "Oktober", "November", "December"];
                                var returnable = <li key={item.id} className={gruppespilStyles.element}>
                                    <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}} onClick={() => window.open("/gruppesession?game=" + item.id, "_self")}>
                                    <div className={gruppespilStyles.nameWrapper} id="td-navn">
                                        <div className={gruppespilStyles.img}>
                                            <Image height={23} width={23} src="https://cdn.sportmonks.com/images/soccer/teams/14/14.png" alt="" />
                                        </div>
                                        <div className={gruppespilStyles.infoName}>
                                            <p className={gruppespilStyles.modifierP} style={{fontWeight: "500", fontSize: "16px"}}>{item.info.name}</p>
                                            <p className={gruppespilStyles.modifierP2}>Af {item.info.admin}</p>
                                        </div>
                                    </div>
                                    <p className={gruppespilStyles.modifierP} id="td-synlighed">{item.info.synlighed}</p>
                                    <div className={gruppespilStyles.nameWrapper} id="td-spillere">
                                        <p className={gruppespilStyles.modifierP} style={{paddingLeft: "8px"}} id="td-spillere">{item.data.player_count}</p>
                                    </div>
                                    <p className={gruppespilStyles.modifierP} id="td-admin">{new Date(item.info.exp).getDate() + " " + monthNames[new Date(item.info.exp).getMonth()]}</p>
                                    </div>
                                </li>;

                                if (mainNav === "offentlige") {
                                    if (item.info.synlighed === "offentlig") {
                                        return returnable;
                                    }
                                } else if (mainNav === "private") {
                                    if (item.info.synlighed === "privat") {
                                        return returnable;
                                    }
                                } else if (mainNav === "dyst") {
                                    if (item.info.synlighed === "dyst") {
                                        return returnable;
                                    }
                                } else if (mainNav === "alle") {
                                    return returnable;
                                }
                            })}
                            {mainNav === "offentlige" && <>
                                {search.filter(function( obj ) { return obj.info.synlighed === 'offentlig' && new Date(obj.info.exp).getTime() > new Date().getTime() }).length === 0 && <>
                                    <div className="td-empty-container">
                                        <div className="td-empty-bg"></div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-cta">
                                            <p className="td-empty-h1">Ingen offentlige gruppespil</p>
                                            <p className="td-empty-cta-p">Find eller opret et gruppespil for at komme igang</p>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {mainNav === "private" && <>
                                {search.filter(function( obj ) { return obj.info.synlighed === 'privat' && new Date(obj.info.exp).getTime() < new Date().getTime() }).length === 0 && <>
                                    <div className="td-empty-container">
                                        <div className="td-empty-bg"></div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-cta">
                                            <p className="td-empty-h1">Ingen private gruppespil</p>
                                            <p className="td-empty-cta-p">Find eller opret et gruppespil for at komme igang</p>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {mainNav === "dyst" && <>
                                {search.filter(function( obj ) { return obj.info.synlighed === 'dyst' && new Date(obj.info.exp).getTime() > new Date().getTime() }).length === 0 && <>
                                    <div className="td-empty-container">
                                        <div className="td-empty-bg"></div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-cta">
                                            <p className="td-empty-h1">Ingen aktive dyster</p>
                                            <p className="td-empty-cta-p">Find aktive præmiedyster for at komme igang</p>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {mainNav === "alle" && <>
                                {search.filter(function( obj ) { return new Date(obj.info.exp).getTime() > new Date().getTime() }).length === 0 && <>
                                    <div className="td-empty-container">
                                        <div className="td-empty-bg"></div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-element" style={{marginLeft: "-50px"}}>
                                            <div className="td-empty-logo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#fff" viewBox="0 0 16 16">
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                                </svg>
                                            </div>
                                            <div className="td-empty-p"></div>
                                        </div>
                                        <div className="td-empty-cta">
                                            <p className="td-empty-h1">Ingen gruppespil</p>
                                            <p className="td-empty-cta-p">Find eller opret et gruppespil for at komme igang</p>
                                        </div>
                                    </div>
                                </>}
                            </>} */}
                            <li key={1} className={gruppespilStyles.element}>
                                <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}} onClick={() => window.open("/gruppesession?game=", "_self")}>
                                <div className={gruppespilStyles.nameWrapper} id="td-navn">
                                    <div className={gruppespilStyles.img}>
                                        {/* {item.info.name.slice(0,1)} */}
                                        <Image height={23} width={23} src="https://cdn.sportmonks.com/images/soccer/teams/14/14.png" alt="" />
                                    </div>
                                    <div className={gruppespilStyles.infoName}>
                                        <p className={gruppespilStyles.modifierP} style={{fontWeight: "500", fontSize: "16px"}}>Kaisergames</p>
                                        <p className={gruppespilStyles.modifierP2}>Af Jan Kaiser</p>
                                    </div>
                                </div>
                                <p className={gruppespilStyles.modifierP} id="td-synlighed">Privat</p>
                                <div className={gruppespilStyles.nameWrapper} id="td-spillere">
                                    <p className={gruppespilStyles.modifierP} style={{paddingLeft: "8px"}} id="td-spillere">8</p>
                                </div>
                                <p className={gruppespilStyles.modifierP} id="td-admin">23 sep</p>
                                </div>
                            </li>
                            <li key={2} className={gruppespilStyles.element}>
                                <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}} onClick={() => window.open("/gruppesession?game=", "_self")}>
                                <div className={gruppespilStyles.nameWrapper} id="td-navn">
                                    <div className={gruppespilStyles.img}>
                                        {/* {item.info.name.slice(0,1)} */}
                                        <Image height={23} width={23} src="https://cdn.sportmonks.com/images/soccer/teams/15/15.png" alt="" />
                                    </div>
                                    <div className={gruppespilStyles.infoName}>
                                        <p className={gruppespilStyles.modifierP} style={{fontWeight: "500", fontSize: "16px"}}>Lindqvist</p>
                                        <p className={gruppespilStyles.modifierP2}>Af Jakob Lindqvist</p>
                                    </div>
                                </div>
                                <p className={gruppespilStyles.modifierP} id="td-synlighed">Privat</p>
                                <div className={gruppespilStyles.nameWrapper} id="td-spillere">
                                    <p className={gruppespilStyles.modifierP} style={{paddingLeft: "8px"}} id="td-spillere">13</p>
                                </div>
                                <p className={gruppespilStyles.modifierP} id="td-admin">8 dec</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Gruppespil;