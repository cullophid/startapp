# StartApp
Embracing functional programming with redux

## usage


in the browser:

```js
  // main.js

  import React from 'react'
  import {render} from 'react-dom'
  import App from './universal/App'
  import update from './universal/update'

  const initialModel = window.__initialState__

  const view = (dispatch, state) => render(<App { ...{dispatch, state} }/>, document.getElementById('main'))

  startApp({view, update, model: initialModel})

  ```

on the server

```js
  // index.js

  import React from 'react'
  import {renderToString} from 'react-dom/server'
  import App from './universal/App'
  import update from './universal/update'

  const FullPage = state =>
    <html>
      <head>
        <script>
          window.__initialState__ = { JSON.stringify(state) }
        </script>
        ...
        </head>
      <body>
        <div id="main">
          <App {...{dispatch: () => {}, state }}/>
        </div>
        <script type="text/javascript" src="/bundle.js"></script>
      </body>


  const initialModel = {
    title: 'Foo',
    description: 'FooBar'
  }

  const dispatch = () => {}

  const view = (state) =>
    renderToString(<FullPage { ...state }/>)
  module.exports = (req, res) =>
    startAppServer({view, update, model: initialModel, action: locationAction(req.url)})
      .fork(
        e => res.status(e.status).send(e.msg),
        html => res.send(html)
      )

  ```


## Gothas

StartApp expects all parts of your app to be stateless. This includes your view and update functions, and the futures you return from reducers.
