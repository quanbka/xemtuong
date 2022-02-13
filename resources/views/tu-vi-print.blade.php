<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
    <center>

    <style>
        .truyen_text {
            font-size: 16px;
            line-height: 140%;
            color: #333333;
            text-align: justify;
            padding-top: 10px;
            font-family: Constantia, "Lucida Bright", "DejaVu Serif", Georgia, serif;
        }

        .mota_text {
            font-size: 19px;
            line-height: 130%;
            color: #333333;
            text-align: justify;
            padding-top: 1px;
            font-family: Constantia, "Lucida Bright", "DejaVu Serif", Georgia, serif;
        }

        .jsArticleStep .stepNumber {
            margin-right: 10px
        }

        .jsArticleStep .stepContent {
            margin-left: 0
        }

        .jsArticleStep .stepNumber {
            float: left;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #fff;
            font-weight: 700;
            background: url(/img/bg-step.png) no-repeat center center
        }

        .jsArticleStep .stepContent {
            margin-left: 45px
        }

        .detail-content .article-source {
            text-align: right;
            font-weight: 500;
            font-size: 14px;
            color: #444
        }

        .how {
            list-style: circle;
            list-style-position: outside;
        }

        /* CSSTerm.com Simple CSS menu */
        .menu_simple ul {
            margin: 0;
            padding: 0;
            width: 100%;
            list-style-type: none;
        }

        .menu_simple ul li a {
            text-decoration: none;
            color: #772600;
            padding: 6px 6px;
            display: block;
            border-bottom: 1px dotted black;
        }

        .menu_simple ul li a:visited {
            color: #772600;
        }

        .menu_simple ul li a:hover,
        .menu_simple ul li .current {
            color: red;
            background-color: #5FD367;
            background: url("/images/bg_footer.jpg");
            text-decoration: none;
        }

        .title {
            display: inline-block;
            color: #FFCCFF;
            font: 28px Tahoma;
            letter-spacing: 1px;
            font-weight: bold;
            text-shadow: 1px 1px 1px #ef333f, 1px -1px 1px #ef333f, -1px 1px 1px #ef333f, -1px -1px 1px #ef333f;
        }

        .title1 {
            display: inline-block;
            color: #3399FF;
            FONT-SIZE: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            LINE-HEIGHT: 150%;
            text-shadow: 2px 2px 2px #00205b, 1px -1px 1px #00205b, -1px 1px 1px #00205b, -1px -1px 1px #fff;
        }


        .title2 {
            display: inline-block;
            color: #FFCCFF;
            font: 20px Tahoma;
            letter-spacing: 1px;
            font-weight: bold;
            text-shadow: 1px 1px 1px #ef333f, 1px -1px 1px #fff, -1px 1px 1px #ef333f, -1px -1px 1px #ef333f;
        }

        H1 {
            display: inline-block;
            color: #FFCCFF;
            font: 28px Tahoma;
            letter-spacing: 1px;
            font-weight: bold;
            text-shadow: 1px 1px 1px #ef333f, 1px -1px 1px #ef333f, -1px 1px 1px #ef333f, -1px -1px 1px #ef333f;
        }


        #textbox {
            display: flex;
            justify-content: space-between;
        }

        .color_tho {
            color: #FF8204;
        }

        .color_kim {
            color: #808080;
        }

        .color_moc {
            color: #009933;
        }

        .color_thuy {
            color: #0073e6;
        }

        .color_hoa {
            color: #ff0000;
        }

        .color_diaban {
            color: #CC3300;
        }

        .color_red {
            color: red;
        }

        .color_do {
            color: red;
        }

        .color_cam {
            color: #FF9900;
        }

        .color_xanhla {
            color: #008000;
        }

        .color_xam {
            color: #666666;
        }

        .tuvi_title {
            font-size: 17px;
            font-weight: bold;
            color: #003366;
        }

        .tuvi_title_nho {
            font-size: 16px;
            color: #000;
            color: red;
        }

        .truong_sinh {
            font-size: 13px;
            font-weight: bold;
            color: #525252;
        }

        .tac_gia {
            font-size: 10px;
            color: #666666;
            display: none;
        }

        .badge {
            font-size: 14px;
            font-weight: bold;
            background-color: black;
            color: #fff;
        }
    </style>

    <body>
        <center>
            <center>

                <div>
                    {!! $table !!}
                </div>
                <style media="screen">
                    .table-responsive > table {
                        border: 2px solid black;
                    }
                    div > div > table > tbody > tr > td {
                        border: 1px solid black;
                    }
                    .table-responsive table.table {
                        width: 880px !important;;
                        height:1000px !important;
                        background-image: url("/images/bodybg2.jpg");
                        border-collapse: collapse !important;;
                    }
                </style>

            </center>
            <div id='fontchu' class='truyen_text' itemprop='articleBody'>
                {!! $text !!}
            </div>
            <script type="text/javascript">
                window.print();
            </script>
    </body>

</html>
