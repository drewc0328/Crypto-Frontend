import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { User } from "./Models/User";
import { UserContext } from "./UserContext";

import Landing from "./Pages/Landing/Landing";
import Home from "./Pages/Home/Home";
import Portfolio from "./Pages/Portfolio/Portfolio";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
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

  const [user, setUser] = useState<User>(localUser);

  const updateUser = (u: User) => {
    //console.log("APP USER: ", u);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Switch>
              <Route path="/" exact={true}>
                <Landing />
              </Route>

              <Route path="/Home" exact={true}>
                <Home />
              </Route>

              <Route path="/Portfolio" exact={true}>
                <Portfolio />
              </Route>
              <Redirect to="/" />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </UserContext.Provider>
  );
};

export default App;
