import { IonButton, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

import "./Header.css";

interface Props {
  routeHome?: () => void;
  routePortfolio?: () => void;
  routeSignOut: () => void;
}

const Header: React.FC<Props> = (props) => {
  return (
    <IonHeader className="home-header">
      <IonToolbar className="header-toolbar header-title-toolbar">
        <IonTitle className="header-title-text header-button">
          BitHive - Crypto Trading
        </IonTitle>
      </IonToolbar>
      <IonToolbar
        className={`header-toolbar portfolio-${props.routePortfolio}`}
      >
        <IonButton
          color="dark"
          className="header-button"
          onClick={props.routePortfolio}
        >
          Portfolio
        </IonButton>
      </IonToolbar>
      <IonToolbar className={`header-toolbar home-${props.routeHome}`}>
        <IonButton
          color="dark"
          className="header-button"
          onClick={props.routeHome}
        >
          Prices
        </IonButton>
      </IonToolbar>
      <IonToolbar className="header-toolbar">
        <IonButton
          color="dark"
          className="header-button"
          onClick={props.routeSignOut}
        >
          Sign-out
        </IonButton>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
