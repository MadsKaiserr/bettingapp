import * as React from 'react';
import { useEffect } from 'react';
import { getQuestions } from "./components/faqQ.js";
import Head from 'next/head'
import Link from 'next/link'
import faqStyles from './css/modules/sider/faq.module.css';
import { motion } from "framer-motion"
 
function Faq () {

    var questions = getQuestions();

    function showQuestion(id) {
        var question = document.getElementById(id);
        question.classList.toggle(faqStyles.faq__selected);
    }
    
    useEffect(() => {
        window.addEventListener("scroll", function(){
            if (document.getElementById("designer-hero")) {
                document.getElementById("designer-hero").classList.toggle("designer-relative", window.scrollY > 340);
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>FAQ - Spørgsmål og svar | Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/faq" />
                <meta name="description" content="Få svar på alt hvad du vil vide om betting på Fantasybetting - Ofte stillede spørgsmål - Hvordan fungerer odds på Fantasybetting?" />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="odds,faq,Fantasybetting faq,spørgsmål og svar,Fantasybetting spørgsmål og svar,hvordan opretter man gruppespil,hvordan tilmelder jeg mig præmiedyster" />
                <meta itemProp="name" content="Fantasybetting FAQ" />
                <meta itemProp="description" content="Få svar på alt hvad du vil vide om betting på Fantasybetting - Ofte stillede spørgsmål - Hvordan fungerer odds på Fantasybetting?" />
                <meta property="og:title" content="FAQ - Spørgsmål og svar - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/faq" />
                <meta property="og:description" content="Få svar på alt hvad du vil vide om betting på Fantasybetting - Ofte stillede spørgsmål - Hvordan fungerer odds på Fantasybetting?" />
            </Head>
            <div className={faqStyles.container}>
                <div className={faqStyles.hero}>
                    <div className={faqStyles.heroWrapper}>
                        <h1 className={faqStyles.heroH1}>Få svar på dine spørgsmål.</h1>
                        <h2 className={faqStyles.heroH2}>Få svar på alverdens spørgsmål om spillet, hvordan det fungerer, hjælp til diverse funktioner, organisationshjælp mm.</h2>
                    </div>
                </div>
                <ul className={faqStyles.faq__container} style={{width: "100%", marginTop: "30px"}}>
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
        </>
    )
}
 
export default Faq;