import React from 'react';
import './App.css';
import {
  QueryClientProvider,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useStore from './store';

const queryClient = new QueryClient();
const getHiMessage = async () => {
  return await fetch('http://localhost:8080').then((res) => res.text());
};

function AppContent() {
  const { data: hiMessage } = useQuery({
    queryKey: ['hi'],
    queryFn: getHiMessage,
  });

  const { count, increase, decrease } = useStore();

  return (
    <div className="App">
      <p className={'text-xl text-blue-600 underline'}>
        {hiMessage ?? 'no message'}
      </p>
      <div className="counter">
        <p className="text-lg">Count: {count}</p>
        <button onClick={increase}>Increase</button>
        <button onClick={decrease}>Decrease</button>
      </div>
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
