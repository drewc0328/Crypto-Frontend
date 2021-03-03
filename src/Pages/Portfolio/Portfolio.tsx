import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../../UserContext";
import { PortfolioItem } from "../../Models/PortfolioItem";
import PortfolioContainer from "../../Components/PortfolioContainer/PortfolioContainer";
import {
  IonCard,
  IonCol,
  IonGrid,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";

import { Redirect } from "react-router-dom";
import Header from "../../Components/Header/Header";
import TradedCrypto from "../../Components/TradedCrypto/TradedCrypto";
import { Crypto } from "../../Models/Crypto";

import "./Portfolio.css";

const Portfolio: React.FC<{}> = () => {
  //User Context
  const { user, updateUser } = useContext(UserContext);
  const [error, setError] = useState<string>("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>();
  const [cryptoNetWorth, setCryptoNetWorth] = useState<number>(0);

  // Crypto from PortfolioContainer that will be sent to Buy/Sell component
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>({
    name: "",
    abbr: "",
    change: "",
    change_percent: "",
    market_cap: "",
    price: 0,
    logo: "",
  });

  // Boolean states to route to different parts of app or for logic involving certain user requirements
  const [toHome, setToHome] = useState<Boolean>(false);
  const [signOut, setSignOut] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [trading, setTrading] = useState<Boolean>(false);

  const getPortfolio = async () => {
    //console.log("getPortoflio user: ", user);
    try {
      const response = await fetch(
        "https://bithive-crypto-exchange.herokuapp.com/api/users/getPortfolio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user._id,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setError("Error getting the user's portfolio data");
      } else {
        //console.log(responseData.portfolioList);
        await setPortfolioItems(responseData.portfolioList);
        if (responseData.portfolioList) {
          let runningTotal = 0;
          responseData.portfolioList?.forEach((p: PortfolioItem) => {
            runningTotal += parseFloat(p.amount) * p.price;
          });

          setCryptoNetWorth(runningTotal);
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isSubscribed = true;
    function getUserFromLocalStorage() {
      if (!user._id) {
        let localUser = localStorage.getItem("user");
        if (localUser !== null) {
          updateUser(JSON.parse(localUser));
        }
      }
    }

    function portfolioTimeout() {
      if (isSubscribed) {
        getPortfolio();
        setTimeout(portfolioTimeout, 90000);
      }
    }

    getUserFromLocalStorage();
    portfolioTimeout();

    return function cleanup() {
      isSubscribed = false;
    };
  }, []);

  const handleTrading = async (abbr: string) => {
    try {
      const response = await fetch(
        `https://bithive-crypto-exchange.herokuapp.com/api/cryptocurrencies/getByAbbr/${abbr}`
      );
      const responseData = await response.json();

      if (!response) {
        console.log(responseData.message);
      } else {
        setSelectedCrypto(responseData.crypto);
        setTrading(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = async () => {
    setTrading(false);
    setLoading(true);
    await getPortfolio();
    setLoading(false);
    //console.log("port items: ", portfolioItems);
  };

  return (
    <IonPage className="portfolio-page">
      {/* {console.log("OWNED: ", user.ownedCryptos)}
      {console.log("Portfolio Items Render: ", portfolioItems)} */}
      {toHome && <Redirect to="/home" />}
      {signOut && <Redirect to="/" />}
      {trading && (
        <TradedCrypto close={() => handleClose()} crypto={selectedCrypto} />
      )}
      {loading && !error ? (
        <IonLoading isOpen={true} message={"Please wait..."} />
      ) : !error ? (
        <div className="overflow-div">
          <Header
            routeHome={() => setToHome(true)}
            routeSignOut={() => setSignOut(true)}
          />
          <IonCard className="header-card">
            <IonGrid>
              <div className="portfolio-subheader-div">
                <IonRow>
                  <IonCol>
                    <IonText className="portfolio-subheader-text">
                      User Balance: ${user.balance}
                    </IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText className="portfolio-subheader-text">
                      Portfolio Worth: ${cryptoNetWorth}
                    </IonText>
                  </IonCol>
                </IonRow>
              </div>
            </IonGrid>
          </IonCard>

          {portfolioItems && !error ? (
            <div className="portfolio-main-div">
              <IonCard className="portfolio-container-card portfolio-margin">
                <IonGrid>
                  <IonRow>
                    <IonCol className="portfolio-property-col" size="3" size-md>
                      <IonText className="portfolio-property-col-text">
                        Name
                      </IonText>
                    </IonCol>
                    <IonCol
                      className="portfolio-property-price-col"
                      size="3"
                      size-md
                    >
                      <IonText className="portfolio-property-col-text">
                        Price
                      </IonText>
                    </IonCol>
                    <IonCol
                      className="portfolio-property-amount-col"
                      size="3"
                      size-md
                    >
                      <IonText className="portfolio-property-col-text">
                        Amount
                      </IonText>
                    </IonCol>
                    <IonCol
                      className="portfolio-property-asset-col"
                      size="3"
                      size-md
                    >
                      <IonText className="portfolio-property-col-text">
                        Asset Worth
                      </IonText>
                    </IonCol>
                    <IonCol></IonCol>
                  </IonRow>
                </IonGrid>
              </IonCard>
              {portfolioItems.map((p) => (
                <div key={p.price}>
                  <PortfolioContainer
                    crypto={p}
                    handleTrading={(abbr: string) => handleTrading(abbr)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>No Cryptos</div>
          )}
        </div>
      ) : (
        <div>
          <h1>{error}</h1>
        </div>
      )}
    </IonPage>
  );
};

export default Portfolio;
