import * as React from 'react';
import Head from 'next/head'
import Header from './layout/header.tsx';
import { useState, useEffect } from 'react';
import axios from "axios";

function Kontakt() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [modal, setModal] = useState(false);

    const [besked, setBesked] = useState("");
    const [email, setEmail] = useState("");
    const [navn, setNavn] = useState("");

    function sendBesked() {
        setLoading(true);
        const signupURL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/kontakt";

        const requestConfig = {
            headers: {
                "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
            }
        }

        const requestBody = {
            email: email,
            navn: navn,
            besked: besked
        }

        if (besked !== "" && navn !== "" && email !== "") {
            axios.post(signupURL, requestBody, requestConfig).then(response => {
                console.log("AWS - Besked sendt:", response);
                setBesked("");
                setEmail("");
                setNavn("");
                setMessage("Beskeden er sendt!")
                setModal(true);
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                console.log(error);
                setMessage("Der skete en fejl - Din besked blev ikke sendt.")
                setModal(false);
            })
        } else {
            setLoading(false);
            setMessage("Udfyld alle felter")
        }
    }

    return (
        <>
            <Head>
                <title>Kontakt - Fantasybetting</title>
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
            <Header />
            {modal && <div className="modal-test">
                <div className="modal-con">
                    <p className="con-modal-p">Tak for din henvendelse! Vi vil svare dig hurtigst muligt på den angivede email-addresse.</p>
                    <div className="modal-wrapper">
                        <button className="con-modal-btn" onClick={() => setModal(false)}>Okay</button>
                    </div>
                </div>
            </div>}
            <div className="gs-container">
                <div className="main-block-container">
                    <div className="hero-text">
                        <h3 className="cp-h3 animation-fadeleft">Kom i kontakt med os</h3>
                        <h1 className="cp-h1 animation-fadeleft animation-delay-200">Kontakt Fantasybetting</h1>
                        <h2 className="cp-h2 animation-fadetop animation-delay-300">Få svar på dine spørgsmål, og kom i <span className="color-primary font-weight-500">kontakt</span> direkte med os.</h2>
                    </div>
                </div>
                <div className="gs-wrapper">
                    <div className="kt-container">
                        <div className="kt-wrapper">
                            <div className="kt-type">
                                <p clasName="kt-p">Navn</p>
                                <input type="text" value={navn} onChange={event => setNavn(event.target.value)}  className="kt-input" placeholder="Fx. Mads Kaiser" />
                            </div>
                            <div className="kt-type">
                                <p clasName="kt-p">Email</p>
                                <input type="text" value={email} onChange={event => setEmail(event.target.value)}  className="kt-input" placeholder="Fx. madskaiser@gmail.com" />
                            </div>
                        </div>
                        <div className="kt-type" style={{width: "100%"}}>
                            <p clasName="kt-p">Besked</p>
                            <textarea className="kt-area" onChange={event => setBesked(event.target.value)}  value={besked} placeholder="Besked..." />
                        </div>
                        {besked !== "" && <button className="kontakt-btn" onClick={() => sendBesked()}>{loading && <div className="loader" id="loader"></div>}{!loading && <>Send besked</>}</button>}
                        {message !== "" && <p className="kontakt-p">{message}</p>}
                        {besked === "" && <button className="kontakt-btn-off">Send besked</button>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Kontakt;