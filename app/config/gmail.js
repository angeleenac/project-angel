const nodemailer = require("nodemailer");
const moment = require("moment");

const main = async ({ random, email, estimasi, durasi }) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "masbim956@gmail.com", // generated ethereal user
        pass: "xqmqlrlkhqnwbtuo", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: "masbim956@gmail.com",
      to: email,
      subject: "Login OTP By Email",
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Login OTP By Email</title>
        </head>
        <body>
          <table>
            <tr>
              <th style="text-align: left; text-decoration: underline">
                Login OTP By Email
              </th>
            </tr>
            <tr>
              <th>&nbsp;</th>
            </tr>
            <tr>
              <td>
                Kode OTP Login Anda:
                <span style="font-weight: bold; letter-spacing: 3px">${random}</span>
              </td>
            </tr>
            <tr>
              <td>
                Estimasi waktu verifikasi otp anda: ${durasi} menit
              </td>
            </tr>
            <tr>
              <td>&emsp;</td>
            </tr>
            <tr>
              <td>
                Silahkan masukan 6 kode OTP diatas ke dalam aplikasi mobile app anda
              </td>
            </tr>
            <tr>
              <th style="text-align: right">
                Developer By &copy; Satu Kantor PT. BIGS
              </th>
            </tr>
          </table>
        </body>
      </html>
      `,
    });

    return info;
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  main,
};
