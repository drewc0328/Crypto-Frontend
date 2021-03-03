import React from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
} from "@ionic/react";

import { useMediaQuery } from "react-responsive";

import { PortfolioItem } from "../../Models/PortfolioItem";

import "./PortfolioContainer.css";

interface Props {
  crypto: PortfolioItem;
  handleTrading: (abbr: string) => void;
}

const PortfolioContaier: React.FC<Props> = (props) => {
  const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

  const mobileTrade = () => {
    if (isMobile) {
      props.handleTrading(props.crypto.abbr);
    }
  };
  return (
    <IonCard onClick={mobileTrade} className="portfolio-container-card">
      <IonGrid>
        <IonRow>
          <IonCol className="property-col translate-p port-container-name">
            <IonText className="property-text">{props.crypto.name}</IonText>
          </IonCol>
          <IonCol className="property-col translate-p port-container-price">
            <IonText>${props.crypto.price}</IonText>
          </IonCol>
          <IonCol className="property-col translate-p port-container-amount">
            <IonText>{props.crypto.amount}</IonText>
          </IonCol>
          <IonCol className="property-col translate-p">
            <IonText>
              $
              {Math.round(
                parseFloat(props.crypto.amount) * props.crypto.price * 100
              ) / 100}
            </IonText>
          </IonCol>
          <IonCol className="property-col port-container-buy-sell">
            <IonButton
              color="dark"
              onClick={props.handleTrading.bind(null, props.crypto.abbr)}
            >
              BUY/SELL
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default PortfolioContaier;
