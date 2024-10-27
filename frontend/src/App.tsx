import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  QueryClientProvider,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
const getHiMessage = async () => {
  return await fetch('http://localhost:8080').then((res) => res.text());
};

function AppContent() {
  const { data: hiMessage } = useQuery({
    queryKey: ['hi'],
    queryFn: getHiMessage,
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{hiMessage ?? 'no message'}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
