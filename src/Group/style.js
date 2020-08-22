import styled from 'styled-components'

export const EditWrap = styled.div`
  &.delete {
    background-color: #333;
  }
  border: 2px dashed transparent;
  &.focus {
    border-color: #1890ff;
  }
  &.dragover {
    background-color: yellow;
  }
`; 