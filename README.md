#StartApp

##Usage

```js
import app from 'startapp'
app({
  model: {title: 'Hello world'},
  update: {
    setTitle: (state, title) =>
      [{...state, title}]
  },
  view: (state, msg) =>
    ReactDOM.render(<App {...{model, msg}} />, document.getElementById('root')),
  subs: [ // called when dom content is loaded
    (state, msg) => document.body.addEventListener('click', () => msg.setTitle('Body clicked'))
  ]
}
```
