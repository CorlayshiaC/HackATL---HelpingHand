import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { AIAssistant } from '../components/AIAssistant';

export function Root() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header />
      <main>
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  );
}