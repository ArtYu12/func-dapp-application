import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonconnect";
import { fromNano } from "@ton/core";

function App() {
  const {
    contract_address,
    counter_value,
    sendIncriment,
    sendWithdraw,
    sendDeposit,
    balance,
  } = useMainContract();

  const { connected } = useTonConnect()
  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{fromNano(Number(balance))}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && <div onClick={() => sendIncriment(10)}>Incriment by 10</div>}
        {connected && <div onClick={() => sendDeposit()}>Deposit 0.2 TON</div>}
        {connected && <div onClick={() => sendWithdraw()}>Withdraw 0.1 TON</div>}
      </div>
    </div>
  );
}

export default App;