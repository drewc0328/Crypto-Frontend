import {
  IonLoading,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonText,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import CryptoContainer from "../../Components/CryptoContainer/CryptoContainer";
import { Crypto } from "../../Models/Crypto";
import TradedCrypto from "../../Components/TradedCrypto/TradedCrypto";
import "./Home.css";
import Header from "../../Components/Header/Header";

const Home: React.FC<{}> = () => {
  //Storing all of the crypto
  const [cryptoData, setCryptoData] = useState<Crypto[]>();

  const [signOut, setSignOut] = useState<Boolean>(false);

  const [buySell, setBuySell] = useState<Boolean>(false);

  const [portfolio, setPortfolio] = useState<Boolean>(false);

  //Storing the current state of the crypto that is being bought or sold
  const [tradedCrypto, setTradedCrypto] = useState<Crypto>({
    name: "",
    abbr: "",
    change: "",
    change_percent: "",
    market_cap: "",
    price: 0,
    logo: "",
  });

  const getCryptoData = async () => {
    try {
      const response = await fetch(
        "https://bithive-crypto-exchange.herokuapp.com/api/cryptocurrencies/"
      );
      const responseData = await response.json();

      if (!response) {
        console.log(responseData.message);
      } else {
        setCryptoData(responseData.cryptos);
      }
    } catch (err) {}
  };

  useEffect(() => {
    let isSubscribed = true;
    function foo() {
      if (isSubscribed) {
        getCryptoData();
        setTimeout(foo, 90000);
      }
    }
    foo();

    return function cleanup() {
      isSubscribed = false;
    };
  }, []);

  const tradeCryptoHandler = (crypto: Crypto) => {
    setBuySell(true);
    setTradedCrypto(crypto);
  };

  const closeModal = () => {
    setBuySell(false);
  };

  return (
    <IonPage className="home-ion-page">
      {signOut && <Redirect to="/" />}
      {buySell && <TradedCrypto close={closeModal} crypto={tradedCrypto} />}
      {portfolio && <Redirect to="/portfolio" />}
      <Header
        routePortfolio={() => setPortfolio(true)}
        routeSignOut={() => setSignOut(true)}
      />
      <div className="crypto-container-div">
        {cryptoData !== undefined ? (
          <IonGrid className="crypto-grid">
            <IonCard>
              <IonGrid>
                <IonRow className="home-label-row">
                  <IonCol className="home-name-label">
                    <IonText>Name</IonText>
                  </IonCol>
                  <IonCol className="home-price-label">
                    <IonText>Price</IonText>
                  </IonCol>
                  <IonCol className="home-change-label">
                    <IonText>Change/24H</IonText>
                  </IonCol>
                  <IonCol className="home-change-per-label">
                    <IonText>Change%</IonText>
                  </IonCol>
                  <IonCol className="home-market-label">
                    <IonText>Market Cap</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>

            {cryptoData.map((c) => (
              <IonRow key={c.abbr} className="crypto-row">
                <IonCol size="12" className="crypto-col">
                  <CryptoContainer
                    crypto={c}
                    tradeCrypto={tradeCryptoHandler}
                  />
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        ) : (
          <IonLoading isOpen={true} message={"Please wait..."} />
        )}
      </div>
    </IonPage>
  );
};

export default Home;
