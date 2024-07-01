import * as React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import betingelserStyles from './css/modules/sider/betingelser.module.css';
 
function Betingelser () {
    return (
        <>
            <Head>
                <title>Betingelser - Fantasybetting</title>
                <link rel="canonical" href="https://www.Fantasybetting.dk/betingelser" />
                <meta name="description" content="Følgende af Fantasybettings betingelser er gældende i forbindelse med anvendelsen af Fantasybetting. Ved brug af internetsiden anerkender og tiltræder du vores betingelser." />
                <meta name="author" content="Mads Kaiser" />
                <meta name="keywords" content="Fantasybetting betingelser,betingelser,terms of service,tos,faq,privatliv" />
                <meta itemProp="name" content="Fantasybetting Betingelser" />
                <meta itemProp="description" content="Følgende af Fantasybettings betingelser er gældende i forbindelse med anvendelsen af Fantasybetting. Ved brug af internetsiden anerkender og tiltræder du vores betingelser." />
                <meta property="og:title" content="Betingelser - Fantasybetting" />
                <meta property="og:url" content="https://www.Fantasybetting.dk/betingelser" />
                <meta property="og:description" content="Følgende af Fantasybettings betingelser er gældende i forbindelse med anvendelsen af Fantasybetting. Ved brug af internetsiden anerkender og tiltræder du vores betingelser." />
            </Head>
            <div className={betingelserStyles.container}>
                <h1 className={betingelserStyles.h1}>Fantasybetting Betingelser</h1>
                <p className={betingelserStyles.h2}>Sidst opdateret 26. sep, 2022</p>
                <p className={betingelserStyles.p}>Velkommen til Fantasybetting</p>
                <h2 className={betingelserStyles.p}>Følgende vilkår og rettigheder er gældende i forbindelse med anvendelsen af internetsiden. Ved at gå ind på denne internetside anerkender og tiltræder du følgende vilkår og rettigheder. Såfremt du ikke kan acceptere disse vilkår og rettigheder, skal du ikke benytte denne internetside</h2>
                <div className={betingelserStyles.betingelser__section}>
                    <h2 className={betingelserStyles.h3}>Sektion A - Om Fantasybetting</h2>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>1 - Hvem er vi?</h3>
                        <p className={betingelserStyles.p}>Fantasybetting er en dansk-ejet enkeltmandsvirksomhed, som er drevet af Mads Kaiser. Vi lader folk konkurrere med familie og venner i Oddset verdenen, uden nogen økonomisk risiko. Vi giver derved også individer under 18-år mulighed for at prøve kræfter af med Odds helt gratis. <br /><br />
                        Fantasybetting tilbyder sjove konkurrencer for familie og venner, og lader folk oprette gruppespil, for at sætte deres Oddset-evner på prøve. Opret gruppespil, deltag i offentlige og private gruppespil, eller prøv kræfter med præmiedyster, hvis du føler dig selvsikker</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>2 - Hvad er vores formål?</h3>
                        <p className={betingelserStyles.p}>Fantasybetting har til formål at tilbyde folk at få afprøvet deres Oddset evner uden økonomisk risiko. Vi stræber på, at kunden får den sjoveste oplevelse på platformen, og kan have en fed konkurrence med familie og venner.</p>
                    </div>
                </div>
                <div className={betingelserStyles.betingelser__section}>
                    <h2 className={betingelserStyles.h3}>Sektion B - Generelle betingelser</h2>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>1 - Ansvarsfraskrivelse</h3>
                        <p className={betingelserStyles.p}>Vi, Fantasybetting, er ikke ansvarlig for indhold offentliggjort i chat rooms og debatsider samt andre fælles områder. Fantasybetting kan ikke gøres ansvarlig såfremt offentliggjort brugerindhold strider mod nogen tredjeparts rettigheder. Alt sådant indhold uanset om det er ytret som meninger, erklæringer eller anbefalinger er brugernes ytrede synspunkter og ikke Fantasybettings.<br /><br />
                        Dataen, som bliver benyttet på hjemmesiden til at udregne odds, sandsynligheder osv., kommer ikke fra Fantasybetting selv, og der kan derfor forekomme upræcishedder eller manglende data. Derved vil Fantasybetting så vidt muligt forsøge at opretholde hjemmesidens kampe som kan bettes på, men tager sin ret til at fjerne en kamp fra åbne kampe, således kampen ikke kan spilles på.<br /><br />
                        Fantasybetting kan være forbundet med andre internetsider, og fraskriver sig derved ansvar for disse, da Fantasybetting ikke har indflydelse på oplysninger, produkter eller ydelser disse tilbyder.</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>2 - Rettigheder til sidens indhold</h3>
                        <p className={betingelserStyles.p}>Alt materiale, værker eller lignende på hjemmeside er ejet af Fantasybetting, og er beskyttet af love om ophavsret og varemærke. Der må derfor ikke kopieres, udstedes, vidersælges, vidergives, ændre eller lignende i vores materiale, kode, værker eller blogopslag.<br /><br />
                        Hjemmesiden sikrer sig, at du som bruger kun har adgang til at benytte siden, men ikke distribuere den af nogen af ovenstående måder.</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>3 - Privatlivspolitik</h3>
                        <p className={betingelserStyles.p}>Ved brug af Fantasybetting accepterer du privatlivspolikken, og dens bestræbelser. <Link href="/privatliv">Se privatlivspolitik</Link></p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>4 - Tekniske problemer mm.</h3>
                        <p className={betingelserStyles.p}>Der kan på hjemmesiden forekomme tekniske problemer, som i visse tilfælde omfatter modtagelse af forkert eller manglende data, som kan medføre forkert behandling af dine væddemål. Forekommer dette, bedes du kontakte på vores kontaktside.</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>5 - Lovvalg og værneting</h3>
                        <p className={betingelserStyles.p}>Disse vilkår og rettigheder reguleres af dansk ret og skal fortolkes i henhold hertil. Hvis det af en domstol med den rette kompetence statueres, at en eller flere af vilkårenes bestemmelser er ugyldige eller uden retskraft, skal den/de fortolkes så tæt på den oprindelige ordlyd som mulig med henblik på at afspejle Fantasybetting intentioner samtidig med, at de øvrige bestemmelser herover bevarer fuld, uændret gyldighed.<br /><br />
                        Hvis Fantasybetting undlader at gøre rettigheder eller bestemmelser i vilkårene gældende, medfører dette ikke et afkald på en sådan rettighed eller bestemmelse, medmindre Fantasybetting har givet skriftlig samtykke hertil.</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>6 - Yderligere hjælp</h3>
                        <p className={betingelserStyles.p}>Mangler du yderligere hjælp, eller skal have svar på et spørgsmål, kan du læse vores FAQ, eller kontakte os direkte på vores kontakt side.</p>
                    </div>
                </div>
                <div className={betingelserStyles.betingelser__section}>
                    <h2 className={betingelserStyles.h3}>Sektion C - Benyttelse af siden</h2>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>1 - Konto</h3>
                        <p className={betingelserStyles.p}>...</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>2 - Tredjepartsoplysninger</h3>
                        <p className={betingelserStyles.p}>...</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>3 - Præmieturneringer</h3>
                        <p className={betingelserStyles.p}>...</p>
                    </div>
                    <div className={betingelserStyles.betingelser__element}>
                        <h3 className={betingelserStyles.h4}>4 - Fejl på data</h3>
                        <p className={betingelserStyles.p}>...</p>
                    </div>
                </div>
            </div>
        </>
    )
}
 
export default Betingelser;