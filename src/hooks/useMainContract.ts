import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, toNano } from "@ton/core";
import { useTonConnect } from "./useTonconnect";

async function sleep(time: number) {
  return new Promise((reslove) => setTimeout(reslove, time))
}

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();


  const {sender} = useTonConnect()

  const [balance, setBalance] = useState<null | number>(0)

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract: any = new MainContract(
      Address.parse("EQDNGObaugrhZHE05p8N77-Ej_f6ZOXw8DODT62CkYwpF6xB") 
    );
    return client.open(contract)
  }, [client]);

  useEffect(() => {
    if (!mainContract) return;
    async function getValue() {
        const val = await mainContract?.getData();
        console.log(val)
        setContractData({
            counter_value: val.counter,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
        });
        const {balance} = await mainContract?.getBalance()
        setBalance(balance);

        await sleep(5000)

        getValue()
    }

    getValue()
    
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    balance,
    ...contractData,
    sendIncriment: async (amount: number) => {
      return mainContract?.sendIncrement(sender, toNano("0.05"), amount)
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("0.2"))
    },
    sendWithdraw: async () => {
      return mainContract?.sendWithdraw(sender, toNano("0.05"), toNano("0.1"))
    },
  };
}
