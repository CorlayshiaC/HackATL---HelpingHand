import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AI_RESPONSES: Record<string, string> = {
  greeting: "Hi! I'm your GiveLocal AI assistant. I can help you find causes, create campaigns, or answer questions about donations. What would you like to know?",
  quiz: "I recommend taking our quick quiz! It asks about your interests and location, then matches you with campaigns that align with your values. Click 'Take Quiz' in the menu to get started.",
  create: "To create a campaign, you'll need to sign in first. Then click 'Create Campaign' in the menu. You'll provide details about your cause, set a funding goal, and mark your location on a map.",
  donate: "To donate, browse campaigns on the Dashboard or find matches through our quiz. Click any campaign to see details, then enter your donation amount. You'll need to be signed in to donate.",
  location: "Our platform is location-based! You can find campaigns near you or anywhere in the world. During the quiz, you'll select your location on a map and choose how far you want to search (5-500km radius).",
  categories: "We support 12 cause categories: Education, Health, Environment, Food Security, Housing, Arts & Culture, Technology Access, Community Development, Youth Programs, Senior Care, Animal Welfare, and Disaster Relief.",
  default: "I can help you with finding campaigns, creating your own campaign, making donations, understanding our categories, or navigating the platform. What specific question do you have?",
  needhelp: "Create a campaign and then create a campaign on the dashboard page with your specific need. Also if you use our quiz and enter your location you'll see nearby food banks, clothing resources, shelters, and community support programs.",
  donor: "In Donor mode, you can find campaigns to support, volunteer opportunities, and donation drop-off locations near you.",
  map: "Use the Discover Map to find nearby resources like shelters, food banks, donation centers, and volunteer opportunities. You can filter by category.",
  campaign_types: "Campaigns can be for medical expenses, community projects, education, disaster relief, housing support, and more.",
  impact: "Our platform tracks community impact like total donations, clothes donated, food donated, volunteer hours, and active campaigns.",
  start_help: "You can help by donating, volunteering, donating clothes or food, or starting a campaign for someone in need.",
  ai: "I use your interests, location, and platform activity to recommend campaigns, volunteer opportunities, and resources that match your interests and community needs.",
  urgent: "There are urgent needs in your community right now. Check the 'Urgent Needs' section on your dashboard or the map to see where help is needed most.",
  clothes: "You can donate clothes at nearby drop-off locations. Open the map and select the 'Clothing' category to find locations near you.",
  food: "You can donate food or find food banks using the map. Browse capaigns to see nearby locations.",
  shelter: "To find shelters near you, select browse campaigns to see shelters near you.",
  recommend: "For recommendations take the quiz that gives you options, based on your interests and location, its located at the top on your dashboard."

  };

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: AI_RESPONSES.greeting },
  ]);
  const [input, setInput] = useState('');

  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('quiz') || msg.includes('match') || msg.includes('find')) {
      return AI_RESPONSES.quiz;
    } else if (msg.includes('create') || msg.includes('campaign') || msg.includes('start')) {
      return AI_RESPONSES.create;
    } else if (msg.includes('donate') || msg.includes('give') || msg.includes('contribution')) {
      return AI_RESPONSES.donate;
    } else if (msg.includes('location') || msg.includes('where') || msg.includes('map')) {
      return AI_RESPONSES.location;
    } else if (msg.includes('categor') || msg.includes('type') || msg.includes('causes')) {
      return AI_RESPONSES.categories;
    } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return AI_RESPONSES.greeting;
    } else if (msg.includes('volunteer')) {
      return AI_RESPONSES.volunteer;
    } else if (msg.includes('need help') || msg.includes('i need help') || msg.includes('help me')) {
      return AI_RESPONSES.needhelp;
    } else if (msg.includes('donor mode')) {
      return AI_RESPONSES.donor;
    } else if (msg.includes('map') || msg.includes('discover')) {
      return AI_RESPONSES.map;
    } else if (msg.includes('impact') || msg.includes('stats')) {
      return AI_RESPONSES.impact;
    } else if (msg.includes('ai') || msg.includes('recommend')) {
      return AI_RESPONSES.ai;
    } else if (msg.includes('urgent')) {
      return AI_RESPONSES.urgent;
    } else if (msg.includes('clothes')) {
      return AI_RESPONSES.clothes;
    } else if (msg.includes('food')) {
      return AI_RESPONSES.food;
    } else if (msg.includes('shelter')) {
      return AI_RESPONSES.shelter;
    } else {
          return AI_RESPONSES.default;
        }
      };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const aiResponse: Message = { role: 'assistant', content: getAIResponse(input) };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full size-16 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="size-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-h-[600px] shadow-2xl"
          >
            <Card className="flex flex-col h-full">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    <CardTitle className="text-lg">AI Assistant</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
                <CardDescription className="text-blue-50">
                  Ask me anything about GiveLocal
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Sparkles className="size-4 inline mr-2 text-blue-600" />
                      )}
                      <span className="text-sm">{message.content}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="min-h-[60px] max-h-[120px] resize-none"
                  />
                  <Button onClick={handleSend} disabled={!input.trim()} size="icon" className="shrink-0">
                    <Send className="size-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
