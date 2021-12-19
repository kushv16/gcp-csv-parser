const csv = require("csv-parser");
const fs = require("fs");
const {deleteUnwantedEntries,giveRankToCandidates,displaceRankToLeft,sortEntries,writeFile}= require('./utilities.js')

/**
 * Main entry point to the script
 * 
 * This function parses the CSV and performs the following things on the JSON. 
 *      - Delete Unwanted keys from the JSON
 *      - Sort the JSON according to number of tracks completed
 *      - Calculated Rank of every candidate
 *      - Write down the final JSON to a file which can be rendered on the webpage
 * @param {CSV} gcpCSV csv file
 */
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