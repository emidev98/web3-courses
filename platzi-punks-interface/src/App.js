import { Route } from 'react-router-dom';
import Home from './views/home';
import MainLayout from './layouts/main';
import Punks from './views/punks';
import Punk from './views/punk';

function App() {

  return (
    <MainLayout>
        <Route path="/" exact component={Home}/>
        <Route path="/punks" exact component={Punks}/>
        <Route path="/punks/:tokenId" exact component={Punk}/>
    </MainLayout>
  );
}

export default App;
