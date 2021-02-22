import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
} from "@ionic/react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Crypto } from "../../Models/Crypto";
import "./CryptoContainer.css";

interface Props {
  crypto: Crypto;
  tradeCrypto: (crypto: Crypto) => void;
}

const CryptoContainer: React.FC<Props> = (props) => {
  const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });
  const mobileTrade = () => {
    if (isMobile) {
      props.tradeCrypto(props.crypto);
    }
  };

  return (
    <IonCard onClick={mobileTrade} className="container-card">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <img src={props.crypto.logo} alt="crypto-logo" />
                </IonCol>
                <IonCol className="crypto-abbr-col">
                  <IonText className="crypto-text">{props.crypto.abbr}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
          <IonCol className="crypto-col crypto-name">
            <IonText className="crypto-text">{props.crypto.name}</IonText>
          </IonCol>
          <IonCol className="crypto-col crypto-price">
            <IonText className="crypto-text">{props.crypto.price}</IonText>
          </IonCol>
          <IonCol className="crypto-col crypto-change">
            <IonText className="crypto-text">{props.crypto.change}</IonText>
          </IonCol>
          <IonCol className="crypto-col crypto-percent-change">
            <IonText className="crypto-text">
              {props.crypto.change_percent}
            </IonText>
          </IonCol>
          <IonCol className="crypto-col crypto-market-cap">
            <IonText className="crypto-text">{props.crypto.market_cap}</IonText>
          </IonCol>
          <IonCol className="crypto-buy-sell-btn">
            <IonButton
              color="dark"
              onClick={() => props.tradeCrypto(props.crypto)}
            >
              Buy/Sell
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default CryptoContainer;
