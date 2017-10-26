//npm google

var google = require('./google')

google.resultsPerPage = 10
var nextCounter = 0
var printedCount = 0;

google('Pizza', function (err, res){
  if (err) console.error(err)

  for (var i = 0; i < res.links.length; ++i) {
    var link = res.links[i];
    //console.log(link.href);
    if (link.title == ""|| link.href == null|| link.title == null){
      continue;
    }
    if (link.title.includes ("Image") || link.title.includes("Youtube")||link.href.includes("https://www.youtube")){
      continue;
    }

    console.log(link.title + ' - ' + link.href)
    console.log(link.description + "\n")
    printedCount++;
    if (printedCount == 3){
      break;
    }
  }


})
// /npm google
