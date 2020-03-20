import * as axios  from 'axios';
import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { RepoListPage } from './components/RepoListPage';

import 'typeface-roboto';

function App() {
  const [isAuthorized, setAuthorized] = useState(false);

  return (
    <div className="App">
      {
        isAuthorized
        ? <RepoListPage/>
        : <Auth onLogin={({tokenId}) => {
            axios.defaults.headers.common.Authorization = 'Bearer ' + tokenId;
            setAuthorized(true);
          }}/>
      }
    </div>
  );
}

export default App;
