import React from 'react';
import { InMemoryCache, ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { RestLink } from 'apollo-link-rest';
import camelCase from 'camelcase';
import Home from './components/Home';

const typePatcher = {
  RacksPayload: data => {
    if (data.racks === null) {
      return data;
    }

    const racksArr = Object.keys(data.racks).map(key => {
      if (data.racks[key] === null) {
        return null;
      }
      return {
        ...data.racks[key],
        __typename: 'Rack',
        stopCode: data.racks[key].stopCode || null,
      };
    });

    // eslint-disable-next-line no-param-reassign
    data.racks = racksArr.filter(Boolean);
    return data;
  },
};

const restLink = new RestLink({
  uri: 'https://data.foli.fi/',
  typePatcher,
  fieldNameNormalizer: key => camelCase(key),
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <Home />
  </ApolloProvider>
);

export default App;
