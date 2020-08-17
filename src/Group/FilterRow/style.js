import styled from 'styled-components'

export const ScrollWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: space-between;
  overflow-x: hidden;
  margin: 5px 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;