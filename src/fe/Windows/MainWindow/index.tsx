import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Spinner, Intent } from '@blueprintjs/core';
import '../../style/globalStyle.scss';

ReactDOM.render(
  <div>
    {<Spinner intent={Intent.PRIMARY} />}
    <div>{process.env.NODE_ENV}</div>
  </div>,
  document.getElementById('root')
);
