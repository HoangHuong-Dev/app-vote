<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Club;
use App\Models\Country;
use App\Models\Topic;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Tạo admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'is_admin' => true
        ]);

        // Tạo một số user thường
        User::factory(5)->create();

        // Tạo dữ liệu cho bóng đá
        $england = Country::create([
            'name' => 'England',
            'code' => 'GB',
            'flag' => 'https://flagcdn.com/gb.svg',
            'image' => 'https://example.com/england-topic.jpg'
        ]);

        $spain = Country::create([
            'name' => 'Spain',
            'code' => 'ES',
            'flag' => 'https://flagcdn.com/es.svg',
            'image' => 'https://example.com/spain-topic.jpg'
        ]);

        // Các câu lạc bộ bóng đá
        Club::create([
            'name' => 'Manchester United',
            'country_id' => $england->id,
            'logo' => 'https://resources.premierleague.com/premierleague/badges/t1.svg',
            'description' => 'Câu lạc bộ bóng đá Manchester United',
            'image' => 'https://example.com/manchesterunited.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'Liverpool',
            'country_id' => $england->id,
            'logo' => 'https://resources.premierleague.com/premierleague/badges/t14.svg',
            'description' => 'Câu lạc bộ bóng đá Liverpool',
            'image' => 'https://example.com/liverpool-topic.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'Real Madrid',
            'country_id' => $spain->id,
            'logo' => 'https://assets.laliga.com/squad/2023/t186/p48.png',
            'description' => 'Câu lạc bộ bóng đá Real Madrid',
            'image' => 'https://example.com/realmadrid-topic.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'Barcelona',
            'country_id' => $spain->id,
            'logo' => 'https://assets.laliga.com/squad/2023/t178/p50.png',
            'description' => 'Câu lạc bộ bóng đá Barcelona',
            'image' => 'https://example.com/barcelona-topic.jpg',
            'is_active' => true
        ]);

        // Chủ đề bóng đá
        Topic::create([
            'title' => 'Câu lạc bộ bóng đá được yêu thích nhất Ngoại hạng Anh 2024',
            'description' => 'Bình chọn câu lạc bộ bóng đá được yêu thích nhất tại Ngoại hạng Anh mùa giải 2023-2024',
            'start_date' => now(),
            'end_date' => now()->addDays(30),
            'is_active' => true,
            'image' => 'https://example.com/football-topic.jpg'
        ]);

        // Tạo dữ liệu cho âm nhạc
        $korea = Country::create([
            'name' => 'South Korea',
            'code' => 'KR',
            'flag' => 'https://flagcdn.com/kr.svg',
            'image' => 'https://example.com/korea-topic.jpg'
        ]);

        $usa = Country::create([
            'name' => 'United States',
            'code' => 'US',
            'flag' => 'https://flagcdn.com/us.svg',
            'image' => 'https://example.com/usa-topic.jpg'
        ]);

        // Các nhóm nhạc
        Club::create([
            'name' => 'BTS',
            'country_id' => $korea->id,
            'logo' => 'https://example.com/bts-logo.png',
            'description' => 'Nhóm nhạc nam nổi tiếng của Hàn Quốc',
            'image' => 'https://example.com/bts-topic.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'BLACKPINK',
            'country_id' => $korea->id,
            'logo' => 'https://example.com/blackpink-logo.png',
            'description' => 'Nhóm nhạc nữ nổi tiếng của Hàn Quốc',
            'image' => 'https://example.com/blackpink-topic.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'Maroon 5',
            'country_id' => $usa->id,
            'logo' => 'https://example.com/maroon5-logo.png',
            'description' => 'Ban nhạc pop rock nổi tiếng của Mỹ',
            'image' => 'https://example.com/maroon5-topic.jpg',
            'is_active' => true
        ]);

        Club::create([
            'name' => 'Imagine Dragons',
            'country_id' => $usa->id,
            'logo' => 'https://example.com/imaginedragons-logo.png',
            'description' => 'Ban nhạc rock nổi tiếng của Mỹ',
            'image' => 'https://example.com/imaginedragons-topic.jpg',
            'is_active' => true
        ]);

        // Chủ đề âm nhạc
        Topic::create([
            'title' => 'Nhóm nhạc K-pop được yêu thích nhất 2024',
            'description' => 'Bình chọn nhóm nhạc K-pop được yêu thích nhất năm 2024',
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(31),
            'is_active' => true,
            'image' => 'https://example.com/music-topic.jpg'
        ]);
    }
}
