/* c8 ignore start */
// this file is only used for the web app, which we do not test

import { ScrollViewStyleReset } from "expo-router/html"
import type { PropsWithChildren } from "react"

// https://docs.expo.dev/router/reference/static-rendering/#root-html
//
// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.

const Root = ({ children }: PropsWithChildren): React.ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
        <meta name="apple-itunes-app" content="app-id=6532602002" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default Root
/* c8 ignore end */
