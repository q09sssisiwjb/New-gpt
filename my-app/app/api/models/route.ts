import { NextResponse } from 'next/server';

interface OpenRouterModel {
  id: string;
  name?: string;
  context_length?: number;
  description?: string;
  pricing?: {
    prompt?: string | number;
    completion?: string | number;
  };
}

interface ProcessedModel {
  id: string;
  name: string;
  context_length: number;
  description: string;
}

interface OpenRouterResponse {
  data: OpenRouterModel[];
}

export async function GET() {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    
    const freeModels = data.data
      .filter((model: OpenRouterModel) => 
        model.pricing?.prompt === '0' || 
        model.pricing?.prompt === 0 ||
        model.id.includes(':free')
      )
      .map((model: OpenRouterModel): ProcessedModel => ({
        id: model.id,
        name: model.name || model.id,
        context_length: model.context_length || 0,
        description: model.description || 'No description available',
      }))
      .sort((a: ProcessedModel, b: ProcessedModel) => b.context_length - a.context_length);

    return NextResponse.json({ models: freeModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
