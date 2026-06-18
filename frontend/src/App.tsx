import PortfolioChat from './components/PortfolioChat';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <header className="text-center my-4">
        <h1 className="text-3xl font-bold text-white">My AI Portfolio</h1>
      </header>
      
      <main>
        <PortfolioChat />
      </main>
    </div>
  );
}

export default App;