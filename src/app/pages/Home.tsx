import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f3ef]">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="max-w-3xl pt-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Sparkles className="size-4" />
              <span>AI-Powered Giving</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Small gifts,{' '}
              <span className="text-gray-400">big change</span>
              <br />
              in your community
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl">
              Discover local causes that matter to you. Our AI matches you with community projects based on your passions and location — anywhere in the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-gray-700 hover:bg-gray-800 text-white rounded-full px-6 gap-2 shadow-sm"
              >
                <Link to="/quiz">
                  <Sparkles className="size-5" />
                  Take the Match Quiz
                </Link>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                size="lg"
                className="text-gray-700 hover:text-gray-900 gap-2"
              >
                <Link to="/dashboard">
                  Browse Causes
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}