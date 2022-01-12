import { Route } from 'react-router-dom';
import Home from './views/home';
import MainLayout from './layouts/main';
import Punks from './views/punks';

function App() {

  return (
    <MainLayout>
        <Route path="/" exact component={Home}/>
        <Route path="/punks" exact component={Punks}/>
    </MainLayout>
  );
}

export default App;
