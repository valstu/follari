import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Map from '../Map';
import Sidebar from '../Sidebar';
import { FONT_FAMILY } from '../../styleConstants';

const GET_RACKS = gql`
  query GetRacks {
    racksQuery @rest(type: "RacksPayload", path: "citybike") {
      racks {
        stopCode
        name
        lat
        lon
        bikesAvail
        slotsTotal
        id
      }
      lastupdate
      bikesTotalAvail
    }
  }
`;

const MapContainer = styled.div`
  background: black;
  height: 45vh;
  display: flex;
  flex: 1 1 0;
  // we cannot style this directly so lets use the magic of CSS
  & .sc-map-element-inject > div {
    background-color: black !important;
  }
  @media (min-width: 768px) {
    height: 100vh;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  font-weight: 300;
  height: 100vh;
  font-family: ${FONT_FAMILY};
  @media (min-width: 768px) {
    flex-direction: row;
  }
  a {
    text-decoration: none;
    border-bottom: 1px solid blue;
  }
  a:hover {
    color: blue;
  }
  a:visited {
    color: black;
  }
`;

const Loading = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
  font-family: ${FONT_FAMILY};
  span {
    font-size: 10rem;
  }
`;

const ErrorContainer = styled.h1`
  text-align: center;
  font-weight: 500;
  font-family: ${FONT_FAMILY};
`;

class Home extends Component {
  state = {
    activeId: null,
    position: {
      lat: 60.447813,
      lng: 22.26663,
    },
  };

  onHover = activeId => this.setState({ activeId });
  onHoverEnd = () =>
    this.setState(prevState => ({ ...prevState, activeId: null }));
  onListItemClick = position =>
    this.setState(prevState => ({ ...prevState, position }));
  onDragEnd = position =>
    this.setState(prevState => ({ ...prevState, position }));
  onRackInteract = (rackId, interaction) => {
    switch (interaction) {
      case 'mouseover':
        this.setState({ activeId: rackId });
        break;
      case 'mouseout':
        this.setState({ activeId: null });
        break;
      case 'click':
        // Available, but not used yet
        break;
      default:
        break;
    }
  };

  render() {
    const { activeId, position } = this.state;
    return (
      <Query query={GET_RACKS}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <Loading>
                <h3>Ladataan...</h3>
              </Loading>
            );
          }
          if (error) {
            return (
              <ErrorContainer>
                {error.message || '500 Palvelinvirhe'}
              </ErrorContainer>
            );
          }
          return (
            <Container>
              <Sidebar
                {...data.racksQuery}
                onHover={this.onHover}
                onHoverEnd={this.onHoverEnd}
                onListItemClick={this.onListItemClick}
                activeId={activeId}
              />
              <Map
                position={position}
                activeId={activeId}
                racks={data.racksQuery.racks}
                onDragEnd={this.onDragEnd}
                onRackInteract={this.onRackInteract}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                  process.env.REACT_APP_GOOGLE_MAPS_APIKEY
                }&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100vh` }} />}
                containerElement={<MapContainer />}
                mapElement={
                  <div
                    className="sc-map-element-inject"
                    style={{
                      height: `100%`,
                      width: '100%',
                      background: 'black',
                    }}
                  />
                }
              />
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default Home;
