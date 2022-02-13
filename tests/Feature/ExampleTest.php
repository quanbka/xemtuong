<?php

namespace Tests\Feature;

use Tests\TestCase;
// use Illuminate\Foundation\Testing\RefreshDatabase;

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
        $count = 0;
        for ($i=-2208985200; $i <= -2108985200; $i = $i + 3600) {
            // print_r(date('Y-m-d h:i:s' . PHP_EOL, $i));
            $year = date('Y', $i);
            $month = date('m', $i);
            $day = date('d', $i);
            $gio = date('h', $i);
            print_r( PHP_EOL . "curl -s 'https://tuvi.phongthuygiatocviet.com/an_sao_tu_vi?name=name&isLunar=&day=$day&month=$month&year=$year&gio=$gio&phut=00&fixhour=0&gender=0&year_xem=2022&submit=Submit' > /dev/null" );
            // $response = $this->get("/an_sao_tu_vi?name=name&isLunar=&day=$day&month=$month&year=$year&gio=$gio&phut=00&fixhour=0&gender=0&year_xem=2021&submit=Submit");
            // $response->assertStatus(200);
            $count++;
        }
        // print_r($count);

    }
}
