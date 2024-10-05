import styled from 'styled-components'

export const TabHeader = styled.div`
  padding: 2px;
  display: flex;
  flex: 1;
  align-items: center;
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
  height: 50px;
  width: 50px;
  margin-bottom: 10px;
  flex: 1;
`;