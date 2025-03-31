var EC = {
    "isSlid": !![],
    "Width": $(window)["width"](),
    "Init": function () {
        EC["Init"]["LazyLoad"] = new LazyLoad({});
        EC["Style"]["Footer"]();
        $(".gen-search")["click"](function () {
            $(".pop-1")["addClass"]("show")["siblings"](".box-bg2")["show"]();
            $("body")["css"]({
                "height": "100%",
                "width": "100%",
                "overflow": "hidden"
            });
        });
        $(".gen-history")["click"](function () {
            $(".pop-2")["addClass"]("show")["siblings"](".box-bg2")["show"]();
            EC["Init"]["LazyLoad"]["update"]();
            $("body")["css"]({
                "height": "100%",
                "width": "100%",
                "overflow": "hidden"
            });
        });
        $(".pop-bj")["click"](function () {
            $(".pop-list-body")["removeClass"]("show")["siblings"](".box-bg2")["hide"](), $("body")["css"]({
                "height": "",
                "width": "",
                "overflow": ""
            });
        });
        $(".pop-2 span")["click"](function () {
            $(this)["addClass"]("on")["siblings"]()["removeClass"]("on");
            let _0x29917a = $(".pop-2 span")["index"](this),
                _0x16dd44 = $(".history")["eq"](_0x29917a);
            _0x16dd44["fadeIn"](800)["siblings"]()["hide"]();
            _0x16dd44["addClass"]("check")["siblings"]()["removeClass"]("check");
            if (EC["Empty"](EC["Cookie"]["Get"]("user_id"))) {
                $(".user-history")["html"]("<div class=\"null cor5\"><img src=\"" + maccms["path2"] + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["0"] + "</span></div>" + "<a href=\"javascript:\" class=\"button top30 head-user\" style=\"width:100%\">" + language["1"] + "</a>");
            } else {
                $(".user-history li")["length"] === 0 && EC["Ajax"](maccms["path"] + "/index.php/api/history", "post", "json", "", function (_0x5b91e6) {
                    if (_0x5b91e6["code"] === 1) {
                        let _0xbe7749 = "";
                        $["each"](_0x5b91e6["list"], function (_0x5871ec, _0x1c5434) {
                            _0xbe7749 += "<li><a class=\"history-a flex\" href=\"" + _0x1c5434["data"]["link"] + "\" target=\"video\" title=\"" + _0x1c5434["data"]["name"] + "\"><img class=\"lazy lazy1\" referrerpolicy=\"no-referrer\" alt=\"" + _0x1c5434["data"]["name"] + "\" data-src=\"" + _0x1c5434["data"]["pic"] + "\"/>" + "<div class=\"history-r\"><div class=\"hide2\">" + _0x1c5434["data"]["name"] + "</div><div><span class=\"cor5\">" + _0x1c5434["data"]["type"]["type_name"] + "</span></div></div></a></li>";
                        });
                        $(".user-history ul")["html"](_0xbe7749);
                        EC["Init"]["LazyLoad"]["update"]();
                        Number($(".lang-bnt")["length"]) === 1 && zh_tranBody();
                    } else {
                        $(".user-history ul")["html"](EC["History"]["Msg"]);
                    }
                });
            }
        });
        $(".user-share-button")["click"](function () {
            EC["Pop"]["Show"]($(".user-share-html")["html"](), language["3"], function () {});
        });
        let _0x2c2d7c = $(".gen-loading"),
            _0xd18d29 = _0x2c2d7c["data"]("time");
        setTimeout(function () {
            $(".gen-loading")["fadeOut"]("slow");
        }, _0xd18d29);
        $(".head-more-a")["hover"](function () {
            $(".nav-more")["html"]("&#xe564;");
            $(".head-more")["show"]();
        }, function () {
            $(".nav-more")["html"]("&#xe563;");
            $(".head-more")["hide"]();
        });
        let _0x2b338e = null,
            _0x323c32 = $(".head"),
            _0x2aec15 = $(".row-2 .tim-box"),
            _0x418250 = null;
        _0x323c32["length"] > 0 && (_0x2b338e = _0x323c32["offset"]()["top"]);
        _0x2aec15["length"] > 0 && (_0x418250 = _0x2aec15["eq"](_0x2aec15["length"] - 1)["offset"]()["top"]);
        $(window)["scroll"](EC["debounce"](function () {
            let _0x52f870 = $(this)["scrollTop"]();
            _0x323c32["toggleClass"]("head-b", _0x52f870 > _0x2b338e)["css"]("position", _0x52f870 > _0x2b338e ? "fixed" : "");
            $(".head .left, .head .right")["toggleClass"]("head-b", _0x52f870 > _0x2b338e);
            _0x52f870 > 300 ? $(".top")["fadeIn"](600) : $(".top")["fadeOut"](600);
            if (EC["Width"] > 991) {
                if (_0x52f870 > _0x418250) {
                    _0x2aec15["eq"](_0x2aec15["length"] - 1)["css"]({
                        "position": "fixed",
                        "top": "100px",
                        "width": $(".row-2")["width"]()
                    });
                } else {
                    _0x2aec15["eq"](_0x2aec15["length"] - 1)["css"]({
                        "position": "",
                        "top": "",
                        "width": ""
                    });
                }
            }
        }, 50));
        $(".top")["click"](function () {
            $("html,body")["animate"]({
                "scrollTop": 0
            }, 500);
            _0x323c32["removeClass"]("head-b")["css"]({
                "position": ""
            });
        });
        if (Number($(".slid-e")["length"]) === 1) {
            let _0x1f430f = new Swiper(".swiper3", {
                "loop": !![],
                "slidesPerView": 1,
                "pagination": {
                    "el": ".swiper-pagination"
                },
                "on": {
                    "slideChangeTransitionStart": function () {
                        _0x228534();
                        $(".muted")["off"]("click");
                        $(".toReplay")["off"]("click");
                        $(".slid-e-video")["removeClass"]("v-show");
                        $(".slid-e-bj")["removeClass"]("v-hidden");
                    },
                    "slideChangeTransitionEnd": function () {
                        $(".wap-hide")["is"](":hidden") == ![] && EC["isSlid"] && (EC["isSlid"] = ![], setTimeout(function () {
                            EC["isSlid"] = !![], _0x164caa();
                        }, 1000));
                    }
                }
            });
            function _0x228534() {
                let _0x40df01 = Array["from"](document["getElementsByClassName"]("preview"));
                for (let _0x2562ed = 0; _0x2562ed < _0x40df01["length"]; _0x2562ed++) {
                    const _0x118aaa = _0x40df01[_0x2562ed];
                    _0x118aaa["pause"]();
                    _0x118aaa["currentTime"] = 0;
                }
            }
            let _0x3757ae = 0;
            function _0x164caa() {
                let _0x44e020 = document["querySelector"](".slid-e")["querySelector"](".swiper-slide-active")["querySelector"]("video"),
                    _0x1acdfb = $(".slid-e .swiper-slide-active");
                if (~~_0x44e020["duration"] > 10) {
                    _0x1acdfb["find"](".slid-e-video")["addClass"]("v-show");
                    _0x1acdfb["find"](".slid-e-bj")["addClass"]("v-hidden");
                    if (_0x44e020["muted"]) {
                        $(".muted .fa")["removeClass"]("ds-shengyin")["addClass"]("ds-liulan");
                    } else {
                        $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin");
                    }
                    $(".muted")["click"](function () {
                        if (_0x44e020["muted"]) {
                            $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin"), _0x44e020["muted"] = ![], _0x3757ae = 1;
                        } else {
                            _0x44e020["muted"] = !![];
                            {
                                $(".muted .fa")["removeClass"]("ds-shengyin")["addClass"]("ds-liulan");
                                _0x3757ae = 0;
                            }
                        }
                    });
                    if (_0x3757ae === 1) {
                        $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin");
                        _0x44e020["muted"] = ![];
                    }
                    $(".toReplay")["click"](function () {
                        _0x1acdfb["find"](".slid-e-video")["addClass"]("v-show"), _0x1acdfb["find"](".slid-e-bj")["addClass"]("v-hidden"), _0x44e020["currentTime"] = 0, _0x44e020["play"]();
                    });
                    _0x44e020["play"]();
                    _0x44e020["addEventListener"]("ended", function () {
                        _0x1acdfb["find"](".slid-e-video")["removeClass"]("v-show");
                        _0x1acdfb["find"](".slid-e-bj")["removeClass"]("v-hidden");
                        _0x1f430f["slideNext"]();
                    });
                } else {
                    setTimeout(function () {
                        _0x1f430f["slideNext"]();
                    }, 6000);
                }
            }
        }
        let _0x31d712 = $("#height_limit");
        _0x31d712["height"]() >= 80 && (_0x31d712["addClass"]("occlusion"), $(".text-open")["show"]());
        $(".tim-bnt")["click"](function () {
            _0x31d712["hasClass"]("height_rel") ? ($(".tim-bnt")["html"]("<i class=\"fa r6 ease\">&#xe563;</i>" + language["4"]), _0x31d712["removeClass"]("height_rel"), _0x31d712["addClass"]("occlusion")) : ($(".tim-bnt")["html"]("<i class=\"fa r6 ease\">&#xe564;</i>" + language["4"]), _0x31d712["addClass"]("height_rel"), _0x31d712["removeClass"]("occlusion"));
        });
        EC["Swiper"]["Navs"]();
        EC["Swiper"]["Slide"]();
        EC["Swiper"]["Roll"]();
        EC["Actor"]["Detail"]();
        $(".gen-left-list")["click"](function () {
            let _0x486697 = $(".head-more")["html"](),
                _0x115d35 = "bold0",
                _0x593afb = "wap-show1",
                _0x4d2311 = $(".head-nav");
            _0x4d2311["hasClass"]("bold1") && (_0x115d35 = "bold1");
            _0x4d2311["hasClass"]("wap-show0") && (_0x593afb = "wap-show0");
            EC["Pop"]["Drawer"]("<div class='drawer-nav drawer-scroll " + _0x115d35 + " " + _0x593afb + "'><div class='drawer-scroll-list'>" + _0x486697 + "</div></div>", function () {
                let _0x1dcfd9 = $(".gen-account-menu")["html"]();
                $(".drawer-list-box")["prepend"]("<div class='drawer-menu cor2'>" + _0x1dcfd9 + "</div>");
            });
        });
        $(".playBut")["click"](function () {
            let _0x3ec2a3 = $(this)["attr"]("data-url");
            $(".play-advance .topfadeInUp")["html"]("<video id=\"xkPlayer\" width=\"100%\" height=\"100%\" controls preload=\"auto\" autoplay><source src=\"" + _0x3ec2a3 + "\" type=\"video/mp4\"></video>");
            $(".play-advance")["show"]();
        });
        $(".play-advance .box-bg,.play-advance .mfp-close")["click"](function () {
            let _0x251456 = document["getElementById"]("xkPlayer");
            _0x251456["currentTime"] = 0;
            _0x251456["pause"]();
            $(".play-advance")["hide"]();
            $(".mfp-iframe")["remove"]();
        });
        $(".deployment")["click"](function () {
            let _0x32956f = $(".info-parameter")["html"]();
            EC["Pop"]["Drawer"](_0x32956f, function () {
                $(".drawer-list-box")["addClass"]("drawer-list-b bj3");
                $(document)["on"]("click", ".drawer-of", function () {
                    EC["Pop"]["DrawerDel"]();
                });
            });
        });
        $(".wap-diy-vod-e .vod-link")["hover"](function () {
            $(this)["addClass"]("box");
            $(this)["children"](".vod-no-dom-show")["hide"]();
            $(this)["children"](".vod-no-dom")["show"]();
        }, function () {
            $(this)["children"](".vod-no-dom-show")["show"]();
            {
                $(this)["removeClass"]("box");
                $(this)["children"](".vod-no-dom")["hide"]();
            }
        });
        $("#BuyPopEdom")["click"](function () {
            let _0x2eaf49 = $(this);
            _0x2eaf49["attr"]("data-id") && confirm(language["6"]) && EC["Ajax"](maccms["path"] + "/index.php/user/ajax_buy_popedom.html?id=" + _0x2eaf49["attr"]("data-id") + "&mid=" + _0x2eaf49["attr"]("data-mid") + "&sid=" + _0x2eaf49["attr"]("data-sid") + "&nid=" + _0x2eaf49["attr"]("data-nid") + "&type=" + _0x2eaf49["attr"]("data-type"), "get", "json", "", function (_0x5907fb) {
                _0x2eaf49["addClass"]("disabled");
                _EC["Pop"]["Msg"](_0x5907fb["msg"]);
                Number(_0x5907fb["code"]) === 1 && top["location"]["reload"]();
                _0x2eaf49["removeClass"]("disabled");
            });
        });
        $("#check")["click"](function () {
            let _0x433d5e = $(this);
            _0x433d5e["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/ajax/pwd.html?id=" + _0x433d5e["attr"]("data-id") + "&mid=" + _0x433d5e["attr"]("data-mid") + "&type=" + _0x433d5e["attr"]("data-type") + "&pwd=" + _0x433d5e["parents"]("form")["find"]("input[name=\"pwd\"]")["val"](), "get", "json", "", function (_0x1def91) {
                _0x433d5e["addClass"]("disabled");
                _EC["Pop"]["Msg"](_0x1def91["msg"]);
                if (Number(_0x1def91["code"]) === 1) {
                    location["reload"]();
                }
                _0x433d5e["removeClass"]("disabled");
            });
        });
        switch (maccms["aid"]) {
            case "12":
            case "11":
                let _0x135efb = $("#dataList");
                if (_0x135efb["length"] > 0) {
                    let _0x462b3d = _0x135efb["data"](),
                        _0x21dfef = {
                            "type": _0x462b3d["type"],
                            "class": _0x462b3d["class"],
                            "area": _0x462b3d["area"],
                            "lang": _0x462b3d["lang"],
                            "version": _0x462b3d["version"],
                            "state": _0x462b3d["state"],
                            "letter": _0x462b3d["letter"]
                        };
                    $(".ec-casc-list .swiper-slide")["click"](function () {
                        $(this)["addClass"]("nav-dt")["siblings"]()["removeClass"]("nav-dt");
                        EC["Swiper"]["Navs"]();
                        _0x21dfef[$(this)["data"]("type")] = $(this)["data"]("val");
                        if (EC["Empty"]($(this)["data"]("type"))) {
                            return;
                        }
                        _0x135efb["html"]("");
                        HTML["Skeleton"](_0x135efb, 3, _0x462b3d["tpl"]);
                        EC["flow"]["get"](_0x21dfef, _0x135efb, _0x462b3d, function () {});
                    });
                    $(".site-tabs a")["click"](function () {
                        $(this)["addClass"]("active")["siblings"]()["removeClass"]("active");
                        if (Number($("#dataList .null")["length"]) === 1) {
                            return;
                        }
                        _0x21dfef["by"] = $(this)["data"]("type");
                        _0x135efb["html"]("");
                        HTML["Skeleton"](_0x135efb, 3, _0x462b3d["tpl"]);
                        EC["flow"]["get"](_0x21dfef, _0x135efb, _0x462b3d, function () {});
                    });
                    HTML["Skeleton"](_0x135efb, 3, _0x462b3d["tpl"]);
                    _0x21dfef[$(this)["data"]("type")] = $(this)["data"]("val");
                    EC["flow"]["get"](_0x21dfef, _0x135efb, _0x462b3d, function () {});
                }
                break;
            case "14":
            case "104":
            case "15":
                $(".anthology-tab a")["click"](function () {
                    $(this)["addClass"]("on nav-dt")["siblings"]()["removeClass"]("on nav-dt");
                    let _0x37912c = $(".anthology-tab a")["index"](this),
                        _0x5c26d0 = $(".anthology-list .none")["eq"](_0x37912c);
                    _0x5c26d0["fadeIn"](800)["siblings"]()["hide"]();
                    _0x5c26d0["addClass"]("dx")["siblings"]()["removeClass"]("dx");
                    EC["Swiper"]["Navs"]();
                });
                $("#zxdaoxu")["each"](function () {
                    $(this)["on"]("click", function (_0x3b6f7c) {
                        _0x3b6f7c["preventDefault"]();
                        $(".dx")["each"](function () {
                            let _0x5cfbe7 = $(this)["find"]("li");
                            for (let _0x4480a1 = 0, _0x483e7c = _0x5cfbe7["length"] - 1; _0x4480a1 < _0x483e7c;) {
                                let _0x3ee9a6 = _0x5cfbe7["eq"](_0x4480a1)["clone"](!![]),
                                    _0x1ae191 = _0x5cfbe7["eq"](_0x483e7c)["replaceWith"](_0x3ee9a6);
                                _0x5cfbe7["eq"](_0x4480a1)["replaceWith"](_0x1ae191);
                                ++_0x4480a1;
                                --_0x483e7c;
                            }
                        });
                    });
                });
                $("#role .public-list-box")["click"](function () {
                    let _0x1cd546 = $(this)["index"](),
                        _0x422713 = $("#role .cor5")["eq"](_0x1cd546)["text"](),
                        _0x5fc82e = $("#role .time-title")["eq"](_0x1cd546)["text"](),
                        _0x51f0ea = $("#role .lazy")["eq"](_0x1cd546)["data"](),
                        _0x284a26 = _0x51f0ea["text"];
                    _0x284a26["length"] < 1 && (_0x284a26 = language["7"]);
                    let _0x45c49e = "<div class=\"role-card\"><div class=\"card-top flex\"><div class=\"left\"><img class=\"lazy\" src=\"" + _0x51f0ea["src"] + "\" alt=\"" + _0x5fc82e + "\"></div>\n" + "<div class=\"right\"><p>" + _0x5fc82e + "</p><p class=\"cor5\">" + _0x422713 + "</p></div></div> \n" + "<div class=\"card-bottom\"><p class=\"card-title\">" + language["8"] + "</p><div class=\"card-text cor5\">" + _0x284a26 + "</div></div></div>";
                    EC["Pop"]["Show"](_0x45c49e, language["9"], function () {});
                });
                $(".vod-detail .vod-detail-bnt .button")["click"](function () {
                    location["href"] = $(".anthology-list-play a")["eq"](0)["attr"]("href");
                });
                $(".player-button-ac")["click"](function () {
                    $(".anthology-list")["toggleClass"]("player-list-ac");
                });
                $(".play-tips-bnt")["click"](function () {
                    $(".tips-box")["slideToggle"](), $(".charge,.player-share-box")["hide"]();
                });
                $(".ec-report")["click"](function () {
                    let _0x51f6e3 = $(this)["data"]();
                    EC["Gbook"]["Report"](_0x51f6e3);
                });
                $(".charge-button")["click"](function () {
                    $(".charge")["fadeToggle"](), $(".player-share-box,.tips-box")["hide"]();
                });
                $(".comment-form")["length"] < 1 && (EC["Comment"]["Login"] = $(this)["data"]()["login"], EC["Comment"]["Verify"] = $(this)["data"]()["verify"], EC["Comment"]["Init"](), EC["Comment"]["Show"](1));
                $("#expand_details")["click"](function () {
                    $(".player-vod-box")["hide"]();
                    $(".player-list-box")["hide"]();
                    $(".player-details-box")["show"]();
                });
                $(".player-close")["click"](function () {
                    $(".player-vod-box")["show"]();
                    $(".player-list-box")["show"]();
                    $(".player-details-box")["hide"]();
                    $(".player-return .none")["hide"]();
                    $(".player-vod-no1")["show"]();
                    $(".player-vod-no2")["html"]("<div class=\"top40\"><div class=\"loading\"><span></span><span></span><span></span><span></span><span></span></div></div>")["hide"]();
                });
                $(".player-vod-no1 .public-list-box")["click"](function () {
                    $(".player-return .none")["show"](), $(".player-vod-no1")["hide"](), $(".player-vod-no2")["show"](), EC["Ajax"](maccms["path"] + "/index.php/api/actor_vod_player_api?id=" + $(this)["attr"]("data-id"), "get", "json", "", function (_0x3727f9) {
                        if (Number(_0x3727f9["code"]) === 1) {
                            let _0x399524 = "";
                            $["each"](_0x3727f9["list"], function (_0xd8ab02, _0x55afed) {
                                _0x399524 = _0x399524 + "<div class=\"public-list-box public-pic-b\"><div class=\"public-list-div\"><a class=\"public-list-exp\" href=\"" + _0x55afed["url"] + "\" title=\"" + _0x55afed["name"] + "\">" + "<img class=\"lazy lazy1 gen-movie-img " + maccms["vod_mask"] + "\" referrerpolicy=\"no-referrer\" alt=\"" + language["10"] + "\" data-src=\"" + _0x55afed["pic"] + "\" /></a>\n" + "<i class=\"collection fa\" data-type=\"2\" data-mid=\"" + maccms["mid"] + "\" data-id=\"" + _0x55afed["id"] + "\">&#xe577;</i></div>\n" + "<div class=\"public-list-button\"><a target=\"_blank\" class=\"time-title hide ft4\" href=\"" + _0x55afed["url"] + "\" title=\"" + _0x55afed["name"] + "\">" + _0x55afed["name"] + "</a></div></div>";
                            });
                            $(".player-vod-no2")["html"]("<div class=\"role-card top20\">" + _0x3727f9["html"] + "</div><div class=\"title-m cor4\"><h5>" + language["11"] + "</h5></div><div class=\"flex wrap border-box hide-b-16 wap-diy-vod-a\">" + _0x399524 + "</div>");
                            EC["Init"]["LazyLoad"]["update"]();
                        } else {
                            _EC["Pop"]["Msg"](language["12"], "", "error");
                        }
                    });
                });
                $(".player-return .none")["click"](function () {
                    $(this)["hide"]();
                    $(".player-vod-no1")["show"]();
                    $(".player-vod-no2")["html"]("<div class=\"top40\"><div class=\"loading\"><span></span><span></span><span></span><span></span><span></span></div></div>")["hide"]();
                });
                if (Number(maccms["jx"]) === 1) {
                    let _0x447786 = $(".line-switch");
                    EC["player"]["player_jx"](_0x447786["attr"]("data-api"), _0x447786["attr"]("data-url"));
                    $(".vod-playerUrl")["click"](function () {
                        _0x447786["html"]("");
                        EC["player"]["player_jx"](_0x447786["attr"]("data-api"), $(this)["attr"]("data-form"));
                    });
                    $(document)["on"]("click", ".line-switch a", function () {
                        $("#playleft iframe")["attr"]("src", $(this)["attr"]("data-api") + MacPlayer["PlayUrl"]);
                        {
                            maccms["jx_index"] = $(this)["index"]();
                            {
                                $(this)["addClass"]("bj2")["siblings"]()["removeClass"]("bj2");
                                _EC["Pop"]["Msg"](language["13"], "", "success");
                            }
                        }
                    });
                }
                break;
            case "4":
                EC["Gbook"]["Init"]();
                break;
            case "24":
                $(".tim-content img")["touchTouch"]();
                let _0x5b1a96 = $(".ds-comment");
                if (Number(_0x5b1a96["length"]) === 1) {
                    EC["Comment"]["Init"]();
                    {
                        EC["Comment"]["Verify"] = _0x5b1a96["data"]()["verify"];
                        {
                            EC["Comment"]["Login"] = _0x5b1a96["data"]()["login"];
                            EC["Comment"]["Show"](1);
                        }
                    }
                }
                break;
            case "21":
                let _0x50aa76 = $("#dataList");
                if (_0x50aa76["length"] > 0) {
                    let _0x5ed32c = _0x50aa76["data"]();
                    HTML["Skeleton"](_0x50aa76, 3, _0x5ed32c["tpl"]);
                    let _0x4b6a1c = {
                        "type": _0x5ed32c["type"]
                    };
                    EC["flow"]["get"](_0x4b6a1c, _0x50aa76, _0x5ed32c, function () {
                        EC["Swiper"]["Roll"]();
                    });
                }
                break;
            case "23":
                let _0x63af8b = $("#dataList");
                if (_0x63af8b["length"] > 0) {
                    let _0x95a7a2 = _0x63af8b["data"]();
                    HTML["Skeleton"](_0x63af8b, 3, _0x95a7a2["tpl"]);
                    let _0x2e9222 = {
                        "wd": _0x95a7a2["type"],
                        "tag": _0x95a7a2["wdtag"]
                    };
                    EC["flow"]["get"](_0x2e9222, _0x63af8b, _0x95a7a2, function () {
                        EC["Swiper"]["Roll"]();
                    });
                }
                break;
            case "84":
                $(".art-so-tag")["click"](function () {
                    let _0x5f4c1f = $("#dataList"),
                        _0x39460c = _0x5f4c1f["data"]();
                    _0x5f4c1f["html"]("");
                    HTML["Skeleton"](_0x5f4c1f, 3, _0x39460c["tpl"]);
                    let _0x375f2f = {
                        "wd": _0x39460c["type"],
                        "tag": _0x39460c["wdtag"]
                    };
                    EC["flow"]["get"](_0x375f2f, _0x5f4c1f, _0x39460c, function () {
                        EC["Swiper"]["Roll"]();
                    });
                });
                break;
            case "82":
                let _0x5136ce = $("#dataList");
                if (_0x5136ce["length"] > 0) {
                    let _0x35beb8 = _0x5136ce["data"](),
                        _0x27f344 = {
                            "type": _0x35beb8["type"]
                        };
                    $(".ec-casc-list .swiper-slide")["click"](function () {
                        $(this)["addClass"]("nav-dt")["siblings"]()["removeClass"]("nav-dt");
                        EC["Swiper"]["Navs"]();
                        _0x27f344[$(this)["data"]("type")] = $(this)["data"]("val");
                        _0x5136ce["html"]("");
                        HTML["Skeleton"](_0x5136ce, 3, _0x35beb8["tpl"]);
                        EC["flow"]["get"](_0x27f344, _0x5136ce, _0x35beb8, function () {});
                    });
                    HTML["Skeleton"](_0x5136ce, 3, _0x35beb8["tpl"]);
                    _0x27f344[$(this)["data"]("type")] = $(this)["data"]("val");
                    EC["flow"]["get"](_0x27f344, _0x5136ce, _0x35beb8, function () {});
                }
                break;
            case "302":
                let _0x1607c2 = $("#dataList");
                if (_0x1607c2["length"] > 0) {
                    let _0x5434d4 = _0x1607c2["data"](),
                        _0x31ae84 = {};
                    $(".ec-casc-list .swiper-slide")["click"](function () {
                        $(".swiper-slide")["removeClass"]("nav-dt");
                        $(this)["addClass"]("nav-dt");
                        EC["Swiper"]["Navs"]();
                        _0x31ae84["type"] = $(this)["data"]("id");
                        _0x1607c2["html"]("");
                        HTML["Skeleton"](_0x1607c2, 3, _0x5434d4["tpl"]);
                        EC["flow"]["get"](_0x31ae84, _0x1607c2, _0x5434d4, function () {});
                    });
                    HTML["Skeleton"](_0x1607c2, 3, _0x5434d4["tpl"]);
                    _0x31ae84[$(this)["data"]("type")] = $(this)["data"]("val");
                    EC["flow"]["get"](_0x31ae84, _0x1607c2, _0x5434d4, function () {});
                }
                break;
        }
        Number(maccms["mid"]) === 11 && ($(".web-so-btn")["click"](function () {
            let _0x1c4494 = $(".website-val")["val"]();
            _0x1c4494 ? window["open"]($(".website-filter-grid .action")["attr"]("data-url") + _0x1c4494) : _EC["Pop"]["Msg"](language["14"], "", "error");
        }), $(".website-filter-grid .icon")["click"](function () {
            $(".website-filter-grid .action")["removeClass"]("action");
            $(this)["addClass"]("action");
        }), $(".togo")["click"](function () {
            let _0x4a1b86 = $(this)["attr"]("data-id"),
                _0x5125a2 = $(this)["attr"]("data-mi");
            Number(_0x5125a2) === 1 ? _EC["Pop"]["Msg"](language["15"], "", "error") : EC["Ajax"](maccms["path"] + "/index.php/api/website?id=" + _0x4a1b86, "get", "json", "", function (_0x5c6a1b) {
                _0x5c6a1b["smg"] === 1 ? EC["Pop"]["Show"]("<div class=\"website-title\">" + _0x5c6a1b["data"]["website_name"] + "</div><div class=\"card-text cor5\"><p>" + _0x5c6a1b["data"]["website_blurb"] + "</p><p>" + _0x5c6a1b["data"]["website_content"] + "</p></div><div class=\"flex website-tag top20\">" + _0x5c6a1b["data"]["website_tag"] + "</div>", language["20"], function () {}) : _EC["Pop"]["Msg"](language["15"], "", "error");
            });
        }), $("#tou_gao")["click"](function () {
            if (Number(EC["User"]["IsLogin"]) === 0) {
                EC["User"]["Login"]();
                return;
            }
            EC["Pop"]["Show"]("<form class=\"tg-form\"><p class=\"cor5 top10\">" + language["16"] + "</p><div class=\"region nav-link textarea border\">\n" + "<textarea class=\"tg-content cor5\" name=\"gbook_content\" style=\"width:100%;height:100%\"></textarea>\n" + "</div><div class=\"flex\"><input type=\"text\" class=\"input bj br cor5\" name=\"verify\" value=\"\" maxlength=\"4\" size=\"20\">\n" + "<img class=\"ds-verify-img\" src=\"/index.php/verify/index.html\" alt=\"" + language["19"] + "\" onclick=\"this.src = this.src+'?'\"></div>\n" + "<input type=\"button\" class=\"tg-submit button top20 submit_btn\" style=\"width:100%\" value=\"" + language["17"] + "\"></form>", language["18"], function () {
                $(".tg-submit")["click"](function () {
                    EC["Gbook"]["Tg"]();
                });
            });
        }));
        $("#website_user")["click"](function () {
            $["ajax"]({
                "url": window["location"]["href"] + "&pdw=" + $("#website_password")["val"](),
                "type": "post",
                "dataType": "json",
                "success": function (_0x5daf46) {
                    Number(_0x5daf46["smg"]) === 1 ? window["location"]["replace"](_0x5daf46["url"]) : window["location"]["replace"]("https://www.kugou.com/song/#hash=8C1A6044DDF1650A82B42769C47FD645&album_id=501600");
                }
            });
        });
        $(".jp-download")["click"](function () {
            let _0x310793 = "<p class=\"cor5 top10\">" + language["21"] + "</p><div class=\"region nav-link textarea bj\"><textarea id=\"bar2\" class=\"cor5\" style=\"width:100%;height:100%\">" + language["22"] + "《" + ecData["list"][ecData["playid"]]["name"] + "》" + language["23"] + ecData["list"][ecData["playid"]]["url"] + "</textarea></div>\n" + "<button type=\"button\" class=\"button copyBtn\" style=\"width:100%\" data-clipboard-action=\"copy\" data-clipboard-target=\"#bar2\">" + language["24"] + "</button>";
            EC["Pop"]["Show"](_0x310793, language["25"], function () {
                $(document)["on"]("click", ".copyBtn", function () {
                    _EC["Pop"]["Msg"](language["26"], "", "success"), $(".window")["remove"]();
                });
            });
        });
        $(".ds-pop")["length"] > 0 && EC["Empty"](EC["Cookie"]["Get"]("ecPopup")) && (EC["Cookie"]["Set"]("ecPopup", 1, 1), $("#notice")["show"](), $("#notice .box-bg,#notice .button")["click"](function () {
            $("#notice")["hide"]();
        }));
        $(".player-switch")["click"](function () {
            let _0x54bce2 = $(".player");
            _0x54bce2["hasClass"]("player-switch-box") ? ($(this)["html"]("&#xe565;"), _0x54bce2["removeClass"]("player-switch-box")) : ($(this)["html"]("&#xe566;"), _0x54bce2["addClass"]("player-switch-box"));
        });
        const _0x5f3848 = " %c 短" + "视主" + "题 by 草" + "根® %c Q" + "Q6025" + "24950|90625" + "9831（严" + "禁利" + "用主" + "题" + "建设" + "违" + "法" + "网" + "站）";
        console["log"]("\n" + _0x5f3848 + "\n", "color: #fadfa3; background: #030307; padding:5px 0; font-size:18px;", "background: #fadfa3; padding:5px 0; font-size:18px;");
        if ($(".week-title")["length"] > 0) {
            let _0x4f3956 = ["一", "二", "三", "四", "五", "六", "日"],
                _0x50bd94 = new Date()["getDay"]();
            _0x50bd94 === 0 && (_0x50bd94 = 7);
            let _0x4ac570 = $("#week-list" + _0x50bd94),
                _0x52c015 = _0x4ac570["children"]();
            _0x4ac570["show"]();
            $(".week-bj")["addClass"]("week-" + _0x50bd94);
            $(".week-key" + _0x50bd94)["addClass"]("tim");
            let _0x3a8135 = $("#dataList"),
                _0x509593 = _0x3a8135["data"](),
                _0xc3657e = {
                    "weekday": _0x4f3956[_0x50bd94 - 1],
                    "num": _0x509593["num"],
                    "by": _0x509593["by"],
                    "type": _0x509593["type"]
                };
            HTML["Skeleton"](_0x52c015, 3, "vod");
            _0x24e389(_0xc3657e, _0x52c015, _0x509593);
            $(".week-title .week-select a")["click"](function () {
                $(this)["addClass"]("tim")["siblings"]()["removeClass"]("tim");
                let _0x3aabe2 = $(this)["data"]();
                $(".week-bj")["removeClass"]("week-1 week-2 week-3 week-4 week-5 week-6 week-7")["addClass"]("week-" + _0x3aabe2["index"]);
                $(".wow")["hide"]();
                _0x4ac570 = $("#week-list" + _0x3aabe2["index"]);
                _0x4ac570["show"]();
                _0x52c015 = _0x4ac570["children"]();
                if (_0x52c015["html"]()["length"] > 50) {
                    return;
                }
                _0xc3657e["weekday"] = _0x3aabe2["val"];
                HTML["Skeleton"](_0x52c015, 3, "vod");
                _0x24e389(_0xc3657e, _0x52c015, _0x509593);
            });
        }
        function _0x24e389(_0x27eb27, _0x3a8c0e, _0x1d5833) {
            setTimeout(function () {
                let _0x4625b2 = [],
                    _0x55b565 = Math["round"](new Date() / 1000),
                    _0x74ba5b = _0x27eb27;
                _0x74ba5b["time"] = _0x55b565;
                _0x74ba5b["key"] = EC["Md5"](_0x55b565);
                EC["Ajax"](_0x1d5833["api"], "post", "json", _0x74ba5b, function (_0x1fb14d) {
                    if (Number(_0x1fb14d["code"]) === 1) {
                        _0x4625b2 = HTML["Art"](_0x1fb14d, _0x1d5833);
                        if (EC["flow"]["empty"](_0x1fb14d["list"]["length"], _0x3a8c0e)) {
                            return;
                        }
                        _0x3a8c0e["html"](_0x4625b2["join"](""));
                        EC["Init"]["LazyLoad"]["update"]();
                        EC["Style"]["Footer"]();
                        $(".lang-bnt")["length"] === 1 && zh_tranBody();
                    } else {
                        if (Number(_0x1fb14d["code"]) === 2) {
                            $(".flow-more")["html"](_0x1fb14d["msg"]);
                        } else {
                            _EC["Pop"]["Msg"](language["27"] + _0x1fb14d["msg"], "", "error");
                        }
                    }
                }, function () {
                    _EC["Pop"]["Msg"](language["28"], "", "error");
                });
            }, 100);
        }
    },
    "Style": {
        "Init": function () {
            let _0xd9862a = $(".theme-style"),
                _0x249aab = EC["Cookie"]["Get"]("ec-wap_style");
            !EC["Empty"](_0x249aab) && ($("body")["attr"]("class", _0x249aab), _0x249aab === "theme1" ? _0xd9862a["html"]("&#xe574;")["attr"]("data-id", 1) : _0xd9862a["html"]("&#xe575;")["attr"]("data-id", 2));
            _0xd9862a["click"](function () {
                EC["Style"]["Switch"](_0xd9862a);
            });
        },
        "Set": function (_0x14eae6) {
            EC["Cookie"]["Set"]("ec-wap_style", _0x14eae6);
        },
        "Switch": function (_0x25d571) {
            let _0x7d4daa = _0x25d571["attr"]("data-id");
            Number(_0x7d4daa) === 1 ? ($("body")["attr"]("class", "theme2"), _0x25d571["html"]("&#xe575;")["attr"]("data-id", 2), EC["Style"]["Set"]("theme2")) : ($("body")["attr"]("class", "theme1"), _0x25d571["html"]("&#xe574;")["attr"]("data-id", 1), EC["Style"]["Set"]("theme1"));
        },
        "Footer": function () {
            $(".footer")["removeClass"]("footerLess");
            $(document["body"])["height"]() < $(window)["height"]() ? $(".footer")["addClass"]("footerLess") : $(".footer")["removeClass"]("footerLess");
        }
    },
    "Cookie": {
        "Set": function (_0x221740, _0x68697b, _0x5ee317) {
            let _0x3b95d2 = new Date();
            _0x3b95d2["setTime"](_0x3b95d2["getTime"]() + _0x5ee317 * 24 * 60 * 60 * 1000);
            document["cookie"] = _0x221740 + "=" + encodeURIComponent(_0x68697b) + ";path=/;expires=" + _0x3b95d2["toUTCString"]();
        },
        "Get": function (_0xda0af2) {
            let _0x4c400e = document["cookie"]["match"](new RegExp("(^| )" + _0xda0af2 + "=([^;]*)(;|$)"));
            if (_0x4c400e != null) {
                return decodeURIComponent(_0x4c400e[2]);
            }
        },
        "Del": function (_0x4769b0) {
            let _0x346b6f = new Date();
            _0x346b6f["setTime"](_0x346b6f["getTime"]() - 1);
            let _0x59c155 = this["Get"](_0x4769b0);
            _0x59c155 != null && (document["cookie"] = _0x4769b0 + "=" + encodeURIComponent(_0x59c155) + ";path=/;expires=" + _0x346b6f["toUTCString"]());
        }
    },
    "Empty": function (_0x47e407) {
        return _0x47e407 == null || _0x47e407 === "";
    },
    "debounce": function (_0x5d4f8c, _0x3837cc) {
        let _0x55a0c5 = null;
        return function () {
            let _0x5aa4a3 = this,
                _0x5c043e = arguments;
            clearTimeout(_0x55a0c5);
            _0x55a0c5 = setTimeout(function () {
                _0x5d4f8c["apply"](_0x5aa4a3, _0x5c043e);
            }, _0x3837cc);
        };
    },
    "GoBack": function () {
        let _0x37730f = document["domain"];
        document["referrer"]["indexOf"](_0x37730f) > 0 ? history["back"]() : window["location"] = "//" + _0x37730f;
    },
    "Ajax": function (_0x4e22d9, _0x44806d, _0x492797, _0x38f164, _0x2d1a4f, _0x3766d9, _0xa57b99) {
        _0x44806d = _0x44806d || "get";
        _0x492797 = _0x492797 || "json";
        _0x38f164 = _0x38f164 || "";
        _0x3766d9 = _0x3766d9 || "";
        _0xa57b99 = _0xa57b99 || "";
        $["ajax"]({
            "url": _0x4e22d9,
            "type": _0x44806d,
            "dataType": _0x492797,
            "data": _0x38f164,
            "timeout": 5000,
            "beforeSend": function (_0x1bda21) {},
            "error": function (_0x16d666, _0x4a579c, _0x540641) {
                if (_0x3766d9) {
                    _0x3766d9(_0x16d666, _0x4a579c, _0x540641);
                }
            },
            "success": function (_0x527995) {
                _0x2d1a4f(_0x527995);
            },
            "complete": function (_0xf2a1ac, _0x5ca30e) {
                if (_0xa57b99) {
                    _0xa57b99(_0xf2a1ac, _0x5ca30e);
                }
            }
        });
    },
    "flow": {
        "load": function (_0x877b41) {
            _0x877b41 = _0x877b41 || {};
            let _0x34e8a6 = this,
                _0x350086 = 0,
                _0x762eab,
                _0x271e9d,
                _0x4a188c,
                _0x357424 = $(_0x877b41["elem"]);
            if (!_0x357424[0]) {
                return;
            }
            let _0x3c2a2d = $(_0x877b41["scrollElem"] || document),
                _0x2c2548 = _0x877b41["mb"] || 50,
                _0x19dfc8 = "isAuto" in _0x877b41 ? _0x877b41["isAuto"] : !![],
                _0x2c6b11 = _0x877b41["end"] || language["29"],
                _0x2b881c = _0x877b41["scrollElem"] && _0x877b41["scrollElem"] !== document,
                _0x30b80f = "<i class=\"fa ds-jiantouyou\"></i>" + language["30"],
                _0x58ce66 = $("<div class=\"flow-more cor5\"><a href=\"javascript:;\">" + _0x30b80f + "</a></div>");
            !_0x357424["find"](".flow-more")[0] && _0x357424["append"](_0x58ce66);
            let _0x2a8a7b = function (_0x3baae8, _0x30115d) {
                    Number(_0x350086) === 1 && $(".flow-more")["siblings"]()["remove"]();
                    _0x3baae8 = $(_0x3baae8);
                    _0x58ce66["before"](_0x3baae8);
                    _0x30115d = Number(_0x30115d) === 0 ? !![] : null;
                    _0x30115d ? _0x58ce66["html"](_0x2c6b11) : _0x58ce66["find"]("a")["html"](_0x30b80f);
                    _0x271e9d = _0x30115d;
                    _0x762eab = null;
                    EC["Init"]["LazyLoad"]["update"]();
                },
                _0x4b2d01 = function () {
                    _0x762eab = !![];
                    _0x58ce66["find"]("a")["html"]("<i class=\"loading3\"></i>" + language["31"]);
                    typeof _0x877b41["done"] === "function" && _0x877b41["done"](++_0x350086, _0x2a8a7b, _0x357424);
                };
            _0x4b2d01();
            _0x58ce66["find"]("a")["on"]("click", function () {
                if (_0x271e9d) {
                    return;
                }
                _0x762eab || _0x4b2d01();
            });
            if (!_0x19dfc8) {
                return _0x34e8a6;
            }
            _0x3c2a2d["off"]("scroll");
            _0x3c2a2d["on"]("scroll", function () {
                let _0x1312a4 = $(this),
                    _0x34383d = _0x1312a4["scrollTop"]();
                if (_0x4a188c) {
                    clearTimeout(_0x4a188c);
                }
                if (_0x271e9d || !_0x357424["width"]()) {
                    return;
                }
                _0x4a188c = setTimeout(function () {
                    let _0x4158c0 = _0x2b881c ? _0x1312a4["height"]() : $(window)["height"](),
                        _0xbd067d = _0x2b881c ? _0x1312a4["prop"]("scrollHeight") : document["documentElement"]["scrollHeight"];
                    _0xbd067d - _0x34383d - _0x4158c0 <= _0x2c2548 && (_0x762eab || _0x4b2d01());
                }, 100);
            });
            return _0x34e8a6;
        },
        "empty": function (_0x290e77, _0x4904ac) {
            if (Number(_0x290e77) === 0) {
                _0x4904ac["html"]("<div class=\"null cor5\"><img src=\"" + maccms["path2"] + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["32"] + "</span></div>");
                return !![];
            }
            return ![];
        },
        "get": function (_0x17296a, _0x42acaa, _0x357d84, _0x3deeff) {
            if (_0x42acaa["length"] > 0) {
                EC["flow"]["load"]({
                    "elem": "#dataList",
                    "isAuto": _0x357d84["pattern"],
                    "end": _0x357d84["txt"],
                    "done": function (_0x21f058, _0x4f2f96, _0x14efbc) {
                        setTimeout(function () {
                            let _0x1630d3 = [],
                                _0x26d10c = Math["ceil"](new Date()["getTime"]() / 1000),
                                _0x53db1d = $["extend"](_0x17296a, {
                                    "page": _0x21f058,
                                    "time": _0x26d10c,
                                    "key": EC["Md5"](_0x26d10c)
                                });
                            EC["Ajax"](_0x357d84["api"], "post", "json", _0x53db1d, function (_0x5ecbae) {
                                if (Number(_0x5ecbae["code"]) === 1) {
                                    if (EC["flow"]["empty"](_0x5ecbae["list"]["length"], _0x14efbc)) {
                                        return;
                                    }
                                    _0x1630d3 = HTML["Art"](_0x5ecbae, _0x357d84);
                                    _0x4f2f96(_0x1630d3["join"](""), _0x21f058 < _0x5ecbae["pagecount"]);
                                    _0x3deeff();
                                    EC["Style"]["Footer"]();
                                    $(".lang-bnt")["length"] === 1 && zh_tranBody();
                                } else {
                                    if (Number(_0x5ecbae["code"]) === 2) {
                                        $(".flow-more")["html"](_0x5ecbae["msg"]);
                                    } else {
                                        _EC["Pop"]["Msg"](language["27"] + _0x5ecbae["msg"], "", "error");
                                    }
                                }
                            }, function () {
                                _EC["Pop"]["Msg"](language["28"], "", "error");
                            });
                        }, 100);
                    }
                });
            }
        }
    },
    "Copy": {
        "Init": function () {
            EC["Width"] < 767 ? ($(".play-score")["click"](function () {
                EC["Pop"]["Show"]($("#rating")["prop"]("outerHTML"), language["33"], function () {});
            }), $(".vod-detail-share")["click"](function () {
                $(".vod-detail .share-box")["remove"]();
                let _0x2c882a = "<div class=\"cor5 radius\"><span class=\"share-tips\">" + language["34"] + "</span><span id=\"bar\" class=\"share-url bj cor5\">" + window["location"]["href"] + $(document)["attr"]("title") + "</span><button type=\"button\" class=\"share-copy bj2 ho radius copyBtn\" data-clipboard-action=\"copy\" data-clipboard-target=\"#bar\">" + language["35"] + "</button></div>";
                EC["Pop"]["Show"](_0x2c882a, language["18"], function () {
                    $(document)["on"]("click", ".copyBtn", function () {
                        _EC["Pop"]["Msg"](language["36"], "", "success"), $(".window")["remove"]();
                    });
                });
                new ClipboardJS(".copyBtn");
            })) : ($(".share-url")["html"](window["location"]["href"] + $(document)["attr"]("title")), new ClipboardJS(".copyBtn"), EC["Copy"]["Qrcode"](), $(".vod-detail-share")["hover"](function () {
                $(".vod-detail .share-box")["show"]();
                $(document)["on"]("click", ".copyBtn", function () {
                    $(".vod-detail .share-box")["hide"]();
                    _EC["Pop"]["Msg"](language["36"], "", "success");
                });
            }, function () {
                $(".vod-detail .share-box")["hide"]();
            }));
            $(".player-share-button")["click"](function () {
                $(".player-share-box")["fadeToggle"]();
                $(".charge,.tips-box")["hide"]();
                $(".player-share-box .copyBtn")["click"](function () {
                    _EC["Pop"]["Msg"](language["36"], "", "success"), $(".player-share-box")["slideUp"]();
                });
            });
            let _0x327a21 = new ClipboardJS(".CopyUel");
            $(".CopyUel")["click"](function () {
                _0x327a21["on"]("success", function () {
                    _EC["Pop"]["Msg"](language["37"], "", "success");
                });
                _0x327a21["on"]("error", function () {
                    _EC["Pop"]["Msg"](language["38"], "", "error");
                });
            });
        },
        "Qrcode": function () {
            $(".hl-cans")["each"](function () {
                if ($(this)["length"]) {
                    $(this)["qrcode"]({
                        "width": 120,
                        "height": 120,
                        "text": encodeURI(window["location"]["href"])
                    });
                    function _0x26b9f4(_0x1800e4) {
                        let _0x35b68d = new Image();
                        _0x35b68d["src"] = _0x1800e4["toDataURL"]("image/png");
                        return _0x35b68d;
                    }
                    let _0x300b6f = $("canvas")[0],
                        _0x11a86f = _0x26b9f4(_0x300b6f);
                    $(this)["next"](".share-pic")["append"](_0x11a86f);
                }
            });
        }
    },
    "Swiper": {
        "Navs": function () {
            new Swiper(".nav-swiper", {
                "observer": !![],
                "freeMode": !![],
                "slidesPerView": "auto",
                "direction": "horizontal",
                "on": {
                    "init": function () {
                        EC["Swiper"]["Nav"](this["$el"], this["$wrapperEl"], this["virtualSize"]);
                    },
                    "observerUpdate": function () {
                        EC["Swiper"]["Nav"](this["$el"], this["$wrapperEl"], this["virtualSize"]);
                    }
                }
            });
        },
        "Nav": function (_0x13071a, _0x152f28, _0x1a3838) {
            if (_0x13071a["find"](".nav-dt")["length"] > 0) {
                let _0x527bfe = _0x13071a["find"](".nav-dt")["outerWidth"](!![]),
                    _0x223f0d = _0x13071a["find"](".nav-dt")[0]["offsetLeft"],
                    _0xe05bab = _0x152f28["parent"]()["outerWidth"](!![]),
                    _0x481277 = parseInt(_0x1a3838);
                _0x152f28["transition"](300);
                if (_0x223f0d < (_0xe05bab - parseInt(_0x527bfe)) / 2) {
                    _0x152f28["transform"]("translate3d(0px,0px,0px)");
                } else {
                    if (_0x223f0d > _0x481277 - (parseInt(_0x527bfe) + _0xe05bab) / 2) {
                        _0x152f28["transform"]("translate3d(" + (_0xe05bab - _0x481277) + "px,0px,0px)");
                    } else {
                        _0x152f28["transform"]("translate3d(" + ((_0xe05bab - parseInt(_0x527bfe)) / 2 - _0x223f0d) + "px,0px,0px)");
                    }
                }
            }
        },
        "Slide": function () {
            new Swiper(".slide-swiper", {
                "autoplay": !![],
                "loop": !![],
                "slidesPerView": 1
            });
            new Swiper(".mySwiper", {
                "loop": !![],
                "autoplay": !![],
                "clickable": !![],
                "slidesPerView": 1,
                "pagination": {
                    "el": ".swiper-pagination"
                }
            });
            new Swiper(".slide-swiper2", {
                "autoplay": {
                    "disableOnInteraction": ![]
                },
                "loop": !![],
                "slidesPerView": 1,
                "on": {
                    "init": function () {
                        let _0x234ff0 = $(".lazy-p")["eq"](1)["css"]("backgroundImage");
                        $(".slide-time-ios")["css"]("backgroundImage", _0x234ff0);
                    },
                    "slideChangeTransitionEnd": function () {
                        let _0x2d0fd5 = $(".lazy-p")["eq"](this["realIndex"] - 1)["css"]("backgroundImage");
                        $(".slide-time-ios")["css"]("backgroundImage", _0x2d0fd5);
                    }
                }
            });
            let _0x317318 = new Swiper(".you-ku", {
                "loop": !![],
                "slidesPerView": 1,
                "autoplay": {
                    "disableOnInteraction": ![]
                },
                "pagination": {
                    "el": ".swiper-pagination"
                },
                "on": {
                    "slideNextTransitionEnd": function () {
                        $(".slide-nav-list li")["eq"](this["realIndex"])["addClass"]("on")["siblings"]()["removeClass"]("on");
                        _0x5650a8();
                    }
                }
            });
            $(".slide-nav-list li")["hover"](function () {
                $(this)["addClass"]("on")["siblings"]()["removeClass"]("on");
                {
                    _0x317318["slideTo"]($(".slide-nav-list li")["index"](this) + 1, 1000, ![]);
                    _0x5650a8();
                }
            });
            function _0x5650a8() {
                let _0x2c0352 = $(".slid-g .swiper-slide-active .this-100")["html"]();
                $(".slide-nav-link")["html"]("<div class=\"this-100\">" + _0x2c0352 + "</div>");
            }
        },
        "Roll": function () {
            new Swiper(".roll", {
                "paginationClickable": !![],
                "slidesPerView": "auto"
            });
        }
    },
    "Actor": {
        "Detail": function () {
            new Swiper(".list-swiper", {
                "slidesPerView": 3,
                "slidesPerGroup": 3,
                "observer": !![],
                "navigation": {
                    "nextEl": ".swiper-button-next",
                    "prevEl": ".swiper-button-prev"
                },
                "breakpoints": {
                    2200: {
                        "slidesPerView": 10,
                        "slidesPerGroup": 10
                    },
                    1934: {
                        "slidesPerView": 9,
                        "slidesPerGroup": 9
                    },
                    1692: {
                        "slidesPerView": 8,
                        "slidesPerGroup": 8
                    },
                    1330: {
                        "slidesPerView": 7,
                        "slidesPerGroup": 7
                    },
                    767: {
                        "freeMode": !![],
                        "slidesPerView": "auto",
                        "slidesPerGroup": 1
                    }
                }
            });
            let _0xff0d13 = $(".star-works .actor-api");
            if (_0xff0d13["length"] > 0) {
                if ($(".star-works .public-list-box")["length"] > 0) {
                    _0x220638($(".star-active")["attr"]("data-actor"));
                } else {
                    $(".star-works")["hide"]();
                }
            }
            $(".star-works-top .public-list-box")["click"](function () {
                $(this)["addClass"]("star-active")["siblings"]()["removeClass"]("star-active");
                _0x220638($(this)["attr"]("data-actor"));
            });
            function _0x220638(_0x321755) {
                let _0x17aa7e = "";
                for (let _0x13794d = 0; _0x13794d < 9; _0x13794d++) {
                    _0x17aa7e = _0x17aa7e + "<div class=\"public-list-box public-pic-b swiper-slide\"><div class=\"public-list-div\">" + "<a class=\"public-list-exp\"><div class=\"lazy box\"><span class=\"loadIcon spin-dot-spin\"><i class=\"spin-dot-item\"></i><i class=\"spin-dot-item\"></i>" + "<i class=\"spin-dot-item\"></i><i class=\"spin-dot-item\"></i></span></div></a></div><div class=\"public-list-button\"><a class=\"time-title box radius\"></a>" + "</div></div>";
                }
                _0xff0d13["html"](_0x17aa7e);
                EC["Ajax"](maccms["path"] + "/index.php/api/actor_vod_api?name=" + _0x321755, "get", "json", "", function (_0x209d30) {
                    if (Number(_0x209d30["code"]) === 1) {
                        _0x17aa7e = "";
                        $["each"](_0x209d30["list"], function (_0x4950a7, _0x4a66db) {
                            _0x17aa7e = _0x17aa7e + "    <div class=\"public-list-box public-pic-" + _0x209d30["ajax"]["vod_pic"] + " swiper-slide\">\n" + "        <div class=\"public-list-div public-list-bj\">\n" + "            <a" + HTML["Target"](_0x209d30["ajax"]["vod_target"]) + " class=\"public-list-exp\" href=\"" + _0x4a66db["url"] + "\">\n" + "                <img class=\"lazy lazy1 gen-movie-img " + maccms["vod_mask"] + "\" alt=\"" + _0x4a66db["name"] + "\" referrerpolicy=\"no-referrer\" data-src=\"" + _0x4a66db["pic"] + "\" />" + "                <span class=\"public-bg\"></span>\n" + "                <span class=\"public-play\"><i class=\"fa\">&#xe593;</i></span>\n" + "            </a>\n" + "        </div>\n" + "        <div class=\"public-list-button\"><a" + HTML["Target"](_0x209d30["ajax"]["vod_target"]) + " class=\"time-title ft4 hide\" href=\"" + _0x4a66db["url"] + "\" title=\"" + _0x4a66db["name"] + "\">" + _0x4a66db["name"] + "</a></div>" + "    </div>";
                        });
                        _0xff0d13["html"](_0x17aa7e);
                        EC["Init"]["LazyLoad"]["update"]();
                        $(".lang-bnt")["length"] === 1 && zh_tranBody();
                    } else {
                        _EC["Pop"]["Msg"](language["39"], "", "error");
                    }
                });
            }
        }
    },
    "Pop": {
        "Uid": "DCC147D11943AF75",
        "Drawer": function (_0x3a3aac, _0x15fdcb) {
            if ($(".drawer-list")["length"] > 0) {
                _EC["Pop"]["Msg"](language["40"], "", "error");
                return;
            }
            $("body")["append"]("<div class=\"drawer-list\"><div class=\"drawer-list-bg box-bg ease\" style=\"display:none\"></div><div class=\"drawer-list-box bj3\"></div></div>");
            $(".drawer-list-box")["html"](_0x3a3aac);
            _0x15fdcb();
            setTimeout(function () {
                $(".drawer-list-bg")["css"]({
                    "display": "block"
                });
                $("body")["css"]({
                    "height": "100%",
                    "width": "100%",
                    "overflow": "hidden"
                });
                $(".drawer-list")["addClass"]("drawer-show");
            }, 0);
            $(".drawer-list-bg")["on"]("click", function () {
                EC["Pop"]["DrawerDel"]();
            })["on"]("touchmove", function () {
                EC["Pop"]["DrawerDel"]();
            });
        },
        "DrawerDel": function () {
            $(".drawer-list-box")["addClass"]("drawer-out");
            $("body")["css"]({
                "height": "",
                "width": "",
                "overflow": ""
            });
            $(".drawer-list-bg")["css"]({
                "display": "none"
            });
            setTimeout(function () {
                $(".drawer-list")["remove"]();
            }, 100);
        },
        "Show": function (_0x4674b2, _0x22f413, _0x30d3d4) {
            Number($(".window")["length"]) !== 1 && EC["Pop"]["RemoveWin"]();
            $("body")["append"]("<div class=\"window\"><div class=\"box-bg\"></div><div class=\"window-box\"><div class=\"topfadeInUp animated bj3 cor4\"><div class=\"window-title rel\"><h2 class=\"subscript ft4 br\"></h2><a class=\"window-off fa ds-guanbi\"></a></div><div class=\"window-content\"></div></div></div></div>");
            $(".window .subscript")["html"](_0x22f413);
            $(".window-content")["html"](_0x4674b2);
            $(".window-box")["addClass"]("window-show");
            $(document)["on"]("click", ".box-bg", function () {
                $(this)["parent"]()["remove"]();
            });
            $(document)["on"]("click", ".window-off", function () {
                $(this)["parent"]()["parent"]()["parent"]()["parent"]()["remove"]();
            });
            _0x30d3d4();
        },
        "RemoveWin": function () {
            $(".window")["remove"]();
        }
    },
    "Toggle": function () {
        $(".switch-button a")["click"](function () {
            $(this)["addClass"]("selected")["siblings"]()["removeClass"]("selected");
            let _0x22853c = $(".switch-button a")["index"](this),
                _0x2e3881 = $(".switch-box .check")["eq"](_0x22853c);
            _0x2e3881["fadeIn"](800)["siblings"]()["hide"]();
            _0x2e3881["addClass"]("selected")["siblings"]()["removeClass"]("selected");
        });
    },
    "player": {
        "player_jx": function (_0x5bd170, _0xba705b) {
            let _0x309a33 = {},
                _0x257e39 = _0x5bd170["split"]("#");
            for (let _0x219ace = 0; _0x219ace < _0x257e39["length"]; _0x219ace++) {
                let _0x4df9b1 = _0x257e39[_0x219ace]["split"]("$"),
                    _0x518201 = _0x4df9b1[1]["split"](",");
                for (let _0x19cd57 = 0; _0x19cd57 < _0x518201["length"]; _0x19cd57++) {
                    _0x309a33["hasOwnProperty"](_0x518201[_0x19cd57]) ? _0x309a33[_0x518201[_0x19cd57]][Object["keys"](_0x309a33[_0x518201[_0x19cd57]])["length"]] = {
                        "name": _0x4df9b1[0],
                        "api": _0x4df9b1[2]
                    } : _0x309a33[_0x518201[_0x19cd57]] = {
                        0: {
                            "name": _0x4df9b1[0],
                            "api": _0x4df9b1[2]
                        }
                    };
                }
            }
            let _0x195d34 = "";
            for (let _0x169d6b in _0x309a33) {
                if (_0x169d6b == _0xba705b) {
                    let _0x160d47 = _0x309a33[_0x169d6b];
                    for (let _0x45538b = 0; _0x45538b < Object["keys"](_0x160d47)["length"]; _0x45538b++) {
                        if (!EC["Empty"](maccms["jx_index"]) && _0x45538b == maccms["jx_index"]) {
                            _0x195d34 = _0x195d34 + "<a class=\"box radius hide border bj2\" href=\"javascript:\" data-api=\"" + _0x160d47[_0x45538b]["api"] + "\">" + _0x160d47[_0x45538b]["name"] + "</a>";
                        } else {
                            _0x195d34 = _0x195d34 + "<a class=\"box radius hide border\" href=\"javascript:\" data-api=\"" + _0x160d47[_0x45538b]["api"] + "\">" + _0x160d47[_0x45538b]["name"] + "</a>";
                        }
                    }
                }
            }
            _0x195d34["length"] > 1 && $(".line-switch")["html"](_0x195d34);
        }
    },
    "User": {
        "BoxShow": 0,
        "IsLogin": 0,
        "Init": function () {
            !EC["Empty"](EC["Cookie"]["Get"]("user_id")) && (EC["User"]["IsLogin"] = 1);
            $(document)["on"]("click", ".head-user", function () {
                if (EC["Empty"](EC["Cookie"]["Get"]("user_id"))) {
                    EC["User"]["Login"]();
                } else {
                    window["location"]["href"] = $(this)["attr"]("data-url");
                }
            });
            $(document)["on"]("click", ".head-user-out", function () {
                EC["User"]["Logout"]();
            });
        },
        "Login": function () {
            EC["Ajax"](maccms["path"] + "/index.php/user/ajax_login", "post", "json", "", function (_0x272864) {
                EC["Pop"]["Show"](_0x272864, language["41"], function () {
                    $("body")["on"]("click", "#wp-submit", function () {
                        $(this)["unbind"]("click");
                        EC["Ajax"](maccms["path"] + "/index.php/user/login", "post", "json", $(".login-form")["serialize"](), function (_0x6b37d5) {
                            _EC["Pop"]["Msg"](_0x6b37d5["msg"], "", "error");
                            Number(_0x6b37d5["code"]) === 1 && location["reload"]();
                        });
                    });
                });
            }, function () {
                _EC["Pop"]["Msg"](language["42"], "", "error");
            });
        },
        "Logout": function () {
            $(this)["unbind"]("click");
            EC["Ajax"](maccms["path"] + "/index.php/user/logout", "post", "json", "", function (_0x362657) {
                _EC["Pop"]["Msg"](_0x362657["msg"]);
                if (Number(_0x362657["code"]) === 1) {
                    location["reload"]();
                }
            });
        },
        "Collection": function () {
            $("body")["on"]("click", ".collection", function () {
                if (Number(EC["User"]["IsLogin"]) === 0) {
                    EC["User"]["Login"]();
                    return;
                }
                let _0x118a74 = $(this);
                _0x118a74["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/user/ajax_ulog/?ac=set&mid=" + _0x118a74["attr"]("data-mid") + "&id=" + _0x118a74["attr"]("data-id") + "&type=" + _0x118a74["attr"]("data-type"), "get", "json", "", function () {
                    _EC["Pop"]["Msg"]("收藏成功");
                });
            });
        }
    },
    "Ulog": {
        "Init": function () {
            EC["Ulog"]["Set"]();
        },
        "Set": function () {
            let _0x117736 = $(".ds-log-set");
            _0x117736["attr"]("data-mid") && $["get"](maccms["path"] + "/index.php/api/ulog/?ac=set&mid=" + _0x117736["attr"]("data-mid") + "&id=" + _0x117736["attr"]("data-id") + "&sid=" + _0x117736["attr"]("data-sid") + "&nid=" + _0x117736["attr"]("data-nid") + "&type=" + _0x117736["attr"]("data-type"));
        }
    },
    "Hits": {
        "Init": function () {
            let _0x31c497 = $(".ds-hits");
            if (Number(_0x31c497["length"]) === 0) {
                return;
            }
            EC["Ajax"](maccms["path"] + "/index.php/ajax/hits?mid=" + _0x31c497["attr"]("data-mid") + "&id=" + _0x31c497["attr"]("data-id") + "&type=update", "get", "json", "", function (_0x5868cf) {
                Number(_0x5868cf["code"]) === 1 && $(".ds-hits")["each"](function (_0x56c63e) {
                    let _0x12fde5 = $(".ds-hits")["eq"](_0x56c63e)["attr"]("data-type");
                    _0x12fde5 !== "insert" && $("." + _0x12fde5)["html"](eval("(r.data." + _0x12fde5 + ")"));
                });
            });
        }
    },
    "Md5": function (_0x5c71d3) {
        return hex_md5("DS" + _0x5c71d3 + EC["Pop"]["Uid"]);
    },
    "Score": function () {
        let _0xbe444b = 0;
        $(document)["on"]("click", "#rating li", function () {
            if (_0xbe444b > 0) {
                _EC["Pop"]["Msg"](language["43"]);
            } else {
                let _0x4c0e26 = $("#rating")["data"]();
                EC["Ajax"](maccms["path"] + "/index.php/ajax/score?mid=" + _0x4c0e26["mid"] + "&id=" + _0x4c0e26["id"] + "&score=" + $(this)["attr"]("val") * 2, "post", "json", "", function (_0x40055a) {
                    _EC["Pop"]["Msg"](_0x40055a["msg"]);
                    _0xbe444b = 1;
                }, function () {
                    _EC["Pop"]["Msg"](language["44"], "", "error");
                });
            }
            $(this)["nextAll"]()["removeClass"]("active");
            $(this)["prevAll"]()["addClass"]("active");
            $(this)["addClass"]("active");
        });
    },
    "Suggest": {
        "Init": function (_0x542ee5, _0x50ef46) {
            if (Number(maccms["so_off"]) === 1) {
                try {
                    $(_0x542ee5)["autocomplete"](maccms["path"] + "/index.php/ajax/suggest?mid=" + _0x50ef46, {
                        "inputClass": "search-input",
                        "resultsClass": "results",
                        "loadingClass": "loading",
                        "appendTo": ".completion",
                        "minChars": 1,
                        "matchSubset": 0,
                        "cacheLength": 10,
                        "multiple": ![],
                        "matchContains": !![],
                        "autoFill": ![],
                        "dataType": "json",
                        "parse": function (_0x38646f) {
                            if (Number(_0x38646f["code"]) === 1) {
                                let _0x4809c2 = [];
                                $["each"](_0x38646f["list"], function (_0x533660, _0x2c1bb8) {
                                    _0x2c1bb8["url"] = _0x38646f["url"];
                                    _0x4809c2[_0x533660] = {
                                        "data": _0x2c1bb8
                                    };
                                });
                                return _0x4809c2;
                            } else {
                                return {
                                    "data": ""
                                };
                            }
                        },
                        "formatItem": function (_0x145936) {
                            return _0x145936["name"];
                        },
                        "formatResult": function (_0x376b1b) {
                            return _0x376b1b["text"];
                        }
                    })["result"](function (_0x4f2895, _0x118b6b) {
                        $(_0x542ee5)["val"](_0x118b6b["name"]);
                        let _0x51deba = _0x118b6b["url"]["replace"]("mac_wd", encodeURIComponent(_0x118b6b["name"]));
                        EC["Records"]["Set"](_0x118b6b["name"], _0x51deba);
                        location["href"] = _0x51deba;
                    });
                } catch (_0x1302c5) {}
            }
        }
    },
    "History": {
        "BoxShow": 0,
        "Limit": 30,
        "Days": 7,
        "Json": "",
        "Msg": "<div class=\"null cor5\"><img src=\"" + maccms["path2"] + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["45"] + "</span></div>",
        "Init": function () {
            let _0x5553d0 = [];
            if (this["Json"]) {
                _0x5553d0 = this["Json"];
            } else {
                let _0x459772 = EC["Cookie"]["Get"]("mac_history");
                !EC["Empty"](_0x459772) && (_0x5553d0 = eval(_0x459772));
            }
            let _0x158527 = "";
            if (_0x5553d0["length"] > 0) {
                for (let _0x2f7017 = 0; _0x2f7017 < _0x5553d0["length"]; _0x2f7017++) {
                    _0x158527 += "<li><a class=\"history-a flex\" href=\"" + _0x5553d0[_0x2f7017]["link"] + "\" target=\"video\" title=\"" + _0x5553d0[_0x2f7017]["name"] + "\"><img class=\"lazy lazy1\" referrerpolicy=\"no-referrer\" alt=\"" + _0x5553d0[_0x2f7017]["name"] + "\" data-src=\"" + _0x5553d0[_0x2f7017]["pic"] + "\"/>" + "<div class=\"history-r\"><div class=\"hide2\">" + _0x5553d0[_0x2f7017]["name"] + "</div><div><span class=\"cor5\">" + _0x5553d0[_0x2f7017]["mid"] + "</span></div></div></a></li>";
                }
            } else {
                _0x158527 += this["Msg"];
            }
            $(".locality-history ul")["html"](_0x158527);
            $("#l_history")["click"](function () {
                EC["History"]["Clear"]();
            });
            let _0x5a93a8 = $(".ds-history-set");
            _0x5a93a8["attr"]("data-name") && EC["History"]["Set"](_0x5a93a8["attr"]("data-name"), _0x5a93a8["attr"]("data-link"), _0x5a93a8["attr"]("data-pic"), _0x5a93a8["attr"]("data-mid"));
        },
        "Set": function (_0x585122, _0x5864ea, _0x171db6, _0x5c5b3a) {
            if (!_0x5864ea) {
                _0x5864ea = document["URL"];
            }
            let _0x1b9f46 = EC["Cookie"]["Get"]("mac_history"),
                _0x26e010 = "";
            if (!EC["Empty"](_0x1b9f46)) {
                this["Json"] = eval(_0x1b9f46);
                for (let _0x148a19 = 0; _0x148a19 < this["Json"]["length"]; _0x148a19++) {
                    if (this["Json"][_0x148a19]["link"] === _0x5864ea) {
                        return ![];
                    }
                }
                _0x26e010 = "{log:[{\"name\":\"" + _0x585122 + "\",\"link\":\"" + _0x5864ea + "\",\"pic\":\"" + _0x171db6 + "\",\"mid\":\"" + _0x5c5b3a + "\"},";
                for (let _0x56bb13 = 0; _0x56bb13 < this["Json"]["length"]; _0x56bb13++) {
                    if (_0x56bb13 <= this["Limit"] && this["Json"][_0x56bb13]) {
                        let _0x3a400e = this["Json"][_0x56bb13]["name"];
                        if (_0x3a400e === _0x585122) {} else {
                            _0x26e010 += "{\"name\":\"" + this["Json"][_0x56bb13]["name"] + "\",\"link\":\"" + this["Json"][_0x56bb13]["link"] + "\",\"pic\":\"" + this["Json"][_0x56bb13]["pic"] + "\",\"mid\":\"" + this["Json"][_0x56bb13]["mid"] + "\"},";
                        }
                    } else {
                        break;
                    }
                }
                _0x26e010 = _0x26e010["substring"](0, _0x26e010["lastIndexOf"](","));
                _0x26e010 += "]}";
            } else {
                _0x26e010 = "{log:[{\"name\":\"" + _0x585122 + "\",\"link\":\"" + _0x5864ea + "\",\"pic\":\"" + _0x171db6 + "\",\"mid\":\"" + _0x5c5b3a + "\"}]}";
            }
            this["Json"] = eval(_0x26e010);
            EC["Cookie"]["Set"]("mac_history", _0x26e010, this["Days"]);
        },
        "Clear": function () {
            EC["Cookie"]["Del"]("mac_history");
            $(".locality-history ul")["html"](this["Msg"]);
        }
    },
    "Records": {
        "Limit": 8,
        "Days": 7,
        "Json": "",
        "Init": function () {
            EC["Records"]["Click"]();
            let _0x2b6479 = [];
            if (this["Json"]) {
                _0x2b6479 = this["Json"];
            } else {
                let _0xec90f1 = EC["Cookie"]["Get"]("DS_Records");
                !EC["Empty"](_0xec90f1) && (_0x2b6479 = eval(_0xec90f1));
            }
            if (_0x2b6479["length"] > 0) {
                let _0x1c9fdd = "";
                for (let _0x172c1e = 0; _0x172c1e < _0x2b6479["length"]; _0x172c1e++) {
                    _0x1c9fdd += "<a href=\"" + _0x2b6479[_0x172c1e]["url"] + "?wd=" + _0x2b6479[_0x172c1e]["name"] + "\" class=\"public-list-b bj border\">" + _0x2b6479[_0x172c1e]["name"] + "</a>";
                }
                $(".records-list")["html"](_0x1c9fdd);
            } else {
                $(".records-list")["html"]("<span class=\"cor5\">" + language["46"] + "</span>");
            }
            $(document)["on"]("click", "#re_del", function () {
                EC["Records"]["Clear"]();
            });
        },
        "Set": function (_0x19df3a, _0x4c5c41) {
            let _0x195b5c = EC["Cookie"]["Get"]("DS_Records"),
                _0x182f13 = {};
            if (!EC["Empty"](_0x195b5c)) {
                this["Json"] = eval(_0x195b5c);
                for (let _0x46d8f5 = 0; _0x46d8f5 < this["Json"]["length"]; _0x46d8f5++) {
                    if (this["Json"][_0x46d8f5]["name"] === _0x19df3a) {
                        return ![];
                    }
                }
                _0x182f13 = "{log:[{\"name\":\"" + _0x19df3a + "\",\"url\":\"" + _0x4c5c41 + "\"},";
                for (let _0x4085f0 = 0; _0x4085f0 < this["Json"]["length"]; _0x4085f0++) {
                    if (_0x4085f0 <= this["Limit"] && this["Json"][_0x4085f0]) {
                        let _0x13734f = this["Json"][_0x4085f0]["name"];
                        if (_0x13734f === _0x19df3a) {} else {
                            _0x182f13 += "{\"name\":\"" + this["Json"][_0x4085f0]["name"] + "\",\"url\":\"" + this["Json"][_0x4085f0]["url"] + "\"},";
                        }
                    } else {
                        break;
                    }
                }
                _0x182f13 = _0x182f13["substring"](0, _0x182f13["lastIndexOf"](","));
                _0x182f13 += "]}";
            } else {
                _0x182f13 = "{log:[{\"name\":\"" + _0x19df3a + "\",\"url\":\"" + _0x4c5c41 + "\"}]}";
            }
            this["Json"] = eval(_0x182f13);
            EC["Cookie"]["Set"]("DS_Records", _0x182f13, this["Days"]);
        },
        "Clear": function () {
            EC["Cookie"]["Del"]("DS_Records");
            $(".records-list")["html"]("<span class=\"cor5\">" + language["47"] + "</span>");
        },
        "Click": function () {
            $(".head .this-select")["click"](function () {
                if ($(this)["attr"]("data-id") === "1") {
                    $(this)["attr"]("data-id", "0")["find"]("i")["html"]("&#xe564;");
                    let _0x3f38e6 = $(".select-list .ease")["html"]();
                    $(".head .this-search")["append"]("<div class=\"this-search-select bj radius br cor4\">" + _0x3f38e6 + "</div>");
                } else {
                    $(this)["attr"]("data-id", "1")["find"]("i")["html"]("&#xe563;");
                    $(".head .this-search-select")["remove"]();
                }
            });
            $("body")["on"]("click", ".head .this-search-select span", function () {
                let _0x3de072 = $(this)["data"]();
                $(".head .this-select")["html"](_0x3de072["name"] + "<i class=\"fa\">&#xe563;</i>")["attr"]("data-id", "1");
                $("#search2")["attr"]("action", _0x3de072["url"]);
                $(".head .this-search-select")["remove"]();
            });
            $(".head .this-search .ds-sousuo")["click"](function () {
                let _0x1e9263 = $(".head .this-input")["val"](),
                    _0x1fcbf7 = $("#search2")["attr"]("action");
                if (EC["Empty"](_0x1e9263)) {
                    event["preventDefault"](), _EC["Pop"]["Msg"](language["48"], "", "error");
                } else {
                    if ($(".lang-bnt")["length"] === 1) {
                        const _0x223fd1 = transChinese(_0x1e9263);
                        $(".head .this-input")["val"](_0x223fd1);
                        _0x1e9263 = _0x223fd1;
                    }
                    EC["Records"]["Set"](_0x1e9263, _0x1fcbf7);
                }
            });
            $(".head .this-input")["click"](function () {
                let _0x49c8f4 = $(".public-list-new")["html"](),
                    _0x3810ba = $(".pop-list-body .wap-diy-vod-e")["html"]();
                $(".head .this-search")["append"]("<div class=\"this-search-get\"><div class=\"box radius\">" + "<div>" + _0x49c8f4 + "</div>" + "<div class=\"wap-diy-vod-e search-hot\">" + _0x3810ba + "</div>" + "</div></div>");
            })["keydown"](function () {
                $(".head .this-search-get")["remove"]();
            });
            $(".head .this-search")["mouseleave"](function () {
                $(".head .this-search-get")["remove"]();
            });
            $(".select-name")["click"](function () {
                if ($(this)["attr"]("data-id") === "1") {
                    $(this)["attr"]("data-id", "0")["children"]()["html"]("&#xe564;");
                    $(".select-list")["show"]();
                } else {
                    $(this)["attr"]("data-id", "1")["children"]()["html"]("&#xe563;");
                    $(".select-list")["hide"]();
                }
            });
            $(".select-list span")["click"](function () {
                let _0xa3ea = $(this)["data"]();
                $(".select-name")["html"](_0xa3ea["name"] + "<i class=\"fa cor4\">&#xe563;</i>")["attr"]("data-id", "1");
                $("#search")["attr"]("action", _0xa3ea["url"]);
                $(".select-list")["hide"]();
            });
            $(".search-input-sub")["click"](function () {
                let _0x4417e1 = $(".search-input")["val"](),
                    _0x1263ee = $("#search")["attr"]("action");
                if (EC["Empty"](_0x4417e1)) {
                    event["preventDefault"]();
                    _EC["Pop"]["Msg"](language["48"], "", "error");
                } else {
                    if ($(".lang-bnt")["length"] === 1) {
                        const _0x432991 = transChinese(_0x4417e1);
                        $(".search-input")["val"](_0x432991);
                        _0x4417e1 = _0x432991;
                    }
                    EC["Records"]["Set"](_0x4417e1, _0x1263ee);
                }
            });
        }
    },
    "Remaining": function (_0x86861b, _0x12c6aa, _0x550a40) {
        let _0x8f7b71 = _0x12c6aa - $(_0x86861b)["val"]()["length"];
        _0x8f7b71 < 0 && (_0x8f7b71 = 0, $(_0x86861b)["val"]($(_0x86861b)["val"]()["substr"](0, 200)));
        $(_0x550a40)["text"](_0x8f7b71);
    },
    "Digg": function () {
        $("body")["on"]("click", ".digg-link", function () {
            let _0x4f9fc1 = $(this);
            if (_0x4f9fc1["attr"]("data-id")) {
                EC["Ajax"](maccms["path"] + "/index.php/ajax/digg.html?mid=" + _0x4f9fc1["attr"]("data-mid") + "&id=" + _0x4f9fc1["attr"]("data-id") + "&type=" + _0x4f9fc1["attr"]("data-type"), "get", "json", "", function (_0x2d3f2c) {
                    _0x4f9fc1["addClass"]("disabled"), Number(_0x2d3f2c["code"]) === 1 ? _0x4f9fc1["attr"]("data-type") === "up" ? _0x4f9fc1["find"](".digg-num")["html"](_0x2d3f2c["data"]["up"]) : _0x4f9fc1["find"](".digg-num")["html"](_0x2d3f2c["data"]["down"]) : _EC["Pop"]["Msg"](_0x2d3f2c["msg"]);
                });
            }
        });
    },
    "Gbook": {
        "Login": 0,
        "Verify": 0,
        "Init": function () {
            let _0x50fb8e = $(".gbook-form")["data"]();
            EC["Gbook"]["Login"] = _0x50fb8e["login"];
            EC["Gbook"]["Verify"] = _0x50fb8e["verify"];
            let _0x39e9a8 = $("body");
            _0x39e9a8["on"]("keyup", ".gbook-content", function () {
                EC["Remaining"]($(this), 200, ".gbook_remaining");
            });
            _0x39e9a8["on"]("focus", ".gbook-content", function () {
                Number(EC["Gbook"]["Login"]) === 1 && Number(EC["User"]["IsLogin"]) !== 1 && EC["User"]["Login"]();
            });
            _0x39e9a8["on"]("click", ".gbook-submit", function () {
                EC["Gbook"]["Submit"]();
            });
        },
        "Show": function (_0xcb4201) {
            EC["Ajax"](maccms["path"] + "/index.php/gbook/index?page=" + _0xcb4201, "post", "json", "", function (_0x521f8b) {
                $(".mac_gbook_box")["html"](_0x521f8b);
            }, function () {
                $(".mac_gbook_box")["html"](language["49"]);
            });
        },
        "Submit": function () {
            if (EC["Empty"]($(".gbook-content")["val"]())) {
                _EC["Pop"]["Msg"](language["50"], "", "error");
                return ![];
            }
            EC["Ajax"](maccms["path"] + "/index.php/gbook/saveData", "post", "json", $(".gbook-form")["serialize"](), function (_0x17f08a) {
                _EC["Pop"]["Msg"](_0x17f08a["msg"]);
                Number(_0x17f08a["code"]) === 1 ? location["reload"]() : Number(EC["Gbook"]["Verify"]) === 1 && EC["Verify"]["Refresh"]();
            });
        },
        "Tg": function () {
            if (EC["Empty"]($(".tg-content")["val"]())) {
                _EC["Pop"]["Msg"](language["51"], "", "error");
                return ![];
            }
            EC["Ajax"](maccms["path"] + "/index.php/api/tougao", "post", "json", $(".tg-form")["serialize"](), function (_0x2a0597) {
                _EC["Pop"]["Msg"](_0x2a0597["msg"]);
                if (Number(_0x2a0597["code"]) === 1) {
                    location["reload"]();
                } else {
                    EC["Verify"]["Refresh"]();
                }
            });
        },
        "Report": function (_0xdf430) {
            EC["Ajax"](maccms["path"] + "/index.php/gbook/report.html?id=" + _0xdf430["id"] + "&name=" + encodeURIComponent(_0xdf430["url"] + location["href"]), "post", "json", "", function (_0x3600d3) {
                EC["Pop"]["Show"](_0x3600d3, language["52"], function () {
                    let _0x295fbd = $(".gbook-form")["data"]();
                    EC["Gbook"]["Login"] = _0x295fbd["login"];
                    EC["Gbook"]["Verify"] = _0x295fbd["verify"];
                    EC["Gbook"]["Init"]();
                });
            }, function () {
                _EC["Pop"]["Msg"](language["49"], "", "error");
            });
        }
    },
    "Comment": {
        "Login": 0,
        "Verify": 0,
        "Init": function () {
            let _0x3cd1ad = $("body");
            _0x3cd1ad["on"]("click", ".comment-face-box img", function () {
                let _0x1e6e65 = $(this)["parent"]()["parent"]()["parent"]()["parent"]()["find"](".comment-content");
                $(_0x1e6e65)["val"]($(_0x1e6e65)["val"]() + "[em:" + $(this)["attr"]("data-id") + "]");
            });
            _0x3cd1ad["on"]("click", ".comment-face-panel", function () {
                $(this)["parent"]()["parent"]()["find"](".comment-face-box")["fadeToggle"]();
            });
            _0x3cd1ad["on"]("click", ".face-close", function () {
                $(".comment-face-box")["hide"]();
            });
            _0x3cd1ad["on"]("click", ".comment-page", function () {
                EC["Comment"]["Show"]($(this)["attr"]("data-page"));
            });
            _0x3cd1ad["on"]("keyup", ".comment-content", function () {
                EC["Remaining"]($(this), 200, $(".comment-remaining"));
            });
            _0x3cd1ad["on"]("focus", ".comment-content", function () {
                Number(EC["Comment"]["Login"]) === 1 && Number(EC["User"]["IsLogin"]) !== 1 && EC["User"]["Login"]();
            });
            _0x3cd1ad["on"]("click", ".comment-report", function () {
                let _0x1646f5 = $(this);
                $(this)["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/comment/report.html?id=" + _0x1646f5["attr"]("data-id"), "get", "json", "", function (_0x11b5e8) {
                    _0x1646f5["addClass"]("disabled");
                    _EC["Pop"]["Msg"](language["53"], "", "success");
                });
            });
            _0x3cd1ad["on"]("click", ".comment-reply-button", function () {
                let _0x5de48f = $(this);
                if (_0x5de48f["attr"]("data-id")) {
                    let _0x368ea3 = _0x5de48f["html"]();
                    $(".comment-reply-form")["remove"]();
                    if (_0x368ea3 === language["54"]) {
                        return _0x5de48f["html"]("&#xe573;"), ![];
                    }
                    let _0x10646f = $(".comment-form")["prop"]("outerHTML"),
                        _0x44e48d = $(_0x10646f);
                    _0x44e48d["addClass"]("comment-reply-form");
                    _0x44e48d["find"]("input[name=\"comment_pid\"]")["val"](_0x5de48f["attr"]("data-id"));
                    _0x5de48f["parent"]()["parent"]()["after"](_0x44e48d);
                    $(".comment-reply-button")["html"]("&#xe573;");
                    _0x5de48f["html"](language["54"]);
                }
            });
            _0x3cd1ad["on"]("click", ".comment-submit", function () {
                let _0x2b87cd = $(this);
                EC["Comment"]["Submit"](_0x2b87cd);
            });
        },
        "Show": function (_0x4dcf24) {
            let _0x469ea9 = $(".ds-comment");
            _0x469ea9["length"] > 0 && EC["Ajax"](maccms["path"] + "/index.php/comment/ajax.html?rid=" + _0x469ea9["attr"]("data-id") + "&mid=" + _0x469ea9["attr"]("data-mid") + "&page=" + _0x4dcf24, "get", "json", "", function (_0x5e6b70) {
                $(".ds-comment")["html"](_0x5e6b70);
                if ($(".lang-bnt")["length"] === 1) {
                    zh_tranBody();
                }
            }, function () {
                _EC["Pop"]["Msg"](language["49"], "", "error");
            });
        },
        "Submit": function (_0x39795c) {
            let _0x172e4f = _0x39795c["parents"]("form");
            if ($(_0x172e4f)["find"](".comment-content")["val"]() === "") {
                _EC["Pop"]["Msg"](language["55"], "", "error");
                return ![];
            }
            let _0x1eabc7 = $(".ds-comment")["data"]();
            if (EC["Empty"](_0x1eabc7["mid"])) {
                _EC["Pop"]["Msg"](language["56"], "", "error");
                return ![];
            }
            if (EC["Empty"](_0x1eabc7["id"])) {
                _EC["Pop"]["Msg"](language["57"], "", "error");
                return ![];
            }
            EC["Ajax"](maccms["path"] + "/index.php/comment/saveData", "post", "json", $(_0x172e4f)["serialize"]() + "&comment_mid=" + _0x1eabc7["mid"] + "&comment_rid=" + _0x1eabc7["id"], function (_0x22a0b5) {
                _EC["Pop"]["Msg"](_0x22a0b5["msg"]);
                Number(_0x22a0b5["code"]) === 1 ? EC["Comment"]["Show"](1) : Number(EC["Comment"]["Verify"]) === 1 && EC["Verify"]["Refresh"]();
            });
        }
    },
    "Verify": {
        "Init": function () {
            EC["Verify"]["Click"]();
            $(".verify-submit")["click"](function () {
                let _0x54427c = $("input[name=\"verify\"]")["val"]();
                EC["Ajax"](maccms["path"] + "/index.php/ajax/verify_check?type=" + $(this)["data"]("type") + "&verify=" + _0x54427c, "post", "json", "", function (_0x347ef9) {
                    if (Number(_0x347ef9["code"]) === 1) {
                        location["reload"]();
                    } else {
                        _EC["Pop"]["Msg"](_0x347ef9["msg"]);
                        EC["Verify"]["Refresh"]();
                    }
                }, function () {
                    _EC["Pop"]["Msg"](language["58"], "", "error"), EC["Verify"]["Refresh"]();
                });
            });
        },
        "Click": function () {
            $("body")["on"]("click", "img.ds-verify-img", function () {
                $(this)["attr"]("src", maccms["path"] + "/index.php/verify/index.html?r=" + Math["random"]());
            });
        },
        "Refresh": function () {
            $(".ds-verify-img")["attr"]("src", maccms["path"] + "/index.php/verify/index.html?r=" + Math["random"]());
        },
        "Show": function () {
            return "<img class=\"ds-verify-img\" src=\"" + maccms["path"] + "/index.php/verify/index.html?\" alt=\"" + language["19"] + "\" title=\"" + language["59"] + "\">";
        }
    },
    "QiAnDao": {
        "Fun": function (_0x4637e3) {
            let _0x14137f = $("#qiAnDao-list"),
                _0x33e7e6 = "",
                _0x5f3e4a = new Date(),
                _0x14607a = new Date(_0x5f3e4a["getFullYear"](), parseInt(_0x5f3e4a["getMonth"]()), 1)["getDay"](),
                _0x364a83 = new Date(_0x5f3e4a["getFullYear"](), parseInt(_0x5f3e4a["getMonth"]() + 1), 0),
                _0x5bf273 = _0x364a83["getDate"]();
            $(".qiAnDao-bj")["text"](_0x5f3e4a["getMonth"]() + 1);
            for (let _0x45366e = 0; _0x45366e < 42; _0x45366e++) {
                _0x33e7e6 += "<li></li>";
            }
            _0x14137f["html"](_0x33e7e6);
            let _0x47de2b = _0x14137f["find"]("li");
            for (let _0x47eb13 = 0; _0x47eb13 < _0x5bf273; _0x47eb13++) {
                let _0x2dc2ad = parseInt(_0x47eb13 + 1);
                _0x47de2b["eq"](_0x47eb13 + _0x14607a)["html"]("<em>" + _0x2dc2ad + "</em>")["addClass"]("date" + _0x2dc2ad);
                if (_0x4637e3["length"] > 0) {
                    for (let _0x54d20c = 0; _0x54d20c < _0x4637e3["length"]; _0x54d20c++) {
                        _0x2dc2ad === _0x4637e3[_0x54d20c] && _0x47de2b["eq"](_0x47eb13 + _0x14607a)["addClass"]("nav-dt");
                    }
                }
            }
            $(".qiAnDao-con")["after"]("<style>#qiAnDao-list li:nth-child(n+" + (_0x5bf273 + _0x14607a + 1) + ") {display: none}</style>")["addClass"]("qiAnDao-show");
            $(".date" + _0x5f3e4a["getDate"]() + ":not(.nav-dt)")["addClass"]("able-qiAnDao");
            $(".qiAnDao-top,.able-qiAnDao")["click"](function () {
                EC["Ajax"](maccms["path"] + "/index.php/qian/sign", "get", "json", "", function (_0x415490) {
                    if (Number(_0x415490["code"]) === 0) {
                        _EC["Pop"]["Msg"](_0x415490["msg"], "", "error");
                    } else {
                        $(".able-qiAnDao")["addClass"]("nav-dt");
                        {
                            _EC["Pop"]["Msg"](language["60"] + _0x415490["reward"], "", "success");
                            $(".qiAnDao-top")["addClass"]("nav-dt");
                        }
                    }
                }, function () {
                    _EC["Pop"]["Msg"](r["msg"], "", "error");
                });
            });
            $(".qiAnDao-gz-bnt")["click"](function () {
                $(".qiAnDao-bottom")["show"]();
            });
            $(".qiAnDao-bottom a")["click"](function () {
                $(".qiAnDao-bottom")["hide"]();
            });
            $(".qiAnDao-gz-off")["click"](function () {
                $(".qiAnDao-con")["hide"]();
            });
        },
        "Init": function () {
            $(".qiAnDao_bnt")["click"](function () {
                if (Number(EC["User"]["IsLogin"]) === 0) {
                    EC["User"]["Login"]();
                    return;
                }
                Number($(".qiAnDao-show")["length"]) === 0 ? ($("#qiAnDao_2,.qiAnDao-top")["hide"](), $("#qiAnDao_1,.qiAnDao-con")["show"](), EC["Ajax"](maccms["path"] + "/index.php/qian/days", "get", "json", "", function (_0x2b7aa2) {
                    Number(_0x2b7aa2["code"]) === 1 ? (EC["QiAnDao"]["Fun"](_0x2b7aa2["data"]), setTimeout(function () {
                        $("#qiAnDao_2,.qiAnDao-top")["show"]();
                        $("#qiAnDao_1")["hide"]();
                    }, 1000)) : ($(".qiAnDao-con")["hide"](), _EC["Pop"]["Msg"](_0x2b7aa2["msg"], "", "error"));
                }, function () {
                    $("#qiAnDao_1")["html"](language["42"]);
                })) : $(".qiAnDao-show")["show"]();
            });
        }
    }
};
;
$(function () {
    EC["Style"]["Init"]();
    EC["Init"]();
    EC["Verify"]["Init"]();
    EC["User"]["Init"]();
    EC["Records"]["Init"]();
    EC["Suggest"]["Init"](".mac_wd", 1, "");
    EC["History"]["Init"]();
    EC["Digg"]();
    EC["Score"]();
    EC["Copy"]["Init"]();
    EC["User"]["Collection"]();
    EC["Ulog"]["Init"]();
    EC["Hits"]["Init"]();
    EC["Toggle"]();
    EC["QiAnDao"]["Init"]();
});