import { OwnedCrypto } from "./OwnedCrypto";

export interface User {
  ownedCryptos: Array<Array<string>>;
  _id: string;
  email: string;
  balance: number;
}
