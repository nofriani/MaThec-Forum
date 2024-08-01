const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class uploadImageFromBase64 {
  static async upload(code) {
    const html_code = code; // Ambil kode HTML dari body permintaan

    // Lakukan parsing kode HTML dengan Cheerio
    const $ = cheerio.load(html_code);

    // Loop melalui semua elemen <img>
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith('data:image')) {
        // Ekstrak data base64
        const base64Data = src.replace(/^data:image\/\w+;base64,/, '');
        // Filename
        const filename = Date.now() + '.png';
        // Simpan data base64 ke file di folder tertentu
        const imagePath = path.join(path.dirname(__dirname), 'image', filename);
        fs.writeFileSync(imagePath, base64Data, 'base64');

        // Ganti nilai atribut src dengan path file yang baru
        $(element).attr('src', 'http://' + process.env.APP_URL + '/src/image/' + filename);
      }
    });

    // Simpan kode HTML yang telah dimodifikasi ke database atau file
    const modifiedHTML = $.html();
    // Lakukan penyimpanan sesuai kebutuhan Anda

    return modifiedHTML;
  }
}

module.exports = uploadImageFromBase64;
