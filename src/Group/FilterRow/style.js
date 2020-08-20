import styled from 'styled-components'

export const ScrollWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;