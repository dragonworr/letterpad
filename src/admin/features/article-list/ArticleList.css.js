import styled from "styled-components";

export const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  a {
    background: var(--bg-success);
    color: #fff !important;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
  }
`;

export const StyledItem = styled.div`
  .selection-box {
    position: relative;
    z-index: 99;
    left: 100%;
    margin-left: -24px;
    border-top-right-radius: 7px;
    top: 4px;
  }
  [type="checkbox"]:checked,
  [type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="checkbox"]:checked + label,
  [type="checkbox"]:not(:checked) + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
  }
  [type="checkbox"]:checked + label:before,
  [type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0px;
    width: 18px;
    height: 18px;
    border: 1px solid #fff;
    background: #fff;
    box-shadow: 0px 0px 4px 1px #0000005c;
    border-radius: 50%;
  }
  [type="checkbox"]:checked + label:after,
  [type="checkbox"]:not(:checked) + label:after {
    content: "";
    width: 10px;
    height: 10px;
    background: #00a69c;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    transition: all 0.1s ease;
  }
  [type="checkbox"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type="checkbox"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;
