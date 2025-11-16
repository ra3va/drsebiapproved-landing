import { NextRequest, NextResponse } from 'next/server'

// Square discount IDs
const SQUARE_DISCOUNTS: Record<string, string> = {
  'TEST99': 'PAAUNOPINBLM2RDQFOEQAJNJ'  // 99% off for testing ($89.99 → $0.90)
  // 'WELCOME15': 'DISCOUNT_ID_HERE', // 15% off - Create in Square when ready
  // 'PARACLEAN20': 'DISCOUNT_ID_HERE', // 20% off - Create in Square when ready
  // 'SAVE10': 'DISCOUNT_ID_HERE', // $10 off - Create in Square when ready
}

export async function POST(request: NextRequest) {
  try {
    const { code, price } = await request.json()
    const discountId = SQUARE_DISCOUNTS[code.toUpperCase()]

    if (!discountId) {
      return NextResponse.json({ valid: false })
    }

    // Get discount details from Square
    const response = await fetch(`https://connect.squareup.com/v2/catalog/object/${discountId}`, {
      headers: {
        'Square-Version': '2025-10-16',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!data.object) {
      return NextResponse.json({ valid: false })
    }

    const discountData = data.object.discount_data
    let discountAmount = 0

    if (discountData.discount_type === 'FIXED_PERCENTAGE') {
      // Calculate percentage discount
      const percentage = parseFloat(discountData.percentage)
      discountAmount = Math.round((price * percentage) / 100)
    } else if (discountData.discount_type === 'FIXED_AMOUNT') {
      // Fixed amount discount
      discountAmount = discountData.amount_money.amount
    }

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      discountId: discountId,
      name: discountData.name
    })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}
