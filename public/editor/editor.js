document.head.innerHTML += `
<style>
.editable{border:1px solid transparent;}
.editable:hover{border:1px dashed #999;cursor: pointer;}
#backdrop{display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background-color: rgba(0,0,0,0.5)}
#editor{width: 700px; margin: 0 auto; margin-top: 5%; min-height:400px; background-color: #F8F8F8; border-radius: 4px;box-shadow: 0px 3px 15px rgba(0,0,0,0.2); padding: 20px;}
#mde{min-height: 250px;resize: none;}
.close{cursor: pointer;}
.label{font-size: 14px; text-transform: uppercase; letter-spacing: 0.03em; color: #777; margin-top: 15px; margin-bottom: 5px;}
</style>`

document.body.innerHTML += `
<div id="backdrop">
<div id="editor">
<div class="close">&times;</div>
<div id="fields"></div>


<button class="btn btn-primary mt-3" onclick="save();">Save</button>
</div></div>`

fetch('data.json')
  .then(response => response.json())
  .then(function(data){
    console.log(data);
    window.data = data;
  });


const backdrop = document.getElementById('backdrop');
const editor = document.getElementById('editor');
const mde = document.getElementById('mde');
const fields = document.getElementById('fields');

document.body.addEventListener('click', function(e){

  if(e.target.closest('.editable')){
    let target = e.target.closest('.editable');
    let id = target.id;
    backdrop.style.display = 'block';

    let index = data.entries.findIndex(x => x.id == id);
    console.log(index);

    var myfields = ``;
    Object.entries(data.entries[index]).forEach(function(item){
      console.log(item);
      if(item[0] !== 'id' && item[0] !== 'body'){
      myfields += `<div class="label">${item[0]}</div>
      <input name="${item[0]}" value="${item[1]}" class="form-control">`
      }
      if(item[0] == 'id'){
      myfields += `<input type="hidden" name="${item[0]}" value="${item[1]}" class="form-control">`
      }
      if(item[0] == 'body'){
      myfields += `<div class="label">${item[0]}</div>
      <textarea name="${item[0]}" class="form-control" id="mde">${item[1]}</textarea>`
      }
    })

    fields.innerHTML = myfields;


  }

  if(e.target.classList.contains('close')){
    backdrop.style.display = "none";
  }

})

function save(){

let mydata = {};
document.querySelectorAll('#fields .form-control').forEach(function(e){
  let name = e.getAttribute('name');
  let val = e.value;
  mydata[name] = val;
})

console.log(mydata);
let index = data.entries.findIndex(x => x.id == mydata.id);
data.entries[index] = mydata;
console.log(data);


  let opts = {};
  opts.path = 'public/data.json';
  opts.type = 'json';
  opts.content = data;
  opts.template = `You've been SSR'd<br>{{#each entries}}
    <section class="editable" id="{{id}}">
    <h1>{{title}}</h1>
    {{{body}}}
    </section>
  {{/each}}`

  call_api('s3/set-data', opts).then(function(res) {
    console.log(res);
    document.querySelector('#page').innerHTML = res;
    backdrop.style.display = 'none';
   });
}

async function call_api(route, mydata) {

  try {
    const idToken = await firebase.auth().currentUser.getIdToken(true);

    var settings = {
      method: 'post',
      body: JSON.stringify(mydata),
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      }
    };
    try {
      const fetchResponse = await fetch('https://backend-three-rho.vercel.app/api/' + route, settings);
      const result = await fetchResponse.text();
      return result;
    } catch (e) {
      return e;
    }

  } catch (e) {
    console.log("Not signed in");
    return "User is not signed in.";
  }

}
