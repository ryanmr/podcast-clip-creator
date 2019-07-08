import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-variant: small-caps;
  text-transform: uppercase;
  font-weight: bold;
  flex: 1;
`;

export const TextInput = styled.input`
  border: 0;
  border-bottom: 1px solid #999;
  font-size: 1.1rem;
  padding: 0.5rem;
  width: 100%;
  flex: 2;
  &:disabled {
    background-color: #ececec;
  }
`;

export const FileInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;

  & + label {
    background-color: #000;
    /* border-radius: 4rem; */
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    font-weight: 700;
    /* height: 4rem; */
    line-height: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    transition: background-color 0.3s;
    width: 100%;
  }

  &:focus + label,
  & + label:hover {
    background-color: #f15d22;
  }

  &:focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
  }
`;
