import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      quizAnswers,
      totalScore,
      severityLevel,
      recommendedProduct,
      primaryProblem
    } = await req.json();

    // Validate required fields
    if (!email || !recommendedProduct) {
      return NextResponse.json(
        { error: 'Email and recommended product are required' },
        { status: 400 }
      );
    }

    // Product to list mapping
    const productLists: Record<string, string> = {
      'paracleanse': 'ParaCleanse Prospects',
      'maya': 'Maya Prospects',
      'seamoss': 'Sea Moss Prospects',
      'mucus-cleanser': 'Mucus Cleanser Prospects'
    };

    const listName = productLists[recommendedProduct] || 'Health Quiz Takers';

    // Find or create the list
    console.log(`Finding or creating list: ${listName}`);
    const list = await brevoClient.findOrCreateList(listName);
    console.log(`List ready: ${list.name} (ID: ${list.id})`);

    // Add contact to Brevo with quiz data
    await brevoClient.addContact({
      email,
      attributes: {
        FIRSTNAME: firstName || '',
        SOURCE: 'health-quiz',
        QUIZ_SCORE: totalScore,
        SEVERITY_LEVEL: severityLevel,
        RECOMMENDED_PRODUCT: recommendedProduct,
        PRIMARY_PROBLEM: primaryProblem || '',
        QUIZ_DATE: new Date().toISOString().split('T')[0],
        QUIZ_COMPLETED: true
      },
      listIds: [list.id],
      updateEnabled: true
    });

    console.log(`Quiz results saved for ${email} - Recommended: ${recommendedProduct}`);

    // Your AI agent will trigger product-specific nurture sequences
    // based on which list they joined

    return NextResponse.json({
      success: true,
      recommendedProduct,
      severityLevel,
      message: 'Quiz results saved and automation triggered'
    });

  } catch (error: any) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save quiz results',
        message: error.message
      },
      { status: 500 }
    );
  }
}
