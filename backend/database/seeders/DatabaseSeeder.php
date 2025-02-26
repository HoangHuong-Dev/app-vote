<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Club;
use App\Models\Country;
use App\Models\Topic;
use App\Models\Vote;
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

        // Tạo countries
        $england = Country::create([
            'name' => 'England',
            'code' => 'GB',
            'flag' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png'
        ]);

        $spain = Country::create([
            'name' => 'Spain',
            'code' => 'ES',
            'flag' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png'
        ]);

        $korea = Country::create([
            'name' => 'South Korea',
            'code' => 'KR',
            'flag' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png'
        ]);

        $usa = Country::create([
            'name' => 'United States',
            'code' => 'US',
            'flag' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png'
        ]);

        // Tạo topic bóng đá
        $footballTopic = Topic::create([
            'title' => 'Câu lạc bộ bóng đá được yêu thích nhất 2024',
            'description' => 'Bình chọn câu lạc bộ bóng đá được yêu thích nhất mùa giải 2023-2024',
            'start_date' => now(),
            'end_date' => now()->addDays(30),
            'is_active' => true,
            'image' => '/uploads/demodemo01.png'
        ]);

        // Liên kết topic bóng đá với các nước
        $footballTopic->countries()->attach([$england->id, $spain->id]);

        // Tạo topic âm nhạc
        $musicTopic = Topic::create([
            'title' => 'Nhóm nhạc được yêu thích nhất 2024',
            'description' => 'Bình chọn nhóm nhạc được yêu thích nhất năm 2024',
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(31),
            'is_active' => true,
            'image' => '/uploads/demodemo01.png'
        ]);

        // Liên kết topic âm nhạc với các nước
        $musicTopic->countries()->attach([$korea->id, $usa->id]);

        // Tạo clubs bóng đá cho England
        $manchesterUnited = Club::create([
            'name' => 'Manchester United',
            'country_id' => $england->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Câu lạc bộ bóng đá Manchester United',
            'is_active' => true
        ]);

        $liverpool = Club::create([
            'name' => 'Liverpool',
            'country_id' => $england->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Câu lạc bộ bóng đá Liverpool',
            'is_active' => true
        ]);

        // Tạo clubs bóng đá cho Spain
        $realMadrid = Club::create([
            'name' => 'Real Madrid',
            'country_id' => $spain->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Câu lạc bộ bóng đá Real Madrid',
            'is_active' => true
        ]);

        $barcelona = Club::create([
            'name' => 'Barcelona',
            'country_id' => $spain->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Câu lạc bộ bóng đá Barcelona',
            'is_active' => true
        ]);

        // Tạo clubs âm nhạc cho Korea
        $bts = Club::create([
            'name' => 'BTS',
            'country_id' => $korea->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Nhóm nhạc nam nổi tiếng của Hàn Quốc',
            'is_active' => true
        ]);

        $blackpink = Club::create([
            'name' => 'BLACKPINK',
            'country_id' => $korea->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Nhóm nhạc nữ nổi tiếng của Hàn Quốc',
            'is_active' => true
        ]);

        // Tạo clubs âm nhạc cho USA
        $maroon5 = Club::create([
            'name' => 'Maroon 5',
            'country_id' => $usa->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Ban nhạc pop rock nổi tiếng của Mỹ',
            'is_active' => true
        ]);

        $imagineDragons = Club::create([
            'name' => 'Imagine Dragons',
            'country_id' => $usa->id,
            'logo' => '/uploads/demodemo01.png',
            'image' => '/uploads/demodemo01.png',
            'description' => 'Ban nhạc rock nổi tiếng của Mỹ',
            'is_active' => true
        ]);

        // Tạo một số votes mẫu
        $users = User::where('is_admin', false)->get();

        // Votes cho topic bóng đá
        Vote::create([
            'user_id' => $users[0]->id,
            'topic_id' => $footballTopic->id,
            'club_id' => $manchesterUnited->id,
            'comment' => 'Manchester United là CLB vĩ đại nhất!',
            'image' => '/uploads/demodemo01.png',
            'created_at' => now()->subDays(5)
        ]);

        Vote::create([
            'user_id' => $users[1]->id,
            'topic_id' => $footballTopic->id,
            'club_id' => $liverpool->id,
            'comment' => 'You\'ll Never Walk Alone!',
            'image' => '/uploads/demodemo01.png',
            'created_at' => now()->subDays(4)
        ]);

        // Votes cho topic âm nhạc
        Vote::create([
            'user_id' => $users[2]->id,
            'topic_id' => $musicTopic->id,
            'club_id' => $bts->id,
            'comment' => 'BTS Army forever!',
            'image' => '/uploads/demodemo01.png',
            'created_at' => now()->subDays(2)
        ]);

        Vote::create([
            'user_id' => $users[3]->id,
            'topic_id' => $musicTopic->id,
            'club_id' => $blackpink->id,
            'comment' => 'BLACKPINK in your area!',
            'image' => '/uploads/demodemo01.png',
            'created_at' => now()->subDays(1)
        ]);

        // Cập nhật số lượt vote cho các clubs
        $clubs = Club::all();
        foreach ($clubs as $club) {
            $voteCount = Vote::where('club_id', $club->id)->count();
            $club->update(['votes_count' => $voteCount]);
        }

        // Tạo topics với countries
        Topic::factory()
            ->count(3)
            ->withCountries(5) // Mỗi topic có 5 countries
            ->create()
            ->each(function ($topic) {
                // Với mỗi country của topic, tạo các clubs
                $topic->countries->each(function ($country) {
                    Club::factory()
                        ->count(5) // Mỗi country có 5 clubs
                        ->create(['country_id' => $country->id]);
                });
            });
    }
}
