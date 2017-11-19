

let log = require('../log');
let request = require('request');
let link = 'https://www.reddit.com/r/news/';

function news(sms, done){
  let data = [];

  request(link, (err, res, body) => {
    if(err) {
			log.warn('news failed')
			done('news failed', sms, '5')
			return
		}
    console.log(document.getElementById(title))
    for(let title of body.title){
      console.log(title)
    }
    //console.log(body.title)
    //console.log(body)

		done(convertJSON(data), sms)
	})
}

// TODO change from newline character
function convertJSON(stuff) {
	let res = ''

	for(let link of stuff) {
		res += link.title.replace(/\n/g, ' ') + '\n'
			+ link.url.replace(/\n/g, ' ') + '\n'
			+ link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}
module.exports = news
