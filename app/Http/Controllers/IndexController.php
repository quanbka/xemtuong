<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IndexController extends Controller
{

    public function redirect () {
        return redirect('/la-so-tu-vi');
    }

    public function index (Request $request) {
        $originUrl = $this->getOriginUrl(url()->full());
        $response = $this->sendRequest($originUrl);
        return $response;
    }

    public function getOriginUrl ($url) {
        return str_replace(config('app.url'), 'http://chitay.xemtuong.net/an_sao_tu_vi/index.php', $url);
    }

    public function sendRequest ($url) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
          CURLOPT_URL => $url,
          CURLOPT_RETURNTRANSFER => true,
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return $response;
    }
}
