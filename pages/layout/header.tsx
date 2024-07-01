import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { getUser } from "../services/authService";
import resetUserSession from "../services/authService";
import cookie from 'js-cookie'

import Spillemyndigheden from '../assets/img/spillemyndighed.png';
import Stopspillet from '../assets/img/stopspillet.png';
import Rofus from '../assets/img/rofus.png';
import Logo from '../assets/img/logo-primary.png';
import Coin from '../assets/img/coin.png';

import headerStyle from '../css/modules/layout/header.module.css';
import { getConfig } from '../services/config';
 
function Header () {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [transaktionerModal, setTransaktionerModal] = useState(false);

    useEffect(() => {
        if (getUser()) {
            setLoggedIn(true)
            setUsername(getUser().username)
            setEmail(getUser().email)
        }
        window.addEventListener("scroll", function(){
            if (document.getElementById("nav-bar")) {
                var header = document.getElementById("nav-bar");
                header.classList.toggle("nav-scrolled", window.scrollY > 450);
            }
        })
    }, [])

    function logout() {
        resetUserSession();
        window.open("/", "_self");
    }

    var whereami = "unknown"
    if (typeof window !== 'undefined') {
        whereami = window.location.pathname;
    }

    const [time, setTime] = useState(new Date().getHours().toString().padStart(2, '0') + ":" + new Date().getMinutes().toString().padStart(2, '0'));

    useEffect(() => {
        setInterval(() => setTime(new Date().getHours().toString().padStart(2, '0') + ":" + new Date().getMinutes().toString().padStart(2, '0')), 1000);
    }, [])

    function getNavigation() {
        return (
            <>
                <nav className={headerStyle.navWrapper}>
                    <div className={headerStyle.navigation}>
                        <Link href="/" className={headerStyle.logoWrapper}>
                            <div style={{position: "relative", width: 45, height: 50}}>
                                <Image style={{position: "relative", width: 45, height: 50}} alt="" src={Logo} />
                            </div>
                            <p className={headerStyle.logoP}>Fantasybetting</p>
                        </Link>
                    </div>
                    <div className={headerStyle.navigation__nav}>
                        <Link href="/betting" className={headerStyle.navP}>Betting</Link>
                        <Link href="/gruppespil" className={headerStyle.navP}>Gruppespil</Link>
                        <Link href="/organisationer" className={headerStyle.navP}>Organisationer</Link>
                        <Link href="/faq" className={headerStyle.navP}>Spørgsmål og svar</Link>
                    </div>
                    <div className={headerStyle.headerCta}>
                        {loggedIn && <div className="nav-profile">
                            <div className="nav-error" id="main-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="nav-error-img" viewBox="0 0 16 16" id="errorIcon">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                <p className="nav-error-p" id="main-error-p">Din konto er suspenderet.</p>
                                <Link href="#" className="nav-error-a">Find ud af hvorfor</Link>
                            </div>
                            <div className="nav-error">
                                <p className="nav-info-p">Beta - V. 1.1.3</p>
                            </div>
                            <Link href="/indstillinger">
                                <div className="nav-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="bell-icon" viewBox="0 0 16 16">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </div>
                            </Link>
                            <div className="nav-profile-btn" onClick={() => {document.getElementById("userDropdown").classList.toggle("display"); document.getElementById("profileArrow").classList.toggle("deg180");}}>
                                <div className="nav-profile-pic">
                                    {cookie.get("fbLogin") && <Image alt="" src={"http://graph.facebook.com/"+ JSON.parse(cookie.get("fbLogin")).id +"/picture?type=square"} />}
                                    {!cookie.get("fbLogin") && <>{username.slice(0,1)}</>}
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="profile-icon" id="profileArrow" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                            <div className="user-dropdown" id="userDropdown">
                                <div className="user-info">
                                    <div className="user-logo-tem">
                                        {typeof window !== 'undefined' && <>
                                            {cookie.get("fbLogin") && <Image alt="" src={"http://graph.facebook.com/"+ JSON.parse(cookie.get("fbLogin")).id +"/picture?type=square"} />}
                                            {!cookie.get("fbLogin") && <>{loggedIn && <>{(username).slice(0,1)}</>}</>}
                                        </>}
                                    </div>
                                    <div className="user-info-desc">
                                        <p className="user-name">{loggedIn && <>{username}</>}</p>
                                        <p className="user-email">{loggedIn && <>{email}</>}</p>
                                    </div>
                                </div>
                                <div className="user-divider"></div>
                                <Link href="/indstillinger">
                                    <div className="user-element">
                                        <p className="user-element-p">Din profil</p>
                                    </div>
                                </Link>
                                <div className="user-element" onClick={() => logout()}>
                                    <p className="user-element-p">Log ud</p>
                                </div>
                            </div>
                        </div>}
                        {!loggedIn && <div className={headerStyle.headerCta}>
                            <Link href="/login" className={headerStyle.ctaSecond}>Log ind</Link>
                            <Link href="/signup" className={headerStyle.ctaMain}>Opret Profil</Link>
                        </div>}
                    </div>
                </nav>
                {whereami.slice(0,8) === "/betting" && <>
                    {loggedIn && <div className={headerStyle.stageWrapper}>
                        <nav className={headerStyle.stageNav}>
                            {whereami === "/betting" && <a className={headerStyle.stagePActive}>Lav kupon</a>}
                            {whereami !== "/betting" && whereami !== "/betting/match" && <Link href="/betting" className={headerStyle.stageP}>Lav kupon</Link>}
                            {whereami === "/betting/match" && <Link href="/betting" className={headerStyle.stagePActive}>Lav kupon</Link>}
                            {whereami === "/betting/liveodds" && <a className={headerStyle.stagePActive}>Liveodds</a>}
                            {whereami !== "/betting/liveodds" && <Link href="/betting/liveodds" className={headerStyle.stageP}>Liveodds</Link>}
                            {whereami === "/betting/favoritter" && <a className={headerStyle.stagePActive}>Favoritter</a>}
                            {whereami !== "/betting/favoritter" && <Link href="/betting/favoritter" className={headerStyle.stageP}>Favoritter</Link>}
                            {whereami === "/betting/search" && <a className={headerStyle.stagePActive}>Søgning</a>}
                            {whereami !== "/betting/search" && <Link href="/betting/search" className={headerStyle.stageP}>Søgning</Link>}
                            {whereami === "/betting/mitgruppespil" && <a className={headerStyle.stagePActive}>Mit gruppespil</a>}
                            {whereami !== "/betting/mitgruppespil" && whereami !== "/betting/aktive-spil" && <Link href="/betting/mitgruppespil" className={headerStyle.stageP}>Mit gruppespil</Link>}
                            {whereami === "/betting/aktive-spil" && <Link href="/betting/mitgruppespil" className={headerStyle.stagePActive}>Mit gruppespil</Link>}
                            {whereami === "/betting/bets" && <a className={headerStyle.stagePActive}>Mine væddemål</a>}
                            {whereami !== "/betting/bets" && <Link href="/betting/bets" className={headerStyle.stageP}>Mine væddemål</Link>}
                        </nav>
                        <div className={headerStyle.konto}>
                            <div className={headerStyle.settingElement} onClick={() => setTransaktionerModal(true)}>
                                <div className={headerStyle.settingImg}>
                                    <Image height={16} width={16} src={Coin} alt="" />
                                </div>
                                <p className={headerStyle.settingP}>1500,00 kr.</p>
                            </div>
                        </div>
                    </div>}
                </>}
            </>
        )
    }

    return (
        <>
            {transaktionerModal && <div className={headerStyle.settingBg}>
                <div className={headerStyle.settingModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setTransaktionerModal(false)} className={headerStyle.settingModalIcon} viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <p className={headerStyle.settingModalH1}>Seneste transaktioner</p>
                    <ul className={headerStyle.settingModalWrapper}>
                        <li className={headerStyle.settingModalElement}>
                            <p className={headerStyle.settingModalP}>Bla bla bla</p>
                        </li>
                    </ul>
                </div>
            </div>}
            <header>
                {getConfig("headerAnsvar") && <div className={headerStyle.ansvarWrapper}>
                    <div className={headerStyle.ansvarNav}>
                        <Image onClick={() => window.open("https://www.spillemyndigheden.dk/", "_BLANK")} alt="Spillemyndighedenv" src={Spillemyndigheden} width={22} height={22} />
                        <Image onClick={() => window.open("https://www.stopspillet.dk/", "_BLANK")} alt="Stopspillet" src={Stopspillet} width={35} height={18} />
                        <Image onClick={() => window.open("https://www.spillemyndigheden.dk/rofus#-rofus-", "_BLANK")} alt="Rofus" src={Rofus} width={65} height={10} />
                    </div>
                    <div className={headerStyle.ansvarNav} style={{gap: "4px"}}>
                        <Link href="/betingelser" className={headerStyle.ansvarA}>Fantasybetting bruger virtuelle penge</Link>
                        <p className={headerStyle.ansvarP}> - <span style={{fontWeight: "500"}}>{time}</span></p>
                    </div>
                </div>}
                {loggedIn ? <div className={headerStyle.headerAuth}></div> : <div className={headerStyle.headerNoAuth}></div>}
                {getConfig("headerAnsvar") && <div className={headerStyle.navContainer} id="nav-bar">
                    {getNavigation()}
                </div>}
                {!getConfig("headerAnsvar") && <div className={headerStyle.navContainer} style={{top: "0"}} id="nav-bar">
                    {getNavigation()}
                </div>}
            </header>
        </>
    )
}
 
export default Header;