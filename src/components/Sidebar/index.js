import React from 'react';
import { string, number, arrayOf, shape, func } from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';
import orderby from 'lodash.orderby';
import cx from 'classnames';

const SidebarContainer = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  height: 55vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  justify-content: space-between;
  @media (min-width: 768px) {
    height: 100vh;
    width: 360px;
  }
`;

const Title = styled.h1`
  font-weight: 300;
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  align-items: baseline;
  @media (min-width: 768px) {
    font-size: 2.8rem;
    span {
      font-size: 4rem;
      margin-right: -0.5rem;
    }
  }
`;

const Subtitle = styled.h2`
  font-weight: 200;
  font-size: 0.8rem;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  strong {
    font-weight: 500;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  text-align: left;
`;

const RackList = styled.ul`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #eee;
  @media (min-width: 768px) {
    border-bottom: 1px solid #eee;
    overflow-y: scroll;
  }
`;

const RackListItem = styled.li`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover,
  &.highlight {
    background: #f6f6f6;
  }
  &.highlight h3 {
    color: #f00;
  }
  &:last-child {
    border-bottom: 0;
  }
  @media (min-width: 768px) {
    padding: 1rem 1rem;
  }
`;

const RackListItemTitle = styled.h3`
  font-weight: 400;
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const RackListItemContent = styled.div`
  font-weight: 200;
  font-size: 0.8rem;
  strong {
    font-weight: 500;
  }
`;

const Footer = styled.div`
  display: none;
  padding: 1rem;
  font-size: 0.75rem;
  flex-direction: column;
  span {
    margin-bottom: 10px;
  }
  span:last-child {
    margin-bottom: 0px;
  }
  @media (min-width: 768px) {
    display: flex;
  }
`;

export const getColor = available => {
  if (available > 3) {
    return 'green';
  }
  if (available > 0) {
    return 'orange';
  }
  return 'red';
};

const AvailabilityIndicator = styled.span`
  display: inline-block;
  margin-top: 1px;
  margin-right: 10px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: ${props => getColor(props.available)};
`;

const Sidebar = ({
  racks,
  lastupdate,
  bikesTotalAvail,
  activeId,
  onHover,
  onHoverEnd,
  onListItemClick,
}) => {
  const orderedRacks = orderby(racks, 'name', 'asc');

  const renderRacks = orderedRacks.map(rack => (
    <RackListItem
      key={rack.id}
      className={cx({ highlight: rack.id === activeId })}
      onMouseEnter={() => onHover(rack.id)}
      onMouseLeave={() => onHoverEnd()}
      onClick={() => onListItemClick({ lat: rack.lat, lng: rack.lon })}
    >
      <RackListItemTitle>{rack.name}</RackListItemTitle>
      <RackListItemContent>
        <AvailabilityIndicator available={rack.bikesAvail} />
        <strong>
          {rack.bikesAvail}/{rack.slotsTotal}
        </strong>{' '}
        vapaana
      </RackListItemContent>
    </RackListItem>
  ));

  return (
    <SidebarContainer>
      <Header>
        <Title>
          <span role="img" aria-label="Bike">
            🚲
          </span>{' '}
          Fölläri
        </Title>
        <Subtitle>
          Nyt <strong>{bikesTotalAvail}</strong>{' '}
          {bikesTotalAvail === 1 ? 'fillari' : 'fillaria'} vapaana!
        </Subtitle>
      </Header>
      <RackList>{renderRacks}</RackList>
      <Footer>
        <span>
          Viimeksi päivitetty:{' '}
          {dayjs(lastupdate * 1000).format('DD.MM.YYYY [klo] HH:mm:ss')}
        </span>
        <span>
          Fork me at <a href="https://github.com/valstu/follari">Github</a> /
          Twitter:{' '}
          <a href="https://twitter.com/valtterikaresto">@valtterikaresto</a>
        </span>
      </Footer>
    </SidebarContainer>
  );
};

Sidebar.propTypes = {
  racks: arrayOf(
    shape({
      id: string,
      stopCode: string,
      name: string,
      lat: number,
      lon: number,
      bikesAvail: number,
      slotsTotal: number,
    }),
  ),
  activeId: string,
  lastupdate: number,
  bikesTotalAvail: number,
  onHover: func.isRequired,
  onHoverEnd: func.isRequired,
  onListItemClick: func.isRequired,
};

Sidebar.defaultProps = {
  racks: [],
  lastupdate: Math.round(new Date().valueOf() / 1000),
  bikesTotalAvail: 0,
  activeId: null,
};

export default Sidebar;
