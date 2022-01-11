import { Route } from 'react-router-dom';
import Home from './views/home';
import MainLayout from './layouts/main';

function App() {

  return (
    <MainLayout>
        <Route exact path="/" component={Home}/>
    </MainLayout>
  );
}

export default App;
