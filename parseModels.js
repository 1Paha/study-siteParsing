const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

function parse($) {
	if (!fs.existsSync('mobiles')) fs.mkdirSync('mobiles', (err) => { if (err) throw err });

	const modelsArray = $('div.product_block');

	modelsArray.each((i, elem) => {

		let phoneName = $('img.pr-line_thumb', elem).attr('title');
		const phoneImageLink = $('img.pr-line_thumb', elem).attr('src');
		const phoneCashValue = $('div.pr-price_cash a.pr-price_mark', elem).text();
		const phoneCashlessValue = $('div.pr-price_cashless a.pr-price_mark', elem).text();
		const phoneDescription = $('div.pr-line_descr', elem).text();

		const extansion = phoneImageLink.match(/\.\D{3,4}$/i)[0];
		
		phoneName = phoneName.replace(/( )|(\/)/g, '_');

		if (!fs.existsSync('mobiles/' + phoneName)) fs.mkdirSync(('mobiles/' + phoneName), (err) => { if (err) throw err });

		fs.writeFileSync(('mobiles/' + phoneName + '/description.txt'), 'Розница: ' + phoneCashValue + '\r\n', (err) => {if (err) throw err});
		fs.appendFileSync(('mobiles/' + phoneName + '/description.txt'), 'Безнал: ' + phoneCashlessValue + '\r\n\r\n', (err) => {if (err) throw err});
		fs.appendFileSync(('mobiles/' + phoneName + '/description.txt'), 'Описание:\r\n\r\n' + phoneDescription, (err) => {if (err) throw err;});

		const readableStream = request(phoneImageLink);
		const writeableStream = fs.createWriteStream('mobiles/' + phoneName + '/' + phoneName + extansion);
		readableStream.pipe(writeableStream);

	});
}

module.exports = (url) => {
	return rp(url)
		.then(cheerio.load)
		.then(parse)
		.then(() => console.log('Ready'))
		.catch(console.error);
};
