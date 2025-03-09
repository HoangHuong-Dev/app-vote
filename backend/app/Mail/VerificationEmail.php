<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $verificationCode;

    public function __construct($name, $verificationCode)
    {
        $this->name = $name;
        $this->verificationCode = $verificationCode;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Email Verification',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
} 