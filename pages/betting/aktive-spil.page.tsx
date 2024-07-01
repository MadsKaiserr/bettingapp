import * as React from 'react';
import bettingStyles from '../css/modules/betting/bets.module.css';
import Head from 'next/head'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import axios from "axios";
import DownArrow from './../assets/img/down-arrow.png';
import cookie from 'js-cookie'
import { getUser } from "../services/authService.js";

function Aktivespil({data}) {
    const router = useRouter()

    useEffect(() => {
        console.log("AWS - Gruppespil:", data)
        // var myArray = [];
        // for (var q in data.newGruppespil) {
        //     if (data.newGruppespil[q].data.players.findIndex(obj => obj.email === cookie.get("email")) >= 0) {
        //         myArray.push(data.newGruppespil[q]);
        //     }
        // }
        // setItems(myArray);
        // setSearch(myArray);
        // setLoading("");
    }, [])

    const [query, setQuery] = useState("");

    const [search, setSearch] = useState([]);

    function makeSearch() {
        var dupli = items;
        var newDupli = [];
        if (query !== "") {
            for (var q in dupli) {
                if (dupli[q].name.includes(query)) {
                    newDupli.push(dupli[q]);
                }
            }
        } else {
            newDupli = dupli;
        }
        setSearch(newDupli);
    }

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState("Indlæser...")

    const [nav, setNav] = useState("alle");

    useEffect(() => {
        if (loading !== "Indlæser...") {
            document.getElementById("stage-loader1").classList.remove("display");
        }
    }, [loading])

    function setActiveGame(id, index, name, notifikationer) {
        cookie.set("activeGame", id, {expires: 7});
        // cookie.set("notifikationer", notifikationer, {expires: 7});
        localStorage.setItem("activeGame", id);
        localStorage.setItem("aktive-spil-suspend", "null");
        router.push("/betting")
    }

    function opretSpilHandler() {
        // if (getUser().rolle !== "none") {
        //     router.push("/betting/opret")
        // } else {
        //     router.push("/priser")
        // }
        router.push("/priser")
    }

    const [currentType, setCurrentType] = useState("alle");

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
            <div className={bettingStyles.container}>
                <div className="td-type">
                    <h1 className="td-h1">Dine gruppespil</h1>
                    <div className="td-btns">
                    <div className="td-type-con animation-fadetop" style={{background: "var(--primary"}} onClick={() => opretSpilHandler()}><span className="td-type-p" style={{color: "#fff"}}>Opret gruppespil</span></div>
                        <div className="td-type-con animation-fadetop" onClick={() => {document.getElementById("type-drop").classList.toggle("display-not")}}>
                            Type: <span className="td-type-p">{currentType}</span>
                            <Image width={7} height={7} src={DownArrow} alt="Pil ned" className="nav-icon" />
                            <div className="td-type-drop display-not" id="type-drop">
                                <p className="td-type-drop-p" onClick={() => setCurrentType("gruppespil")}>Gruppespil</p>
                                <p className="td-type-drop-p" onClick={() => setCurrentType("afsluttede")}>Afsluttede</p>
                                <p className="td-type-drop-p" onClick={() => setCurrentType("dyster")}>Præmiedyster</p>
                                <div className="td-type-drop-divider"></div>
                                <p className="td-type-drop-p" onClick={() => setCurrentType("alle")}>Alle</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="td-box animation-fadetop" style={{margin: "auto", minHeight: "300px", backgroundColor: "transparent", paddingLeft: "0px", paddingRight: "0px", boxShadow: "none"}}>
                    <div className="td-wrapper">
                        <div className="match-loader display" id="stage-loader1"></div>
                        <ul className="td-table" style={{maxHeight: "none", gap: "10px"}}>
                            {/* {search.map((item) => {
                                const index = item.data.players.findIndex(obj => obj.email === "");
                                var activeKupon = 0;
                                for (var u in item.data.players) {
                                    if (item.data.players[u].email === "") {
                                        for (var q in item.data.players[u].kuponer) {
                                            if (item.data.players[u].kuponer[q].calculated === "false") {
                                                activeKupon = activeKupon + 1;
                                            }
                                        }
                                    }
                                }
                                var position = 0;
                                var topScorers = getTopN(item.data.players, item.data.players.length);
                                topScorers.forEach(function(gameItem, index2) {
                                    if (gameItem.email === "") {
                                        position = index2 + 1;
                                    }
                                });

                                var returnable = 
                                <li key={item.id} className="as-element" onClick={() => setActiveGame(item.id, index, item.info.name, "item.data.players[index].info.notifikationer.length")}>
                                    <div>
                                        <p className="as-h1">{item.info.name}</p>
                                        <p className="as-h2">Spillet slutter {new Date(item.info.exp).getDate().toString().padStart(2, '0') + "/" + (new Date(item.info.exp).getMonth() + 1).toString().padStart(2, '0') + "/" + new Date(item.info.exp).getFullYear().toString().padStart(2, '0')}</p>
                                        <div className="hero-info">
                                            <div className="hero-info-block">
                                                <p className="hero-info-block-h1">{item.data.players.length}</p>
                                                <p className="hero-info-block-h2">Spillere</p>
                                            </div>
                                            <div className="hero-info-block">
                                                <p className="hero-info-block-h1">{position}</p>
                                                <p className="hero-info-block-h2">Din position</p>
                                            </div>
                                            <div className="hero-info-block">
                                                <p className="hero-info-block-h1">{activeKupon}</p>
                                                <p className="hero-info-block-h2">Aktive kuponer</p>
                                            </div>
                                        </div>
                                    </div>
                                    {cookie.get("activeGame") && <>
                                        {cookie.get("activeGame") === item.id && <><button className="td-outline">Allerede aktivt</button></>}
                                        {cookie.get("activeGame") !== item.id && <><button className="td-btn">Sæt som aktiv</button></>}
                                    </>}
                                    {!cookie.get("activeGame") && <><button className="td-btn">Sæt som aktiv</button></>}
                                </li>;

                                var afsluttetReturn = 
                                <li key={item.id} className="as-element" onClick={() => setActiveGame(item.id, index, item.name, "item.players[index].info.notifikationer.length")}>
                                    <div>
                                        <p className="as-h1">{item.info.name}</p>
                                        <p className="as-h2">Spillet er afsluttet</p>
                                        <div className="hero-info">
                                            <div className="hero-info-block">
                                                <p className="hero-info-block-h1">{item.data.players.length}</p>
                                                <p className="hero-info-block-h2">Spillere</p>
                                            </div>
                                            <div className="hero-info-block">
                                                <p className="hero-info-block-h1">{position}</p>
                                                <p className="hero-info-block-h2">Din position</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="td-outline">Spillet er afsluttet</button>
                                </li>;
                                if (currentType === "alle") {
                                    if (new Date(item.info.exp).getTime() > new Date().getTime()) {
                                        return returnable;
                                    } else {
                                        return afsluttetReturn;
                                    }
                                } else if (currentType === "gruppespil") {
                                    if ((item.info.synlighed === "offentlig" || item.info.synlighed === "privat") && new Date(item.info.exp).getTime() > new Date().getTime()) {
                                        return returnable;
                                    }
                                } else if (currentType === "afsluttede") {
                                    if (new Date(item.info.exp).getTime() < new Date().getTime()) {
                                        return afsluttetReturn;
                                    }
                                } else if (currentType === "dyster") {
                                    if (item.info.synlighed === "dyst" && new Date(item.info.varighed).getTime() > new Date().getTime()) {
                                        return returnable;
                                    }
                                }
                            })} */}
                            {currentType === "alle" && <>
                                {search.length === 0 && <>
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
                                            <p className="td-empty-h1">Ingen aktive gruppespil</p>
                                            <p className="td-empty-cta-p">Find eller opret et gruppespil for at komme igang</p>
                                            <Link href="/gruppespil" className="find-btn">Find gruppespil</Link>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {currentType === "gruppespil" && <>
                                {search.filter(function( obj ) { return obj.synlighed === 'offentlig' && new Date(obj.varighed).getTime() > new Date().getTime() }).length === 0 && <>
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
                                            <p className="td-empty-h1">Ingen aktive gruppespil</p>
                                            <p className="td-empty-cta-p">Find eller opret et gruppespil for at komme igang</p>
                                            <Link href="/gruppespil" className="td-empty-cta-p" style={{color: "var(--primary)", fontWeight: "500"}}>Find gruppespil</Link>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {currentType === "afsluttede" && <>
                                {search.filter(function( obj ) { return new Date(obj.varighed).getTime() < new Date().getTime() }).length === 0 && <>
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
                                            <p className="td-empty-h1">Ingen afsluttede gruppespil</p>
                                            <p className="td-empty-cta-p">Du har ingen afsluttede gruppespil</p>
                                        </div>
                                    </div>
                                </>}
                            </>}
                            {currentType === "dyster" && <>
                                {search.filter(function( obj ) { return obj.synlighed === 'dyst' && new Date(obj.varighed).getTime() > new Date().getTime() }).length === 0 && <>
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
                        </ul>
                    </div>
                </div>
                <div className="td-spacer animation-fadetop"></div>
                <div className="td-box animation-fadetop" style={{margin: "auto"}}>
                    <p className="find-h1">Find nye gruppespil</p>
                    <p className="find-p">Tilmeld dig offentlige eller private gruppespil, og spil mod familie og venner.</p>
                    <Link href="/gruppespil" className="find-btn">Find nyt gruppespil</Link>
                    <div className="td-divider">
                        <div className="td-line"></div>
                            <p className="td-or">Eller</p>
                        <div className="td-line"></div>
                    </div>
                    <p className="find-h1">Opret et gruppespil</p>
                    <p className="find-p">Opret dit eget gruppespil, og inviter familie og venner til kamp.</p>
                    <button className="find-btn" onClick={() => opretSpilHandler()}>Opret gruppespil</button>
                </div>
            </div>
        </>
    );
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
        sendRedirectLocation('/signup')
    }
    const requestConfig = {
        headers: {
            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
        }
    }
    const resp = await axios.get('https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/aktivgruppespil', requestConfig);
    const data = resp.data;
    if (!data) {
        return {
          notFound: true,
        }
    }
    return {
        props: { data },
    }
}

export default Aktivespil;