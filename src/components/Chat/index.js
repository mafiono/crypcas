import React, { useState, useEffect } from "react";
// import intl from 'react-intl-universal';
import { connect } from "react-redux";
import { getUser } from "../../redux/selectors";

function Chat(props) {
  const [chatInitialized, setChatInitialized] = useState(false);
  const { signedIn, loginName, email } = props.user;

  useEffect(() => {
    if (!chatInitialized && signedIn) {
      setChatInitialized(true);
      let startLiveChat = false;
      let appName = "";
      let appLogo = "";
      if (process.env.REACT_APP_BRAND_EXT === "") {
        startLiveChat = true;
        appName = "RockNRolla";
        appLogo =
          "https://www.rocknrollacasino.com/assets/images/favicon-72x72.png";
      } else if (process.env.REACT_APP_BRAND_EXT === "-321") {
        startLiveChat = true;
        appName = "321CryptoCasino";
        appLogo =
          "https://www.321cryptocasino.com/assets/images-321/favicon-72x72.png";
      }
      if (startLiveChat) {
        // Load Fresh Chat
        const fcScript = document.createElement("script");
        fcScript.innerHTML = `
                    function initFreshChat() {
                        window.fcWidget.init({
                            "config": {
                                "headerProperty": {
                                    "appName": "${appName}",
                                    "appLogo": "${appLogo}",
                                    "backgroundColor": "#ff6600",
                                    "foregroundColor": "#ffffff",
                                    "direction": "rtl"
                                },
                                "hideFAQ": true
                            },
                            "host": "https://wchat.freshchat.com",
                            "token": "f78705ae-6143-45f3-95b1-514daabd1a3f"
                        });
                        // To set user name
                        window.fcWidget.user.setFirstName("${loginName}");
                        // To set user email
                        window.fcwidget.user.setemail("${email}");
                    }
                    function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}initialize(document,"freshchat-js-sdk");
                `;
        document.head.appendChild(fcScript);
      }
    }
  }, [chatInitialized, signedIn, loginName, email]);

  return <></>;
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(Chat);
