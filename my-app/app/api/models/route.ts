import { NextResponse } from 'next/server';

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

    const data = await response.json();
    
    const freeModels = data.data
      .filter((model: any) => 
        model.pricing?.prompt === '0' || 
        model.pricing?.prompt === 0 ||
        model.id.includes(':free')
      )
      .map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
        context_length: model.context_length || 0,
        description: model.description || 'No description available',
      }))
      .sort((a: any, b: any) => b.context_length - a.context_length);

    return NextResponse.json({ models: freeModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
