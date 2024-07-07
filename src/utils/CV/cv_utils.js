const fs = require("fs");
const pdfParse = require("pdf-parse");

const parseCV = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  console.log(data.text);
};

parseCV("C:/projects/Youssef Faisal - CV.pdf");
