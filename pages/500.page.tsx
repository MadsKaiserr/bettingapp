import * as React from 'react';
import Head from 'next/head'
import FaqComponent from './components/faq';
import errorStyles from './css/modules/sider/errors.module.css';
 
function _500 () {
    return (
        <>
            <Head>
                <title>500 - Fejl på serveren | Fantasybetting</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="main-block-container">
                <p className={errorStyles.h2}>500 - Fejl på serveren</p>
                <h1 className={errorStyles.h1}>HOV, DER SKETE EN FEJL</h1>
            </div>
            <FaqComponent />
        </>
    )
}
 
export default _500;