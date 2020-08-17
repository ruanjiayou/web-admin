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