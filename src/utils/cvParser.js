// cvParser.js
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs").promises;

const parsePDF = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const parseWord = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
};

const extractInfo = (text) => {
  // Example: Simple regex-based parsing (you'll want to improve this)
  const nameMatch = text.match(/Name:\s*(.*)/);
  const emailMatch = text.match(/Email:\s*(.*)/);
  const addressMatch = text.match(/Address:\s*(.*)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    email: emailMatch ? emailMatch[1].trim() : null,
    address: addressMatch ? addressMatch[1].trim() : null,
  };
};

const parseCV = async (filePath) => {
  let text;
  if (filePath.endsWith(".pdf")) {
    text = await parsePDF(filePath);
  } else if (filePath.endsWith(".doc") || filePath.endsWith(".docx")) {
    text = await parseWord(filePath);
  } else {
    throw new Error("Unsupported file format");
  }

  return extractInfo(text);
};

module.exports = parseCV;
