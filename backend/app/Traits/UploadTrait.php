<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait UploadTrait
{
    public function uploadFile(UploadedFile $file, $folder = 'uploads', $filename = null)
    {
        $name = !is_null($filename) ? $filename : Str::random(25);
        $extension = $file->getClientOriginalExtension();
        
        $filePath = $folder . '/' . $name . '.' . $extension;
        Storage::disk('public')->put($filePath, file_get_contents($file));
        
        return $filePath;
    }

    public function deleteFile($path)
    {
        if($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
} 