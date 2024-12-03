import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'


(async () => {
    const { Buffer } = await import('buffer');
    //@ts-ignore
    window.Buffer = Buffer;
})();
  


createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider  manifestUrl='https://ArtYu12.github.io/func-dapp-application/tonconnect-manifest.json'>
        <App />
    </TonConnectUIProvider>
)
