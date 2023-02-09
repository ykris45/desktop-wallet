/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import './index.css' // Importing CSS through CSS file to avoid font flickering
import './i18n'
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS: important to import after index.css file

import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { TooltipProvider } from 'react-tooltip'
import { ThemeProvider } from 'styled-components'

import App from './App'
import Tooltips from './components/Tooltips'
import { GlobalContextProvider } from './contexts/global'
import { WalletConnectContextProvider } from './contexts/walletconnect'
import * as serviceWorker from './serviceWorker'
import { store } from './storage/app-state/store'
import { GlobalStyle } from './style/globalStyles'
import { lightTheme } from './style/themes'

// The app still behaves as if React 17 is used. This is because
// `react-custom-scrollbars` is not working with React 18 yet.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(document.getElementById('root')!)

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={lightTheme}>
          <Suspense fallback="loading">
            <GlobalContextProvider>
              <WalletConnectContextProvider>
                <GlobalStyle />
                <TooltipProvider>
                  <App />
                  <Tooltips />
                </TooltipProvider>
              </WalletConnectContextProvider>
            </GlobalContextProvider>
          </Suspense>
        </ThemeProvider>
      </Router>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

//
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
