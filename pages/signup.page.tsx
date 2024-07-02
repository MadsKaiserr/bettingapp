import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
// import resetUserSession from "./services/authService";
// import setUserSession from "./services/authService";
import Link from 'next/link'
import Head from 'next/head'
import signupStyles from './css/modules/sider/signup.module.css';
import gruppespilStyles from './css/modules/gruppespil/gruppespil.module.css';
import Image from 'next/image'
import FacebookLogin from 'react-facebook-login';
import cookie from 'js-cookie'
import Logo from './assets/img/logo-primary.png';
import Google from './assets/img/google.png';
import { useRouter } from 'next/router'
import {GoogleLogin} from 'react-google-login';
import { getSearch } from './services/search';
 
function Signup () {
    const router = useRouter()

    const [navigation, setNavigation] = useState(1)
    const [mainState, setMainState] = useState("unset");
    const [emailState, setEmailState] = useState("person");

    const [message, setMessage] = useState("");
    const [oprettet, setOprettet] = useState(false)

    const [box1, setBox1] = useState(false);
    const [box2, setBox2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);


    useEffect(() => {
        if (box1 && document.getElementById("box1")) {
            document.getElementById("box1").classList.add("signup-checked");
            document.getElementById("box1-icon").classList.add("display");
        } else if (document.getElementById("box1")) {
            document.getElementById("box1").classList.remove("signup-checked");
            document.getElementById("box1-icon").classList.remove("display");
        }
    }, [box1])

    useEffect(() => {
        if (box2 && document.getElementById("box2")) {
            document.getElementById("box2").classList.add("signup-checked");
            document.getElementById("box2-icon").classList.add("display");
        } else if (document.getElementById("box2")) {
            document.getElementById("box2").classList.remove("signup-checked");
            document.getElementById("box2-icon").classList.remove("display");
        }
    }, [box2])

    const [box3, setBox3] = useState(false);
    const [box4, setBox4] = useState(false);

    useEffect(() => {
        if (box3 && document.getElementById("box3")) {
            document.getElementById("box3").classList.add("signup-checked");
            document.getElementById("box3-icon").classList.add("display");
        } else if (document.getElementById("box3")) {
            document.getElementById("box3").classList.remove("signup-checked");
            document.getElementById("box3-icon").classList.remove("display");
        }
    }, [box3])

    useEffect(() => {
        if (box4 && document.getElementById("box4")) {
            document.getElementById("box4").classList.add("signup-checked");
            document.getElementById("box4-icon").classList.add("display");
        } else if (document.getElementById("box4")) {
            document.getElementById("box4").classList.remove("signup-checked");
            document.getElementById("box4-icon").classList.remove("display");
        }
    }, [box4])

    const [FD, setFD] = useState("0")
    const [FM, setFM] = useState("0")
    const [FY, setFY] = useState("0")
    const [fornavn, setFornavn] = useState("");
    const [efternavn, setEfternavn] = useState("");
    const [email, setEmail] = useState("");
    const [kodeord, setKodeord] = useState("");
    const [kodeordVali, setKodeordVali] = useState(false);
    const [brugernavn, setBrugernavn] = useState("");
    const [fbEvent, setFbEvent] = useState("");

    const [FYErr, setFYErr] = useState(false)
    const [fornavnErr, setFornavnErr] = useState(false);
    const [efternavnErr, setEfternavnErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [kodeordErr, setKodeordErr] = useState(false);
    const [brugernavnErr, setBrugernavnErr] = useState(false);
    const [boxErr, setBoxErr] = useState(false);

    useEffect(() => {
        if (kodeord.length >= 8 && document.getElementById("passTegn")) {
            document.getElementById("passTegn").className = "login-req-element-active";
        } else if (document.getElementById("passTegn")) {
            document.getElementById("passTegn").className = "login-req-element";
        }

        var hasNumber = false;
        var hasUpper = false;
        var hasLower = false;
        for (var i = 0; i < kodeord.length; i++) {
            if (parseInt(kodeord[i]) === 0 || parseInt(kodeord[i]) === 1 || parseInt(kodeord[i]) === 2 || parseInt(kodeord[i]) === 3 || parseInt(kodeord[i]) === 4 || parseInt(kodeord[i]) === 5 || parseInt(kodeord[i]) === 6 || parseInt(kodeord[i]) === 7 || parseInt(kodeord[i]) === 8 || parseInt(kodeord[i]) === 9) {
                hasNumber = true;
            }
            if (kodeord[i] === kodeord[i].toUpperCase()) {
                hasUpper = true;
            }
            if (kodeord[i] === kodeord[i].toLowerCase()) {
                hasLower = true;
            }
        }

        if (hasUpper && hasLower && document.getElementById("passBig")) {
            document.getElementById("passBig").className = "login-req-element-active";
        } else if (document.getElementById("passBig")) {
            document.getElementById("passBig").className = "login-req-element";
        }

        if (hasNumber && document.getElementById("passTal")) {
            document.getElementById("passTal").className = "login-req-element-active";
        } else if (document.getElementById("passTal")) {
            document.getElementById("passTal").className = "login-req-element";
        }
        if (hasNumber && hasUpper && hasLower && kodeord.length >= 8) {
            setKodeordVali(true);
        } else {
            setKodeordVali(false);
        }
    }, [kodeord])

    useEffect(() => {
        const pass = document.getElementById("kodeord");
        if (pass) {
            pass.addEventListener('focusin', (event) => {
                if (document.getElementById("login-req")) {
                    document.getElementById("login-req").classList.add("display-flex");
                }
            });
              
            pass.addEventListener('focusout', (event) => {
                if (document.getElementById("login-req")) {
                    document.getElementById("login-req").classList.remove("display-flex");
                }
            });
        }
    })

    const signupHandler = (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);
        setFYErr(false)
        setFornavnErr(false)
        setEfternavnErr(false)
        setBrugernavnErr(false)
        setEmailErr(false)
        setKodeordErr(false)
        setBoxErr(false)

        var emailMatch = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (parseInt(FD) <= 0 || parseInt(FM) <= 0 || parseInt(FY) <= 0) {
            setFYErr(true)
            setLoading(false)
            return;
        } else if (new Date().getTime() < (new Date(FY + "-" + FM + "-" + FD).getTime() + (1000 * 60 * 60 * 24 * 365 * 13))) {
            setFYErr(true)
            setLoading(false)
            return;
        } else if (fornavn === "") {
            setFornavnErr(true)
            setLoading(false)
            return;
        } else if (efternavn === "") {
            setEfternavnErr(true)
            setLoading(false)
            return;
        } else if (brugernavn === "" || brugernavn.indexOf(' ') >= 0) {
            setBrugernavnErr(true)
            setLoading(false)
            return;
        } else if (!email.match(emailMatch)) {
            setEmailErr(true)
            setLoading(false)
            return;
        } else if (!kodeordVali) {
            setKodeordErr(true)
            setLoading(false)
            return;
        } else if (!box1) {
            setBoxErr(true)
            setLoading(false)
            return;
        }

        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/signup";
        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }
        var requestBody = {
            brugernavn: brugernavn,
            fornavn: fornavn,
            efternavn: efternavn,
            birth: FD + "-" + FM + "-" + FY,
            email: email,
            kodeord: kodeord,
            nyhedsbrev: false,
            type: "email"
        }
        if (box2) {
            requestBody.nyhedsbrev = true;
        }

        axios.post(signupURL, requestBody, requestConfig).then(response => {
            console.log("AWS - Opret konto:", response);
            // resetUserSession();

            const loginURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/login";
            const loginConfig = {
                headers: {
                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                }
            }

            const loginBody = {
                email: email,
                password: kodeord,
                type: "email",
                remember: "168h"
            }
    
            axios.post(loginURL, loginBody, loginConfig).then(response => {
                console.log("AWS - Login:", response);
                // setUserSession(response.data.user, response.data.token);
                setOprettet(true)
                setEmailState("oprettet")
                window.scrollTo(0, 0)
            }).catch(error => {
                console.log(error);
                setMessage(error);
                setLoading(false);
            })
        }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                setMessage(error.response.data.message);
                setLoading(false);
            } else {
                setMessage("Backend server is down")
                console.log(error)
                setLoading(false);
            }
        })
    }

    const fbResponse = (event) => {
        if (event.name !== undefined && event.email !== undefined) {
            setFbEvent(JSON.stringify(event))
            // setFbEventLogo(event.id);
            setMessage("");
            document.getElementById("loginForm").classList.add("display-not");
            document.getElementById("fbForm").classList.remove("display-not");
            setEmail(event.email);
            setFornavn(event.name);
        }
    }

    const fbSignupHandler = (event) => {
        event.preventDefault();

        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        // var requestBody = {
        //     username: brugernavn,
        //     navn: fornavn,
        //     fb_logo_id: fbEventLogo,
        //     email: email.toLowerCase(),
        //     rolle: "none",
        //     nyhedsbrev: false,
        //     type: "facebook"
        // }
        var requestBody = {
            username: brugernavn,
            navn: fornavn,
            email: email.toLowerCase(),
            rolle: "none",
            nyhedsbrev: false,
            type: "facebook"
        }

        if (box4) {
            requestBody.nyhedsbrev = true;
        }

        if (brugernavn !== "") {
            if (box3) {
                var signupURL;
                axios.post(signupURL, requestBody, requestConfig).then(response => {
                    console.log("AWS - Opret konto:", response);
                    // resetUserSession();

                    const loginURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/login";
                    const loginConfig = {
                        headers: {
                            "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                        }
                    }
            
                    const loginBody = {
                        email: email.toLowerCase(),
                        type: "facebook"
                    }
            
                    axios.post(loginURL, loginBody, loginConfig).then(response => {
                        console.log("AWS - Login:", response);
                        cookie.set("fbLogin", fbEvent, {expires: 7})
                        // setUserSession(response.data.user, response.data.token);
                        document.getElementById("info1").classList.add("display-not");
                        document.getElementById("info2").classList.remove("display-not");
                        window.scrollTo(0, 0)
                    }).catch(error => {
                        console.log(error);
                        setMessage(error);
                        setLoading2(false);
                    })
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        setMessage(error.response.data.message);
                        setLoading2(false);
                        if (error.response.data.message === "Der er allerede oprettet en bruger med denne email") {
                            document.getElementById("loginForm").classList.remove("display-not");
                            document.getElementById("fbForm").classList.add("display-not");
                        }
                    } else {
                        setMessage("Backend server is down")
                        setLoading2(false);
                    }
                })
            } else {
                setMessage("For at oprette en konto kræver det du accepterer vores betingelser")
                setLoading2(false);
            }
        } else {
            setMessage("Udfyld venligst dit brugernavn");
            setLoading2(false);
        }
    }

    function access() {
        if (favorites.length > 0) {
            const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/favorit";

            const requestConfig = {
                headers: {
                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                }
            }

            const requestBody = {
                "data": favorites,
                "email": cookie.get("email")
            }
            axios.post(signupURL, requestBody, requestConfig).then(response => {
                console.log("AWS - Favoritter:", response);
                router.push("/betting");
            }).catch(error => {
                console.log(error);
            })
        } else {
            router.push("/betting");
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
        for (var i=todayYear-13;i >= 1900;i--){
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

    const handleGoogleSuccess = (res) => {
        console.log("Logged ind", res.profileObj)
    }

    const handleGoogleError = (res) => {
        console.log("Google login fejl", res)
    }

    function checkPerson() {
        setMessage("");
        setFYErr(false)
        setFornavnErr(false)
        setEfternavnErr(false)
        setBrugernavnErr(false)
        setEmailErr(false)
        setKodeordErr(false)
        setBoxErr(false)

        if (parseInt(FD) <= 0 || parseInt(FM) <= 0 || parseInt(FY) <= 0) {
            setFYErr(true)
            setLoading(false)
            return;
        } else if (new Date().getTime() < (new Date(FY + "-" + FM + "-" + FD).getTime() + (1000 * 60 * 60 * 24 * 365 * 13))) {
            setFYErr(true)
            setLoading(false)
            return;
        } else if (fornavn === "") {
            setFornavnErr(true)
            setLoading(false)
            return;
        } else if (efternavn === "") {
            setEfternavnErr(true)
            setLoading(false)
            return;
        } else if (!parseInt(FD)) {
            setFYErr(true)
            setLoading(false)
            return;
        } else {
            setNavigation(2)
            setEmailState("profil")
        }
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

    const [items, setItems] = useState(getSearch());
    const [klubsearchStr, setKlubSearchStr] = useState("");
    const [favorites, setFavorites] = useState([]);

    return (
        <>
            <Head>
                <title>Opret konto på Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/signup" />
                <meta name="description" content="Opret konto på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="Fantasybetting opret konto, opret konto,signup,Fantasybetting signup,lav konto,konto,min konto" />
                <meta itemProp="name" content="Fantasybetting Opret Konto" />
                <meta itemProp="description" content="Opret konto på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
                <meta property="og:title" content="Opret konto - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/signup" />
                <meta property="og:description" content="Opret konto på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
            </Head>
            <div className="match-figure" style={{top: "0px"}}>
                <div className="info-figure1"></div>
                <div className="info-figure2"></div>
            </div>
            <div className={signupStyles.container}>
                <div className={signupStyles.logoContainer}>
                    <Link href="/" className={signupStyles.logoContainerLink}>
                        <div><Image width={55} height={55} src={Logo} alt="Fantasybetting Logo" className={signupStyles.logo} /></div>
                        <a className={signupStyles.logoH1}>Fantasybetting</a>
                    </Link>
                </div>
                <div className={signupStyles.section} id="setupSection">
                    {mainState === "unset" && <div>
                        <h1 className={signupStyles.signupH1}>Opret din konto</h1>
                        <p className={signupStyles.signupH2}>Vælg en af nedenstående for at fortsætte</p>
                        <div>
                            <button onClick={() => {setMainState("email")}} className={signupStyles.heroCta__main__btn}>
                                <span>
                                    {loading && <div className="loader" id="loader"></div>}{!loading && <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" className={signupStyles.heroCta__icon} viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                        </svg>
                                        Opret konto med Email
                                    </>}
                                </span>
                            </button>
                            <div className={signupStyles.heroCta__divider}>
                                <div className={signupStyles.heroCta__divider__line}></div>
                                <p className={signupStyles.heroCta__divider__p}>eller</p>
                                <div className={signupStyles.heroCta__divider__line}></div>
                            </div>
                            <div className={signupStyles.heroCta__cta__container}>
                                <div className={signupStyles.googleBtn__container}>
                                    <span>
                                        <Image alt="" className={signupStyles.googleBtn__icon} src={Google} />
                                        Google
                                    </span>
                                    <GoogleLogin
                                        clientId="953419915155-75840sbvdnuj8r99nip01neok2ma88rt.apps.googleusercontent.com"
                                        autoLoad={false}
                                        buttonText=""
                                        onSuccess={handleGoogleSuccess}
                                        onFailure={handleGoogleError}
                                        icon={false}
                                        isSignedIn={true}
                                        cookiePolicy={'single_host_origin'}
                                        className={signupStyles.googleBtn__btn}
                                    />
                                </div>
                                <FacebookLogin
                                    appId="1252645385555497"
                                    autoLoad={false}
                                    fields="name,email"
                                    callback={fbResponse}
                                    disableMobileRedirect={true}
                                    version="2.5"
                                    textButton="Facebook"
                                    redirectUri="https://www.Fantasybetting.dk/"
                                    cssClass={signupStyles.heroCta__cta__btn}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4267B2" className={signupStyles.heroCta__icon} viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                </svg>}
                                />
                            </div>
                        </div>
                        <p className="login-form-label">Har du allerede en konto? <Link href="/login" className="login-link">Log ind</Link></p>
                    </div>}
                    {mainState === "email" && <>
                        {!oprettet && <>
                            {emailState === "person" && <div>
                                <h1 className={signupStyles.signupH1}>Opret din konto</h1>
                                <div className={signupStyles.signupElement} style={{paddingTop: "0px", paddingBottom: "0px"}}>
                                    <p className={signupStyles.signupH2}>Personlige oplysninger</p>
                                    <p className={signupStyles.signupH3}>Alder - Over 13 år</p>
                                    <div className={signupStyles.multiInput}>
                                        <select className={signupStyles.input} onChange={event => setFD(event.target.value)}>
                                            {getFD()}
                                        </select>
                                        <select className={signupStyles.input} onChange={event => setFM(event.target.value)}>
                                            {getFM()}
                                        </select>
                                        <select className={signupStyles.input} onChange={event => setFY(event.target.value)}>
                                            {getFY()}
                                        </select>
                                    </div>
                                    {FYErr && <p className={signupStyles.signupErr}>Indtast venligst en fødselsdag for mere end 13 år siden</p>}
                                    <input style={{marginTop: "20px"}} type="text" className={signupStyles.input} onChange={event => setFornavn(event.target.value)} placeholder="Fornavn" />
                                    {fornavnErr && <p className={signupStyles.signupErr}>Indtast venligst dit fornavn for at fortsætte</p>}
                                    <input type="text" className={signupStyles.input} style={{marginTop: "20px"}} onChange={event => setEfternavn(event.target.value)} placeholder="Efternavn" />
                                    {efternavnErr && <p className={signupStyles.signupErr}>Indtast venligst dit efternavn for at fortsætte</p>}
                                </div>
                                <div className="form-btn">
                                    {message !== "" && <p className="form-error">{message}</p>}
                                    <button style={{marginTop: "20px"}} onClick={() => {checkPerson()}} className={signupStyles.heroCta__main__btn}>
                                        <span>
                                            {loading && <div className="loader" id="loader"></div>}{!loading && <>
                                                Fortsæt
                                            </>}
                                        </span>
                                    </button>
                                </div>
                                <p className="login-form-label">Har du allerede en konto? <Link href="/login" className="login-link">Log ind</Link></p>
                            </div>}
                            {emailState === "profil" && <div>
                                <h1 className={signupStyles.signupH1}>Opret din konto</h1>
                                <form onSubmit={signupHandler} id="loginForm">
                                    <div className={signupStyles.element}>
                                        <p className={signupStyles.signupH2}>Profiloplysninger</p>
                                        <p className={signupStyles.signupH3}>Email - Vi sender en bekræftelsesmail</p>
                                        <input type="text" className={signupStyles.input} onChange={event => setEmail(event.target.value)} placeholder="Email" />
                                        {emailErr && <p className={signupStyles.signupErr}>Indtast venligst en valid e-mailadresse</p>}
                                        <input style={{marginTop: "20px"}} type="text" className={signupStyles.input} onChange={event => setBrugernavn(event.target.value)} placeholder="Brugernavn" />
                                        {brugernavnErr && <p className={signupStyles.signupErr}>Indtast venligst dit brugernavn uden mellemrum</p>}
                                        <input style={{marginTop: "20px"}} className={signupStyles.input} id="kodeord" type="password" onChange={event => setKodeord(event.target.value)} placeholder="Kodeord" />
                                        {kodeordErr && <p className={signupStyles.signupErr}>Følg venligst de angivede krav for dit kodeord</p>}
                                    </div>
                                    <div className="login-form-p">
                                        <div className="login-req" id="login-req">
                                            <div className="login-req-element" id="passTegn">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="login-req-check" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                </svg>
                                                <p className="login-req-p">Mindst 8 tegn</p>
                                            </div>
                                            <div className="login-req-element" id="passTal">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="login-req-check" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                </svg>
                                                <p className="login-req-p">Mindst 1 tal</p>
                                            </div>
                                            <div className="login-req-element" id="passBig">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="login-req-check" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                </svg>
                                                <p className="login-req-p">Mindst 1 stort og småt bogstav</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="signup-check" onClick={() => {if (box1) {setBox1(false)}else{setBox1(true)}}}>
                                        <div className="signup-checkbox" id="box1">
                                            <svg xmlns="http://www.w3.org/2000/svg" id={"box1-icon"} className="setup-icon" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                            </svg>
                                        </div>
                                        <p className="login-check-p">Jeg accepterer Fantasybetting&apos;s <span className="login-form-dotted" onClick={() => window.open("/betingelser", "_BLANK")}>brugsbetingelser</span> og <span className="login-form-dotted" onClick={() => window.open("/privatliv", "_BLANK")}>privatlivspolitik</span></p>
                                    </div>
                                    {boxErr && <p className={signupStyles.signupErr}>Acceptér venligst vores betingelser for at fortsætte</p>}
                                    <div className="signup-check" onClick={() => {if (box2) {setBox2(false)}else{setBox2(true)}}}>
                                        <div className="signup-checkbox" id="box2">
                                            <svg xmlns="http://www.w3.org/2000/svg" id={"box2-icon"} className="setup-icon" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                            </svg>
                                        </div>
                                        <p className="login-check-p">Jeg vil gerne modtage rabatkuponer, nyheder og tips til betting</p>
                                    </div>
                                    <div className="form-btn">
                                        {message !== "" && <p className="form-error">{message}</p>}
                                        <button style={{marginTop: "20px"}} value="Login" type="submit" className={signupStyles.heroCta__main__btn}>
                                            <span>
                                                {loading && <div className="loader" id="loader"></div>}{!loading && <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" className={signupStyles.heroCta__icon} viewBox="0 0 16 16">
                                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                    </svg>
                                                    Opret konto
                                                </>}
                                            </span>
                                        </button>
                                    </div>
                                    <p className="login-form-label">Har du allerede en konto? <Link href="/login" className="login-link">Log ind</Link></p>
                                </form>
                            </div>}
                        </>}
                        {oprettet && <>
                            {emailState === "oprettet" && <div>
                                <div className="login-text">
                                    <h2 className="login-text-h1">Din konto er nu oprettet!&#128640;</h2>
                                </div>
                                <div className="login-form">
                                    <p className="tak-p">Tak for du vil være med til at teste beta-versionen af Fantasybetting! Det betyder meget!</p>
                                    <p className="tak-p">Da vi stadig er i beta-test, kan der forekomme fejl, mangler mm., og vi vil derfor være taknemmelige, hvis du kunne anmelde fejl, og komme med generel feedback, som kunne hjælpe os på vej til en fremtidigt lancering af hjemmesiden. Dette gøres på kommentar knappen nederst i højre hjørne på siden med kampe.</p>
                                    <p className="tak-p">Flere ligaer, odds, funktioner mm. er på vej</p>
                                    <button className={signupStyles.ctaMain} onClick={() => {setNavigation(3);setEmailState("hold")}}><span>Fortsæt</span><div className={signupStyles.ctaMainDividerBefore}></div><span className={signupStyles.ctaMainDivider}>Til opsætning</span></button>
                                    <button className={signupStyles.ctaMain} onClick={() => {access()}}><span>Fortsæt</span><div className={signupStyles.ctaMainDividerBefore}></div><span className={signupStyles.ctaMainDivider}>Spring opsætning over</span></button>
                                </div>
                            </div>}
                            {emailState === "hold" && <div>
                                <h1 className={signupStyles.signupH1}>Angiv dine favorithold</h1>
                                <form onSubmit={signupHandler} id="loginForm">
                                    <div className="setup-element">
                                        <div className="setup-search">
                                            <input type="text" placeholder="Søg" className="setup-input" onChange={event => setKlubSearchStr(event.target.value)} />
                                        </div>
                                        <ul className="setup-hits">
                                            {items.map((item) => {
                                                if (item.type === "hold" || item.type === "landshold") {
                                                    if (klubsearchStr === "") {
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
                                                                            <Image width={25} height={25} alt="" src={item.logo_path} />
                                                                        </div>
                                                                        <p className="setup-p">{item.name}</p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return (
                                                                <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                                    <button id={"klub-" + item.id + item.type} className="setup-checkbox">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"  id={"icon-" + item.id + item.type} className="setup-icon" viewBox="0 0 16 16">
                                                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                                        </svg>
                                                                    </button>
                                                                    <div className="setup-hit-wrapper">
                                                                        <div className="setup-img">
                                                                            <Image width={25} height={25} alt="" src={item.logo_path} />
                                                                        </div>
                                                                        <p className="setup-p">{item.name}</p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    } else {
                                                        if ((item.name.toLowerCase()).includes(klubsearchStr.toLowerCase())) {
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
                                                                                <Image width={25} height={25} alt="" src={item.logo_path} />
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
                                                                                <Image width={25} height={25} alt="" src={item.logo_path} />
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
                                    </div>
                                    <div className="setup-cta">
                                        <Link href="/betting" className="nav-btn-outline">Forlad opsætning</Link>
                                        <button className="setup-btn" onClick={() => {setNavigation(4);setEmailState("ligaer")}}>Fortsæt</button>
                                    </div>
                                </form>
                            </div>}
                            {emailState === "ligaer" && <div>
                                <h1 className={signupStyles.signupH1}>Angiv dine favoritligaer</h1>
                                <form onSubmit={signupHandler} id="loginForm">
                                    <div className="setup-element">
                                        <div className="setup-search">
                                            <input type="text" placeholder="Søg" className="setup-input" onChange={event => setKlubSearchStr(event.target.value)} />
                                        </div>
                                        <ul className="setup-hits">
                                            {items.map((item) => {
                                                if (item.type === "liga") {
                                                    if (klubsearchStr === "") {
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
                                                                            <Image width={25} height={25} alt="" src={item.logo_path} />
                                                                        </div>
                                                                        <p className="setup-p">{item.name}</p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        } else {
                                                            return (
                                                                <li key={item.name + item.logo_path} className="setup-hit" onClick={() => {addFavorite(item.id, item.name, item.logo_path, item.land, item.type)}}>
                                                                    <button id={"klub-" + item.id + item.type} className="setup-checkbox">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"  id={"icon-" + item.id + item.type} className="setup-icon" viewBox="0 0 16 16">
                                                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                                        </svg>
                                                                    </button>
                                                                    <div className="setup-hit-wrapper">
                                                                        <div className="setup-img">
                                                                            <Image width={25} height={25} alt="" src={item.logo_path} />
                                                                        </div>
                                                                        <p className="setup-p">{item.name}</p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    } else {
                                                        if ((item.name.toLowerCase()).includes(klubsearchStr.toLowerCase())) {
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
                                                                                <Image width={25} height={25} alt="" src={item.logo_path} />
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
                                                                                <Image width={25} height={25} alt="" src={item.logo_path} />
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
                                    </div>
                                    <div className="setup-cta">
                                        <button className="setup-btn" onClick={() => {access()}}>Afslut opsætning</button>
                                    </div>
                                </form>
                            </div>}
                        </>}
                    </>}
                    {mainState !== "unset" && <div className={signupStyles.navigation}>
                        {navigation === 1 && <div className={signupStyles.navigation__active__dot}></div>}
                        {navigation !== 1 && <div className={signupStyles.navigation__dot}></div>}
                        {navigation === 2 && <div className={signupStyles.navigation__active__dot}></div>}
                        {navigation !== 2 && <div className={signupStyles.navigation__dot}></div>}
                        {navigation === 3 && <div className={signupStyles.navigation__active__dot}></div>}
                        {navigation !== 3 && <div className={signupStyles.navigation__dot}></div>}
                        {navigation === 4 && <div className={signupStyles.navigation__active__dot}></div>}
                        {navigation !== 4 && <div className={signupStyles.navigation__dot}></div>}
                    </div>}
                </div>
            </div>
        </>
    )
}
 
export default Signup;