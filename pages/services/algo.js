module.exports = {
    getKupon: function(type,homeTeam,visitorTeam) {
        if (type === "3Way Result") {
            return "Resultat";
        } else if (type === "3Way Result 1st Half") {
            return "Resultat - 1. Halvleg";
        } else if (type === "3Way Result 2nd Half") {
            return "Kampresultat - 2. Halvleg";
        } else if (type === "Team To Score First") {
            return "Første målscorer";
        } else if (type === "Double Chance") {
            return "Dobbelt chance";
        } else if (type === "Double Chance - 1st Half") {
            return "Dobbelt chance - 1. halvleg";
        } else if (type === "Highest Scoring Half") {
            return "Flest mål i halvleg";
        } else if (type === "Both Teams To Score") {
            return "Begge hold scorer";
        } else if (type === "Clean Sheet - Home") {
            return "Clean sheet " + homeTeam;
        } else if (type === "Clean Sheet - Away") {
            return "Clean sheet " + visitorTeam;
        } else if (type === "Corner Match Bet") {
            return "Flest hjørnespark";
        } else if (type === "First Match Corner") {
            return "Første hjørnespark";
        } else if (type === "Last Match Corner") {
            return "Sidste hjørnespark";
        } else if (type === "Team To Score Last") {
            return "Sidste målscorer";
        } else if (type === "Odd/Even") {
            return "Lige/Ulige mål";
        } else if (type === "First Card Received") {
            return "Første kort";
        } else if (type === "A Red Card in the Match") {
            return "Rødt kort i kampen";
        } else if (type === "Both Teams To Receive A Card") {
            return "Begge hold modtager et kort";
        } else if (type === "Both Teams To Receive 2+ Cards") {
            return "Begge hold modtager 2+ kort";
        } else if (type === "Own Goal") {
            return "Selvmål";
        } else if (type === "Over/Under") {
            return "Mål Over/Under";
        } else if (type === "Exact Goals Number") {
            return "Totalt antal mål";
        } else if (type === "Goalscorer") {
            return "Målscorer";
        } else if (type === "Player to be Booked") {
            return "Advarsel til";
        } else if (type === "Handicap Result") {
            return "Handicap Resultat";
        } else if (type === "1st Half Handicap") {
            return "Handicap 1. Halvleg";
        } else if (type === "2nd Half Handicap") {
            return "Handicap 2. Halvleg";
        } else if (type === "1st Goal Method") {
            return "Første mål - Måltype";
        } else if (type === "Early Goal") {
            return "Tidligt mål";
        } else if (type === "Late Goal") {
            return "Sent mål";
        } else if (type === "Team Cards") {
            return "Uddelte kort";
        } else if (type === "Time Of First Corner") {
            return "Første hjørnespark";
        } else if (type === "Total Corners") {
            return "Totale hjørnespark";
        } else if (type === "Team Corners") {
            return "Hjørnespark";
        } else if (type === "Multi Scorers") {
            return "Målscorer";
        } else if (type === "Correct Score") {
            return "Korrekt resultat";
        } else if (type === "Player to be Sent Off") {
            return "Udvisning";
        } else if (type === "10 Minute Result") {
            return "10 min. vinder";
        } else if (type === "Alternative Total Corners") {
            return "Totale hjørnespark";
        } else if (type === "Alternative Total Goals") {
            return "Totale mål";
        }
    },
    getString: function(type,result,homeTeam,visitorTeam) {
        if (type === "3Way Result" || type === "3Way Result 1st Half" || type === "3Way Result 2nd Half") {
            if (result === "0") {
                return homeTeam;
            } else if (result === "1") {
                return "Uafgjort";
            } else if (result === "2") {
                return visitorTeam;
            }
        } else if (type === "Team To Score First" || type === "Team To Score Last") {
            if (result === "0") {
                return homeTeam;
            } else if (result === "1") {
                return "Ingen mål";
            } else if (result === "2") {
                return visitorTeam;
            }
        } else if (type === "First Card Received") {
            if (result === "0") {
                return homeTeam;
            } else if (result === "1") {
                return "Ingen kort";
            } else if (result === "2") {
                return visitorTeam;
            }
        } else if (type === "Corner Match Bet") {
            if (result === "0") {
                return homeTeam;
            } else if (result === "1") {
                return "Ingen hjørnespark";
            } else if (result === "2") {
                return visitorTeam;
            }
        } else if (type === "Double Chance" || type === "Double Chance - 1st Half") {
            if (result === "0") {
                return homeTeam + " eller uafgjort";
            } else if (result === "1") {
                return "Uafgjort eller " + visitorTeam;
            } else if (result === "2") {
                return homeTeam + " eller " + visitorTeam;
            }
        } else if (type === "Own Goal" || type === "Clean Sheet - Away" || type === "A Red Card in the Match" || type === "Clean Sheet - Home" || type === "Both Teams To Score" || type === "Both Teams To Receive A Card" || type === "Both Teams To Receive 2+ Cards") {
            if (result === "0") {
                return "Ja";
            } else if (result === "1") {
                return "Nej";
            }
        } else if (type === "Last Match Corner" || type === "First Match Corner") {
            if (result === "0") {
                return homeTeam;
            } else if (result === "1") {
                return visitorTeam;
            }
        } else if (type === "Odd/Even") {
            if (result === "0") {
                return "Lige";
            } else if (result === "1") {
                return "Ulige";
            }
        } else if (type === "Highest Scoring Half") {
            if (result === "0") {
                return "1. halvleg";
            } else if (result === "1") {
                return "2. halvleg";
            } else if (result === "2") {
                return "Uafgjort";
            }
        } else if (type.slice(0,-3) === "Team Cards" || type.slice(0,-3) === "Team Corners") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Under";
            } else if (result === "2") {
                return "Over";
            } else if (result === "3") {
                return "Under";
            }
        } else if (type.slice(0,-3) === "Over/Under") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Under";
            }
        } else if (type.slice(0,-4) === "Over/Under") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Under";
            }
        } else if (type === "Exact Goals Number") {
            if (result === "0") {
                return "0";
            } else if (result === "1") {
                return "1";
            } else if (result === "2") {
                return "2";
            } else if (result === "3") {
                return "3";
            } else if (result === "4") {
                return "4";
            } else if (result === "5") {
                return "5";
            } else if (result === "6") {
                return "6";
            } else if (result === "7") {
                return "7+";
            }
        } else if (type.slice(0,-3) === "Goals Over/Under 1st Half") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Over";
            } else if (result === "2") {
                return "Over";
            } else if (result === "3") {
                return "Over";
            } else if (result === "4") {
                return "Over";
            } else if (result === "5") {
                return "Under";
            } else if (result === "6") {
                return "Under";
            } else if (result === "7") {
                return "Under";
            } else if (result === "8") {
                return "Under";
            } else if (result === "9") {
                return "Under";
            }
        } else if (type.slice(0,-4) === "Goals Over/Under 1st Half") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Over";
            } else if (result === "2") {
                return "Over";
            } else if (result === "3") {
                return "Over";
            } else if (result === "4") {
                return "Over";
            } else if (result === "5") {
                return "Under";
            } else if (result === "6") {
                return "Under";
            } else if (result === "7") {
                return "Under";
            } else if (result === "8") {
                return "Under";
            } else if (result === "9") {
                return "Under";
            }
        } else if (type.slice(0,-3) === "Over/Under 2nd Half") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Over";
            } else if (result === "2") {
                return "Over";
            } else if (result === "3") {
                return "Over";
            } else if (result === "4") {
                return "Over";
            } else if (result === "5") {
                return "Under";
            } else if (result === "6") {
                return "Under";
            } else if (result === "7") {
                return "Under";
            } else if (result === "8") {
                return "Under";
            } else if (result === "9") {
                return "Under";
            }
        } else if (type.slice(0,-4) === "Over/Under 2nd Half") {
            if (result === "0") {
                return "Over";
            } else if (result === "1") {
                return "Over";
            } else if (result === "2") {
                return "Over";
            } else if (result === "3") {
                return "Over";
            } else if (result === "4") {
                return "Over";
            } else if (result === "5") {
                return "Under";
            } else if (result === "6") {
                return "Under";
            } else if (result === "7") {
                return "Under";
            } else if (result === "8") {
                return "Under";
            } else if (result === "9") {
                return "Under";
            }
        }
    },
    getMatchStatus: function(status) {
        var newStatus = undefined;
        if (status === "FT") {
            newStatus = "FT"
        } else if (status === "AET") {
            newStatus = "ET"
        } else if (status === "HT") {
            newStatus = "Pause"
        } else if (status === "FT_PEN") {
            newStatus = "FT. Straffe"
        } else if (status === "CANCL") {
            newStatus = "Aflyst"
        } else if (status === "POSTP") {
            newStatus = "Udskudt"
        } else if (status === "SUSP") {
            newStatus = "Susp."
        } else if (status === "DELAYED") {
            newStatus = "Forsinket"
        } else if (status === "AU") {
            newStatus = "Afventer"
        } else if (status === "Deleted") {
            newStatus = "Slettet"
        } else if (status === "LIVE") {
            newStatus = "LIVE"
        }
        return newStatus;
    },
    getMonthAbr: function(month) {
        var monthRe = null
        if (month === 0) {
            monthRe = "jan"
        } else if (month === 1) {
            monthRe = "feb"
        } else if (month === 2) {
            monthRe = "mar"
        } else if (month === 3) {
            monthRe = "apr"
        } else if (month === 4) {
            monthRe = "maj"
        } else if (month === 5) {
            monthRe = "jun"
        } else if (month === 6) {
            monthRe = "jul"
        } else if (month === 7) {
            monthRe = "aug"
        } else if (month === 8) {
            monthRe = "sep"
        } else if (month === 9) {
            monthRe = "okt"
        } else if (month === 10) {
            monthRe = "nov"
        } else if (month === 11) {
            monthRe = "dec"
        }
        return monthRe
    },
    getDayAbr: function(time) {
        var dayRe = new Date(time) + ""
        var dayStr = null;
        if (dayRe.slice(0,3) === "Mon") {
            dayStr = "Man"
        } else if (dayRe.slice(0,3) === "Tue") {
            dayStr = "Tir"
        } else if (dayRe.slice(0,3) === "Wed") {
            dayStr = "Ons"
        } else if (dayRe.slice(0,3) === "Thu") {
            dayStr = "Tor"
        } else if (dayRe.slice(0,3) === "Fri") {
            dayStr = "Fre"
        } else if (dayRe.slice(0,3) === "Sat") {
            dayStr = "Lør"
        } else if (dayRe.slice(0,3) === "Sun") {
            dayStr = "Søn"
        }
        return dayStr
    },
    getLabel: function(item, n, homeTeam, visitorTeam) {
        var homeTeam = homeTeam;
        var visitorTeam = visitorTeam;
        if (item.type === "3Way Result") {
            if (n < 0) {
                return "Fuldtid - Resultat"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Uafgjort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Exact Goals Number") {
            if (n < 0) {
                return "Totalt antal mål"
            } else if (n >= 0) {
                return ((item.data[n].label).replace("Goals", "Mål")).replace("Goal", "Mål")
            }
        } else if (item.type === "Over/Under") {
            if (n < 0) {
                return "Mål - Over/Under"
            } else if (n >= 0) {
                return item.data[n].label + " " + item.data[n].total
            }
        } else if (item.type === "Team To Score First") {
            if (n < 0) {
                return "Første hold til at score"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Ingen mål"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Double Chance") {
            if (n < 0) {
                return "Dobbelt chance"
            } else if (n === 0) {
                return homeTeam + " eller uafgjort"
            } else if (n === 1) {
                return "Uafgjort eller " + visitorTeam
            } else if (n === 2) {
                return homeTeam + " eller " + visitorTeam
            }
        } else if (item.type === "Handicap Result") {
            if (n < 0) {
                return "Handicap - Resultat"
            } else if (n === 0) {
                return homeTeam + " " + item.data[n].handicap
            } else if (n === 1) {
                return "Uafgjort " + item.data[n].handicap
            } else if (n === 2) {
                return visitorTeam + " " + item.data[n].handicap
            }
        } else if (item.type === "1st Half Handicap") {
            if (n < 0) {
                return "1. Halvleg - Handicap"
            } else if (n === 0) {
                return homeTeam + " " + item.data[n].handicap
            } else if (n === 1) {
                return "Uafgjort " + item.data[n].handicap
            } else if (n === 2) {
                return visitorTeam + " " + item.data[n].handicap
            }
        } else if (item.type === "Highest Scoring Half") {
            if (n < 0) {
                return "Flest mål i halvleg"
            } else if (n === 0) {
                return "1. Halvleg"
            } else if (n === 1) {
                return "2. Halvleg"
            } else if (n === 2) {
                return "Uafgjort"
            }
        } else if (item.type === "3Way Result 1st Half") {
            if (n < 0) {
                return "1. Halvleg - Resultat"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Uafgjort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "3Way Result 2nd Half") {
            if (n < 0) {
                return "2. Halvleg - Resultat"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Uafgjort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Double Chance - 1st Half") {
            if (n < 0) {
                return "1. Halvleg - Dobbelt chance"
            } else if (n === 0) {
                return homeTeam + " eller uafgjort"
            } else if (n === 1) {
                return "Uafgjort eller " + visitorTeam
            } else if (n === 2) {
                return homeTeam + " eller " + visitorTeam
            }
        } else if (item.type === "Team To Score First") {
            if (n < 0) {
                return "Første hold til at score"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Ingen mål"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Team To Score Last") {
            if (n < 0) {
                return "Sidste hold til at score"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Ingen mål"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Both Teams To Score") {
            if (n < 0) {
                return "Begge hold scorer"
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "Odd/Even") {
            if (n < 0) {
                return "Lige/Ulige"
            } else if (n === 0) {
                return "Ulige"
            } else if (n === 1) {
                return "Lige"
            }
        } else if (item.type === "Own Goal") {
            if (n < 0) {
                return "Selvmål"
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "A Red Card in the Match") {
            if (n < 0) {
                return "Rødt kort i kampen"
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "Team Cards") {
            if (n < 0) {
                return "Uddelte kort"
            } else {
                return n
            }
        } else if (item.type === "Team Corners") {
            if (n < 0) {
                return "Over/Under - Hjørnespark"
            } else {
                return n
            }
        } else if (item.type === "Both Teams To Receive A Card") {
            if (n < 0) {
                return "Begge hold får kort"
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "First Card Received") {
            if (n < 0) {
                return "Første kort"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Ingen kort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "First Match Corner") {
            if (n < 0) {
                return "Første hjørnespark"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return visitorTeam
            }
        } else if (item.type === "Corner Match Bet") {
            if (n < 0) {
                return "Flest hjørnespark"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Uafgjort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Last Match Corner") {
            if (n < 0) {
                return "Sidste hjørnespark"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return visitorTeam
            }
        } else if (item.type === "Clean Sheet - Home") {
            if (n < 0) {
                return "Clean Sheet - " + homeTeam
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "Clean Sheet - Away") {
            if (n < 0) {
                return "Clean Sheet - " + visitorTeam
            } else if (n === 0) {
                return "Ja"
            } else if (n === 1) {
                return "Nej"
            }
        } else if (item.type === "Time Of First Corner") {
            if (n < 0) {
                return "Hjørnespark indenfor tid"
            } else if (n === 0) {
                return (item.data[n].label.replace("Corner before", "Et eller flere hjørnespark inden")).replace("No Corner before", "Ingen hjørnespark inden")
            } else if (n === 1) {
                return (item.data[n].label.replace("No Corner before", "Ingen hjørnespark inden")).replace("Corner before", "Et eller flere hjørnespark inden")
            }
        } else if (item.type === "Total Corners") {
            if (n < 0) {
                return "Totalt antal hjørnespark"
            } else if (n >= 0) {
                return item.data[n].label
            }
        } else if (item.type === "Player to be Booked") {
            if (n < 0) {
                return "Kort til spiller"
            } else if (n >= 0) {
                return item.data[n].label
            }
        } else if (item.type === "1st Goal Method") {
            if (n < 0) {
                return "Første mål - Måltype"
            } else if (n >= 0) {
                return item.data[n].label.replace("Shot", "Skud").replace("Header", "Hovedstød").replace("Penalty", "Straffespark").replace("Free Kick", "Frispark").replace("Own Goal", "Selvmål").replace("No Goal", "Ingen mål")
            }
        } else if (item.type === "Early Goal") {
            if (n < 0) {
                return "Tidligt mål"
            } else if (n === 0) {
                return (item.data[n].label.replace("Goal before", "Mål inden")).replace("No Goal before", "Ingen mål inden")
            } else if (n === 1) {
                return (item.data[n].label.replace("No Goal before", "Ingen mål inden")).replace("Goal before", "Mål inden")
            }
        } else if (item.type === "Goalscorer") {
            if (n < 0) {
                return "Målscorer"
            } else if (n >= 0) {
                return item.data[n].extra.replace("First", "Første").replace("Last", "Sidste").replace("Anytime", "Når som helst") + " - " + item.data[n].label;
            }
        } else if (item.type === "Multi Scorers") {
            if (n < 0) {
                return "Målscorer"
            } else if (n >= 0) {
                return item.data[n].label.replace(" | 2 or More", " - 2 eller flere").replace(" | 3 or More", " - 3 eller flere")
            }
        } else if (item.type === "Correct Score") {
            if (n < 0) {
                return "Korrekt resultat"
            } else if (n >= 0) {
                if (item.data[n].label.slice(0,1) === "1") {
                    return item.data[n].label.replace("1 ", homeTeam + " ") + " " + visitorTeam;
                } else if (item.data[n].label.slice(0,1) === "2") {
                    return item.data[n].label.replace("2 ", homeTeam + " ") + " " + visitorTeam;
                } else if (item.data[n].label.slice(0,4) === "Draw") {
                    return item.data[n].label.replace("Draw ", homeTeam + " ") + " " + visitorTeam;
                }
            }
        } else if (item.type === "10 Minute Result") {
            if (n < 0) {
                return "Første 10 minutter vinder"
            } else if (n === 0) {
                return homeTeam
            } else if (n === 1) {
                return "Uafgjort"
            } else if (n === 2) {
                return visitorTeam
            }
        } else if (item.type === "Alternative Total Corners") {
            if (n < 0) {
                return "Totale hjørnespark"
            } else if (n >= 0) {
                return item.data[n].label.replace("Exactly", "Præcis") + " " + item.data[n].total
            }
        } else if (item.type === "Alternative Total Goals") {
            if (n < 0) {
                return "Totale mål"
            } else if (n >= 0) {
                return item.data[n].label.replace("Exactly", "Præcis") + " " + item.data[n].total
            }
        }
    }
}