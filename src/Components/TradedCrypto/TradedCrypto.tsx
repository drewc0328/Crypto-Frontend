import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonLabel,
  IonModal,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
} from "@ionic/react";
import React, { useState, useEffect, useContext } from "react";

import { Crypto } from "../../Models/Crypto";
import { UserContext } from "../../UserContext";

import "./TradedCrypto.css";

interface Props {
  close: () => void;
  crypto: Crypto;
}

const TradedCrypto: React.FC<Props> = (props) => {
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    user.ownedCryptos.forEach((oc) => {
      if (oc[0] === props.crypto.abbr) {
        setAmountOfOwnedCrypto(parseFloat(oc[1]));
      }
    });
  });

  const [inputPrice, setInputPrice] = useState<string>("0");
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(
    "Buy"
  );
  const [amountOfOwnedCrypto, setAmountOfOwnedCrypto] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const buyCryptoHandler = async () => {
    try {
      const response = await fetch(
        "https://bithive-crypto-exchange.herokuapp.com/api/users/addCrypto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user._id,
            abbr: props.crypto.abbr,
            amount: parseFloat(inputPrice) / props.crypto.price,
          }),
        }
      );

      const responseData = await response.json();
      //console.log("responseData: ", responseData);

      if (!response.ok) {
        setError(responseData.message);
      } else {
        //console.log("RESPONSEDATA.USER: ", responseData.user);
        updateUser(responseData.user);
        props.close();
      }
    } catch (err) {
      setError(err);
    }
  };

  const sellCryptoHandler = async () => {
    //console.log("selling crypto");
    try {
      const response = await fetch(
        "https://bithive-crypto-exchange.herokuapp.com/api/users/sellCrypto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user._id,
            abbr: props.crypto.abbr,
            amount: parseFloat(inputPrice) / props.crypto.price,
          }),
        }
      );

      const responseData = await response.json();

      //console.log("responseData: ", responseData);

      if (!response.ok) {
        setError(responseData.message);
      } else {
        updateUser(responseData.user);
        props.close();
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="modal-wrapper">
      <IonModal isOpen={true} backdropDismiss={false}>
        <IonSegment
          value={currentSelection}
          onIonChange={(e) => {
            setCurrentSelection(e.detail.value);
          }}
        >
          <IonSegmentButton value="Buy" className="buy-button">
            <IonLabel>Buy</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Sell" className="sell-button">
            <IonLabel>Sell</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonGrid className="trade-grid">
          <IonRow className="first-row">
            <div className="name-col">
              <IonCol>
                <IonText>
                  {props.crypto.name.charAt(0).toUpperCase() +
                    props.crypto.name.slice(1)}
                </IonText>
              </IonCol>
            </div>

            <IonCol className="price-col">
              <IonText>${props.crypto.price}</IonText>
            </IonCol>
          </IonRow>
          <IonRow className="price-input-row">
            <IonCol className="price-input-col">
              <IonInput
                type="number"
                placeholder="$0"
                className="price-input"
                onIonChange={(e) => {
                  setInputPrice((e.target as HTMLInputElement).value);
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow className="calculated-crypto-row">
            <IonCol>
              <IonText>
                = {parseFloat(inputPrice) / props.crypto.price}{" "}
                {props.crypto.abbr}
              </IonText>
            </IonCol>
          </IonRow>
          <div className="owned-crypto-and-balance">
            <div className="owned-crypto">
              <IonRow>
                <IonCol>
                  <IonText>Owned {props.crypto.name}:</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonText>
                    {amountOfOwnedCrypto} {props.crypto.abbr} = $
                    {amountOfOwnedCrypto * props.crypto.price}
                  </IonText>
                </IonCol>
              </IonRow>
            </div>
            <IonRow>
              <div className="calculated-balance">
                <IonCol>
                  <IonText>Calculated Balance:</IonText>
                </IonCol>
                <IonCol>
                  {currentSelection === "Buy" ? (
                    <IonText>
                      $
                      {Math.round(
                        (user.balance - parseFloat(inputPrice)) * 100
                      ) / 100}
                    </IonText>
                  ) : (
                    <IonText>
                      $
                      {Math.round(
                        (user.balance + parseFloat(inputPrice)) * 100
                      ) / 100}
                    </IonText>
                  )}
                </IonCol>
              </div>
            </IonRow>
          </div>
          <IonRow className="button-row">
            <IonCol className="buy-sell-button-col">
              <IonButton
                className="buy-sell-btn"
                onClick={
                  currentSelection === "Buy"
                    ? () => buyCryptoHandler()
                    : () => sellCryptoHandler()
                }
              >
                {currentSelection}
              </IonButton>
            </IonCol>
            <IonCol className="cancel-button-col">
              <IonButton className="cancel-btn" onClick={props.close}>
                Cancel
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="error-row">
            <IonCol>
              <IonText className="error-text">{error}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>
    </div>
  );
};

export default TradedCrypto;
