const {
  ref,
  computed,
  onMounted
} = Vue
//import Editor from './components/editor.mjs'

const template = `

<h1>Vue 3 and Fetch Example</h1>

<ul v-if="!loading && data && data.length">
{{data.blog[0].content}}
  <li v-for="post in data.blog">

    <p><strong>{{post.data.title}}</strong></p>
    <p>{{post.content}}</p>
  </li>
</ul>

<p v-if="loading">
 Still loading..
</p>
<p v-if="error">

error
</p>
`

const {
  createApp
} = Vue
const App = createApp({
  template,
  setup() {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    function fetchData() {
      loading.value = true;
      // I prefer to use fetch
      // you can use use axios as an alternative
      return fetch('/data.json', {
          method: 'get',
          headers: {
            'content-type': 'application/json'
          }
        })
        .then(res => {
          // a non-200 response code
          if (!res.ok) {
            // create error instance with HTTP status text
            const error = new Error(res.statusText);
            error.json = res.json();
            throw error;
          }

          return res.json();
        })
        .then(json => {
          console.log(json);
          // set the response data
          data.value = json.data;

        })
        .catch(err => {
          error.value = err;
          // In case a custom JSON error response was provided
          if (err.json) {
            return err.json.then(json => {
              // set the JSON response message
              error.value.message = json.message;
            });
          }
        })
        .then(() => {
          loading.value = false;
        });
    }


    onMounted(() => {
      fetchData();
    });

    return {
      data,
      loading,
      error
    };
  }
})

window.addEventListener('load', () => {
  App.mount('main')
})