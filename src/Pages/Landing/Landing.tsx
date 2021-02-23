import React, { useReducer, useContext } from "react";
import "./Landing.css";

import { UserContext } from "../../UserContext";

import { Redirect } from "react-router-dom";

import {
  IonPage,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonInput,
  IonItem,
  IonCardHeader,
  IonText,
} from "@ionic/react";

const initialState: LoginState = {
  email: "",
  password: "",
  error: "",
  isLoading: false,
  isLoggedIn: false,
};

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string;
  isLoggedIn: boolean;
}

type LoginAction =
  | { type: "login" | "success" | "failure" | "error" | "logOut" }
  | {
      type: "field";
      fieldName: string;
      payload: string | undefined | null | number;
    };

function loginReducer(state: LoginState, action: LoginAction) {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }

    case "login": {
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    }

    case "success": {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        error: "",
      };
    }

    case "failure": {
      return {
        ...state,
        isLoggedIn: false,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}

const Landing: React.FC<{}> = () => {
  //User Context
  const { updateUser } = useContext(UserContext);

  const [state, dispatch] = useReducer(loginReducer, initialState);

  const { email, password, error, isLoading, isLoggedIn } = state;

  const loginHandler = async (e: any) => {
    e.preventDefault();
    if (password.length === 0 || email.length === 0) {
      dispatch({
        type: "field",
        fieldName: "error",
        payload: "Email and/or Password is Empty",
      });
      return;
    }
    dispatch({ type: "login" });
    try {
      const response = await fetch(
        "http://164.90.157.105:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        dispatch({
          type: "field",
          fieldName: "error",
          payload: responseData.message,
        });
        dispatch({ type: "failure" });
      } else {
        if (responseData.user) {
          updateUser(responseData.user);
          dispatch({ type: "success" });
        } else {
          dispatch({
            type: "field",
            fieldName: "error",
            payload: "Error logging user in",
          });
          dispatch({ type: "failure" });
        }
        //dispatch({ type: "success" });
      }
    } catch (err) {
      dispatch({ type: "failure" });
    }
  };

  const signupHandler = async (e: any) => {
    e.preventDefault();
    if (password.length === 0 || email.length === 0) {
      return;
    }
    dispatch({ type: "login" });
    try {
      const response = await fetch(
        "http://164.90.157.105:5000/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        dispatch({
          type: "field",
          fieldName: "error",
          payload: responseData.message,
        });
        dispatch({ type: "failure" });
      } else {
        if (responseData.user) {
          updateUser(responseData.user);
          dispatch({ type: "success" });
        } else {
          dispatch({ type: "failure" });
        }
      }
    } catch (err) {
      dispatch({ type: "failure" });
      dispatch({
        type: "field",
        fieldName: "error",
        payload: "Error signing user up",
      });
    }
  };

  return (
    <IonPage className="landing-page">
      <IonGrid className="main-grid">
        {isLoggedIn && <Redirect to="/Home" />}
        <IonCard className="ion-input-card">
          <IonCardHeader className="card-header">
            <IonGrid>
              <IonRow>
                <IonGrid>
                  <IonRow>
                    <IonCol className="landing-text-col">
                      <IonText className="card-title-text">
                        BitHive - Crypto Trading
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="landing-error-col">
                      <IonText className="error-text">{error}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonRow>
            </IonGrid>
          </IonCardHeader>
          <div className="landing-main-col">
            <IonCol>
              <IonRow>
                <IonItem className="email-item">
                  <IonInput
                    type="text"
                    placeholder="Email"
                    value={email}
                    onIonChange={(e) => {
                      dispatch({
                        type: "field",
                        fieldName: "email",
                        payload: (e.target as HTMLInputElement).value,
                      });
                    }}
                  ></IonInput>
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem className="password-item">
                  <IonInput
                    placeholder="Password"
                    type="password"
                    value={password}
                    onIonChange={(e) =>
                      dispatch({
                        type: "field",
                        fieldName: "password",
                        payload: (e.target as HTMLInputElement).value,
                      })
                    }
                  ></IonInput>
                </IonItem>
              </IonRow>
              <IonRow className="submit-row">
                <IonButton
                  disabled={isLoading}
                  color="dark"
                  className="submit-item"
                  onClick={(e) => loginHandler(e)}
                >
                  Submit
                </IonButton>
              </IonRow>
              <IonRow className="signup-row">
                <IonButton
                  disabled={isLoading}
                  color="dark"
                  className="signup-button"
                  onClick={(e) => signupHandler(e)}
                >
                  Sign-Up
                </IonButton>
              </IonRow>
              <IonRow className="helper-row">
                <IonCol size="9" className="helper-col1">
                  <IonText>Don't have an account?</IonText>
                </IonCol>
              </IonRow>
              <IonRow className="helper-row">
                <IonCol className="helper-col2">
                  <IonText>
                    Enter a valid email and password and click Sign-Up
                  </IonText>
                </IonCol>
              </IonRow>
            </IonCol>
          </div>
        </IonCard>
      </IonGrid>
    </IonPage>
  );
};

export default Landing;
