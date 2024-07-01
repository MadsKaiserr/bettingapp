import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import footerStyle from '../css/modules/layout/footer.module.css';

import Logo from '../assets/img/logo-primary.png';

export default function Footer()  {

    const [sprogModal, setSprogModal] = useState(false);
    const [valutaModal, setValutaModal] = useState(false);

    return (
        <>
            {sprogModal && <div className={footerStyle.settingBg}>
                <div className={footerStyle.settingModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setSprogModal(false)} className={footerStyle.settingModalIcon} viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <p className={footerStyle.settingModalH1}>Vælg et sprog</p>
                    <ul className={footerStyle.settingModalWrapper}>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Dansk</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Svenska</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Norsk</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>English</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Español</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Deutsch</p>
                        </li>
                    </ul>
                </div>
            </div>}
            {valutaModal && <div className={footerStyle.settingBg}>
                <div className={footerStyle.settingModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setValutaModal(false)} className={footerStyle.settingModalIcon} viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <p className={footerStyle.settingModalH1}>Vis odds som</p>
                    <ul className={footerStyle.settingModalWrapper}>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Decimal</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Fraktion</p>
                        </li>
                        <li className={footerStyle.settingModalElement}>
                            <p className={footerStyle.settingModalP}>Amerikansk</p>
                        </li>
                    </ul>
                </div>
            </div>}
            <footer className={footerStyle.footer}>
                <div className={footerStyle.footerWrapper}>
                    <nav className={footerStyle.footerElement}>
                        <p className={footerStyle.footerH1}>Hurtige Links</p>
                        <Link href="/gruppespil" className={footerStyle.footerA}>Tilgængelige ligaer</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Populære hold</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Gruppespil</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Præmiedyster</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Betting</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Hjælp til at spille</Link>
                    </nav>
                    <nav className={footerStyle.footerElement}>
                        <p className={footerStyle.footerH1}>Virksomhed</p>
                        <Link href="/omos" className={footerStyle.footerA}>CVR - Virk</Link><br />
                        <Link href="/omos" className={footerStyle.footerA}>Karriere</Link><br />
                        <Link href="/kontakt" className={footerStyle.footerA}>Kontakt os</Link><br />
                        <Link href="/omos" className={footerStyle.footerA}>Om os</Link>
                    </nav>
                    <nav className={footerStyle.footerElement}>
                        <p className={footerStyle.footerH1}>Organisationer</p>
                        <Link href="/gruppespil" className={footerStyle.footerA}>Partnerprogram</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>For efterskoler</Link><br />
                        <Link href="/gruppespil" className={footerStyle.footerA}>Kontakt os</Link><br />
                    </nav>
                    <nav className={footerStyle.footerElement}>
                        <p className={footerStyle.footerH1}>Resurser</p>
                        <Link href="/gruppespil" className={footerStyle.footerA}>Betingelser</Link><br />
                        <Link href="/privatliv" className={footerStyle.footerA}>Privatlivspolitik</Link><br />
                        <Link href="/omos" className={footerStyle.footerA}>Virksomheden</Link><br />
                        <Link href="/datakontrakter" className={footerStyle.footerA}>Datakontrakter</Link><br />
                        <Link href="/faq" className={footerStyle.footerA}>FAQ</Link>
                    </nav>
                </div>
                <div className={footerStyle.footerBottom}>
                    <div className={footerStyle.logoWrapper}>
                        <div className={footerStyle.footerLogo}>
                            <Image className={footerStyle.footerLogoImage} src={Logo} alt="" />
                        </div>
                        <p className={footerStyle.footerLogoCP}>Fantasybetting</p>
                        <p className={footerStyle.footerCP}>Aps © 2022</p>
                    </div>
                    <div className={footerStyle.someWrapper}>
                        <div className={footerStyle.settingElement} onClick={() => setSprogModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={footerStyle.settingIcon} viewBox="0 0 16 16">
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                            </svg>
                            <p className={footerStyle.settingP}>Dansk</p>
                        </div>
                        <div className={footerStyle.settingElement} onClick={() => setValutaModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={footerStyle.settingIcon} viewBox="0 0 16 16">
                                <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z"/>
                            </svg>
                            <p className={footerStyle.settingP} style={{marginLeft: "-3px"}}>Decimal</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}