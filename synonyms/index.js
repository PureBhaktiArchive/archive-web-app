import { createDirectus, readItems, rest, staticToken } from "@directus/sdk";
import words from "an-array-of-english-words" assert { type: "json" };
import "dotenv/config.js";
import * as fs from "fs";
const getDirectusClient = createDirectus(process.env.DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_STATIC_TOKEN))
  .with(rest());

const audioData = await getDirectusClient.request(
  readItems("audios", {
    fields: ["id", "title", "topics"],
    filter: { status: { _eq: "active" } },
  })
);

let cmsData = "";
Object.values(audioData).forEach((value) => {
  const title = value["title"];
  const topics = value["topics"];
  const allWords = title.concat(topics);
  const wordlist = allWords.match(/\b\w+\b/g).join("\n");

  cmsData += wordlist + ",";
});

const cmsWords = [...new Set(cmsData.split("\n"))];
const englishWords = words.filter((d) => /fun/.test(d));
// Filter out words in array1 that are also in array2
const uniqueWords = cmsWords.filter((word) => !englishWords.includes(word));
const uniqueWordsStr = uniqueWords.toString();
const synonyms = uniqueWordsStr.match(/\b\w+\b/g).join("\n");
console.log(synonyms);
try {
  fs.writeFileSync("./cmswords.txt", synonyms);
  // file written successfully
} catch (err) {
  console.error(err);
}
