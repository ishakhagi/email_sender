const nodemailer = require("nodemailer");
const fs = require("fs");

/**
 * Liefert JSON aus einem CSV File
 * @param {} path 
 */
const getFirmsFromCSV = (path) => {
  const data = fs.readFileSync(path, "utf-8");
  const rows = data.split("\n");
  const columns = rows[0].split(";");
  const firms = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i].split(";");
    const obj = {};
    for (let j = 0; j < r.length; j++) {
      obj[columns[j]] = r[j];
    }
    firms.push(obj);
  }
  return firms;
};

/**
 * Liefert alle Emails aus einem Textfile als Array
 * @param {} path 
 */
const getFirmsFromTextFile = (path) => {
  const data = fs.readFileSync(path, "utf-8");
  const rows = data.split("\n");
  return rows
}

const getFirms = (path, filetype) => {
  if(filetype === "txt") return getFirmsFromTextFile(path);
  if(filetype === "csv") return getFirmsFromCSV(path);
  return []
}


/**
 * Sendet Email an Empfänger
 * @param {} mailOptions 
 */
function sendMail(mailOptions) {
  const transporter = nodemailer.createTransport({
    host: "", // Smtp Server deines Anbieters
    port: 587,
    //secure: true, // use SSL
    auth: {
      user: "", // Deine Email
      pass: "", // Dein Passwort
    },
  });

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        console.log(`Mail nicht gesendet an ` + mailOptions.to);
      } else {
        console.log(`Mail gesendet an ` + mailOptions.to);
        resolve(info);
      }
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function main() {
  const emails = getFirms("./emails.txt", "txt")

  for (let i = 0; i < emails.length; i++) {
    await sleep(1000);
    const mailOptions = {
      from: "", // Deine Email anfügen
      to: emails[i],
      subject: "Dies ist eine automatisch generierte Email",
      attachments: [
        {
          filename: "test.pdf",
          path: "./files/Untitled.pdf",
          contentType: "application/pdf",
        },
        {
          filename: "Logo.png",
          path: "./files/logo.png",
          cid: "logo1",
        },
      ],
      html: `
    <p>
    Sehr geehrte Damen und Herren, 
    <br/>
    <br/>
    Diese Nachricht wurde automatisch verschickt. Lassen Sie sich von mir nicht stören.
    <br/>
    <br/>
    Weiterer Text....
    <br/>
    <br/>
    Vielen Dank.
    <br/>
    Ishak Hagi
    </p>
    <img src="cid:logo1" width=30% height=30%/>`,
    };

    await sendMail(mailOptions);
  }
}

main();
