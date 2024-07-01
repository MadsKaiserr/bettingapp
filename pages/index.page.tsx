import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import homeStyles from './css/modules/home.module.css';

import League from './assets/img/world.png';
import People from './assets/img/users-alt.png';
import Sejr from './assets/img/rocket-lunch.png';
import Penge from './assets/img/usd-circle.png';

import Google from './assets/img/google.png';
import Kamp from './assets/img/kamp.png';
// import FaqComponent from './components/faq.tsx';
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

export default function Home() {

    const fbResponse = (event) => {
        console.log(event);
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
                <title>Fantasybetting - Gratis Betting Konkurrence</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/" />
                <meta name="description" content="Dyst mod dine venner i et verdensomspændende betting-spil, helt uden at bruge en krone. Bet mod familie og venner, eller deltag i præmiedyster." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="Fantasybetting, betting, gratis betting, betting spil, gratis betting spil, betting konkurrence, betting turnering, fodbold betting, gratis fodbold betting, betting-spil, betting tips, odds, gratis oddsning, fodbold odds, gratis tipsspil, betting gruppespil" />
                <meta itemProp="name" content="Fantasybetting" />
                <meta itemProp="description" content="Dyst mod dine venner i et verdensomspændende betting-spil, helt uden at bruge en krone. Bet mod familie og venner, eller deltag i præmiedyster." />
                <meta property="og:title" content="Fantasybetting - Gratis Betting Konkurrence" />
                <meta property="og:description" content="Dyst mod dine venner i et verdensomspændende betting-spil, helt uden at bruge en krone. Bet mod familie og venner, eller deltag i præmiedyster." />
            </Head>
            <div className={homeStyles.hero}>
                <h1 className={homeStyles.heroH1}>
                    <div className={homeStyles.heroWrapper}>
                        <span>F</span>
                        <span>o</span>
                        <span>d</span>
                        <span>b</span>
                        <span>o</span>
                        <span>l</span>
                        <span>d</span>
                        &nbsp;
                        <span>b</span>
                        <span>e</span>
                        <span>t</span>
                        <span>t</span>
                        <span>i</span>
                        <span>n</span>
                        <span>g</span>
                    </div>
                    <div className={homeStyles.heroUnderWrapper}>
                        <span id="dash" style={{marginTop: "-12px", color: "var(--secondary)"}}>-</span>
                        &nbsp;
                        <span className={homeStyles.heroSwitch}>
                            <span className={homeStyles.heroSwitchElement + " main-gradient"} style={{top: "0px", left: "0px", animation: "cycleTop 7s infinite"}}>Helt gratis</span>
                            <span className={homeStyles.heroSwitchElement + " main-gradient"} style={{top: "90px", left: "0px", animation: "cycleBottom 7s infinite"}}>Virtuelle penge</span>
                        </span>
                    </div>
                </h1>
                <h2 className={homeStyles.heroH2}>Konkurrer mod venner i fodbold-betting. &#128640;</h2>
                <div className={homeStyles.heroCta__container}>
                    <Link href="/signup" className={homeStyles.heroCta__main__btn}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" className={homeStyles.heroCta__icon} viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                            </svg>
                            Opret konto med Email
                        </span>
                    </Link>
                    <div className={homeStyles.heroCta__divider}>
                        <div className={homeStyles.heroCta__divider__line}></div>
                        <p className={homeStyles.heroCta__divider__p}>eller fortsæt med</p>
                        <div className={homeStyles.heroCta__divider__line}></div>
                    </div>
                    <div className={homeStyles.heroCta__cta__container}>
                        <div className={homeStyles.googleBtn__container}>
                            <span>
                                <Image alt="" className={homeStyles.googleBtn__icon} src={Google} />
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
                                className={homeStyles.googleBtn__btn}
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
                            cssClass={homeStyles.heroCta__cta__btn}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4267B2" className={homeStyles.heroCta__icon} viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                        </svg>}
                        />
                    </div>
                </div>
                <div className={homeStyles.hero__billede}>
                    <Image alt="" className={homeStyles.hero__billede__img} src={Kamp} />
                </div>
            </div>
            <div className={homeStyles.pointsWrapper}>
                <div className={homeStyles.pointsContainer}>
                    <div className={homeStyles.pointsContainer__element}>
                        <Image alt="League" src={League} className={homeStyles.pointsContainer__element__icon} />
                        <p className={homeStyles.pointsContainer__element__h1}>Vi har mere end 27 ligaer.</p>
                        <p className={homeStyles.pointsContainer__element__p}>Mere end 27+ tilgængelige ligaer, der kan oddses på</p>
                    </div>
                    <div className={homeStyles.pointsContainer__element}>
                        <Image alt="Fællesskab" src={People} className={homeStyles.pointsContainer__element__icon} />
                        <p className={homeStyles.pointsContainer__element__h1}>Dyst mod venner og familie.</p>
                        <p className={homeStyles.pointsContainer__element__p}>Inviter venner og familie til en privat konkurrence</p>
                    </div>
                    <div className={homeStyles.pointsContainer__element}>
                        <Image alt="Sejr" src={Sejr} className={homeStyles.pointsContainer__element__icon} />
                        <p className={homeStyles.pointsContainer__element__h1}>Deltag i vores præmiedyster</p>
                        <p className={homeStyles.pointsContainer__element__p}>Spil mod hele landet og vind diverse gavekort</p>
                    </div>
                    <div className={homeStyles.pointsContainer__element}>
                        <Image alt="Penge" src={Penge} className={homeStyles.pointsContainer__element__icon} />
                        <p className={homeStyles.pointsContainer__element__h1}>Spil med helt gratis.</p>
                        <p className={homeStyles.pointsContainer__element__p}>Du kan spille med og oprette gruppespil helt gratis</p>
                    </div>
                </div>
            </div>
            {/* <FaqComponent /> */}
        </>
    )
}
