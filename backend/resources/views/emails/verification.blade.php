<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }
        .verification-code {
            background-color: #ff3b30;
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            letter-spacing: 5px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello {{ $name }},</h2>
        
        <p>Thank you for registering! To complete your registration, please use the following verification code:</p>
        
        <div class="verification-code">
            {{ $verificationCode }}
        </div>
        
        <p>This code will expire in 60 minutes. If you did not create an account, no further action is required.</p>
        
        <div class="footer">
            <p>This is an automated email, please do not reply.</p>
            <p>&copy; {{ date('Y') }} App Vote. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 