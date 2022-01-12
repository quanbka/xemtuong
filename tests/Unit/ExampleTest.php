<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\IndexController;

class ExampleTest extends TestCase
{
    public function testCanReturnUrl () {
        $indexController = new IndexController;
        $oldUrl = 'https://xemtuong.test/?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&isLunar=&day=12&month=6&year=1984&gio=7&phut=01&fixhour=0&gender=0&year_xem=2022&submit=Submit';
        $newUrl = 'http://chitay.xemtuong.net/an_sao_tu_vi/index.php?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&isLunar=&day=12&month=6&year=1984&gio=7&phut=01&fixhour=0&gender=0&year_xem=2022&submit=Submit';
        $this->assertEquals($indexController->getOriginUrl($oldUrl), $newUrl);
        
        $oldUrl = 'https://xemtuong.test/?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&isLunar=&day=12&month=6&year=1984&gio=7&phut=01&fixhour=0&gender=0&year_xem=2022&submit=Submit';
        $newUrl = 'http://chitay.xemtuong.net/an_sao_tu_vi/index.php?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&isLunar=&day=12&month=6&year=1984&gio=7&phut=01&fixhour=0&gender=0&year_xem=2022&submit=Submit';
        $this->assertEquals($indexController->getOriginUrl($oldUrl), $newUrl);
    }

}
