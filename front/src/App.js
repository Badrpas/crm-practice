import React, { useState } from 'react';
import { Auth } from './components/Auth';
import { Table } from './components/Table';
import { RepoListPage } from './components/RepoListPage';

import 'typeface-roboto';

function App() {
  const [isAuthorized, setAuthorized] = useState(true);

  return (
    <div className="App">
      {
        isAuthorized
        ? <RepoListPage/>
        : <Auth onLogin={(data) => {
            setAuthorized(true);
          }}/>
      }
    </div>
  );
}

export default App;
