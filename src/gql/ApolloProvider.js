import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";

import { getUser } from "../redux/selectors";

export const baseURL = process.env.REACT_APP_BASE_URL || "/";

const createClient = ({ sessionId, locale }) => {
  const appendSession = (data, headers) => {
    const formData = `sessionId=${sessionId}`;
    headers.set("Content-Type", "application/x-www-form-urlencoded");

    return { body: formData, headers };
  };

  const customFetch = (uri, options) => {
    let url = uri;
    if (url.indexOf("?") === -1) {
      url += `?locale=${locale}`;
    } else if (url.indexOf("locale=") === -1) {
      url += `&locale=${locale}`;
    }
    return fetch(url, options);
  };

  const restLink = new RestLink({
    uri: baseURL,
    bodySerializers: {
      appendSession: appendSession,
    },
    customFetch: customFetch,
  });
  const cache = new InMemoryCache();

  return new ApolloClient({
    link: ApolloLink.from([restLink]),
    cache,
  });
};

const Provider = ({ children }) => {
  const user = useSelector(getUser);
  const token = user?.token || "";
  const locale = user?.lang || "en";
  const client = useMemo(
    () => createClient({ sessionId: token, locale: locale }),
    []
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;