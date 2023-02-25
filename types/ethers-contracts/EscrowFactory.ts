/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface EscrowFactoryInterface extends utils.Interface {
  functions: {
    "createEscrow(string,address,uint256,string,address,uint256)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "createEscrow"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createEscrow",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "createEscrow",
    data: BytesLike
  ): Result;

  events: {
    "EscrowCreated(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EscrowCreated"): EventFragment;
}

export interface EscrowCreatedEventObject {
  escrowAddress: string;
}
export type EscrowCreatedEvent = TypedEvent<[string], EscrowCreatedEventObject>;

export type EscrowCreatedEventFilter = TypedEventFilter<EscrowCreatedEvent>;

export interface EscrowFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EscrowFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    createEscrow(
      _player1Id: PromiseOrValue<string>,
      _player1Address: PromiseOrValue<string>,
      _player1BetAmount: PromiseOrValue<BigNumberish>,
      _player2Id: PromiseOrValue<string>,
      _player2Address: PromiseOrValue<string>,
      _player2BetAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createEscrow(
    _player1Id: PromiseOrValue<string>,
    _player1Address: PromiseOrValue<string>,
    _player1BetAmount: PromiseOrValue<BigNumberish>,
    _player2Id: PromiseOrValue<string>,
    _player2Address: PromiseOrValue<string>,
    _player2BetAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createEscrow(
      _player1Id: PromiseOrValue<string>,
      _player1Address: PromiseOrValue<string>,
      _player1BetAmount: PromiseOrValue<BigNumberish>,
      _player2Id: PromiseOrValue<string>,
      _player2Address: PromiseOrValue<string>,
      _player2BetAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "EscrowCreated(address)"(escrowAddress?: null): EscrowCreatedEventFilter;
    EscrowCreated(escrowAddress?: null): EscrowCreatedEventFilter;
  };

  estimateGas: {
    createEscrow(
      _player1Id: PromiseOrValue<string>,
      _player1Address: PromiseOrValue<string>,
      _player1BetAmount: PromiseOrValue<BigNumberish>,
      _player2Id: PromiseOrValue<string>,
      _player2Address: PromiseOrValue<string>,
      _player2BetAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createEscrow(
      _player1Id: PromiseOrValue<string>,
      _player1Address: PromiseOrValue<string>,
      _player1BetAmount: PromiseOrValue<BigNumberish>,
      _player2Id: PromiseOrValue<string>,
      _player2Address: PromiseOrValue<string>,
      _player2BetAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}