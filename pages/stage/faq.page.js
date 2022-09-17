import * as React from 'react';
import {useEffect} from 'react';
import FaqSite from '../components/faq';
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import StageHeader from '../layout/stageheader'
import Height from '../components/height';
 
function StageFaq () {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <Head>
                <title>FAQ - Spørgsmål og svar - Tipsspillet</title>
                <meta name="robots" content="noindex" />
            </Head>
            <StageHeader />
            <Height />
            <div className="stage-main-container" id="faqside">
                <FaqSite />
            </div>
        </>
    )
}
 
export default StageFaq;