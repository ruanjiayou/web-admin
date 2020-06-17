import styled from 'styled-components'

export const Right = styled.div`
  text-align: right;
  flex: 1;
`;
export const CenterXY = styled.div`
height: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

export const AlignAside = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;

export const FullHeight = styled.div`
display: flex;
flex-direction: column;
height: 100%;
`;

export const FullHeightFix = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
`;

export const FullHeightAuto = styled.div`
/* flex-grown flex-shink flex-basis */
flex: 1;
overflow-y: auto;
`;

export const FullWidth = styled.div`
display: flex;
flex-direction: row;
align-items: center;
align-content: center;
`;

export const FullWidthFix = styled.div`
display: flex;
flex-direction: row;
`;

export const FullWidthAuto = styled.div`
flex: 1;
`;