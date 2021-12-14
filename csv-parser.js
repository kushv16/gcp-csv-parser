const csv = require("csv-parser");
const fs = require("fs");
const {deleteUnwantedEntries,giveRankToCandidates,displaceRankToLeft,sortEntries,writeFile}= require('./utilities.js')


const parseGcpCsvWithFilter = (gcpCSV) => {
    let results = [];
    let resultsWithRank = [];
    const track1 = "# of Skill Badges Completed in Track 1", track2 = "# of Skill Badges Completed in Track 2";
    fs.createReadStream(gcpCSV)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
       

        let institute = results[0]["Institution"];
    
        results = deleteUnwantedEntries(results)
        results = sortEntries(results, track1, track2)
        results = giveRankToCandidates(results, track1, track2)
        resultsWithRank = displaceRankToLeft(results, resultsWithRank, track1, track2);
        console.log(resultsWithRank)
        writeFile(resultsWithRank, institute);
    });
}

module.exports = {
    parseGcpCsvWithFilter
}