import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import organisationerStyles from './css/modules/sider/organisationer.module.css';
import faqStyles from './css/modules/sider/faq.module.css';
import Head from 'next/head'
import { getQuestions } from "./components/faqQ.js";
import Iphone from './assets/img/IphoneMockup.png';
 
function Organisationer () {

    var questions = getQuestions()

    function showQuestion(id) {
        var question = document.getElementById(id);
        question.classList.toggle(faqStyles.faq__selected);
    }

    return (
        <>
            <Head>
                <title>Organisationer - Fantasybetting</title>
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
            <div className={organisationerStyles.container}>
                <div className={organisationerStyles.hero}>
                    <div className={organisationerStyles.heroWrapper}>
                        <h1 className={organisationerStyles.heroH1}>For organisationer <br/>og virksomheder.</h1>
                        <h2 className={organisationerStyles.heroH2}>Skab den perfekte underholdning med Fantasybetting i din organisation. Få adgang til eksklusive funktioner såsom miniligaer og puljespil.</h2>
                    </div>
                </div>
                <div className={organisationerStyles.section} id="fordele">
                    <div className={organisationerStyles.section__side}>
                        <div className={organisationerStyles.section__side__left}>
                            <Image alt="" src={Iphone} height="550" />
                        </div>
                        <div className={organisationerStyles.section__side__right}>
                            <h2 className={organisationerStyles.infoComponentH1}>Hvad får din organisation?</h2>
                            <ul className={faqStyles.faq__container} style={{marginTop: "20px", width: "100%"}}>
                                {questions.map(question => {
                                    return (
                                        <li key={question.id} id={question.id} className={faqStyles.faq__element} onClick={() => {showQuestion(question.id)}}>
                                            <div className={faqStyles.faq__element__ui}>
                                                <p className={faqStyles.faq__element__ui__h1}>{question.name}</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={faqStyles.faq__element__icon} width="26" height="26" fill="#333" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </div>
                                            <ul className={faqStyles.faq__element__ux}>
                                                {question.paragraphs.map(para => {
                                                    if (para.type === "text") {
                                                        return (
                                                            <li key={para.text} className={faqStyles.faq__element__ux__p}>{para.text}</li>
                                                        );
                                                    } else if (para.type === "link") {
                                                        return (
                                                            <li key={para.text} className={faqStyles.faq__element__ux__a}><Link href={para.to} className={faqStyles.faq__element__ux__a}>{para.text}</Link></li>
                                                        );
                                                    } else if (para.type === "br") {
                                                        return (
                                                            <li key="br"><br /><br /></li>
                                                        );
                                                    }
                                                })}
                                            </ul>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={organisationerStyles.section} id="fordele">
                    <div className={organisationerStyles.infoComponentHeader}>
                        <div className={organisationerStyles.spaceBetween}>
                            <h2 className={organisationerStyles.infoComponentH1}>Fordele og funktioner</h2>
                            <p className={organisationerStyles.infoComponentP}>Oplev et udvalg af eksklusive fordele og funktioner udelukkende tilgængeligt for organisationer og virksomheder.</p>
                        </div>
                        <div className={organisationerStyles.spaceBetween}>
                            <p></p>
                            <Link href="/kontakt">
                                <div className={organisationerStyles.arrowInline}>
                                    <p className={organisationerStyles.infoComponentA}>Kontakt vores salgsteam</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.infoComponentIcon} viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={organisationerStyles.fordeleContainer}>
                        <div className={organisationerStyles.fordeleElement}>
                            <div className={organisationerStyles.fordeleHeader}>
                                <p className={organisationerStyles.fordeleH1}>Fordele og funktioner overblik</p>
                            </div>
                            <div className={organisationerStyles.fordeleWrapper}>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>Opret flere miniligaer</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>Opret puljespil for medlemmer</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>Oversigt og data på medlemmer</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>Grafik med organisation og Fantasybetting</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>Unikke gruppespil for organisationen</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                                {/* <div className={organisationerStyles.fordel} style={{border: "0px"}}>
                                    <p className={organisationerStyles.fordelP}>Få Tottenham til at vinde ligaen</p>
                                    <div className={organisationerStyles.fordelCross}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} style={{fill: "#333"}} viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className={organisationerStyles.fordeleElement}>
                            <div className={organisationerStyles.fordeleHeader}>
                                <p className={organisationerStyles.fordeleH1}>Detaljeret beskrivelse</p>
                            </div>
                            <div className={organisationerStyles.fordeleWrapper}>
                                <div className={organisationerStyles.fordel}>
                                    <p className={organisationerStyles.fordelP}>TBA</p>
                                    <div className={organisationerStyles.fordelCheck}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={organisationerStyles.fordelIcon} viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={organisationerStyles.section} id="kunder">
                    <div className={organisationerStyles.splitComponentHeader}>
                        <div className={organisationerStyles.splitComponentLeft}>
                            <div>
                                <h2 className={organisationerStyles.infoComponentH1}>Bliv en del af noget større</h2>
                                <p className={organisationerStyles.infoComponentP} style={{paddingLeft: "0px"}}>I er ikke alene om det. Bliv en del af Fantasybettings fællesskab sammen med en række andre organisationer og virksomheder.</p>
                            </div>
                            <div>
                                <Link href="/kontakt">
                                    <button className={organisationerStyles.mainCta}><span>Kontakt vores salgsteam</span></button>
                                </Link>
                            </div>
                        </div>
                        <div className={organisationerStyles.splitComponentRight}>
                            <div className={organisationerStyles.splitArtElement}>
                                <div className={organisationerStyles.splitArtLongBlock}></div>
                                <div className={organisationerStyles.splitArtShortBlock}></div>
                            </div>
                            <div className={organisationerStyles.splitArtElement}>
                                <div className={organisationerStyles.splitArtShortBlock}></div>
                                <div className={organisationerStyles.splitArtLongBlock}></div>
                            </div>
                            <div className={organisationerStyles.splitArtElement}>
                                <div className={organisationerStyles.splitArtLongBlock}></div>
                                <div className={organisationerStyles.splitArtShortBlock}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Organisationer;