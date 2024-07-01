import * as React from 'react';
import bettingStyles from '../css/modules/betting/bets.module.css';
import { getUser } from "../services/authService";
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { getMonthAbr, getDayAbr, getKupon } from "../services/algo.js";
import axios from "axios";
import cookie from 'js-cookie'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Betting() {

    const [items, setItems] = useState([]);
    const [mainMenu, setMainMenu] = useState("alle");

    useEffect(() => {
        const URL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/gruppesession?game=" + cookie.get("activeGame");
        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        axios.get(URL, requestConfig).then(response => {
            console.log("AWS - Gruppesession:", response);
            // var oddArray = response.data.data.players[response.data.data.players.findIndex(obj => obj.email === "")].kuponer;
            // oddArray.sort((a, b) => {
            //     return b.data.iat - a.data.iat;
            // });
            // setItems(oddArray)
        }).catch(error => {
            console.log("Fejl ved indhentning af data" + error)
        })
    }, [])

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
                <p className={bettingStyles.h1}>Mine væddemål</p>
                <p className={bettingStyles.h2}>Viser væddemål for gruppespil: Kaisergames</p>
                <div className={bettingStyles.mainWrapper}>
                    <div className={bettingStyles.mainNav} style={{gap: "10px"}}>
                        {mainMenu === "alle"
                            ? <div className={bettingStyles.menuActive} style={{padding: "0px 10px"}} onClick={() => setMainMenu("alle")}>
                                <p className={bettingStyles.menuP}>Alle</p>
                            </div>
                            : <div className={bettingStyles.menuElement} style={{padding: "0px 10px"}} onClick={() => setMainMenu("alle")}>
                                <p className={bettingStyles.menuP}>Alle</p>
                            </div>
                        }
                        {mainMenu === "afventer"
                            ? <div className={bettingStyles.menuActive} style={{padding: "0px 10px"}} onClick={() => setMainMenu("afventer")}>
                                <p className={bettingStyles.menuP}>Afventer</p>
                            </div>
                            : <div className={bettingStyles.menuElement} style={{padding: "0px 10px"}} onClick={() => setMainMenu("afventer")}>
                                <p className={bettingStyles.menuP}>Afventer</p>
                            </div>
                        }
                        {mainMenu === "afgjort"
                            ? <div className={bettingStyles.menuActive} style={{padding: "0px 10px"}} onClick={() => setMainMenu("afgjort")}>
                                <p className={bettingStyles.menuP}>Afgjort</p>
                            </div>
                            : <div className={bettingStyles.menuElement} style={{padding: "0px 10px"}} onClick={() => setMainMenu("afgjort")}>
                                <p className={bettingStyles.menuP}>Afgjort</p>
                            </div>
                        }
                    </div>
                    {mainMenu === "alle" && <ul className={bettingStyles.betContainer}>
                        {items.map((item) => {
                            var totalOdds = 1;
                            for (var i in item.bets) {
                                totalOdds = totalOdds * parseFloat(item.bets[i].bet.odds[item.bets[i].bet.guess].value);
                            }
                            return (
                                <li key={item.id} className={bettingStyles.kuponElement}>
                                    <div className={bettingStyles.kupon}>
                                        <div>
                                            <p className={bettingStyles.kuponLeftP}>{getDayAbr(new Date(item.data.iat).getMonth()) + ". " + new Date(item.data.iat).getDate() + " " + getMonthAbr(new Date(item.data.iat).getMonth()) + ", " + new Date(item.data.iat).getHours().toString().padStart(2, '0') + ":" + new Date(item.data.iat).getMinutes().toString().padStart(2, '0')}</p>
                                            <p className={bettingStyles.kuponHeaderP}>Kombination ({item.bets.length})</p>
                                            <p className={bettingStyles.kuponRightP}>{item.data.status}</p>
                                        </div>
                                        <div className={bettingStyles.kuponInfo}>
                                            <div>
                                                <p className={bettingStyles.kuponP}>Total indsats:</p><span className={bettingStyles.kuponPB}>{item.data.indsats},00 kr.</span><br />
                                                <p className={bettingStyles.kuponP}>Total odds:</p><span className={bettingStyles.kuponPB}>{totalOdds.toFixed(2)}</span>
                                            </div>
                                            <div style={{textAlign: "right"}}>
                                                <p className={bettingStyles.kuponP}>Potentiel udbetaling</p><br/><span className={bettingStyles.kuponBox}>{(totalOdds * item.data.indsats).toFixed(2).replace(".", ",")} kr.</span>
                                            </div>
                                        </div>
                                        <ul className={bettingStyles.oddWrapper}>
                                            {item.bets.map((bet) => {
                                                return (
                                                    <li key={bet.id}>
                                                        <Link href={"/betting/match?id=" + bet.match.id}>
                                                            <a className={bettingStyles.betWrapper}>
                                                                <p className={bettingStyles.kuponH2Date}>{new Date(bet.match.starting_at * 1000).getDate() + " " + getMonthAbr(new Date(bet.match.starting_at * 1000).getMonth()) + ". " + new Date(bet.match.starting_at * 1000).getHours().toString().padStart(2, '0') + ":" + new Date(bet.match.starting_at * 1000).getMinutes().toString().padStart(2, '0')}</p>
                                                                <p className={bettingStyles.kuponH1}>{getKupon(bet.bet.type,bet.match.localTeam.name,bet.match.visitorTeam.name)} - <span className={bettingStyles.kuponH1B}>{bet.bet.label}</span></p>
                                                                <p className={bettingStyles.kuponH2}>{bet.match.localTeam.name} - {bet.match.visitorTeam.name}</p>
                                                                <p className={bettingStyles.kuponH3}>{bet.bet.odds[bet.bet.guess].value}</p>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                        {items.length <= 0 && <div className={bettingStyles.skeletonWrapper}>
                            <div className={bettingStyles.skeletonElement}>
                                <Skeleton height="40px" />
                                <Skeleton height="180px" />
                            </div>
                            <div className={bettingStyles.skeletonElement}>
                                <Skeleton height="40px" />
                                <Skeleton height="180px" />
                            </div>
                            <div className={bettingStyles.skeletonElement}>
                                <Skeleton height="40px" />
                                <Skeleton height="180px" />
                            </div>
                        </div>}
                    </ul>}
                    {mainMenu === "afventer" && <ul className={bettingStyles.betContainer}>
                        {items.map((item) => {
                            var totalOdds = 1;
                            for (var i in item.bets) {
                                totalOdds = totalOdds * parseFloat(item.bets[i].bet.odds[item.bets[i].bet.guess].value);
                            }
                            if (item.data.status === "afventer") {
                                return (
                                    <li key={item.id} className={bettingStyles.kuponElement}>
                                        <div className={bettingStyles.kupon}>
                                            <div>
                                                <p className={bettingStyles.kuponLeftP}>Man. 19 Dec, 21:06</p>
                                                <p className={bettingStyles.kuponHeaderP}>Kombination ({item.bets.length})</p>
                                                <p className={bettingStyles.kuponRightP}>{item.data.status}</p>
                                            </div>
                                            <div className={bettingStyles.kuponInfo}>
                                                <div>
                                                    <p className={bettingStyles.kuponP}>Total indsats:</p><span className={bettingStyles.kuponPB}>{item.data.indsats},00 kr.</span><br />
                                                    <p className={bettingStyles.kuponP}>Total odds:</p><span className={bettingStyles.kuponPB}>{totalOdds.toFixed(2)}</span>
                                                </div>
                                                <div style={{textAlign: "right"}}>
                                                    <p className={bettingStyles.kuponP}>Potentiel udbetaling</p><br/><span className={bettingStyles.kuponBox}>{(totalOdds * item.data.indsats).toFixed(2).replace(".", ",")} kr.</span>
                                                </div>
                                            </div>
                                            <ul className={bettingStyles.oddWrapper}>
                                                {item.bets.map((bet) => {
                                                    return (
                                                        <li key={bet.id}>
                                                            <Link href={"/betting/match?id=" + bet.match.id}>
                                                                <a className={bettingStyles.betWrapper}>
                                                                    <p className={bettingStyles.kuponH2Date}>{new Date(bet.match.starting_at * 1000).getDate() + " " + getMonthAbr(new Date(bet.match.starting_at * 1000).getMonth()) + ". " + new Date(bet.match.starting_at * 1000).getHours().toString().padStart(2, '0') + ":" + new Date(bet.match.starting_at * 1000).getMinutes().toString().padStart(2, '0')}</p>
                                                                    <p className={bettingStyles.kuponH1}>{getKupon(bet.bet.type,bet.match.localTeam.name,bet.match.visitorTeam.name)} - <span className={bettingStyles.kuponH1B}>{bet.bet.label}</span></p>
                                                                    <p className={bettingStyles.kuponH2}>{bet.match.localTeam.name} - {bet.match.visitorTeam.name}</p>
                                                                    <p className={bettingStyles.kuponH3}>{bet.bet.odds[bet.bet.guess].value}</p>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>}
                    {mainMenu === "afgjort" && <ul className={bettingStyles.betContainer}>
                        {items.map((item) => {
                            var totalOdds = 1;
                            for (var i in item.bets) {
                                totalOdds = totalOdds * parseFloat(item.bets[i].bet.odds[item.bets[i].bet.guess].value);
                            }
                            if (item.data.status === "afgjort") {
                                return (
                                    <li key={item.id} className={bettingStyles.kuponElement}>
                                        <div className={bettingStyles.kupon}>
                                            <div>
                                                <p className={bettingStyles.kuponLeftP}>Man. 19 Dec, 21:06</p>
                                                <p className={bettingStyles.kuponHeaderP}>Kombination ({item.bets.length})</p>
                                                <p className={bettingStyles.kuponRightP}>{item.data.status}</p>
                                            </div>
                                            <div className={bettingStyles.kuponInfo}>
                                                <div>
                                                    <p className={bettingStyles.kuponP}>Total indsats:</p><span className={bettingStyles.kuponPB}>{item.data.indsats},00 kr.</span><br />
                                                    <p className={bettingStyles.kuponP}>Total odds:</p><span className={bettingStyles.kuponPB}>{totalOdds.toFixed(2)}</span>
                                                </div>
                                                <div style={{textAlign: "right"}}>
                                                    <p className={bettingStyles.kuponP}>Potentiel udbetaling</p><br/><span className={bettingStyles.kuponBox}>{(totalOdds * item.data.indsats).toFixed(2).replace(".", ",")} kr.</span>
                                                </div>
                                            </div>
                                            <ul className={bettingStyles.oddWrapper}>
                                                {item.bets.map((bet) => {
                                                    return (
                                                        <li key={bet.id}>
                                                            <Link href={"/betting/match?id=" + bet.match.id}>
                                                                <a className={bettingStyles.betWrapper}>
                                                                    <p className={bettingStyles.kuponH2Date}>{new Date(bet.match.starting_at * 1000).getDate() + " " + getMonthAbr(new Date(bet.match.starting_at * 1000).getMonth()) + ". " + new Date(bet.match.starting_at * 1000).getHours().toString().padStart(2, '0') + ":" + new Date(bet.match.starting_at * 1000).getMinutes().toString().padStart(2, '0')}</p>
                                                                    <p className={bettingStyles.kuponH1}>{getKupon(bet.bet.type,bet.match.localTeam.name,bet.match.visitorTeam.name)} - <span className={bettingStyles.kuponH1B}>{bet.bet.label}</span></p>
                                                                    <p className={bettingStyles.kuponH2}>{bet.match.localTeam.name} - {bet.match.visitorTeam.name}</p>
                                                                    <p className={bettingStyles.kuponH3}>{bet.bet.odds[bet.bet.guess].value}</p>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>}
                </div>
            </div>
        </>
    );
}

export default Betting;