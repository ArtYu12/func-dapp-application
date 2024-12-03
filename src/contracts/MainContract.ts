import {Contract, Address, Cell, beginCell, contractAddress, ContractProvider, SendMode, Sender} from '@ton/core'


export type MainContractConfig = {
    counter: number
    address: Address
    owner_address: Address
}


export function mainContractConfigToCell(config: MainContractConfig): Cell {
    return beginCell()
            .storeUint(config.counter, 32)
            .storeAddress(config.address)
            .storeAddress(config.owner_address)
    .endCell()
}

export class MainContract implements Contract {

    constructor(
        readonly address: Address, 
        readonly init?: {
            code: Cell,
            data: Cell
        }
    ) {}

    static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
        const data = mainContractConfigToCell(config)
        const init = { code, data };
        const address = contractAddress(workchain, init);
    
        return new MainContract(address, init);
    }

    async sendIncrement(provider:ContractProvider, via: Sender, value: bigint, amount: number) {

        console.log(arguments)

        const msg_body = beginCell()
            .storeUint(1, 32)
            .storeUint(amount, 32)
        .endCell()

        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        const msg_body = beginCell().endCell()

        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint) {

        const msg_body = beginCell()
            .storeUint(2, 32)
        .endCell()

        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint, amount: bigint) {
        const msg_body = beginCell()
            .storeUint(3, 32)
            .storeCoins(amount)
        .endCell()

        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async sendNoCodeDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        
        const msg_body = beginCell().endCell()

        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body
        })
    }

    async getData(provider: ContractProvider) {
        const result = await provider.get("get_contract_storage_data", [])
        return {
            counter: result.stack.readNumber(),
            sender_address: result.stack.readAddress(),
            owner_address: result.stack.readAddress()
        }
    }

    async getBalance(provider: ContractProvider) {
        const result = await provider.get("get_current_balance", [])
        return {
            balance: result.stack.readNumber()
        }
    }
}