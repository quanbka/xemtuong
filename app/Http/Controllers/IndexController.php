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
          CURLOPT_URL => 'http://chitay.xemtuong.net/an_sao_tu_vi/index.php',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Cookie: xtprotect=Cookie; PHPSESSID=1ke4fa89a0k4bi5gqkhqgcmgr6'
          ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
         $response;
        return $response;
    }
}
