// src/app/api/payments/route.ts
export async function POST(req) {
  try {
    const { provider, amount, phoneNumber, reference } = await req.json();

    // Input validation
    if (!provider || !amount || !phoneNumber || !reference) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    let response;

    // Log the payment initiation
    logger.info(`Initiating payment: ${provider}, Amount: ${amount}, Phone: ${phoneNumber}, Reference: ${reference}`);

    if (provider === 'mpesa') {
      response = await mpesaService.initiateSTKPush({
        amount,
        phoneNumber,
        accountReference: reference,
        transactionDesc: 'Medical App Payment'
      });
    } else {
      response = await airtelService.requestPayment({
        amount,
        phoneNumber,
        reference
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    logger.error(`Payment initiation failed: ${error.message}`);
    return NextResponse.json(
      { error: 'Payment initiation failed', details: error.message },
      { status: 500 }
    );
  }
}

// src/app/api/payments/mpesa/callback/route.ts
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Process M-Pesa callback
  const resultCode = data.Body.stkCallback.ResultCode;
  const merchantRequestId = data.Body.stkCallback.MerchantRequestID;

  if (resultCode === 0) {
    // Payment successful
    // Update payment status in database
  }

  return NextResponse.json({ success: true });
}

// src/app/api/payments/airtel/callback/route.ts
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Process Airtel Money callback
  const status = data.status;
  const transactionId = data.transaction.id;

  if (status === 'SUCCESS') {
    // Payment successful
    // Update payment status in database
  }

  return NextResponse.json({ success: true });
}
