const fs = require("fs");

const writeFile = (resultsWithRank, institute) => {
  fs.writeFile(
    "data.json",
    JSON.stringify({
      resultsWithRank,
      buildDate: new Date(Date.now()).toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
      }),
      institute,
    }),
    (err) => {
      if (err) throw err;
      console.log("Data file has been saved!");
    }
  );
};

const deleteUnwantedEntries = (results) => {
  let id = 0;
  results.forEach((result) => {
    delete result["Enrolment Status"];
    delete result["Enrolment Date & Time"];
    delete result["Institution"];
    delete result["Student Email"];
    result.id = id++;
  });
    return results;
};

const sortEntries = (results, track1, track2) => {
  results.sort(
    (a, b) =>
      Number(b[track1]) +
        Number(b[track2]) -
        (Number(a[track1]) + Number(a[track2])) ||
      a["Student Name"] - b["Student Name"]
  );

  return results;
};

const giveRankToCandidates = (results, track1, track2) => {
  let rank = 1;

  //set first entry rank = 1 since the array is already sorted
  results[0]["Rank"] = rank;

  //iterate over entries, check if the number of quests completed are same as the previous entry.
  //If they are same then give them the same rank else increment the rank
  for (let pointer = 1; pointer < results.length; pointer++) {
    let totalNumberOfQuestsCompletedByPreviousRank =
      Number(results[pointer - 1][track1]) +
      Number(results[pointer - 1][track2]);
    let totalNumberOfQuestsCompleted =
      Number(results[pointer][track1]) + Number(results[pointer][track2]);

    //if total # of quests completed is 0 then we increment the rank
    if (totalNumberOfQuestsCompleted === 0) {
      rank++;
      results[pointer]["Rank"] = rank;
    }
    //if total # of quests completed is equal to the previous entry then we give them the same rank
    else if (
      totalNumberOfQuestsCompletedByPreviousRank ===
      totalNumberOfQuestsCompleted
    ) {
      results[pointer]["Rank"] = results[pointer - 1]["Rank"];
    } else {
      rank++;
      results[pointer]["Rank"] = rank;
    }
  }

  return results;
};

const displaceRankToLeft = (results, resultsWithRank, track1, track2) => {
  results.forEach((result) => {
    let obj = {
      Rank: result["Rank"],
      "Student Name": result["Student Name"],
      "# of Skill Badges Completed in Track 1": result[track1] + "/6",
      "# of Skill Badges Completed in Track 2": result[track2] + "/6",
      id: result["id"],
      qwiklabs_url:
        result["Google Cloud Skills Boost (previously Qwiklabs) Profile URL"],
    };
    resultsWithRank.push(obj);
  });

  return resultsWithRank
};

module.exports = {
  deleteUnwantedEntries,
  displaceRankToLeft,
  giveRankToCandidates,
  sortEntries,
  writeFile,
};
