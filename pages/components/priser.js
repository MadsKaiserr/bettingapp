import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import axios from "axios";
import { useRouter } from 'next/router'
import { getUser } from "../services/authService";
 
function Priser () {
    const router = useRouter()

    useEffect(() => {
        if (document.getElementById("loader1")) {
            document.getElementById("loader1").classList.add("display-not");
        }
        if (document.getElementById("loader2")) {
            document.getElementById("loader2").classList.add("display-not");
        }
        // window.addEventListener("scroll", function(){
        //     if (document.getElementById("price-input")) {
        //         document.getElementById("price-input").classList.toggle("price-fixed", window.scrollY > 305);
        //     }
        // })
    }, [])

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [priceInterval, setPriceInterval] = useState(3);
    const [plusPrice, setPlusPrice] = useState(29);
    const [premiumPrice, setPremiumPrice] = useState(39);

    const handlePlus = async e => {
        setLoading1(true);
        if (getUser()) {
            if (getUser().rolle === "none") {
                const URL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/subscribe";
                const requestConfig = {
                    headers: {
                        "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                    }
                }
        
                const requestBody = {
                    email: getUser().email,
                    navn: getUser().username,
                    subscription: "plus" + priceInterval
                }

                axios.post(URL, requestBody, requestConfig).then(response => {
                    console.log(response);
                    router.push(response.data.session.url)
                }).catch(error => {
                    console.log("Fejl ved indhentning af data" + error)
                    setLoading1(false);
                })
            } else {
                setLoading1(false);
                setNotiMessage("error", "Du har allerede abonnement", "Gå til indstillinger på din profil, og herunder abonnement, for at ændre dit nuværende abonnement. Se også https://www.tipsspillet.dk/stage/indstillinger");
            }
        } else {
            router.push("/login")
        }
    }

    const handlePremium = async e => {
        setLoading2(true);
        if (getUser()) {
            if (getUser().rolle === "none") {
                const URL = "https://1ponivn4w3.execute-api.eu-central-1.amazonaws.com/api/subscribe";
                const requestConfig = {
                    headers: {
                        "x-api-key": "utBfOHNWpj750kzjq0snL4gNN1SpPTxH8LdSLPmJ"
                    }
                }
        
                const requestBody = {
                    email: getUser().email,
                    navn: getUser().username,
                    subscription: "premium" + priceInterval
                }
                axios.post(URL, requestBody, requestConfig).then(response => {
                    console.log(response);
                    router.push(response.data.session.url)
                }).catch(error => {
                    console.log("Fejl ved indhentning af data" + error)
                    setLoading2(false);
                })
            } else {
                setLoading2(false);
                setNotiMessage("error", "Du har allerede abonnement", "Gå til indstillinger på din profil, og herunder abonnement, for at ændre dit nuværende abonnement. Se også https://www.tipsspillet.dk/stage/indstillinger");
            }
        } else {
            router.push("/login")
        }
    }

    function setType(type) {
        if (type === "quarter") {
            document.getElementById("quarter").className = "price-input-element-active";
            document.getElementById("month").className = "price-input-element";
            document.getElementById("year").className = "price-input-element";
            setPlusPrice(29);
            setPremiumPrice(39);
        } else if (type === "month") {
            document.getElementById("month").className = "price-input-element-active";
            document.getElementById("quarter").className = "price-input-element";
            document.getElementById("year").className = "price-input-element";
            setPlusPrice(39);
            setPremiumPrice(59);
        } else if (type === "year") {
            document.getElementById("year").className = "price-input-element-active";
            document.getElementById("quarter").className = "price-input-element";
            document.getElementById("month").className = "price-input-element";
            setPlusPrice(19);
            setPremiumPrice(29);
        }
    }

    const [messageType, setMessageType] = useState("error-con-error");

    function setNotiMessage(type, heading, message) {
        window.scrollBy(0, -400);
        if (type === "error") {
            setMessageType("error-con-error");
        } else if (type === "success") {
            setMessageType("error-con-success");
        }
        document.getElementById("errorCon").classList.add("display");
        document.getElementById("errorConH").innerHTML = heading;
        document.getElementById("errorConP").innerHTML = message;
    }

    return (
        <>
            <div className="priser-container">
                <div className="match-figure" style={{top: "-200px"}}>
                    <div className="info-figure1"></div>
                    <div className="info-figure2"></div>
                </div>
                <div className="section-price">
                    <div className={messageType} id="errorCon">
                        <div className="error-text">
                            <div className="error-inline">
                                <svg xmlns="http://www.w3.org/2000/svg" style={{marginTop: "-3px"}} width="16" height="16" fill="var(--red)" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                <p className="error-container-h1" id="errorConH">Test fejl</p>
                            </div>
                            <p className="error-container-p" id="errorConP">Test besked</p>
                        </div>
                    </div>
                    <div className="set-center">
                        <div className="price-input animation-fadeleft animation-delay-400" id="price-input">
                            <div className="price-input-element" id="month" onClick={() => {setType("month");setPriceInterval(1)}}>Månedligt</div>
                            <div className="price-input-element-active" id="quarter" onClick={() => {setType("quarter");setPriceInterval(3)}}>Kvartalvis</div>
                            <div className="price-input-element" id="year" onClick={() => {setType("year");setPriceInterval(12)}}>Årligt</div>
                        </div>
                    </div>
                    <div className="plans-container">
                        <div className="plans-con">
                            <div className="plan-element animation-fadetop animation-delay-400">
                                <div className="plan-element-top">
                                    <p className="plan-identifier">Standard</p>
                                    <div className="plan-id-divider"><div className="plan-id-block"></div></div>
                                    <div className="plan-prices">
                                        <p className="plan-element-prisp">kr</p>
                                        <p className="plan-element-pris">0</p>
                                        <p className="plan-element-prisp" style={{fontSize: "15px", width: "100%", opacity: "0.9", marginTop: "auto", marginBottom: "10px"}}>/ for evigt</p>
                                    </div>
                                </div>
                                <Link href="/signup">
                                    <button className="plan-btn-outline">Opret Gratis Konto</button>
                                </Link>
                                <div className="plan-element-perks">
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i 2 spil ad gangen</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i venners gruppespil</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Opret gruppespil i alle ligaer</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i præmieturneringer</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Udvidet statistikker</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Gratis betting tips</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Ingen reklamer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="plan-element animation-fadetop animation-delay-600">
                                <div className="plan-element-top">
                                    <p className="plan-identifier">Plus</p>
                                    <div className="plan-id-divider"><div className="plan-id-block"></div></div>
                                    <div className="plan-prices">
                                        <p className="plan-element-prisp">kr</p>
                                        <p className="plan-element-pris">{plusPrice}</p>
                                        {plusPrice === 29 && <div className="plan-spar">Spar 25%</div>}
                                        {plusPrice === 19 && <div className="plan-spar">Spar 50%</div>}
                                        <p className="plan-element-prisp" style={{fontSize: "15px", width: "100%", opacity: "0.9", marginTop: "auto", marginBottom: "10px"}}>/ måned</p>
                                    </div>
                                </div>
                                <button className="plan-btn-default" onClick={handlePlus}>{loading1 && <div className="loader" id="loader1"></div>}{!loading1 && <>Køb abonnement</>}</button>
                                <div className="plan-element-perks">
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i 5 spil ad gangen</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i venners gruppespil</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Opret private gruppespil</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i præmieturneringer*</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Plus abonnement statistikker</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Gratis betting tips</p>
                                    </div>
                                    <div className="plan-element-perk-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Ingen reklamer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="plan-element animation-fadetop animation-delay-800">
                                <div className="plan-element-top">
                                    <p className="plan-identifier">Premium</p>
                                    <div className="plan-id-divider"><div className="plan-id-block"></div></div>
                                    <div className="plan-prices">
                                        <p className="plan-element-prisp">kr</p>
                                        <p className="plan-element-pris">{premiumPrice}</p>
                                        {premiumPrice === 39 && <div className="plan-spar">Spar 34%</div>}
                                        {premiumPrice === 29 && <div className="plan-spar">Spar 50%</div>}
                                        <p className="plan-element-prisp" style={{fontSize: "15px", width: "100%", opacity: "0.9", marginTop: "auto", marginBottom: "10px"}}>/ måned</p>
                                    </div>
                                </div>
                                <button className="plan-btn-default" onClick={handlePremium}>{loading2 && <div className="loader" id="loader2"></div>}{!loading2 && <>Køb abonnement</>}</button>
                                <div className="plan-element-perks">
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i <span className="plan-element-perk-desc-active">uendelige</span> spil</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i venners gruppespil</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Opret <span className="plan-element-perk-desc-active">offentlige</span> og <span className="plan-element-perk-desc-active">private</span> gruppespil</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Deltag i <i><span className="plan-element-perk-desc-active">alle</span></i> præmieturneringer</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc"><span className="plan-element-perk-desc-active">Alle</span> udvidet statistikker</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Gratis betting tips</p>
                                    </div>
                                    <div className="plan-element-perk">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="plan-element-perk-icon" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                        <p className="plan-element-perk-desc">Ingen reklamer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
 
export default Priser;