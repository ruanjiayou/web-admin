import styled from 'styled-components'

export const TabHeader = styled.div`
  padding: 2px;
`;

export const TabTag = styled.span`
  padding: 2px;
  border-radius: 5px;
  border: 1px solid transparent;
  text-decoration: underline;
  cursor: pointer;
  &.active {
    border-color: white;
    color: white;
  }
`;

export const CompImg = styled.img`
  display: inline-block;
  height: 70px;
  flex: 1;
  margin: 0 5px;
`;