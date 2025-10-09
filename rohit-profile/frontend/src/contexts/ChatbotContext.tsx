import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import chatbotService, { ContactInfo, PortfolioInfo } from '@/services/chatbotService';

// Define types for our messages
export type MessageType = 'user' | 'bot';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Define the context type
interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (content: string, type: MessageType) => void;
  toggleChatbot: () => void;
  resetChat: () => void;
}

// Create the context with a default value
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Define props for the provider
interface ChatbotProviderProps {
  children: ReactNode;
}

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 9);

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId] = useState<string>(chatbotService.getUserId());
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo | null>(null);

  // Load contact and portfolio info
  useEffect(() => {
    const loadInfo = async () => {
      const [contact, portfolio] = await Promise.all([
        chatbotService.getContactInfo(),
        chatbotService.getPortfolioInfo()
      ]);
      setContactInfo(contact);
      setPortfolioInfo(portfolio);
    };
    loadInfo();
  }, []);

  // Initialize with welcome message or load from backend
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatbotService.getChatHistory(userId);
        if (history.length > 0) {
          setMessages(history);
        } else {
          const welcomeMessage: Message = {
            id: generateId(),
            content: "Hi I am bot👋 How can I help you today?",
            type: 'bot',
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
          
          // Save the welcome message
          chatbotService.saveChatHistory(userId, [welcomeMessage])
            .catch(err => console.error("Failed to save welcome message:", err.message || 'Unknown error'));
        }
      } catch (error) {
        console.error("Failed to load chat history:", error.message || 'Unknown error');
        const welcomeMessage: Message = {
          id: generateId(),
          content: "Hi I am bot👋 How can I help you today?",
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };
    
    loadChatHistory();
  }, [userId]);

  // Add a new message to the chat
  const addMessage = (content: string, type: MessageType) => {
    const newMessage: Message = {
      id: generateId(),
      content,
      type,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      
      // Save to backend
      chatbotService.saveChatHistory(userId, updatedMessages)
        .catch(err => console.error("Failed to save chat history:", err.message || 'Unknown error'));
      
      return updatedMessages;
    });
    
    // If it's a user message, simulate bot response
    if (type === 'user') {
      handleBotResponse(content);
    }
  };

  // Handle bot responses based on user input
  const handleBotResponse = (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const response = generateResponse(userMessage);
      
      const botMessage: Message = {
        id: generateId(),
        content: response,
        type: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, botMessage];
        
        // Save to backend
        chatbotService.saveChatHistory(userId, updatedMessages)
          .catch(err => console.error("Failed to save chat history:", err.message || 'Unknown error'));
        
        return updatedMessages;
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // Check if query is relevant to portfolio/professional topics
  const isRelevantQuery = (message: string): boolean => {
    const portfolioKeywords = [
      'portfolio', 'work', 'project', 'skill', 'experience', 'service', 'contact',
      'about', 'background', 'education', 'certification', 'technology', 'tech',
      'development', 'design', 'programming', 'code', 'website', 'app', 'software',
      'frontend', 'backend', 'fullstack', 'react', 'node', 'javascript', 'typescript',
      'hire', 'freelance', 'available', 'cost', 'price', 'timeline', 'delivery',
      'team', 'collaboration', 'process', 'methodology', 'agile', 'scrum',
      'achievement', 'award', 'client', 'testimonial', 'review', 'feedback',
      'email', 'phone', 'whatsapp', 'location', 'address', 'hours', 'time',
      'hello', 'hi', 'help', 'thanks', 'thank', 'bye', 'goodbye'
    ];
    
    return portfolioKeywords.some(keyword => message.includes(keyword));
  };

  // Check if user is asking for detailed/specific information
  const isDetailedQuery = (message: string): boolean => {
    const detailKeywords = [
      'specific', 'detailed', 'more about', 'tell me about', 'explain', 'elaborate',
      'deep dive', 'in depth', 'comprehensive', 'thorough', 'complete details',
      'full information', 'everything about', 'all details', 'specifics',
      'technical details', 'implementation', 'architecture', 'methodology'
    ];
    
    return detailKeywords.some(keyword => message.includes(keyword));
  };

  // Generate contact Rohit message
  const getContactRohitMessage = (): string => {
    const name = portfolioInfo?.name || 'Rohit Sharma';
    return `For more detailed and specific information, I'd recommend reaching out to ${name} directly. He can provide comprehensive insights and answer your specific questions in detail.\n\n📞 **Contact ${name}:**\n${contactInfo?.email ? `• Email: ${contactInfo.email}\n` : ''}
${contactInfo?.phone ? `• Phone: ${contactInfo.phone}\n` : ''}
${contactInfo?.whatsapp ? `• WhatsApp: ${contactInfo.whatsapp}\n` : ''}\nResponse time: ${portfolioInfo?.responseTime || '24 hours'}`;
  };

  // Enhanced ChatGPT-like response generator
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Check if query is relevant
    if (!isRelevantQuery(message)) {
      return "I'm sorry, but I'm specifically designed to help with questions about this portfolio, services, contact information, and professional background. I can't assist with topics outside of these areas. \n\nFeel free to ask about:\n• Portfolio projects and work\n• Skills and technologies\n• Services offered\n• Contact information\n• Professional background\n• Availability and hiring";
    }
    
    // Get conversation context
    const recentMessages = messages.slice(-4);
    const hasContext = recentMessages.length >= 2;
    const lastBotMessage = hasContext ? recentMessages.filter(m => m.type === 'bot').pop()?.content : '';
    
    // Greeting patterns with personalized responses
    if (message.match(/\b(hello|hi|hey|howdy|greetings|good morning|good afternoon|good evening)\b/)) {
      const greetings = [
        `Hello! I'm the AI assistant for ${portfolioInfo?.name || 'this portfolio'}. How can I help you today?`,
        `Hi there! I'm here to help you learn about ${portfolioInfo?.name || 'our'} work and services. What would you like to know?`,
        `Hey! Welcome to ${portfolioInfo?.name || 'the'} portfolio. I can answer questions about projects, skills, and contact info. How can I assist?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Help patterns with comprehensive assistance
    if (message.match(/\b(help|assist|support|what can you do|capabilities)\b/)) {
      return `I'm an AI assistant specialized in helping you explore ${portfolioInfo?.name || 'this'} portfolio. Here's what I can help with:\n\n💼 **Professional Information:**\n• Work experience and background\n• Skills and technical expertise\n• Education and certifications\n• Notable achievements and projects\n\n🛠️ **Services & Collaboration:**\n• Available services and specializations\n• Project timelines and processes\n• Pricing and availability\n• Team collaboration approach\n\n📞 **Contact & Communication:**\n• Contact information and methods\n• Business hours and response times\n• Location and meeting options\n\n📊 **Technical Details:**\n• Technologies and tools used\n• Development methodologies\n• Project examples and case studies\n\nWhat specific area interests you most?`;
    }
    
    // Contact information with real data
    if (message.match(/\b(contact|email|phone|reach|message|call)\b/)) {
      if (contactInfo) {
        let response = "Here's how you can reach us:\n";
        if (contactInfo.email) response += `📧 Email: ${contactInfo.email}\n`;
        if (contactInfo.phone) response += `📞 Phone: ${contactInfo.phone}\n`;
        if (contactInfo.whatsapp) response += `💬 WhatsApp: ${contactInfo.whatsapp}\n`;
        if (contactInfo.location) response += `📍 Location: ${contactInfo.location}\n`;
        if (contactInfo.businessHours) response += `🕒 Hours: ${contactInfo.businessHours}`;
        return response;
      }
      return "You can reach out through the contact form on the website. Would you like me to guide you to the contact section?";
    }
    
    // Specific contact queries
    if (message.match(/\b(mobile|phone number|telephone)\b/)) {
      return contactInfo?.phone ? `📞 Phone: ${contactInfo.phone}` : "Phone number not available. Please check the contact section.";
    }
    
    if (message.match(/\b(email|mail)\b/)) {
      return contactInfo?.email ? `📧 Email: ${contactInfo.email}` : "Email not available. Please check the contact section.";
    }
    
    if (message.match(/\b(whatsapp|whats app)\b/)) {
      return contactInfo?.whatsapp ? `💬 WhatsApp: ${contactInfo.whatsapp}` : "WhatsApp not available. Please check the contact section.";
    }
    
    if (message.match(/\b(location|address|where)\b/)) {
      return contactInfo?.location ? `📍 Location: ${contactInfo.location}` : "Location not available. Please check the contact section.";
    }
    
    if (message.match(/\b(hours|time|open|available)\b/)) {
      return contactInfo?.businessHours ? `🕒 Business Hours: ${contactInfo.businessHours}` : "Business hours not available. Please check the contact section.";
    }
    
    // Project and portfolio queries
    if (message.match(/\b(projects?|portfolio|work examples|showcase|case studies?)\b/)) {
      if (portfolioInfo?.projects && portfolioInfo.projects.length > 0) {
        let response = `📊 **Featured Projects**\n\n`;
        portfolioInfo.projects.slice(0, 3).forEach((project, index) => {
          response += `**${index + 1}. ${project.title || project.name}**\n`;
          if (project.description) response += `${project.description}\n`;
          if (project.technologies) response += `Technologies: ${project.technologies.join(', ')}\n`;
          response += '\n';
        });
        response += "Would you like to see more projects or learn about the development process for any of these?";
        return response;
      }
      return "The portfolio includes various web applications, interactive experiences, and technical solutions. Would you like to know about specific types of projects or technologies used?";
    }
    
    // Achievements and recognition
    if (message.match(/\b(achievements?|awards?|recognition|accomplishments?)\b/)) {
      if (portfolioInfo?.achievements && portfolioInfo.achievements.length > 0) {
        let response = `🏆 **Achievements & Recognition**\n\n`;
        portfolioInfo.achievements.forEach((achievement, index) => {
          response += `• ${achievement.title || achievement}\n`;
          if (achievement.description) response += `  ${achievement.description}\n`;
        });
        response += "\nThese achievements reflect the commitment to quality and innovation in every project.";
        return response;
      }
      return "The portfolio demonstrates consistent delivery of high-quality projects and satisfied clients. Would you like to know about specific project outcomes or client feedback?";
    }
    
    // Pricing and cost queries
    if (message.match(/\b(price|cost|pricing|budget|rates?|fees?)\b/)) {
      return `💰 **Pricing Information**\n\nProject costs vary based on several factors:\n• Project scope and complexity\n• Timeline requirements\n• Technology stack needed\n• Ongoing support needs\n\nI'd be happy to provide a detailed quote after discussing your specific requirements. Would you like to share some details about your project, or shall I connect you with ${portfolioInfo?.name || 'the team'} for a consultation?`;
    }
    
    // Timeline and delivery queries
    if (message.match(/\b(timeline|delivery|how long|duration|when|deadline)\b/)) {
      return `⏱️ **Project Timelines**\n\nTypical project timelines:\n• Simple websites: 2-4 weeks\n• Complex web applications: 6-12 weeks\n• E-commerce solutions: 4-8 weeks\n• Custom development: Varies by scope\n\nFactors affecting timeline:\n• Project complexity and features\n• Design requirements\n• Content and asset preparation\n• Feedback and revision cycles\n\nWould you like to discuss timeline for a specific type of project?`;
    }
    
    // Process and methodology
    if (message.match(/\b(process|methodology|how do you work|approach|workflow)\b/)) {
      return `🔄 **Development Process**\n\n**1. Discovery & Planning**\n• Requirements gathering\n• Technical analysis\n• Project roadmap creation\n\n**2. Design & Prototyping**\n• UI/UX design\n• Interactive prototypes\n• Client feedback integration\n\n**3. Development**\n• Agile development approach\n• Regular progress updates\n• Quality assurance testing\n\n**4. Launch & Support**\n• Deployment and optimization\n• Training and documentation\n• Ongoing maintenance options\n\nThis ensures transparent communication and high-quality results throughout the project.`;
    }
    
    // Portfolio information with follow-up questions
    if (message.match(/\b(portfolio|work|projects|showcase|examples?)\b/)) {
      return "The portfolio showcases various projects including web applications, 3D visualizations, and interactive experiences. Would you like to see featured projects or learn about a specific technology used?";
    }
    
    // Comprehensive services information
    if (message.match(/\b(services?|offers?|provide|capabilities|what do you do|work)\b/)) {
      if (portfolioInfo?.services && portfolioInfo.services.length > 0) {
        let response = `💼 **Services & Offerings**\n\n`;
        
        portfolioInfo.services.forEach((service, index) => {
          response += `**${index + 1}. ${service.title || service.name}**\n`;
          if (service.description) response += `${service.description}\n`;
          if (service.features && service.features.length > 0) {
            response += 'Key features:\n';
            service.features.forEach(feature => response += `  • ${feature}\n`);
          }
          response += '\n';
        });
        
        response += `**Team Size:** ${portfolioInfo.teamSize > 1 ? `${portfolioInfo.teamSize} professionals` : 'Solo developer with network support'}\n`;
        response += `**Response Time:** ${portfolioInfo.responseTime}\n`;
        response += `**Current Status:** ${portfolioInfo.availability}\n\n`;
        
        response += "Would you like detailed information about any specific service, pricing, or project timelines?";
        return response;
      }
      return "Services include comprehensive web development, design, and technical consulting. Would you like to know more about specific offerings?";
    }
    
    // Handle requests for detailed project specifications
    if (message.match(/\b(custom requirements|specific needs|unique features|complex functionality|advanced features)\b/)) {
      return `I understand you're looking for information about custom or advanced features! While I can share general capabilities, for discussing specific requirements, custom solutions, or complex functionality tailored to your needs, ${getContactRohitMessage()}`;
    }
    
    // Comprehensive about/background information
    if (message.match(/\b(about|who|background|experience|education|biography|bio)\b/)) {
      if (portfolioInfo) {
        let response = `👨‍💻 **About ${portfolioInfo.name}**\n\n`;
        
        if (portfolioInfo.title) response += `**Role:** ${portfolioInfo.title}\n`;
        if (portfolioInfo.tagline) response += `**Tagline:** ${portfolioInfo.tagline}\n\n`;
        
        if (portfolioInfo.description) response += `**Background:**\n${portfolioInfo.description}\n\n`;
        
        if (portfolioInfo.experience) response += `**Experience:** ${portfolioInfo.experience}\n\n`;
        
        if (portfolioInfo.education && portfolioInfo.education.length > 0) {
          response += `**Education:**\n`;
          portfolioInfo.education.forEach(edu => response += `• ${edu}\n`);
          response += '\n';
        }
        
        if (portfolioInfo.certifications && portfolioInfo.certifications.length > 0) {
          response += `**Certifications:**\n`;
          portfolioInfo.certifications.forEach(cert => response += `• ${cert}\n`);
          response += '\n';
        }
        
        response += `**Working Style:** ${portfolioInfo.workingStyle || 'Collaborative and client-focused'}\n`;
        response += `**Availability:** ${portfolioInfo.availability || 'Available for new projects'}\n\n`;
        
        response += "Would you like to know more about specific skills, services, or see some project examples?";
        return response;
      }
      return "This portfolio showcases a skilled professional with expertise in modern web technologies. Would you like to know more about specific areas?";
    }
    
    // Comprehensive skills and technologies
    if (message.match(/\b(skills?|technologies|tech stack|languages?|frameworks?|tools|expertise)\b/)) {
      if (portfolioInfo) {
        let response = `🛠️ **Technical Expertise**\n\n`;
        
        if (portfolioInfo.frontendTech && portfolioInfo.frontendTech.length > 0) {
          response += `**Frontend Technologies:**\n`;
          portfolioInfo.frontendTech.forEach(tech => response += `• ${tech}\n`);
          response += '\n';
        }
        
        if (portfolioInfo.backendTech && portfolioInfo.backendTech.length > 0) {
          response += `**Backend Technologies:**\n`;
          portfolioInfo.backendTech.forEach(tech => response += `• ${tech}\n`);
          response += '\n';
        }
        
        if (portfolioInfo.tools && portfolioInfo.tools.length > 0) {
          response += `**Development Tools:**\n`;
          portfolioInfo.tools.forEach(tool => response += `• ${tool}\n`);
          response += '\n';
        }
        
        if (portfolioInfo.skills && portfolioInfo.skills.length > 0) {
          response += `**Core Skills:**\n`;
          portfolioInfo.skills.forEach(skill => response += `• ${skill}\n`);
          response += '\n';
        }
        
        if (portfolioInfo.specializations && portfolioInfo.specializations.length > 0) {
          response += `**Specializations:**\n`;
          portfolioInfo.specializations.forEach(spec => response += `• ${spec}\n`);
          response += '\n';
        }
        
        response += "Would you like to know more about experience with any specific technology or see projects that use these skills?";
        return response;
      }
      return "Technical expertise includes modern web technologies, frameworks, and development tools. Would you like specific details about any technology area?";
    }
    
    // Handle requests for very specific technical details
    if (message.match(/\b(architecture|implementation|code structure|database design|deployment|infrastructure|security|performance optimization)\b/)) {
      return `That's a great technical question! While I can provide general information about the technologies and approaches used, for detailed technical discussions about architecture, implementation specifics, or in-depth technical decisions, ${getContactRohitMessage()}`;
    }
    
    // Enhanced follow-up context handling
    if (hasContext && lastBotMessage) {
      // Handle yes/no responses to previous questions
      if (message.match(/\b(yes|yeah|sure|okay|ok|yep|absolutely|definitely)\b/)) {
        if (lastBotMessage.includes("guide you to the contact section")) {
          return "Perfect! You can find the contact section by scrolling to the bottom of the page or clicking 'Contact' in the navigation menu. There you'll find a contact form and all the direct contact details including email, phone, and WhatsApp.";
        } else if (lastBotMessage.includes("project examples") || lastBotMessage.includes("case studies")) {
          return "Excellent! The portfolio showcases diverse projects including interactive web applications, e-commerce platforms, and custom business solutions. Each project highlights different technical approaches and problem-solving methodologies. Would you like details about any specific project or technology used?";
        } else if (lastBotMessage.includes("detailed information about any specific service")) {
          return "Great! Which service interests you most? I can provide detailed information about web development, UI/UX design, technical consulting, or any other service. Just let me know what you'd like to focus on.";
        } else if (lastBotMessage.includes("consultation")) {
          return `Perfect! I'll connect you with ${portfolioInfo?.name || 'the team'} for a detailed consultation. You can reach out via:\n\n${contactInfo?.email ? `📧 Email: ${contactInfo.email}\n` : ''}
${contactInfo?.phone ? `📞 Phone: ${contactInfo.phone}\n` : ''}
${contactInfo?.whatsapp ? `💬 WhatsApp: ${contactInfo.whatsapp}\n` : ''}\nResponse time: ${portfolioInfo?.responseTime || '24 hours'}`;
        }
      } else if (message.match(/\b(no|nope|not now|later|maybe later)\b/)) {
        const responses = [
          "No worries at all! Feel free to explore the portfolio and reach out whenever you're ready.",
          "That's perfectly fine! I'm here whenever you need information about the portfolio or services.",
          "No problem! Take your time exploring, and don't hesitate to ask if you have any questions."
        ];
        return responses[Math.floor(Math.random() * responses.length)] + " Is there anything else I can help you with right now?";
      }
      
      // Handle specific follow-up requests
      if (message.match(/\b(more details?|tell me more|elaborate|explain|deep dive|comprehensive|thorough)\b/)) {
        if (lastBotMessage.includes("Technical Expertise")) {
          return "I'd be happy to elaborate on the technical skills! Which specific area interests you most? Frontend development, backend systems, databases, deployment, or perhaps experience with specific frameworks like React, Node.js, or others?";
        } else if (lastBotMessage.includes("Services")) {
          return "Certainly! Which service would you like me to explain in detail? I can cover the complete process, deliverables, timelines, and what makes each service unique.";
        } else if (isDetailedQuery(message)) {
          return `I can see you're looking for comprehensive details! While I provide good general information, for in-depth discussions and detailed explanations tailored to your specific interests, ${getContactRohitMessage()}`;
        }
      }
    }
    
    // Gratitude handling with personality
    if (message.match(/\b(thank|thanks|appreciate|grateful|awesome|great|perfect|excellent)\b/)) {
      const responses = [
        "You're very welcome! I'm glad I could help. Feel free to ask if you need anything else about the portfolio or services.",
        "My pleasure! I'm here to help make your experience as informative as possible. What else would you like to know?",
        "Happy to assist! Don't hesitate to reach out if you have more questions about the work, services, or anything else."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Farewell with personalized invitation
    if (message.match(/\b(bye|goodbye|see you|farewell|exit|quit|talk later)\b/)) {
      const farewells = [
        `Goodbye! It was great chatting with you about ${portfolioInfo?.name || 'the'} portfolio. Feel free to return anytime with questions!`,
        "Thanks for your interest! Don't hesitate to reach out when you're ready to discuss your project or have more questions.",
        "Take care! I'm always here to help with information about services, projects, or anything else you'd like to know."
      ];
      return farewells[Math.floor(Math.random() * farewells.length)] + " Have a wonderful day! 😊";
    }
    
    // Enhanced fallback with comprehensive suggestions
    const suggestions = [
      "I'd be happy to help! Here are some things you can ask me about:",
      "I'm here to help with information about the portfolio. You can ask about:",
      "Let me help you find what you're looking for. I can provide information on:"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    return `${randomSuggestion}\n\n📼 **Professional Info:**\n• Background and experience\n• Skills and technologies\n• Education and certifications\n\n📊 **Work & Projects:**\n• Portfolio projects and case studies\n• Services and specializations\n• Achievements and recognition\n\n🛠️ **Collaboration:**\n• Development process and methodology\n• Pricing and project timelines\n• Team size and working style\n\n📞 **Contact & Availability:**\n• Contact information and methods\n• Business hours and response times\n• Current availability for projects\n\n💡 **Need More Details?**\nFor comprehensive information or specific technical discussions, ${getContactRohitMessage()}\n\nFeel free to ask about any of these topics, or try rephrasing your question!`;
  };

  // Toggle the chatbot open/closed state
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  // Reset the chat to initial state
  const resetChat = () => {
    // Clear backend history
    chatbotService.clearChatHistory(userId)
      .catch(err => console.error("Failed to clear chat history:", err.message || 'Unknown error'));
    
    const welcomeMessage: Message = {
      id: generateId(),
      content: "Hi I am bot👋 How can I help you today?",
      type: 'bot',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    // Save the welcome message
    chatbotService.saveChatHistory(userId, [welcomeMessage])
      .catch(err => console.error("Failed to save chat history:", err.message || 'Unknown error'));
  };

  // Provide the context value
  const value = {
    messages,
    isOpen,
    isLoading,
    addMessage,
    toggleChatbot,
    resetChat,
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};

// Custom hook to use the chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};