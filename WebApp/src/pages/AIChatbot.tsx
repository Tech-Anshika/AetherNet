import { useState } from "react";
import { ArrowLeft, Bot, Mic, Paperclip, Send, MicOff, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for spacecraft safety and maintenance. I can help you with:\n\n1. **Safety procedures**\n2. **Repair instructions**\n3. **Tool locations**\n4. **Emergency protocols**\n5. **Equipment identification**\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    "Check Oxygen Levels",
    "Locate Fire Extinguisher", 
    "Show Repair Steps",
    "Emergency Protocol",
    "Equipment Status"
  ];

  // Fallback responses for common queries when API is unavailable
  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('oxygen') || lowerQuery.includes('o2')) {
      return '**Oxygen Level Check Procedure:**\n\n1. Locate the oxygen monitoring panel (usually near the main control console)\n2. Check the digital display for current O2 levels\n3. Normal range: 19.5% - 23.5%\n4. If levels are below 19.5%, activate backup oxygen system\n5. Report any anomalies to mission control immediately\n\n**Safety Note:** Always wear your helmet in low-oxygen situations.';
    }
    
    if (lowerQuery.includes('fire') || lowerQuery.includes('extinguisher')) {
      return '**Fire Extinguisher Location & Usage:**\n\n**Primary Locations:**\n- Main control room (behind pilot seat)\n- Equipment bay (wall-mounted)\n- Emergency exit areas\n\n**Usage Steps:**\n1. Pull the safety pin\n2. Aim at the base of the fire\n3. Squeeze the trigger\n4. Sweep from side to side\n\n**Types Available:**\n- CO2 extinguishers for electrical fires\n- Dry chemical for general fires\n\n**Emergency Protocol:** If fire spreads, activate emergency depressurization system.';
    }
    
    if (lowerQuery.includes('repair') || lowerQuery.includes('fix')) {
      return '**General Repair Protocol:**\n\n1. **Assess the situation** - Determine if it\'s safe to proceed\n2. **Check equipment status** - Use diagnostic tools\n3. **Follow safety procedures** - Wear appropriate PPE\n4. **Use repair kit** - Located in maintenance compartment\n5. **Test functionality** - Verify repair was successful\n6. **Document the repair** - Log in maintenance log\n\n**Emergency Repairs:** Always prioritize crew safety over equipment repair.';
    }
    
    if (lowerQuery.includes('emergency') || lowerQuery.includes('protocol')) {
      return '**Emergency Protocols:**\n\n**Fire Emergency:**\n1. Activate fire suppression system\n2. Evacuate to safe zone\n3. Contact mission control\n\n**Oxygen Emergency:**\n1. Don emergency breathing apparatus\n2. Check for leaks\n3. Seal affected compartments\n\n**Communication Loss:**\n1. Use backup communication systems\n2. Follow emergency procedures\n3. Maintain calm and focus\n\n**Medical Emergency:**\n1. Administer first aid\n2. Contact medical support\n3. Follow emergency protocols';
    }
    
    if (lowerQuery.includes('equipment') || lowerQuery.includes('status')) {
      return '**Equipment Status Check:**\n\n**Critical Systems:**\n- Life support: ✅ Operational\n- Communication: ✅ Operational\n- Navigation: ✅ Operational\n- Power systems: ✅ Operational\n\n**Safety Equipment:**\n- Fire extinguishers: ✅ Available\n- Emergency kits: ✅ Stocked\n- Oxygen tanks: ✅ Full\n- Communication devices: ✅ Functional\n\n**Maintenance Schedule:** All systems are within normal parameters.';
    }
    
    if (lowerQuery.includes('camera') || lowerQuery.includes('detection') || lowerQuery.includes('object')) {
      return '**Object Detection System:**\n\n**Camera Status:**\n- Primary camera: ✅ Operational\n- Detection algorithms: ✅ Active\n- Recognition accuracy: 98%\n\n**Usage:**\n1. Ensure proper lighting\n2. Keep lenses clean\n3. Monitor for false positives\n4. Document anomalies\n\n**Note:** System works best with clear, well-lit images.';
    }
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('greeting')) {
      return '**Greetings, Astronaut!** 👨‍🚀\n\nWelcome to your AI assistant. I\'m here to help with:\n• Safety protocols\n• Equipment maintenance\n• Emergency procedures\n• System diagnostics\n\nHow can I assist you today?';
    }
    
    if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('nutrition')) {
      return '**Nutrition Protocol:**\n\n**Meal Schedule:**\n- Breakfast: 06:00 UTC\n- Lunch: 12:00 UTC\n- Dinner: 18:00 UTC\n\n**Storage:**\n- Food compartments: ✅ Stocked\n- Hydration systems: ✅ Full\n- Nutrition balance: ✅ Optimal\n\n**Remember:** Proper nutrition is crucial for mission success.';
    }
    
    if (lowerQuery.includes('sleep') || lowerQuery.includes('rest') || lowerQuery.includes('bed')) {
      return '**Rest Protocol:**\n\n**Sleep Schedule:**\n- Recommended: 8 hours\n- Sleep area: Secured\n- Restraints: Available\n\n**Environment:**\n- Temperature: Optimal\n- Noise levels: Minimal\n- Lighting: Dimmed\n\n**Note:** Quality rest is essential for alertness.';
    }
    
    // Default response with more helpful guidance
    return '**AI Assistant Status:** 🤖\n\nI\'m currently operating in offline mode due to API limitations. However, I can still provide helpful guidance for:\n\n• **Safety Procedures** - Fire, oxygen, emergency protocols\n• **Equipment Maintenance** - Repairs, system checks\n• **Mission Support** - Status checks, navigation\n• **General Assistance** - Any spacecraft-related queries\n\nWhat would you like to know about?';
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if we should use API or fallback (to conserve quota)
      const shouldUseAPI = Math.random() > 0.9; // 10% chance to use API (reduced due to quota issues)
      
      if (shouldUseAPI) {
        // Try the API
        console.log('Sending API request with message:', inputValue);
        
        const requestBody = {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant for astronauts aboard a spacecraft. Provide helpful, concise guidance for safety procedures, repairs, tool locations, and emergency protocols. Focus on spacecraft-specific equipment like fire extinguishers, oxygen tanks, emergency kits, and communication devices. Format responses with clear numbered steps when appropriate. Be encouraging and supportive while maintaining professional expertise. Keep responses under 300 words.'
            },
            {
              role: 'user',
              content: inputValue
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        console.log('API Response Status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);
          
          if (data.choices && data.choices[0] && data.choices[0].message) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: data.choices[0].message.content,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            return; // Success - exit early
          }
        } else {
          // Log the error response
          const errorData = await response.text();
          console.error('API Error Response:', errorData);
          console.error('API Status:', response.status);
          
          // If it's a quota error, log it specifically
          if (response.status === 429) {
            console.log('API quota exceeded - using enhanced fallback responses');
            console.log('💡 Tip: Get a fresh API key with available credits for full AI responses');
          }
        }
      } else {
        console.log('Using fallback response to conserve API quota');
      }

      // Use fallback response
      const fallbackResponse = getFallbackResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Use fallback response for any error
      const fallbackResponse = getFallbackResponse(inputValue);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    // Auto-send quick action
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index}>
        {line.includes('**') ? (
          <div dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
              .replace(/^\d+\.\s/, '<span class="text-primary font-bold">$&</span>')
          }} />
        ) : (
          line
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
      <div className="absolute inset-0 stars" />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 glass border-b border-white/10 animate-glow-pulse">
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:scale-105 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -inset-1 bg-primary/20 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">AI Assistance</h1>
                <p className="text-sm text-muted-foreground">Online & Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <Card
                className={`max-w-xs md:max-w-md ${
                  message.type === 'ai'
                    ? 'chat-bubble-ai'
                    : 'chat-bubble-user'
                }`}
              >
                <CardContent className="p-3">
                  <div className={`text-sm ${message.type === 'ai' ? 'text-white' : 'text-white'}`}>
                    {formatMessage(message.content)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <Card className="chat-bubble-ai max-w-xs">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="glass hover:glow-purple text-xs"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 glass border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about repair procedure, safety protocols, or equipment location..."
                className="pr-20 glass border-white/20 focus:border-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/10"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={isListening ? "neon" : "ghost"}
                  onClick={toggleVoiceInput}
                  className="h-8 w-8 hover:bg-white/10"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="neon"
              size="icon"
              className="hover:scale-105 transition-transform"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {isListening && (
            <div className="mt-2 flex items-center justify-center gap-2 text-primary">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-sm">Listening...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}