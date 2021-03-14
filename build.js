const matter = require('gray-matter');
const marked = require('marked');
const Handlebars = require('handlebars');
const fs = require('fs');

/*
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
*/

var data = fs.readFileSync('./public/data.json', 'utf8');

var source = fs.readFileSync('./tpl/index.html', 'utf8');
var template = Handlebars.compile(source);
var result = template(JSON.parse(data));

fs.writeFileSync('./public/index.html', result, 'utf8');
// fs.writeFileSync('./public/data.json', JSON.stringify(data), 'utf8');
