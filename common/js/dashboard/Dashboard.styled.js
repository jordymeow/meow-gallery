// React & Vendor Libs
import Styled from 'styled-components';

// NekoUI
import { NekoBlock } from '@neko-ui';

const TabText = Styled.div`
  color: white;
  padding: 15px;
  margin-bottom: -15px;

  a {
    color: #7dedff;
    text-decoration: none;
  }

  p {
    font-size: 15px;
  }
`;

const StyledPluginBlock = Styled(NekoBlock)`

  .nui-block-title {
    display: none;
  }

  .nui-block-content {
    display: flex;
    padding: 10px;

    h2 {
      color: #055082;
      font-size: 16px;
      margin: 5px 0 5px 0;

      a {
        text-decoration: none;
      }
    }

    p {
      margin: 0px;
      line-height: 18px;
    }
  }
`;

const StyledPluginImage = Styled.img`
  width: 85px;
  height: 85px;
  padding-right: 10px;
`;

const StyledPhpInfo = Styled.div`

  margin: 15px;

  .center {
    background: white;
    border-radius: 10px;
    padding: 10px;
    font-family: Lato;
    max-width: 100%
    overflow: none;

    h2 {
      font-size: 26px;
    }

    table {
      width: 100%;

      tr td:first-child {
        width: 220px;
        font-weight: bold;
        color: #1e7cba;
      }

      * {
        overflow-wrap: anywhere;
      }
    }
  }

  hr {
    border-color: #1e7cba;
  }
`;

const StyledPhpErrorLogs = Styled.div`
  color: white;
  margin: 0px 15px 15px 15px;

  .fatal {
    padding: 8px 12px;
    border-radius: 10px;
    background: #ab3014;
    margin: 0 0 10px 0;
    border: 0;
  }

  .warning {
    padding: 8px 12px;
    border-radius: 10px;
    background: #b98c0e;
    margin: 0 0 10px 0;
    border: 0;
  }

  .notice {
    padding: 8px 12px;
    border-radius: 10px;
    background: #23ad74;
    margin: 0 0 10px 0;
    border: 0;
  }
`;

export { TabText, StyledPluginBlock, StyledPluginImage, StyledPhpInfo, StyledPhpErrorLogs };