import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes';
import { SWRConfig } from 'swr';
import { CartProvider, UIProvider } from '../context';
import { AuthProvider } from '../context/auth/AuthProvider';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


function MyApp({ Component, pageProps }: AppProps) {
  return (

    <SessionProvider>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
        <SWRConfig 
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider> 
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme} >
                  <CssBaseline>
                    <Component {...pageProps} />
                  </CssBaseline>
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>

      </PayPalScriptProvider>
    </SessionProvider>
  )
}

export default MyApp
