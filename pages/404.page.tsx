import * as React from 'react';
import Head from 'next/head'
import FaqComponent from './components/faq';
import Link from 'next/link'
import errorStyles from './css/modules/sider/errors.module.css';
 
function _404 () {
    return (
        <>
            <Head>
                <title>404s - Side ikke fundet | Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className={errorStyles.container}>
                <h1 className={errorStyles.h1}><span style={{color: "var(--primary)"}}>404</span> - Siden blev ikke fundet<span style={{color: "var(--primary)"}}>.</span></h1>
                <h2 className={errorStyles.h2} style={{paddingBottom: "5px"}}>Siden kunne ikke findes på vores servere.</h2>
                <h2 className={errorStyles.h2}>Siden kan være rykket eller fjernet. For mere info, bedes du kontakte os</h2>
                <Link href="/" className={errorStyles.btn}><span>Til forsiden</span></Link>
            </div>
            <FaqComponent />
        </>
    )
}
 
export default _404;