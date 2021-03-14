const matter = require('gray-matter');
const marked = require('marked');
const fs = require('fs');


// below is for rendering data from markdown
const blogFolder = './posts/blog/';

var data = {};
data.blog = [];
fs.readdirSync(blogFolder).forEach(filename => {

  // var content = fs.readFileSync(blogFolder+filename, 'utf8');
  var newItem = matter.read(blogFolder+filename);
  newItem.body = marked(newItem.content);
  data.blog.push(newItem);

});

data.blog = [...data.blog].reverse();

console.log(data);

fs.writeFileSync('./public/data.json', JSON.stringify(data), 'utf8');
