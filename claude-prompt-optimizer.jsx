import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Copy, Download, Loader2, Zap, History, Star, Settings, Code, FileText, Brain, Search, MessageSquare, Mail, Sparkles, ChevronDown, Keyboard, Save, AlertCircle, CheckCircle } from 'lucide-react';

// Enhanced templates based on Anthropic's best practices
const FORMATTER_TEMPLATES = {
  'general': {
    name: 'General',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
    variables: ['task_objective', 'audience', 'context', 'success_criteria'],
    systemPrompt: `You are an expert prompt engineer specializing in Anthropic's Claude best practices. Transform the user's input into a clear, direct, and effective prompt following these guidelines:

<task_context>
This is for a general-purpose prompt that should be clear, contextual, and specific according to Anthropic's documentation.
</task_context>

<guidelines>
1. BE CLEAR AND DIRECT
   - Think of Claude as a brilliant but new employee who needs explicit instructions
   - Provide contextual information about what the task results will be used for
   - Be specific about what you want Claude to do
   - Use sequential steps with numbered lists or bullet points

2. STRUCTURE WITH XML TAGS
   - Use XML tags to clearly separate different parts of the prompt
   - Nest tags hierarchically for complex content
   - Be consistent with tag names throughout

3. PROVIDE CONTEXT
   - Explain the purpose and end goal
   - Describe the target audience
   - Include relevant background information
   - Define success criteria explicitly

4. USE BEST PRACTICES
   - Tell Claude what to do instead of what not to do
   - Match prompt style to desired output
   - Include relevant examples when helpful
</guidelines>

<variables>
- Task objective: {{task_objective}}
- Target audience: {{audience}}
- Context: {{context}}
- Success criteria: {{success_criteria}}
</variables>

Transform the following rough prompt into a professional, optimized prompt for Claude:`
  },
  'coding': {
    name: 'Coding',
    icon: <Code className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
    variables: ['language', 'framework', 'complexity_level', 'code_style'],
    systemPrompt: `You are an expert prompt engineer specializing in coding prompts for Claude. Transform the user's input into an optimal coding prompt following Anthropic's best practices:

<task_context>
Create a coding prompt that leverages Claude's technical capabilities while avoiding common pitfalls.
</task_context>

<guidelines>
1. STRUCTURE FOR CLARITY
   - Use clear XML tags to separate requirements, constraints, and examples
   - Provide explicit instructions about output format
   - Include edge cases and error handling requirements

2. CODING BEST PRACTICES (Claude 4)
   - Be explicit about desired behavior and coding patterns
   - Request specific features explicitly (no implicit assumptions)
   - Avoid focusing on passing tests - emphasize robust, generalizable solutions
   - For frontend code: Request animations and interactions explicitly

3. PROVIDE TECHNICAL CONTEXT
   - Specify the programming language and version
   - List required frameworks or libraries
   - Define coding style preferences
   - Include performance or optimization requirements

4. USE EXAMPLES EFFECTIVELY
   - Provide input/output examples when relevant
   - Show edge cases and expected behavior
   - Include code snippets for style reference
</guidelines>

<variables>
- Programming language: {{language}}
- Framework/libraries: {{framework}}
- Complexity level: {{complexity_level}}
- Code style preferences: {{code_style}}
</variables>

Transform the following coding request into an optimized prompt:`
  },
  'extended_thinking': {
    name: 'Extended Thinking',
    icon: <Brain className="w-4 h-4" />,
    color: 'from-purple-500 to-indigo-500',
    variables: ['problem_complexity', 'thinking_approach', 'domain', 'constraints'],
    systemPrompt: `You are an expert prompt engineer specializing in extended thinking prompts for Claude. Create prompts that maximize Claude's deep reasoning capabilities:

<task_context>
Design prompts for complex problems requiring step-by-step analysis and deep reasoning.
</task_context>

<guidelines>
1. EXTENDED THINKING BEST PRACTICES
   - Use general instructions first, avoid overly prescriptive steps
   - Allow Claude's creativity in approaching problems
   - Start with high-level guidance, then iterate if needed
   - Extended thinking performs best in English

2. STRUCTURE FOR THINKING
   - Use <thinking> tags to encourage structured reasoning
   - Request Claude to break down complex problems
   - Ask for reasoning before conclusions
   - Include reflection points for self-correction

3. OPTIMIZE FOR DEPTH
   - Frame problems that benefit from careful analysis
   - Include multiple constraints or considerations
   - Request evaluation of trade-offs
   - Ask for alternative approaches

4. INSTRUCTION FOLLOWING
   - Be clear about desired reasoning depth
   - Specify if you want to see the thinking process
   - Define what constitutes a complete analysis
</guidelines>

<variables>
- Problem complexity: {{problem_complexity}}
- Preferred thinking approach: {{thinking_approach}}
- Domain/field: {{domain}}
- Constraints: {{constraints}}
</variables>

Transform the following into an extended thinking prompt:`
  },
  'deep_research': {
    name: 'Deep Research',
    icon: <Search className="w-4 h-4" />,
    color: 'from-orange-500 to-red-500',
    variables: ['research_topic', 'sources_needed', 'depth_level', 'output_format'],
    systemPrompt: `You are an expert prompt engineer specializing in research prompts. Create prompts that guide Claude to conduct thorough, well-structured research:

<task_context>
Design prompts for comprehensive research tasks requiring analysis and synthesis of information.
</task_context>

<guidelines>
1. RESEARCH PROMPT STRUCTURE
   - Define clear research objectives and scope
   - Specify required depth and breadth
   - Request structured output with clear sections
   - Include citation and source requirements

2. LEVERAGE LONG CONTEXT
   - Place reference materials at the top of prompts
   - Use XML tags to structure multiple documents
   - Request quotes from sources before analysis
   - Ground responses in provided materials

3. ANALYSIS REQUIREMENTS
   - Ask for synthesis across multiple sources
   - Request identification of patterns or themes
   - Include critical evaluation criteria
   - Specify comparison frameworks

4. OUTPUT ORGANIZATION
   - Define section structure clearly
   - Request executive summaries for long content
   - Specify formatting for citations
   - Include visual organization (headers, bullets)
</guidelines>

<variables>
- Research topic: {{research_topic}}
- Sources needed: {{sources_needed}}
- Depth level: {{depth_level}}
- Output format: {{output_format}}
</variables>

Transform the following into a deep research prompt:`
  },
  'analysis': {
    name: 'Analysis',
    icon: <FileText className="w-4 h-4" />,
    color: 'from-indigo-500 to-purple-500',
    variables: ['data_type', 'analysis_framework', 'key_metrics', 'actionable_insights'],
    systemPrompt: `You are an expert prompt engineer specializing in analytical prompts. Create prompts that guide Claude to perform thorough, insightful analysis:

<task_context>
Design prompts for data analysis, evaluation, and insight generation tasks.
</task_context>

<guidelines>
1. ANALYTICAL STRUCTURE
   - Define the analysis framework clearly
   - Specify key metrics or evaluation criteria
   - Request both quantitative and qualitative insights
   - Include visualization or presentation requirements

2. CHAIN OF THOUGHT FOR ANALYSIS
   - Ask Claude to think step-by-step through data
   - Request identification of patterns first
   - Then ask for interpretation and implications
   - Include confidence levels or limitations

3. ACTIONABLE OUTPUT
   - Request specific recommendations
   - Ask for prioritized action items
   - Include implementation considerations
   - Specify decision-making criteria

4. USE XML TAGS EFFECTIVELY
   - Separate data, analysis, and conclusions
   - Tag different analytical perspectives
   - Structure findings hierarchically
</guidelines>

<variables>
- Type of data: {{data_type}}
- Analysis framework: {{analysis_framework}}
- Key metrics: {{key_metrics}}
- Need for actionable insights: {{actionable_insights}}
</variables>

Transform the following into an analytical prompt:`
  },
  'email_draft': {
    name: 'Email Draft',
    icon: <Mail className="w-4 h-4" />,
    color: 'from-teal-500 to-cyan-500',
    variables: ['recipient', 'purpose', 'tone', 'key_points'],
    systemPrompt: `You are an expert prompt engineer specializing in email communication prompts. Create prompts that help Claude draft effective, professional emails:

<task_context>
Design prompts for email drafting that result in clear, purposeful, and appropriately toned messages.
</task_context>

<guidelines>
1. EMAIL CONTEXT
   - Specify the recipient and their relationship
   - Define the email's primary purpose
   - Include relevant background or history
   - Clarify desired outcomes

2. TONE AND STYLE
   - Be explicit about formality level
   - Specify emotional tone (friendly, urgent, diplomatic)
   - Include cultural or organizational considerations
   - Match style to recipient expectations

3. STRUCTURE AND CLARITY
   - Request clear subject lines
   - Define key points to cover
   - Specify desired email length
   - Include call-to-action requirements

4. PROFESSIONAL ELEMENTS
   - Include appropriate greetings/closings
   - Request relevant attachments mentions
   - Specify follow-up expectations
   - Consider timing and urgency
</guidelines>

<variables>
- Recipient: {{recipient}}
- Purpose: {{purpose}}
- Tone: {{tone}}
- Key points: {{key_points}}
</variables>

Transform the following into an email drafting prompt:`
  }
};

const OUTPUT_FORMATS = [
  { key: 'structured', name: 'Structured Prompt', icon: '🎯' },
  { key: 'xml', name: 'XML Tagged', icon: '🏷️' },
  { key: 'markdown', name: 'Markdown', icon: '📝' },
  { key: 'step_by_step', name: 'Step-by-Step', icon: '📋' }
];

// Particle background component
const ParticleBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode 
          ? `rgba(139, 92, 246, ${particle.opacity})` 
          : `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [darkMode]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Morphing shape component
const MorphingShape = ({ darkMode, className = '' }) => {
  return (
    <div className={`absolute ${className} pointer-events-none`}>
      <div className={`w-96 h-96 ${darkMode 
        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
        : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
      } rounded-full blur-3xl animate-pulse`} />
    </div>
  );
};

const ClaudePromptOptimizer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('general');
  const [userInput, setUserInput] = useState('');
  const [variables, setVariables] = useState({});
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('structured');
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);

  // Load saved data on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('claudeOptimizer_darkMode');
    const savedHistory = localStorage.getItem('claudeOptimizer_history');
    const savedFavorites = localStorage.getItem('claudeOptimizer_favorites');
    const savedShowTips = localStorage.getItem('claudeOptimizer_showTips');
    
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedShowTips !== null) setShowTips(JSON.parse(savedShowTips));
  }, []);

  // Save data when changed
  useEffect(() => {
    localStorage.setItem('claudeOptimizer_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('claudeOptimizer_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('claudeOptimizer_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('claudeOptimizer_showTips', JSON.stringify(showTips));
  }, [showTips]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (userInput.trim()) {
          optimizePrompt();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [userInput, selectedTemplate, variables, outputFormat]);

  const template = FORMATTER_TEMPLATES[selectedTemplate];

  const interpolateVariables = (prompt) => {
    let result = prompt;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    return result;
  };

  const formatOutput = (optimized) => {
    // Apply output format transformations
    switch (outputFormat) {
      case 'xml':
        return `<prompt>
  <context>
    ${variables.context || '[Add context here]'}
  </context>
  
  <instructions>
    ${optimized}
  </instructions>
  
  <output_requirements>
    ${variables.success_criteria || '[Define success criteria]'}
  </output_requirements>
</prompt>`;
      
      case 'step_by_step':
        // Extract main points and format as steps
        const lines = optimized.split('\n').filter(line => line.trim());
        const steps = lines.map((line, index) => `${index + 1}. ${line.trim()}`);
        return `Follow these steps carefully:

${steps.join('\n\n')}

Begin with step 1 and proceed sequentially.`;
      
      case 'markdown':
        return `# Prompt

## Context
${variables.context || '*Add context here*'}

## Task
${optimized}

## Success Criteria
${variables.success_criteria || '*Define success criteria*'}`;
      
      default:
        return optimized;
    }
  };

  const optimizePrompt = async () => {
    if (!userInput.trim()) return;
    
    setIsOptimizing(true);
    
    const fullPrompt = interpolateVariables(template.systemPrompt) + '\n\n' + userInput;
    
    try {
      const optimized = await window.claude.complete(fullPrompt);
      const formatted = formatOutput(optimized);
      setOptimizedPrompt(formatted);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        template: selectedTemplate,
        input: userInput,
        output: formatted,
        timestamp: new Date().toISOString(),
        variables: { ...variables }
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20
      
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      setOptimizedPrompt('Error optimizing prompt. Please try again.');
    }
    
    setIsOptimizing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadOutput = () => {
    const element = document.createElement('a');
    const file = new Blob([optimizedPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `optimized-prompt-${selectedTemplate}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addToFavorites = () => {
    const favorite = {
      id: Date.now(),
      template: selectedTemplate,
      input: userInput,
      output: optimizedPrompt,
      variables: { ...variables }
    };
    setFavorites(prev => [favorite, ...prev]);
  };

  const loadFromHistory = (item) => {
    setSelectedTemplate(item.template);
    setUserInput(item.input);
    setVariables(item.variables);
    setOptimizedPrompt(item.output);
    setShowHistory(false);
  };

  // Best practices tips based on template
  const getBestPracticeTips = () => {
    switch (selectedTemplate) {
      case 'general':
        return [
          'Be clear and direct - think of Claude as a brilliant new employee',
          'Use XML tags to structure complex prompts',
          'Provide context about what the results will be used for',
          'Define success criteria explicitly'
        ];
      case 'coding':
        return [
          'Be explicit about desired behavior and patterns',
          'Request specific features (animations, error handling)',
          'Avoid focusing on tests - emphasize robust solutions',
          'Include edge cases and performance requirements'
        ];
      case 'extended_thinking':
        return [
          'Use general instructions first, then iterate',
          'Allow Claude\'s creativity in problem-solving',
          'Frame problems that benefit from deep analysis',
          'Include multiple constraints for richer thinking'
        ];
      case 'deep_research':
        return [
          'Place reference materials at the top of prompts',
          'Request quotes from sources before analysis',
          'Define clear research objectives and scope',
          'Specify output structure with sections'
        ];
      case 'analysis':
        return [
          'Define analysis framework clearly',
          'Request both quantitative and qualitative insights',
          'Ask for step-by-step thinking through data',
          'Include confidence levels and limitations'
        ];
      case 'email_draft':
        return [
          'Specify recipient relationship and context',
          'Be explicit about formality and tone',
          'Include key points to cover',
          'Define desired outcomes and call-to-action'
        ];
      default:
        return [];
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    } relative overflow-hidden`}>
      
      <ParticleBackground darkMode={darkMode} />
      
      {/* Morphing background shapes */}
      <MorphingShape darkMode={darkMode} className="top-10 left-10" />
      <MorphingShape darkMode={darkMode} className="bottom-10 right-10" />
      <MorphingShape darkMode={darkMode} className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex h-screen">
        {/* Left Panel - Input */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {/* Header */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 mb-6 border ${darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/40 border-white/50'
          } shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  Claude Prompt Optimizer
                </h1>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Transform your ideas into expert-level prompts using Anthropic's best practices
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-lg transition-all ${darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300' 
                    : 'hover:bg-gray-100/50 text-gray-600'
                  }`}
                >
                  <History className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-all ${darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300' 
                    : 'hover:bg-gray-100/50 text-gray-600'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-all ${darkMode 
                    ? 'hover:bg-gray-700/50 text-yellow-400' 
                    : 'hover:bg-gray-100/50 text-purple-600'
                  }`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Template Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(FORMATTER_TEMPLATES).map(([key, tmpl]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                    selectedTemplate === key
                      ? `bg-gradient-to-r ${tmpl.color} text-white shadow-lg transform scale-105`
                      : darkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300' 
                        : 'bg-white/50 hover:bg-white/70 text-gray-700'
                  }`}
                >
                  {tmpl.icon}
                  {tmpl.name}
                </button>
              ))}
            </div>

            {/* Variables */}
            {template.variables.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {template.variables.map(variable => (
                  <div key={variable}>
                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      {variable.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={variables[variable] || ''}
                      onChange={(e) => setVariables(prev => ({...prev, [variable]: e.target.value}))}
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm ${darkMode 
                        ? 'bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-400' 
                        : 'bg-white/70 border-gray-300/50 text-gray-900 focus:border-purple-500'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Best Practices Tips */}
            {showTips && (
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-blue-50/50'} border ${darkMode ? 'border-gray-600/30' : 'border-blue-200/50'}`}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'} mb-1`}>
                      Best Practices for {template.name}
                    </p>
                    <ul className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                      {getBestPracticeTips().map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowTips(false)}
                    className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 border ${darkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/40 border-white/50'
          } shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <label className={`block text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Prompt or Idea
              </label>
              <div className="flex items-center gap-2 text-xs">
                <Keyboard className="w-3 h-3" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Cmd+Enter to optimize
                </span>
              </div>
            </div>
            
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`w-full h-64 px-4 py-3 rounded-xl resize-none transition-all backdrop-blur-sm ${darkMode 
                ? 'bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400' 
                : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } border focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="Enter your rough prompt or idea here. Be as detailed or as brief as you like - I'll transform it into a professional prompt following Anthropic's best practices..."
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Output format:
                </span>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className={`px-3 py-1 rounded-lg text-sm border transition-all backdrop-blur-sm ${darkMode 
                    ? 'bg-gray-800/60 border-gray-600/50 text-white' 
                    : 'bg-white/80 border-gray-300/50 text-gray-900'
                  }`}
                >
                  {OUTPUT_FORMATS.map(format => (
                    <option key={format.key} value={format.key}>
                      {format.icon} {format.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={optimizePrompt}
                disabled={isOptimizing || !userInput.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isOptimizing || !userInput.trim()
                    ? 'bg-gray-400/50 text-gray-600 cursor-not-allowed'
                    : `bg-gradient-to-r ${template.color} text-white hover:shadow-xl transform hover:scale-105`
                }`}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Optimize Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className={`w-1/2 border-l ${darkMode ? 'border-gray-700/50' : 'border-white/50'} flex flex-col backdrop-blur-xl ${darkMode ? 'bg-gray-900/20' : 'bg-white/20'}`}>
          {/* Output Header */}
          {optimizedPrompt && (
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700/50 bg-gray-800/40' : 'border-white/50 bg-white/40'} backdrop-blur-sm`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Optimized Prompt
                </h3>
                <div className="flex items-center gap-2">
                  {copySuccess && (
                    <span className="flex items-center gap-1 text-green-500 text-sm animate-fade-in">
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </span>
                  )}
                  <button
                    onClick={addToFavorites}
                    className={`p-2 rounded-lg transition-all ${darkMode 
                      ? 'hover:bg-gray-700/50 text-yellow-400' 
                      : 'hover:bg-gray-100/50 text-yellow-600'
                    }`}
                    title="Add to favorites"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(optimizedPrompt)}
                    className={`p-2 rounded-lg transition-all ${darkMode 
                      ? 'hover:bg-gray-700/50 text-blue-400' 
                      : 'hover:bg-gray-100/50 text-blue-600'
                    }`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadOutput}
                    className={`p-2 rounded-lg transition-all ${darkMode 
                      ? 'hover:bg-gray-700/50 text-green-400' 
                      : 'hover:bg-gray-100/50 text-green-600'
                    }`}
                    title="Download prompt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Output Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {optimizedPrompt ? (
              <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                <pre className={`whitespace-pre-wrap text-sm leading-relaxed font-mono ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {optimizedPrompt}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your optimized prompt will appear here
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                    Enter your prompt and click optimize to get started
                  </p>
                  <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'} max-w-md mx-auto`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      This tool uses Anthropic's official best practices to transform your ideas into professional prompts optimized for Claude AI.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className={`fixed right-0 top-0 h-full w-80 backdrop-blur-xl ${darkMode 
          ? 'bg-gray-900/90 border-gray-700/50' 
          : 'bg-white/90 border-white/50'
        } border-l z-50 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {history.map(item => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                    : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    {FORMATTER_TEMPLATES[item.template].icon}
                    {FORMATTER_TEMPLATES[item.template].name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 line-clamp-2`}>
                    {item.input}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ClaudePromptOptimizer;