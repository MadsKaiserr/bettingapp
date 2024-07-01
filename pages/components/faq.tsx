import * as React from 'react';
import Link from 'next/link'
import { getQuestions } from "./faqQ.js";
import faqStyles from '../css/modules/sider/faq.module.css';
 
function Faq () {

    var questions = getQuestions();

    function showQuestion(id) {
        var question = document.getElementById(id);
        question.classList.toggle(faqStyles.faq__selected);
    }

    return (
        <>
            <div className="faq__wrapper">
                <p className="faq__h1">Få svar på dine spørgsmål</p>
                <ul className={faqStyles.faq__container}>
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