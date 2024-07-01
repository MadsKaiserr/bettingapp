import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import resetUserSession from "./services/authService";
import setUserSession from "./services/authService";
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import FacebookLogin from 'react-facebook-login';
import Google from './assets/img/google.png';
import Logo from './assets/img/logo-primary.png';
import cookie from 'js-cookie'
import PrimaryLogo from './assets/img/logo-primary.png';
import { useRouter } from 'next/router'
import signupStyles from './css/modules/sider/signup.module.css';
import {GoogleLogin} from 'react-google-login';
 
function Login () {
    const router = useRouter()

    const [box1, setBox1] = useState(false);

    useEffect(() => {
        if (document.getElementById("box1")) {
            if (box1) {
                document.getElementById("box1").classList.add("signup-checked");
                document.getElementById("box1-icon").classList.add("display");
            } else {
                document.getElementById("box1").classList.remove("signup-checked");
                document.getElementById("box1-icon").classList.remove("display");
            }
        }
    }, [box1])

    const [email, setEmail] = useState("");
    const [kodeord, setKodeord] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailErr, setEmailErr] = useState(false);
    const [kodeordErr, setKodeordErr] = useState(false);

    const loginHandler = (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);
        setEmailErr(false)
        setKodeordErr(false)

        if (email === "") {
            setEmailErr(true)
            setLoading(false)
            return;
        } else if (kodeord === "") {
            setKodeordErr(true)
            setLoading(false)
            return;
        }

        const loginURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/login";
        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        const requestBody = {
            email: email,
            password: kodeord,
            type: "email",
            remember: "168h"
        }

        if (box1) {
            requestBody.remember = "744h"
        }

        axios.post(loginURL, requestBody, requestConfig).then(response => {
            console.log("AWS - Login:", response);
            setUserSession(response.data.user, response.data.token);
            router.push("/betting");
        }).catch(error => {
            console.log(error);
            if (error.code === "ERR_NETWORK") {
                setMessage("Serverfejl - Kontakt for mere info");
            } else {
                if (error.response.data.message === "Forkert kodeord") {
                    setKodeordErr(true)
                } else if (error.response.data.message === "Brugeren kunne ikke findes") {
                    setEmailErr(true)
                } else {
                    setMessage("Serverfejl - Kontakt for mere info");
                }
            }
            setLoading(false);
        })
    }

    const fbResponse = (event) => {
        console.log(event);
        if (!event.status) {
            const requestConfig = {
                headers: {
                    "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                }
            }
    
            const requestBody = {
                email: event.email,
                type: "facebook"
            }

            var loginURL;
    
            axios.post(loginURL, requestBody, requestConfig).then(response => {
                console.log("AWS - Login:", response);
                setUserSession(response.data.user, response.data.token);
                cookie.set("fbLogin", JSON.stringify(event), {expires: 7})
                if (response.data.user.type === "facebook") {
                    if (!response.data.user.fb_logo_id) {
                        const loginURL2 = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/user";
                        const requestConfig2 = {
                            headers: {
                                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                            }
                        }
                
                        const requestBody2 = {
                            fb_logo_id: event.id,
                            name: event.name,
                            email: event.email
                        }
                
                        axios.patch(loginURL2, requestBody2, requestConfig2).then(response => {
                            console.log("AWS - Update user:", response);
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                }
                window.open("/stage", "_self");
            }).catch(error => {
                console.log(error);
                setMessage(error.response.data.message);
            })
        } else {
            setMessage("Serverfejl")
        }
    }

    const handleGoogleSuccess = (res) => {
        console.log("Logged ind", res.profileObj)
    }

    const handleGoogleError = (res) => {
        console.log("Google login fejl", res)
    }

    return (
        <>
            <Head>
                <title>Log ind på Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/login" />
                <meta name="description" content="Log ind på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="Fantasybetting log ind, log ind,login,Fantasybetting login,lav konto,konto,min konto" />
                <meta itemProp="name" content="Fantasybetting Log Ind" />
                <meta itemProp="description" content="Log ind på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
                <meta property="og:title" content="Log ind - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/login" />
                <meta property="og:description" content="Log ind på Danmarks eneste gratis betting platform - Bet for virtuelle penge mod familie og venner." />
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
                <div className={signupStyles.section}>
                    <h1 className={signupStyles.signupH1}>Velkommen tilbage</h1>
                    <p className={signupStyles.signupH2}>Log ind på din profil</p>
                    <form onSubmit={loginHandler} id="loginForm">
                        <div className={signupStyles.signupElement} style={{paddingTop: "0px"}}>
                            <input placeholder='Email adresse' type="text" className={signupStyles.input} onChange={event => setEmail(event.target.value)} />
                            {emailErr && <p className={signupStyles.signupErr}>Der findes ingen konto med denne e-mailadresse</p>}
                            <input style={{marginTop: "20px"}} placeholder="Kodeord" type="password" className={signupStyles.input} onChange={event => setKodeord(event.target.value)} />
                            {kodeordErr && <p className={signupStyles.signupErr}>Adgangskoden matcher ikke denne e-mailadresse</p>}
                        </div>
                        <div className="signup-check" style={{marginTop: "0px", marginBottom: "30px"}} onClick={() => {if (box1) {setBox1(false)}else{setBox1(true)}}}>
                            <div className="signup-checkbox" id="box1">
                                <svg xmlns="http://www.w3.org/2000/svg" id={"box1-icon"} className="setup-icon" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                            </div>
                            <p className="login-check-p">Husk denne enhed i 30 dage</p>
                        </div>
                        {message !== "" && <p className={signupStyles.error__message}>{message}</p>}
                        <div className={signupStyles.heroCta__container}>
                            <button value="Login" type="submit" className={signupStyles.heroCta__main__btn}>
                                <span>
                                    {loading && <div className="loader" id="loader"></div>}{!loading && <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" className={signupStyles.heroCta__icon} viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                        </svg>
                                        Log ind
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
                        <p className="login-form-label">Har du ikke en konto? <Link href="/signup" className="login-link">Opret konto</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
 
export default Login;