<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $response = $this->get('/');

        $response->assertStatus(302);
    }

    public function testAll () {
        $response = $this->get('/la-so-tu-vi?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&isLunar=&day=12&month=6&year=1984&gio=12&phut=59&fixhour=0&gender=1&year_xem=2021&submit=Submit');
        $response->assertStatus(200);
    }
}
