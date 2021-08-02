import styled from 'styled-components'

export const HoverTitle = styled.div`
  & > span {
    visibility: hidden;
  }
  &:hover > span {
    visibility: visible;
  }
`