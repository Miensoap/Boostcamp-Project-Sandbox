import React from 'react';
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
        <p className={'text-xl text-blue-600 underline'}>
          {hiMessage ?? 'no message'}
        </p>
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
