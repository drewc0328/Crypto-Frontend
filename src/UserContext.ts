import { createContext } from "react";
import { User } from "./Models/User";

export interface UserContextData {
  user: User;
  updateUser: (user: User) => void;
}

const initialUser = localStorage.getItem("user");
let localUser = {
  ownedCryptos: [],
  _id: "",
  email: "",
  balance: 0,
};
if (initialUser !== null) {
  localUser = JSON.parse(initialUser);
}

export const userContextDefaultValue: UserContextData = {
  user: localUser,
  updateUser: (user: User) => null,
};

export const UserContext = createContext<UserContextData>(
  userContextDefaultValue
);
