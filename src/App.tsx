import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './screens/login/Login';
import { EventList } from './screens/event-list/EventList';
import { SelectReceptionMethod } from './screens/select-reception-method/SelectReceptionMethod';
import { SelfqrDescription } from './screens/selfqr-description/SelfqrDescription';
import { SelfqrScanner } from './screens/selfqr-scanner/SelfqrScanner';
import { CheckIn } from './screens/check-in/CheckIn';
import { CheckInConfirmation } from './screens/check-in-confirmation/CheckInConfirmation';
import { Completion } from './screens/completion/Completion';
import './App.css';

function App() {
  return (
    <Router basename="/DemoReception">
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event-list" element={<EventList />} />
          <Route path="/select-reception-method" element={<SelectReceptionMethod />} />
          <Route path="/selfqr-description" element={<SelfqrDescription />} />
          <Route path="/selfqr-scanner" element={<SelfqrScanner />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/check-in-confirmation" element={<CheckInConfirmation />} />
          <Route path="/completion" element={<Completion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;