const matter = require('gray-matter');
const marked = require('marked');
const fs = require('fs');

const postsFolder = './posts/'
var data = {};
fs.readdirSync(postsFolder).forEach(folder => {
  // below is for rendering data from markdown
  var curFolder = postsFolder + folder + '/';

  data[folder] = [];
  fs.readdirSync(curFolder).forEach(filename => {

    // var content = fs.readFileSync(blogFolder+filename, 'utf8');
    var newItem = matter.read(curFolder + filename);
    newItem.id = filename;
    newItem.title = newItem.data.title;
    newItem.body = marked(newItem.content);
    data[folder].push(newItem);

  });

});


//data.blog = [...data.blog].reverse();

console.log(data);

fs.writeFileSync('./public/data.json', JSON.stringify(data), 'utf8');