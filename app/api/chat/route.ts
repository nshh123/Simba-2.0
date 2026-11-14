import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import productsData from '@/data/simba_products.json';
import { getAvailableGroqModel } from '@/lib/groq';

export async function POST(req: Request) {
  let activeModel = 'openai/gpt-oss-120b';
  let activeModelsList: string[] = [];

  try {
    const { message } = await req.json();

    const currentApiKey = process.env.GROQ_API_KEY;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!currentApiKey) {
      // Mock response if API key is missing
      console.warn('GROQ_API_KEY is missing. Returning mock response.');
      return NextResponse.json({
        response: "I'm sorry, I'm currently in demo mode and cannot connect to Groq. Please configure the GROQ_API_KEY in your .env.local and restart your server.",
        matchedProductIds: []
      });
    }

    const groq = new Groq({ apiKey: currentApiKey.trim() });
    const { model, availableModels } = await getAvailableGroqModel(groq);
    activeModel = model;
    activeModelsList = availableModels;

    const systemPrompt = `
      You are a helpful assistant for Simba Supermarket.
      Your task is to help users find products from our catalog.
      
      Our product catalog:
      ${JSON.stringify(productsData.products.map(p => ({ id: p.id, name: p.name, description: p.description, price: p.price, category: p.category })), null, 2)}
      
      Rules:
      1. If a user asks for a product we have (e.g., "fresh milk"), recommend it and provide its details.
      2. If a user expresses a need (e.g., "something for breakfast"), suggest relevant items from the catalog.
      3. If we don't have exactly what they want, suggest the closest alternatives.
      4. Keep your response natural, short, and friendly.
      5. ALWAYS return a JSON response with the following structure:
         {
           "response": "Your natural language message here",
           "matchedProductIds": ["prod-001", "prod-002"] // List of IDs of products mentioned or relevant
         }
    `;

    const completionOptions: any = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: activeModel,
      response_format: { type: 'json_object' },
    };

    if (activeModel.startsWith('openai/gpt-oss')) {
      completionOptions.reasoning_format = 'hidden';
    }

    const chatCompletion = await groq.chat.completions.create(completionOptions);

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq');
    }

    try {
      const parsedContent = JSON.parse(content);
      const matchedProducts = (parsedContent.matchedProductIds || []).map((id: string) => 
        productsData.products.find(p => p.id === id)
      ).filter(Boolean);

      return NextResponse.json({
        response: parsedContent.response || "Here is what I found:",
        matchedProducts
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', content);
      throw new Error('AI returned an invalid response format.');
    }
  } catch (error: any) {
    console.error('Groq API Error Details:', error);
    
    let userFriendlyMessage = "I'm having trouble thinking right now. Please try again in a moment.";
    const rawError = error?.error?.message || error?.message;

    if (error?.error?.message) {
      userFriendlyMessage = `I'm having trouble: ${error.error.message}`;
    } else if (typeof rawError === 'string') {
      const jsonMatch = rawError.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed?.error?.message) {
            userFriendlyMessage = `I'm having trouble: ${parsed.error.message}`;
          }
        } catch {
          userFriendlyMessage = `I'm having trouble: ${rawError}`;
        }
      } else {
        userFriendlyMessage = `I'm having trouble: ${rawError}`;
      }
    }

    if (
      typeof rawError === 'string' &&
      (rawError.includes('does not exist') || rawError.includes('not have access') || rawError.includes('model_not_found'))
    ) {
      const modelsListStr = activeModelsList.length > 0 ? activeModelsList.join(', ') : 'None listed';
      userFriendlyMessage = `Model '${activeModel}' is not accessible on your Groq project. Available models for this key: [${modelsListStr}]. You can check your Groq Playground or set GROQ_MODEL in .env.local.`;
    }
    
    return NextResponse.json({ 
      response: userFriendlyMessage,
      matchedProducts: [],
      error: rawError || 'Unknown error'
    }, { status: 500 });
  }
}
