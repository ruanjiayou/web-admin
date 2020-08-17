import styled from 'styled-components'

export const EditWrap = styled.div`

  &.delete {
    background-color: #333;
  }
  &.edit {
    border: 2px dashed #333;
    margin: 3px;
    padding: 3px;
  }
  &:focus {
    border-color: #1890ff;
    box-shadow: none;
  }
`; 