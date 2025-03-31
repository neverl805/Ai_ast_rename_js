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
      let currentElementIndex = $(".pop-2 span")["index"](this),
        historyElement = $(".history")["eq"](currentElementIndex);
      historyElement["fadeIn"](800)["siblings"]()["hide"]();
      historyElement["addClass"]("check")["siblings"]()["removeClass"]("check");
      if (EC["Empty"](EC["Cookie"]["Get"]("user_id"))) {
        $(".user-history")["html"](maccms["path2"] + "<div class=\"null cor5\"><img src=\"" + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["0"] + "</span></div>" + "<a href=\"javascript:\" class=\"button top30 head-user\" style=\"width:100%\">" + language["1"] + "</a>");
      } else {
        $(".user-history li")["length"] === 0 && EC["Ajax"](maccms["path"] + "/index.php/api/history", "post", "json", "", function (asyncRequestResult) {
          if (asyncRequestResult["code"] === 1) {
            let historyList = "";
            $["each"](asyncRequestResult["list"], function (historyLoop, currentItem) {
              historyList += currentItem["data"]["link"] + "<li><a class=\"history-a flex\" href=\"" + "\" target=\"video\" title=\"" + currentItem["data"]["name"] + "\"><img class=\"lazy lazy1\" referrerpolicy=\"no-referrer\" alt=\"" + currentItem["data"]["name"] + "\" data-src=\"" + currentItem["data"]["pic"] + "\"/>" + "<div class=\"history-r\"><div class=\"hide2\">" + currentItem["data"]["name"] + "</div><div><span class=\"cor5\">" + currentItem["data"]["type"]["type_name"] + "</span></div></div></a></li>";
            });
            $(".user-history ul")["html"](historyList);
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
    let loadingAnimationContainer = $(".gen-loading"),
      loadingDelay = loadingAnimationContainer["data"]("time");
    setTimeout(function () {
      $(".gen-loading")["fadeOut"]("slow");
    }, loadingDelay);
    $(".head-more-a")["hover"](function () {
      $(".nav-more")["html"]("&#xe564;");
      $(".head-more")["show"]();
    }, function () {
      $(".nav-more")["html"]("&#xe563;");
      $(".head-more")["hide"]();
    });
    let elementIndex = null,
      electedElements = $(".head"),
      profileHistoryData = $(".row-2 .tim-box"),
      currentVideoDetails = null;
    electedElements["length"] > 0 && (elementIndex = electedElements["offset"]()["top"]);
    profileHistoryData["length"] > 0 && (currentVideoDetails = profileHistoryData["eq"](profileHistoryData["length"] - 1)["offset"]()["top"]);
    $(window)["scroll"](EC["debounce"](function () {
      let crollPosition = $(this)["scrollTop"]();
      electedElements["toggleClass"]("head-b", crollPosition > elementIndex)["css"]("position", crollPosition > elementIndex ? "fixed" : "");
      $(".head .left, .head .right")["toggleClass"]("head-b", crollPosition > elementIndex);
      crollPosition > 300 ? $(".top")["fadeIn"](600) : $(".top")["fadeOut"](600);
      if (EC["Width"] > 991) {
        if (crollPosition > currentVideoDetails) {
          profileHistoryData["eq"](profileHistoryData["length"] - 1)["css"]({
            "position": "fixed",
            "top": "100px",
            "width": $(".row-2")["width"]()
          });
        } else {
          profileHistoryData["eq"](profileHistoryData["length"] - 1)["css"]({
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
      electedElements["removeClass"]("head-b")["css"]({
        "position": ""
      });
    });
    if (Number($(".slid-e")["length"]) === 1) {
      let wiperInstance = new Swiper(".swiper3", {
        "loop": !![],
        "slidesPerView": 1,
        "pagination": {
          "el": ".swiper-pagination"
        },
        "on": {
          "slideChangeTransitionStart": function () {
            pauseAllVideos();
            $(".muted")["off"]("click");
            $(".toReplay")["off"]("click");
            $(".slid-e-video")["removeClass"]("v-show");
            $(".slid-e-bj")["removeClass"]("v-hidden");
          },
          "slideChangeTransitionEnd": function () {
            $(".wap-hide")["is"](":hidden") == ![] && EC["isSlid"] && (EC["isSlid"] = ![], setTimeout(function () {
              EC["isSlid"] = !![], isVideoDurationGreaterThanTenSeconds();
            }, 1000));
          }
        }
      });
      function pauseAllVideos() {
        let videoPreviewQueue = Array["from"](document["getElementsByClassName"]("preview"));
        for (let ___i = 0; ___i < videoPreviewQueue["length"]; ___i++) {
          const videoPreview = videoPreviewQueue[___i];
          videoPreview["pause"]();
          videoPreview["currentTime"] = 0;
        }
      }
      let isMuted = 0;
      function isVideoDurationGreaterThanTenSeconds() {
        let videoElement = document["querySelector"](".slid-e")["querySelector"](".swiper-slide-active")["querySelector"]("video"),
          wiperSlide = $(".slid-e .swiper-slide-active");
        if (~~videoElement["duration"] > 10) {
          wiperSlide["find"](".slid-e-video")["addClass"]("v-show");
          wiperSlide["find"](".slid-e-bj")["addClass"]("v-hidden");
          if (videoElement["muted"]) {
            $(".muted .fa")["removeClass"]("ds-shengyin")["addClass"]("ds-liulan");
          } else {
            $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin");
          }
          $(".muted")["click"](function () {
            if (videoElement["muted"]) {
              $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin"), videoElement["muted"] = ![], isMuted = 1;
            } else {
              videoElement["muted"] = !![];
              {
                $(".muted .fa")["removeClass"]("ds-shengyin")["addClass"]("ds-liulan");
                isMuted = 0;
              }
            }
          });
          if (isMuted === 1) {
            $(".muted .fa")["removeClass"]("ds-liulan")["addClass"]("ds-shengyin");
            videoElement["muted"] = ![];
          }
          $(".toReplay")["click"](function () {
            wiperSlide["find"](".slid-e-video")["addClass"]("v-show"), wiperSlide["find"](".slid-e-bj")["addClass"]("v-hidden"), videoElement["currentTime"] = 0, videoElement["play"]();
          });
          videoElement["play"]();
          videoElement["addEventListener"]("ended", function () {
            wiperSlide["find"](".slid-e-video")["removeClass"]("v-show");
            wiperSlide["find"](".slid-e-bj")["removeClass"]("v-hidden");
            wiperInstance["slideNext"]();
          });
        } else {
          setTimeout(function () {
            wiperInstance["slideNext"]();
          }, 6000);
        }
      }
    }
    let userHistoryData = $("#height_limit");
    userHistoryData["height"]() >= 80 && (userHistoryData["addClass"]("occlusion"), $(".text-open")["show"]());
    $(".tim-bnt")["click"](function () {
      userHistoryData["hasClass"]("height_rel") ? ($(".tim-bnt")["html"](language["4"] + "<i class=\"fa r6 ease\">&#xe563;</i>"), userHistoryData["removeClass"]("height_rel"), userHistoryData["addClass"]("occlusion")) : ($(".tim-bnt")["html"](language["4"] + "<i class=\"fa r6 ease\">&#xe564;</i>"), userHistoryData["addClass"]("height_rel"), userHistoryData["removeClass"]("occlusion"));
    });
    EC["Swiper"]["Navs"]();
    EC["Swiper"]["Slide"]();
    EC["Swiper"]["Roll"]();
    EC["Actor"]["Detail"]();
    $(".gen-left-list")["click"](function () {
      let headMoreContent = $(".head-more")["html"](),
        houldApplyBoldStyle = "bold0",
        howNavDrawer = "wap-show1",
        navElement = $(".head-nav");
      navElement["hasClass"]("bold1") && (houldApplyBoldStyle = "bold1");
      navElement["hasClass"]("wap-show0") && (howNavDrawer = "wap-show0");
      EC["Pop"]["Drawer"](houldApplyBoldStyle + "<div class='drawer-nav drawer-scroll " + " " + howNavDrawer + "'><div class='drawer-scroll-list'>" + headMoreContent + "</div></div>", function () {
        let ___htmlContent = $(".gen-account-menu")["html"]();
        $(".drawer-list-box")["prepend"](___htmlContent + "<div class='drawer-menu cor2'>" + "</div>");
      });
    });
    $(".playBut")["click"](function () {
      let videoSource = $(this)["attr"]("data-url");
      $(".play-advance .topfadeInUp")["html"](videoSource + "<video id=\"xkPlayer\" width=\"100%\" height=\"100%\" controls preload=\"auto\" autoplay><source src=\"" + "\" type=\"video/mp4\"></video>");
      $(".play-advance")["show"]();
    });
    $(".play-advance .box-bg,.play-advance .mfp-close")["click"](function () {
      let videoContainer = document["getElementById"]("xkPlayer");
      videoContainer["currentTime"] = 0;
      videoContainer["pause"]();
      $(".play-advance")["hide"]();
      $(".mfp-iframe")["remove"]();
    });
    $(".deployment")["click"](function () {
      let infoParameterContent = $(".info-parameter")["html"]();
      EC["Pop"]["Drawer"](infoParameterContent, function () {
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
      let _currentElement = $(this);
      _currentElement["attr"]("data-id") && confirm(language["6"]) && EC["Ajax"](maccms["path"] + "/index.php/user/ajax_buy_popedom.html?id=" + _currentElement["attr"]("data-id") + "&mid=" + _currentElement["attr"]("data-mid") + "&sid=" + _currentElement["attr"]("data-sid") + "&nid=" + _currentElement["attr"]("data-nid") + "&type=" + _currentElement["attr"]("data-type"), "get", "json", "", function (esponseData) {
        _currentElement["addClass"]("disabled");
        _EC["Pop"]["Msg"](esponseData["msg"]);
        Number(esponseData["code"]) === 1 && top["location"]["reload"]();
        _currentElement["removeClass"]("disabled");
      });
    });
    $("#check")["click"](function () {
      let __currentElement = $(this);
      __currentElement["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/ajax/pwd.html?id=" + __currentElement["attr"]("data-id") + "&mid=" + __currentElement["attr"]("data-mid") + "&type=" + __currentElement["attr"]("data-type") + "&pwd=" + __currentElement["parents"]("form")["find"]("input[name=\"pwd\"]")["val"](), "get", "json", "", function (ajaxResponseCallback) {
        __currentElement["addClass"]("disabled");
        _EC["Pop"]["Msg"](ajaxResponseCallback["msg"]);
        if (Number(ajaxResponseCallback["code"]) === 1) {
          location["reload"]();
        }
        __currentElement["removeClass"]("disabled");
      });
    });
    switch (maccms["aid"]) {
      case "12":
      case "11":
        let dataListElement = $("#dataList");
        if (dataListElement["length"] > 0) {
          let dataTemplate = dataListElement["data"](),
            configurationParameters = {
              "type": dataTemplate["type"],
              "class": dataTemplate["class"],
              "area": dataTemplate["area"],
              "lang": dataTemplate["lang"],
              "version": dataTemplate["version"],
              "state": dataTemplate["state"],
              "letter": dataTemplate["letter"]
            };
          $(".ec-casc-list .swiper-slide")["click"](function () {
            $(this)["addClass"]("nav-dt")["siblings"]()["removeClass"]("nav-dt");
            EC["Swiper"]["Navs"]();
            configurationParameters[$(this)["data"]("type")] = $(this)["data"]("val");
            if (EC["Empty"]($(this)["data"]("type"))) {
              return;
            }
            dataListElement["html"]("");
            HTML["Skeleton"](dataListElement, 3, dataTemplate["tpl"]);
            EC["flow"]["get"](configurationParameters, dataListElement, dataTemplate, function () {});
          });
          $(".site-tabs a")["click"](function () {
            $(this)["addClass"]("active")["siblings"]()["removeClass"]("active");
            if (Number($("#dataList .null")["length"]) === 1) {
              return;
            }
            configurationParameters["by"] = $(this)["data"]("type");
            dataListElement["html"]("");
            HTML["Skeleton"](dataListElement, 3, dataTemplate["tpl"]);
            EC["flow"]["get"](configurationParameters, dataListElement, dataTemplate, function () {});
          });
          HTML["Skeleton"](dataListElement, 3, dataTemplate["tpl"]);
          configurationParameters[$(this)["data"]("type")] = $(this)["data"]("val");
          EC["flow"]["get"](configurationParameters, dataListElement, dataTemplate, function () {});
        }
        break;
      case "14":
      case "104":
      case "15":
        $(".anthology-tab a")["click"](function () {
          $(this)["addClass"]("on nav-dt")["siblings"]()["removeClass"]("on nav-dt");
          let clickIndex = $(".anthology-tab a")["index"](this),
            clickedTab = $(".anthology-list .none")["eq"](clickIndex);
          clickedTab["fadeIn"](800)["siblings"]()["hide"]();
          clickedTab["addClass"]("dx")["siblings"]()["removeClass"]("dx");
          EC["Swiper"]["Navs"]();
        });
        $("#zxdaoxu")["each"](function () {
          $(this)["on"]("click", function (event) {
            event["preventDefault"]();
            $(".dx")["each"](function () {
              let earchResult = $(this)["find"]("li");
              for (let everseSearchCounter = 0, axSearchIndex = earchResult["length"] - 1; everseSearchCounter < axSearchIndex;) {
                let earchCounterClone = earchResult["eq"](everseSearchCounter)["clone"](!![]),
                  _earchResult = earchResult["eq"](axSearchIndex)["replaceWith"](earchCounterClone);
                earchResult["eq"](everseSearchCounter)["replaceWith"](_earchResult);
                ++everseSearchCounter;
                --axSearchIndex;
              }
            });
          });
        });
        $("#role .public-list-box")["click"](function () {
          let currentCardIndex = $(this)["index"](),
            textContent = $("#role .cor5")["eq"](currentCardIndex)["text"](),
            timeTitle = $("#role .time-title")["eq"](currentCardIndex)["text"](),
            lazyClassAttribute = $("#role .lazy")["eq"](currentCardIndex)["data"](),
            cardContent = lazyClassAttribute["text"];
          cardContent["length"] < 1 && (cardContent = language["7"]);
          let cardTemplate = lazyClassAttribute["src"] + "<div class=\"role-card\"><div class=\"card-top flex\"><div class=\"left\"><img class=\"lazy\" src=\"" + "\" alt=\"" + timeTitle + "\"></div>\n" + "<div class=\"right\"><p>" + timeTitle + "</p><p class=\"cor5\">" + textContent + "</p></div></div> \n" + "<div class=\"card-bottom\"><p class=\"card-title\">" + language["8"] + "</p><div class=\"card-text cor5\">" + cardContent + "</div></div></div>";
          EC["Pop"]["Show"](cardTemplate, language["9"], function () {});
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
          let currentElementData = $(this)["data"]();
          EC["Gbook"]["Report"](currentElementData);
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
          $(".player-return .none")["show"](), $(".player-vod-no1")["hide"](), $(".player-vod-no2")["show"](), EC["Ajax"](maccms["path"] + "/index.php/api/actor_vod_player_api?id=" + $(this)["attr"]("data-id"), "get", "json", "", function (ajaxResponseData) {
            if (Number(ajaxResponseData["code"]) === 1) {
              let elementConstructor = "";
              $["each"](ajaxResponseData["list"], function (deadBeef, itemData) {
                elementConstructor = elementConstructor + "<div class=\"public-list-box public-pic-b\"><div class=\"public-list-div\"><a class=\"public-list-exp\" href=\"" + itemData["url"] + "\" title=\"" + itemData["name"] + "\">" + "<img class=\"lazy lazy1 gen-movie-img " + maccms["vod_mask"] + "\" referrerpolicy=\"no-referrer\" alt=\"" + language["10"] + "\" data-src=\"" + itemData["pic"] + "\" /></a>\n" + "<i class=\"collection fa\" data-type=\"2\" data-mid=\"" + maccms["mid"] + "\" data-id=\"" + itemData["id"] + "\">&#xe577;</i></div>\n" + "<div class=\"public-list-button\"><a target=\"_blank\" class=\"time-title hide ft4\" href=\"" + itemData["url"] + "\" title=\"" + itemData["name"] + "\">" + itemData["name"] + "</a></div></div>";
              });
              $(".player-vod-no2")["html"](ajaxResponseData["html"] + "<div class=\"role-card top20\">" + "</div><div class=\"title-m cor4\"><h5>" + language["11"] + "</h5></div><div class=\"flex wrap border-box hide-b-16 wap-diy-vod-a\">" + elementConstructor + "</div>");
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
          let videoPlayerSwitch = $(".line-switch");
          EC["player"]["player_jx"](videoPlayerSwitch["attr"]("data-api"), videoPlayerSwitch["attr"]("data-url"));
          $(".vod-playerUrl")["click"](function () {
            videoPlayerSwitch["html"]("");
            EC["player"]["player_jx"](videoPlayerSwitch["attr"]("data-api"), $(this)["attr"]("data-form"));
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
        let electedElement = $(".ds-comment");
        if (Number(electedElement["length"]) === 1) {
          EC["Comment"]["Init"]();
          {
            EC["Comment"]["Verify"] = electedElement["data"]()["verify"];
            {
              EC["Comment"]["Login"] = electedElement["data"]()["login"];
              EC["Comment"]["Show"](1);
            }
          }
        }
        break;
      case "21":
        let userRole = $("#dataList");
        if (userRole["length"] > 0) {
          let userRoleData = userRole["data"]();
          HTML["Skeleton"](userRole, 3, userRoleData["tpl"]);
          let roleTypeData = {
            "type": userRoleData["type"]
          };
          EC["flow"]["get"](roleTypeData, userRole, userRoleData, function () {
            EC["Swiper"]["Roll"]();
          });
        }
        break;
      case "23":
        let configurationKey = $("#dataList");
        if (configurationKey["length"] > 0) {
          let dataConfig = configurationKey["data"]();
          HTML["Skeleton"](configurationKey, 3, dataConfig["tpl"]);
          let config = {
            "wd": dataConfig["type"],
            "tag": dataConfig["wdtag"]
          };
          EC["flow"]["get"](config, configurationKey, dataConfig, function () {
            EC["Swiper"]["Roll"]();
          });
        }
        break;
      case "84":
        $(".art-so-tag")["click"](function () {
          let _dataListElement = $("#dataList"),
            wiperConfig = _dataListElement["data"]();
          _dataListElement["html"]("");
          HTML["Skeleton"](_dataListElement, 3, wiperConfig["tpl"]);
          let _wiperConfig = {
            "wd": wiperConfig["type"],
            "tag": wiperConfig["wdtag"]
          };
          EC["flow"]["get"](_wiperConfig, _dataListElement, wiperConfig, function () {
            EC["Swiper"]["Roll"]();
          });
        });
        break;
      case "82":
        let dataConfiguration = $("#dataList");
        if (dataConfiguration["length"] > 0) {
          let keletonConfig = dataConfiguration["data"](),
            configuration = {
              "type": keletonConfig["type"]
            };
          $(".ec-casc-list .swiper-slide")["click"](function () {
            $(this)["addClass"]("nav-dt")["siblings"]()["removeClass"]("nav-dt");
            EC["Swiper"]["Navs"]();
            configuration[$(this)["data"]("type")] = $(this)["data"]("val");
            dataConfiguration["html"]("");
            HTML["Skeleton"](dataConfiguration, 3, keletonConfig["tpl"]);
            EC["flow"]["get"](configuration, dataConfiguration, keletonConfig, function () {});
          });
          HTML["Skeleton"](dataConfiguration, 3, keletonConfig["tpl"]);
          configuration[$(this)["data"]("type")] = $(this)["data"]("val");
          EC["flow"]["get"](configuration, dataConfiguration, keletonConfig, function () {});
        }
        break;
      case "302":
        let executeFunctionOnElement = $("#dataList");
        if (executeFunctionOnElement["length"] > 0) {
          let esultVariable = executeFunctionOnElement["data"](),
            wiperSlideData = {};
          $(".ec-casc-list .swiper-slide")["click"](function () {
            $(".swiper-slide")["removeClass"]("nav-dt");
            $(this)["addClass"]("nav-dt");
            EC["Swiper"]["Navs"]();
            wiperSlideData["type"] = $(this)["data"]("id");
            executeFunctionOnElement["html"]("");
            HTML["Skeleton"](executeFunctionOnElement, 3, esultVariable["tpl"]);
            EC["flow"]["get"](wiperSlideData, executeFunctionOnElement, esultVariable, function () {});
          });
          HTML["Skeleton"](executeFunctionOnElement, 3, esultVariable["tpl"]);
          wiperSlideData[$(this)["data"]("type")] = $(this)["data"]("val");
          EC["flow"]["get"](wiperSlideData, executeFunctionOnElement, esultVariable, function () {});
        }
        break;
    }
    Number(maccms["mid"]) === 11 && ($(".web-so-btn")["click"](function () {
      let websiteFilterGridValue = $(".website-val")["val"]();
      websiteFilterGridValue ? window["open"]($(".website-filter-grid .action")["attr"]("data-url") + websiteFilterGridValue) : _EC["Pop"]["Msg"](language["14"], "", "error");
    }), $(".website-filter-grid .icon")["click"](function () {
      $(".website-filter-grid .action")["removeClass"]("action");
      $(this)["addClass"]("action");
    }), $(".togo")["click"](function () {
      let dataId = $(this)["attr"]("data-id"),
        dataMi = $(this)["attr"]("data-mi");
      Number(dataMi) === 1 ? _EC["Pop"]["Msg"](language["15"], "", "error") : EC["Ajax"](maccms["path"] + "/index.php/api/website?id=" + dataId, "get", "json", "", function (esponse) {
        esponse["smg"] === 1 ? EC["Pop"]["Show"](esponse["data"]["website_name"] + "<div class=\"website-title\">" + "</div><div class=\"card-text cor5\"><p>" + esponse["data"]["website_blurb"] + "</p><p>" + esponse["data"]["website_content"] + "</p></div><div class=\"flex website-tag top20\">" + esponse["data"]["website_tag"] + "</div>", language["20"], function () {}) : _EC["Pop"]["Msg"](language["15"], "", "error");
      });
    }), $("#tou_gao")["click"](function () {
      if (Number(EC["User"]["IsLogin"]) === 0) {
        EC["User"]["Login"]();
        return;
      }
      EC["Pop"]["Show"](language["16"] + "<form class=\"tg-form\"><p class=\"cor5 top10\">" + "</p><div class=\"region nav-link textarea border\">\n" + "<textarea class=\"tg-content cor5\" name=\"gbook_content\" style=\"width:100%;height:100%\"></textarea>\n" + "</div><div class=\"flex\"><input type=\"text\" class=\"input bj br cor5\" name=\"verify\" value=\"\" maxlength=\"4\" size=\"20\">\n" + "<img class=\"ds-verify-img\" src=\"/index.php/verify/index.html\" alt=\"" + language["19"] + "\" onclick=\"this.src = this.src+'?'\"></div>\n" + "<input type=\"button\" class=\"tg-submit button top20 submit_btn\" style=\"width:100%\" value=\"" + language["17"] + "\"></form>", language["18"], function () {
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
        "success": function (_esponseData) {
          Number(_esponseData["smg"]) === 1 ? window["location"]["replace"](_esponseData["url"]) : window["location"]["replace"]("https://www.kugou.com/song/#hash=8C1A6044DDF1650A82B42769C47FD645&album_id=501600");
        }
      });
    });
    $(".jp-download")["click"](function () {
      let htmlString = language["21"] + "<p class=\"cor5 top10\">" + "</p><div class=\"region nav-link textarea bj\"><textarea id=\"bar2\" class=\"cor5\" style=\"width:100%;height:100%\">" + language["22"] + "《" + ecData["list"][ecData["playid"]]["name"] + "》" + language["23"] + ecData["list"][ecData["playid"]]["url"] + "</textarea></div>\n" + "<button type=\"button\" class=\"button copyBtn\" style=\"width:100%\" data-clipboard-action=\"copy\" data-clipboard-target=\"#bar2\">" + language["24"] + "</button>";
      EC["Pop"]["Show"](htmlString, language["25"], function () {
        $(document)["on"]("click", ".copyBtn", function () {
          _EC["Pop"]["Msg"](language["26"], "", "success"), $(".window")["remove"]();
        });
      });
    });
    $(".ds-pop")["length"] > 0 && EC["Empty"](EC["Cookie"]["Get"]("ecPopup")) && (EC["Cookie"]["Set"]("ecPopup", 1, 1), $("#notice")["show"](), $("#notice .box-bg,#notice .button")["click"](function () {
      $("#notice")["hide"]();
    }));
    $(".player-switch")["click"](function () {
      let playerSwitchBoxSelector = $(".player");
      playerSwitchBoxSelector["hasClass"]("player-switch-box") ? ($(this)["html"]("&#xe565;"), playerSwitchBoxSelector["removeClass"]("player-switch-box")) : ($(this)["html"]("&#xe566;"), playerSwitchBoxSelector["addClass"]("player-switch-box"));
    });
    const clickedElementIndex = " %c 短" + "视主" + "题 by 草" + "根® %c Q" + "Q6025" + "24950|90625" + "9831（严" + "禁利" + "用主" + "题" + "建设" + "违" + "法" + "网" + "站）";
    console["log"](clickedElementIndex + "\n" + "\n", "color: #fadfa3; background: #030307; padding:5px 0; font-size:18px;", "background: #fadfa3; padding:5px 0; font-size:18px;");
    if ($(".week-title")["length"] > 0) {
      let daysOfWeek = ["一", "二", "三", "四", "五", "六", "日"],
        dayOfWeek = new Date()["getDay"]();
      dayOfWeek === 0 && (dayOfWeek = 7);
      let electedWeekListElement = $(dayOfWeek + "#week-list"),
        electedWeekElements = electedWeekListElement["children"]();
      electedWeekListElement["show"]();
      $(".week-bj")["addClass"](dayOfWeek + "week-");
      $(dayOfWeek + ".week-key")["addClass"]("tim");
      let dataList = $("#dataList"),
        weekData = dataList["data"](),
        currentWeekDetails = {
          "weekday": daysOfWeek[dayOfWeek - 1],
          "num": weekData["num"],
          "by": weekData["by"],
          "type": weekData["type"]
        };
      HTML["Skeleton"](electedWeekElements, 3, "vod");
      processAPIData(currentWeekDetails, electedWeekElements, weekData);
      $(".week-title .week-select a")["click"](function () {
        $(this)["addClass"]("tim")["siblings"]()["removeClass"]("tim");
        let elementData = $(this)["data"]();
        $(".week-bj")["removeClass"]("week-1 week-2 week-3 week-4 week-5 week-6 week-7")["addClass"](elementData["index"] + "week-");
        $(".wow")["hide"]();
        electedWeekListElement = $(elementData["index"] + "#week-list");
        electedWeekListElement["show"]();
        electedWeekElements = electedWeekListElement["children"]();
        if (electedWeekElements["html"]()["length"] > 50) {
          return;
        }
        currentWeekDetails["weekday"] = elementData["val"];
        HTML["Skeleton"](electedWeekElements, 3, "vod");
        processAPIData(currentWeekDetails, electedWeekElements, weekData);
      });
    }
    function processAPIData(a, currentWeekContent, apiEndpointUrl) {
      setTimeout(function () {
        let __erverResponseData = [],
          currentDateTime = Math["round"](new Date() / 1000),
          timeData = a;
        timeData["time"] = currentDateTime;
        timeData["key"] = EC["Md5"](currentDateTime);
        EC["Ajax"](apiEndpointUrl["api"], "post", "json", timeData, function (erverResponseData) {
          if (Number(erverResponseData["code"]) === 1) {
            __erverResponseData = HTML["Art"](erverResponseData, apiEndpointUrl);
            if (EC["flow"]["empty"](erverResponseData["list"]["length"], currentWeekContent)) {
              return;
            }
            currentWeekContent["html"](__erverResponseData["join"](""));
            EC["Init"]["LazyLoad"]["update"]();
            EC["Style"]["Footer"]();
            $(".lang-bnt")["length"] === 1 && zh_tranBody();
          } else {
            if (Number(erverResponseData["code"]) === 2) {
              $(".flow-more")["html"](erverResponseData["msg"]);
            } else {
              _EC["Pop"]["Msg"](language["27"] + erverResponseData["msg"], "", "error");
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
      let themeStyle = $(".theme-style"),
        bodyThemeStyle = EC["Cookie"]["Get"]("ec-wap_style");
      !EC["Empty"](bodyThemeStyle) && ($("body")["attr"]("class", bodyThemeStyle), bodyThemeStyle === "theme1" ? themeStyle["html"]("&#xe574;")["attr"]("data-id", 1) : themeStyle["html"]("&#xe575;")["attr"]("data-id", 2));
      themeStyle["click"](function () {
        EC["Style"]["Switch"](themeStyle);
      });
    },
    "Set": function (cookieValue) {
      EC["Cookie"]["Set"]("ec-wap_style", cookieValue);
    },
    "Switch": function (themeData) {
      let themeSelector = themeData["attr"]("data-id");
      Number(themeSelector) === 1 ? ($("body")["attr"]("class", "theme2"), themeData["html"]("&#xe575;")["attr"]("data-id", 2), EC["Style"]["Set"]("theme2")) : ($("body")["attr"]("class", "theme1"), themeData["html"]("&#xe574;")["attr"]("data-id", 1), EC["Style"]["Set"]("theme1"));
    },
    "Footer": function () {
      $(".footer")["removeClass"]("footerLess");
      $(document["body"])["height"]() < $(window)["height"]() ? $(".footer")["addClass"]("footerLess") : $(".footer")["removeClass"]("footerLess");
    }
  },
  "Cookie": {
    "Set": function (cookiePrefix, cookieData, cookieExpirationTime) {
      let expirationDate = new Date();
      expirationDate["setTime"](expirationDate["getTime"]() + cookieExpirationTime * 24 * 60 * 60 * 1000);
      document["cookie"] = cookiePrefix + "=" + encodeURIComponent(cookieData) + ";path=/;expires=" + expirationDate["toUTCString"]();
    },
    "Get": function (cookieName) {
      let extractedCookieValue = document["cookie"]["match"](new RegExp(cookieName + "(^| )" + "=([^;]*)(;|$)"));
      if (extractedCookieValue != null) {
        return decodeURIComponent(extractedCookieValue[2]);
      }
    },
    "Del": function (cookieToDelete) {
      let currentTime = new Date();
      currentTime["setTime"](currentTime["getTime"]() - 1);
      let _cookieToDelete = this["Get"](cookieToDelete);
      _cookieToDelete != null && (document["cookie"] = cookieToDelete + "=" + encodeURIComponent(_cookieToDelete) + ";path=/;expires=" + currentTime["toUTCString"]());
    }
  },
  "Empty": function (isNullOrEmpty) {
    return isNullOrEmpty == null || isNullOrEmpty === "";
  },
  "debounce": function (executeCallback, debounceDelay) {
    let debounceTimeoutId = null;
    return function () {
      let currentThis = this,
        _arguments = arguments;
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(function () {
        executeCallback["apply"](currentThis, _arguments);
      }, debounceDelay);
    };
  },
  "GoBack": function () {
    let currentWebsiteDomain = document["domain"];
    document["referrer"]["indexOf"](currentWebsiteDomain) > 0 ? history["back"]() : window["location"] = currentWebsiteDomain + "//";
  },
  "Ajax": function (url, httpMethod, esponseType, payload, handleAjaxResponse, errorCallback, callbackFunction) {
    httpMethod = httpMethod || "get";
    esponseType = esponseType || "json";
    payload = payload || "";
    errorCallback = errorCallback || "";
    callbackFunction = callbackFunction || "";
    $["ajax"]({
      "url": url,
      "type": httpMethod,
      "dataType": esponseType,
      "data": payload,
      "timeout": 5000,
      "beforeSend": function (ajaxBeforeSendCallback) {},
      "error": function (handleRequestError, currentCookieExpirationUTCDate, cookieExpirationDate) {
        if (errorCallback) {
          errorCallback(handleRequestError, currentCookieExpirationUTCDate, cookieExpirationDate);
        }
      },
      "success": function (_esponse) {
        handleAjaxResponse(_esponse);
      },
      "complete": function (__esponse, erverResponse) {
        if (callbackFunction) {
          callbackFunction(__esponse, erverResponse);
        }
      }
    });
  },
  "flow": {
    "load": function (elementId) {
      elementId = elementId || {};
      let currentScopeThis = this,
        loadingCount = 0,
        isLazyLoading,
        howLoadingOnScroll,
        timeoutId,
        elemRef = $(elementId["elem"]);
      if (!elemRef[0]) {
        return;
      }
      let crollElement = $(elementId["scrollElem"] || document),
        pixelLimit = elementId["mb"] || 50,
        autoLoadingEnabled = "isAuto" in elementId ? elementId["isAuto"] : !![],
        loadingMoreString = elementId["end"] || language["29"],
        isScrollableElement = elementId["scrollElem"] && elementId["scrollElem"] !== document,
        isLoadingButtonContent = language["30"] + "<i class=\"fa ds-jiantouyou\"></i>",
        loadingIndicator = $(isLoadingButtonContent + "<div class=\"flow-more cor5\"><a href=\"javascript:;\">" + "</a></div>");
      !elemRef["find"](".flow-more")[0] && elemRef["append"](loadingIndicator);
      let howLoadingIndicator = function (wrappingFunction, houldShowLoading) {
          Number(loadingCount) === 1 && $(".flow-more")["siblings"]()["remove"]();
          wrappingFunction = $(wrappingFunction);
          loadingIndicator["before"](wrappingFunction);
          houldShowLoading = Number(houldShowLoading) === 0 ? !![] : null;
          houldShowLoading ? loadingIndicator["html"](loadingMoreString) : loadingIndicator["find"]("a")["html"](isLoadingButtonContent);
          howLoadingOnScroll = houldShowLoading;
          isLazyLoading = null;
          EC["Init"]["LazyLoad"]["update"]();
        },
        triggerLazyLoad = function () {
          isLazyLoading = !![];
          loadingIndicator["find"]("a")["html"](language["31"] + "<i class=\"loading3\"></i>");
          typeof elementId["done"] === "function" && elementId["done"](++loadingCount, howLoadingIndicator, elemRef);
        };
      triggerLazyLoad();
      loadingIndicator["find"]("a")["on"]("click", function () {
        if (howLoadingOnScroll) {
          return;
        }
        isLazyLoading || triggerLazyLoad();
      });
      if (!autoLoadingEnabled) {
        return currentScopeThis;
      }
      crollElement["off"]("scroll");
      crollElement["on"]("scroll", function () {
        let ___currentElement = $(this),
          currentScrollTop = ___currentElement["scrollTop"]();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (howLoadingOnScroll || !elemRef["width"]()) {
          return;
        }
        timeoutId = setTimeout(function () {
          let crollableHeight = isScrollableElement ? ___currentElement["height"]() : $(window)["height"](),
            _crollableHeight = isScrollableElement ? ___currentElement["prop"]("scrollHeight") : document["documentElement"]["scrollHeight"];
          _crollableHeight - currentScrollTop - crollableHeight <= pixelLimit && (isLazyLoading || triggerLazyLoad());
        }, 100);
      });
      return currentScopeThis;
    },
    "empty": function (itemsPerPage, nullElement) {
      if (Number(itemsPerPage) === 0) {
        nullElement["html"](maccms["path2"] + "<div class=\"null cor5\"><img src=\"" + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["32"] + "</span></div>");
        return !![];
      }
      return ![];
    },
    "get": function (parameter, _itemsPerPage, houldLazyLoad, lazyLoadFunction) {
      if (_itemsPerPage["length"] > 0) {
        EC["flow"]["load"]({
          "elem": "#dataList",
          "isAuto": houldLazyLoad["pattern"],
          "end": houldLazyLoad["txt"],
          "done": function (currentPage, contentLoader, isLoading) {
            setTimeout(function () {
              let lazyContentLoader = [],
                currentTimestampSeconds = Math["ceil"](new Date()["getTime"]() / 1000),
                __currentPage = $["extend"](parameter, {
                  "page": currentPage,
                  "time": currentTimestampSeconds,
                  "key": EC["Md5"](currentTimestampSeconds)
                });
              EC["Ajax"](houldLazyLoad["api"], "post", "json", __currentPage, function (_erverResponse) {
                if (Number(_erverResponse["code"]) === 1) {
                  if (EC["flow"]["empty"](_erverResponse["list"]["length"], isLoading)) {
                    return;
                  }
                  lazyContentLoader = HTML["Art"](_erverResponse, houldLazyLoad);
                  contentLoader(lazyContentLoader["join"](""), currentPage < _erverResponse["pagecount"]);
                  lazyLoadFunction();
                  EC["Style"]["Footer"]();
                  $(".lang-bnt")["length"] === 1 && zh_tranBody();
                } else {
                  if (Number(_erverResponse["code"]) === 2) {
                    $(".flow-more")["html"](_erverResponse["msg"]);
                  } else {
                    _EC["Pop"]["Msg"](language["27"] + _erverResponse["msg"], "", "error");
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
        let hareButtonHtml = language["34"] + "<div class=\"cor5 radius\"><span class=\"share-tips\">" + "</span><span id=\"bar\" class=\"share-url bj cor5\">" + window["location"]["href"] + $(document)["attr"]("title") + "</span><button type=\"button\" class=\"share-copy bj2 ho radius copyBtn\" data-clipboard-action=\"copy\" data-clipboard-target=\"#bar\">" + language["35"] + "</button></div>";
        EC["Pop"]["Show"](hareButtonHtml, language["18"], function () {
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
      let clipboardInstance = new ClipboardJS(".CopyUel");
      $(".CopyUel")["click"](function () {
        clipboardInstance["on"]("success", function () {
          _EC["Pop"]["Msg"](language["37"], "", "success");
        });
        clipboardInstance["on"]("error", function () {
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
          function convertQRToBase64PNGURL(qrCanvas) {
            let qrImage = new Image();
            qrImage["src"] = qrCanvas["toDataURL"]("image/png");
            return qrImage;
          }
          let firstCanvasElement = $("canvas")[0],
            qrCanvasImage = convertQRToBase64PNGURL(firstCanvasElement);
          $(this)["next"](".share-pic")["append"](qrCanvasImage);
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
    "Nav": function (wiperMainElement, width, navLeftPosition) {
      if (wiperMainElement["find"](".nav-dt")["length"] > 0) {
        let widthOfA = wiperMainElement["find"](".nav-dt")["outerWidth"](!![]),
          offsetLeft = wiperMainElement["find"](".nav-dt")[0]["offsetLeft"],
          outerWidth = width["parent"]()["outerWidth"](!![]),
          parsedNavLeftPosition = parseInt(navLeftPosition);
        width["transition"](300);
        if (offsetLeft < (outerWidth - parseInt(widthOfA)) / 2) {
          width["transform"]("translate3d(0px,0px,0px)");
        } else {
          if (offsetLeft > parsedNavLeftPosition - (parseInt(widthOfA) + outerWidth) / 2) {
            width["transform"](outerWidth - parsedNavLeftPosition + "translate3d(" + "px,0px,0px)");
          } else {
            width["transform"]((outerWidth - parseInt(widthOfA)) / 2 - offsetLeft + "translate3d(" + "px,0px,0px)");
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
            let lazyPBackground = $(".lazy-p")["eq"](1)["css"]("backgroundImage");
            $(".slide-time-ios")["css"]("backgroundImage", lazyPBackground);
          },
          "slideChangeTransitionEnd": function () {
            let prevLazyBgUrl = $(".lazy-p")["eq"](this["realIndex"] - 1)["css"]("backgroundImage");
            $(".slide-time-ios")["css"]("backgroundImage", prevLazyBgUrl);
          }
        }
      });
      let _wiperInstance = new Swiper(".you-ku", {
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
            appendDivContent();
          }
        }
      });
      $(".slide-nav-list li")["hover"](function () {
        $(this)["addClass"]("on")["siblings"]()["removeClass"]("on");
        {
          _wiperInstance["slideTo"]($(".slide-nav-list li")["index"](this) + 1, 1000, ![]);
          appendDivContent();
        }
      });
      function appendDivContent() {
        let activeSlideContent = $(".slid-g .swiper-slide-active .this-100")["html"]();
        $(".slide-nav-link")["html"](activeSlideContent + "<div class=\"this-100\">" + "</div>");
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
      let ainElements = $(".star-works .actor-api");
      if (ainElements["length"] > 0) {
        if ($(".star-works .public-list-box")["length"] > 0) {
          initializeActorsList($(".star-active")["attr"]("data-actor"));
        } else {
          $(".star-works")["hide"]();
        }
      }
      $(".star-works-top .public-list-box")["click"](function () {
        $(this)["addClass"]("star-active")["siblings"]()["removeClass"]("star-active");
        initializeActorsList($(this)["attr"]("data-actor"));
      });
      function initializeActorsList(actorName) {
        let dynamicStringBuilder = "";
        for (let loopCounter = 0; loopCounter < 9; loopCounter++) {
          dynamicStringBuilder = dynamicStringBuilder + "<div class=\"public-list-box public-pic-b swiper-slide\"><div class=\"public-list-div\">" + "<a class=\"public-list-exp\"><div class=\"lazy box\"><span class=\"loadIcon spin-dot-spin\"><i class=\"spin-dot-item\"></i><i class=\"spin-dot-item\"></i>" + "<i class=\"spin-dot-item\"></i><i class=\"spin-dot-item\"></i></span></div></a></div><div class=\"public-list-button\"><a class=\"time-title box radius\"></a>" + "</div></div>";
        }
        ainElements["html"](dynamicStringBuilder);
        EC["Ajax"](maccms["path"] + "/index.php/api/actor_vod_api?name=" + actorName, "get", "json", "", function (___esponse) {
          if (Number(___esponse["code"]) === 1) {
            dynamicStringBuilder = "";
            $["each"](___esponse["list"], function (_currentItem, __currentItem) {
              dynamicStringBuilder = dynamicStringBuilder + "    <div class=\"public-list-box public-pic-" + ___esponse["ajax"]["vod_pic"] + " swiper-slide\">\n" + "        <div class=\"public-list-div public-list-bj\">\n" + "            <a" + HTML["Target"](___esponse["ajax"]["vod_target"]) + " class=\"public-list-exp\" href=\"" + __currentItem["url"] + "\">\n" + "                <img class=\"lazy lazy1 gen-movie-img " + maccms["vod_mask"] + "\" alt=\"" + __currentItem["name"] + "\" referrerpolicy=\"no-referrer\" data-src=\"" + __currentItem["pic"] + "\" />" + "                <span class=\"public-bg\"></span>\n" + "                <span class=\"public-play\"><i class=\"fa\">&#xe593;</i></span>\n" + "            </a>\n" + "        </div>\n" + "        <div class=\"public-list-button\"><a" + HTML["Target"](___esponse["ajax"]["vod_target"]) + " class=\"time-title ft4 hide\" href=\"" + __currentItem["url"] + "\" title=\"" + __currentItem["name"] + "\">" + __currentItem["name"] + "</a></div>" + "    </div>";
            });
            ainElements["html"](dynamicStringBuilder);
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
    "Drawer": function (rightDrawerContent, onDrawerContentLoaded) {
      if ($(".drawer-list")["length"] > 0) {
        _EC["Pop"]["Msg"](language["40"], "", "error");
        return;
      }
      $("body")["append"]("<div class=\"drawer-list\"><div class=\"drawer-list-bg box-bg ease\" style=\"display:none\"></div><div class=\"drawer-list-box bj3\"></div></div>");
      $(".drawer-list-box")["html"](rightDrawerContent);
      onDrawerContentLoaded();
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
    "Show": function (content, windowTitle, windowHeight) {
      Number($(".window")["length"]) !== 1 && EC["Pop"]["RemoveWin"]();
      $("body")["append"]("<div class=\"window\"><div class=\"box-bg\"></div><div class=\"window-box\"><div class=\"topfadeInUp animated bj3 cor4\"><div class=\"window-title rel\"><h2 class=\"subscript ft4 br\"></h2><a class=\"window-off fa ds-guanbi\"></a></div><div class=\"window-content\"></div></div></div></div>");
      $(".window .subscript")["html"](windowTitle);
      $(".window-content")["html"](content);
      $(".window-box")["addClass"]("window-show");
      $(document)["on"]("click", ".box-bg", function () {
        $(this)["parent"]()["remove"]();
      });
      $(document)["on"]("click", ".window-off", function () {
        $(this)["parent"]()["parent"]()["parent"]()["parent"]()["remove"]();
      });
      windowHeight();
    },
    "RemoveWin": function () {
      $(".window")["remove"]();
    }
  },
  "Toggle": function () {
    $(".switch-button a")["click"](function () {
      $(this)["addClass"]("selected")["siblings"]()["removeClass"]("selected");
      let witchButtonIndex = $(".switch-button a")["index"](this),
        witchCheckboxElement = $(".switch-box .check")["eq"](witchButtonIndex);
      witchCheckboxElement["fadeIn"](800)["siblings"]()["hide"]();
      witchCheckboxElement["addClass"]("selected")["siblings"]()["removeClass"]("selected");
    });
  },
  "player": {
    "player_jx": function (playerId, charIndex) {
      let characterData = {},
        playerIdParts = playerId["split"]("#");
      for (let i = 0; i < playerIdParts["length"]; i++) {
        let playerIdFirstPart = playerIdParts[i]["split"]("$"),
          playerIdString = playerIdFirstPart[1]["split"](",");
        for (let _playerIdString = 0; _playerIdString < playerIdString["length"]; _playerIdString++) {
          characterData["hasOwnProperty"](playerIdString[_playerIdString]) ? characterData[playerIdString[_playerIdString]][Object["keys"](characterData[playerIdString[_playerIdString]])["length"]] = {
            "name": playerIdFirstPart[0],
            "api": playerIdFirstPart[2]
          } : characterData[playerIdString[_playerIdString]] = {
            0: {
              "name": playerIdFirstPart[0],
              "api": playerIdFirstPart[2]
            }
          };
        }
      }
      let characterSkillsHTML = "";
      for (let charDataIterator in characterData) {
        if (charDataIterator == charIndex) {
          let charData = characterData[charDataIterator];
          for (let currentIndex = 0; currentIndex < Object["keys"](charData)["length"]; currentIndex++) {
            if (!EC["Empty"](maccms["jx_index"]) && currentIndex == maccms["jx_index"]) {
              characterSkillsHTML = characterSkillsHTML + "<a class=\"box radius hide border bj2\" href=\"javascript:\" data-api=\"" + charData[currentIndex]["api"] + "\">" + charData[currentIndex]["name"] + "</a>";
            } else {
              characterSkillsHTML = characterSkillsHTML + "<a class=\"box radius hide border\" href=\"javascript:\" data-api=\"" + charData[currentIndex]["api"] + "\">" + charData[currentIndex]["name"] + "</a>";
            }
          }
        }
      }
      characterSkillsHTML["length"] > 1 && $(".line-switch")["html"](characterSkillsHTML);
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
      EC["Ajax"](maccms["path"] + "/index.php/user/ajax_login", "post", "json", "", function (_ajaxResponseCallback) {
        EC["Pop"]["Show"](_ajaxResponseCallback, language["41"], function () {
          $("body")["on"]("click", "#wp-submit", function () {
            $(this)["unbind"]("click");
            EC["Ajax"](maccms["path"] + "/index.php/user/login", "post", "json", $(".login-form")["serialize"](), function (loginResponse) {
              _EC["Pop"]["Msg"](loginResponse["msg"], "", "error");
              Number(loginResponse["code"]) === 1 && location["reload"]();
            });
          });
        });
      }, function () {
        _EC["Pop"]["Msg"](language["42"], "", "error");
      });
    },
    "Logout": function () {
      $(this)["unbind"]("click");
      EC["Ajax"](maccms["path"] + "/index.php/user/logout", "post", "json", "", function (logoutResponse) {
        _EC["Pop"]["Msg"](logoutResponse["msg"]);
        if (Number(logoutResponse["code"]) === 1) {
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
        let dataIdElement = $(this);
        dataIdElement["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/user/ajax_ulog/?ac=set&mid=" + dataIdElement["attr"]("data-mid") + "&id=" + dataIdElement["attr"]("data-id") + "&type=" + dataIdElement["attr"]("data-type"), "get", "json", "", function () {
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
      let dsLogSet = $(".ds-log-set");
      dsLogSet["attr"]("data-mid") && $["get"](maccms["path"] + "/index.php/api/ulog/?ac=set&mid=" + dsLogSet["attr"]("data-mid") + "&id=" + dsLogSet["attr"]("data-id") + "&sid=" + dsLogSet["attr"]("data-sid") + "&nid=" + dsLogSet["attr"]("data-nid") + "&type=" + dsLogSet["attr"]("data-type"));
    }
  },
  "Hits": {
    "Init": function () {
      let dsHitsElement = $(".ds-hits");
      if (Number(dsHitsElement["length"]) === 0) {
        return;
      }
      EC["Ajax"](maccms["path"] + "/index.php/ajax/hits?mid=" + dsHitsElement["attr"]("data-mid") + "&id=" + dsHitsElement["attr"]("data-id") + "&type=update", "get", "json", "", function (____esponse) {
        Number(____esponse["code"]) === 1 && $(".ds-hits")["each"](function (domIterator) {
          let dataTypeId = $(".ds-hits")["eq"](domIterator)["attr"]("data-type");
          dataTypeId !== "insert" && $(dataTypeId + ".")["html"](eval(dataTypeId + "(r.data." + ")"));
        });
      });
    }
  },
  "Md5": function (d5Input) {
    return hex_md5(d5Input + "DS" + EC["Pop"]["Uid"]);
  },
  "Score": function () {
    let isRatingComplete = 0;
    $(document)["on"]("click", "#rating li", function () {
      if (isRatingComplete > 0) {
        _EC["Pop"]["Msg"](language["43"]);
      } else {
        let ratingData = $("#rating")["data"]();
        EC["Ajax"](maccms["path"] + "/index.php/ajax/score?mid=" + ratingData["mid"] + "&id=" + ratingData["id"] + "&score=" + $(this)["attr"]("val") * 2, "post", "json", "", function (__erverResponse) {
          _EC["Pop"]["Msg"](__erverResponse["msg"]);
          isRatingComplete = 1;
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
    "Init": function (userId, _userId) {
      if (Number(maccms["so_off"]) === 1) {
        try {
          $(userId)["autocomplete"](maccms["path"] + "/index.php/ajax/suggest?mid=" + _userId, {
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
            "parse": function (uggestParseVariable) {
              if (Number(uggestParseVariable["code"]) === 1) {
                let uggestionsData = [];
                $["each"](uggestParseVariable["list"], function (uggestionsArray, uggestionsIndex) {
                  uggestionsIndex["url"] = uggestParseVariable["url"];
                  uggestionsData[uggestionsArray] = {
                    "data": uggestionsIndex
                  };
                });
                return uggestionsData;
              } else {
                return {
                  "data": ""
                };
              }
            },
            "formatItem": function (uggestedUsername) {
              return uggestedUsername["name"];
            },
            "formatResult": function (formattedResult) {
              return formattedResult["text"];
            }
          })["result"](function (uggestResult, uggestedUser) {
            $(userId)["val"](uggestedUser["name"]);
            let usernameUrl = uggestedUser["url"]["replace"]("mac_wd", encodeURIComponent(uggestedUser["name"]));
            EC["Records"]["Set"](uggestedUser["name"], usernameUrl);
            location["href"] = usernameUrl;
          });
        } catch (errorIdentifier) {}
      }
    }
  },
  "History": {
    "BoxShow": 0,
    "Limit": 30,
    "Days": 7,
    "Json": "",
    "Msg": maccms["path2"] + "<div class=\"null cor5\"><img src=\"" + "static/ds3/img/null.png\" alt=\"" + language["2"] + "\"><span>" + language["45"] + "</span></div>",
    "Init": function () {
      let dataSource = [];
      if (this["Json"]) {
        dataSource = this["Json"];
      } else {
        let acHistory = EC["Cookie"]["Get"]("mac_history");
        !EC["Empty"](acHistory) && (dataSource = eval(acHistory));
      }
      let historyContent = "";
      if (dataSource["length"] > 0) {
        for (let _i = 0; _i < dataSource["length"]; _i++) {
          historyContent += dataSource[_i]["link"] + "<li><a class=\"history-a flex\" href=\"" + "\" target=\"video\" title=\"" + dataSource[_i]["name"] + "\"><img class=\"lazy lazy1\" referrerpolicy=\"no-referrer\" alt=\"" + dataSource[_i]["name"] + "\" data-src=\"" + dataSource[_i]["pic"] + "\"/>" + "<div class=\"history-r\"><div class=\"hide2\">" + dataSource[_i]["name"] + "</div><div><span class=\"cor5\">" + dataSource[_i]["mid"] + "</span></div></div></a></li>";
        }
      } else {
        historyContent += this["Msg"];
      }
      $(".locality-history ul")["html"](historyContent);
      $("#l_history")["click"](function () {
        EC["History"]["Clear"]();
      });
      let dsHistorySet = $(".ds-history-set");
      dsHistorySet["attr"]("data-name") && EC["History"]["Set"](dsHistorySet["attr"]("data-name"), dsHistorySet["attr"]("data-link"), dsHistorySet["attr"]("data-pic"), dsHistorySet["attr"]("data-mid"));
    },
    "Set": function (userNickname, linkUrl, avatarPicUrl, userMid) {
      if (!linkUrl) {
        linkUrl = document["URL"];
      }
      let cookieParser = EC["Cookie"]["Get"]("mac_history"),
        userInfo = "";
      if (!EC["Empty"](cookieParser)) {
        this["Json"] = eval(cookieParser);
        for (let ____i = 0; ____i < this["Json"]["length"]; ____i++) {
          if (this["Json"][____i]["link"] === linkUrl) {
            return ![];
          }
        }
        userInfo = userNickname + "{log:[{\"name\":\"" + "\",\"link\":\"" + linkUrl + "\",\"pic\":\"" + avatarPicUrl + "\",\"mid\":\"" + userMid + "\"},";
        for (let index = 0; index < this["Json"]["length"]; index++) {
          if (index <= this["Limit"] && this["Json"][index]) {
            let userName = this["Json"][index]["name"];
            if (userName === userNickname) {} else {
              userInfo += this["Json"][index]["name"] + "{\"name\":\"" + "\",\"link\":\"" + this["Json"][index]["link"] + "\",\"pic\":\"" + this["Json"][index]["pic"] + "\",\"mid\":\"" + this["Json"][index]["mid"] + "\"},";
            }
          } else {
            break;
          }
        }
        userInfo = userInfo["substring"](0, userInfo["lastIndexOf"](","));
        userInfo += "]}";
      } else {
        userInfo = userNickname + "{log:[{\"name\":\"" + "\",\"link\":\"" + linkUrl + "\",\"pic\":\"" + avatarPicUrl + "\",\"mid\":\"" + userMid + "\"}]}";
      }
      this["Json"] = eval(userInfo);
      EC["Cookie"]["Set"]("mac_history", userInfo, this["Days"]);
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
      let ecordList = [];
      if (this["Json"]) {
        ecordList = this["Json"];
      } else {
        let dsRecordsCookie = EC["Cookie"]["Get"]("DS_Records");
        !EC["Empty"](dsRecordsCookie) && (ecordList = eval(dsRecordsCookie));
      }
      if (ecordList["length"] > 0) {
        let __htmlContent = "";
        for (let __i = 0; __i < ecordList["length"]; __i++) {
          __htmlContent += ecordList[__i]["url"] + "<a href=\"" + "?wd=" + ecordList[__i]["name"] + "\" class=\"public-list-b bj border\">" + ecordList[__i]["name"] + "</a>";
        }
        $(".records-list")["html"](__htmlContent);
      } else {
        $(".records-list")["html"](language["46"] + "<span class=\"cor5\">" + "</span>");
      }
      $(document)["on"]("click", "#re_del", function () {
        EC["Records"]["Clear"]();
      });
    },
    "Set": function (ecordName, ecordLinkUrl) {
      let DSRecordsCookie = EC["Cookie"]["Get"]("DS_Records"),
        collectionData = {};
      if (!EC["Empty"](DSRecordsCookie)) {
        this["Json"] = eval(DSRecordsCookie);
        for (let loopIndex = 0; loopIndex < this["Json"]["length"]; loopIndex++) {
          if (this["Json"][loopIndex]["name"] === ecordName) {
            return ![];
          }
        }
        collectionData = ecordName + "{log:[{\"name\":\"" + "\",\"url\":\"" + ecordLinkUrl + "\"},";
        for (let processJson = 0; processJson < this["Json"]["length"]; processJson++) {
          if (processJson <= this["Limit"] && this["Json"][processJson]) {
            let jsonObjectName = this["Json"][processJson]["name"];
            if (jsonObjectName === ecordName) {} else {
              collectionData += this["Json"][processJson]["name"] + "{\"name\":\"" + "\",\"url\":\"" + this["Json"][processJson]["url"] + "\"},";
            }
          } else {
            break;
          }
        }
        collectionData = collectionData["substring"](0, collectionData["lastIndexOf"](","));
        collectionData += "]}";
      } else {
        collectionData = ecordName + "{log:[{\"name\":\"" + "\",\"url\":\"" + ecordLinkUrl + "\"}]}";
      }
      this["Json"] = eval(collectionData);
      EC["Cookie"]["Set"]("DS_Records", collectionData, this["Days"]);
    },
    "Clear": function () {
      EC["Cookie"]["Del"]("DS_Records");
      $(".records-list")["html"](language["47"] + "<span class=\"cor5\">" + "</span>");
    },
    "Click": function () {
      $(".head .this-select")["click"](function () {
        if ($(this)["attr"]("data-id") === "1") {
          $(this)["attr"]("data-id", "0")["find"]("i")["html"]("&#xe564;");
          let easeElements = $(".select-list .ease")["html"]();
          $(".head .this-search")["append"](easeElements + "<div class=\"this-search-select bj radius br cor4\">" + "</div>");
        } else {
          $(this)["attr"]("data-id", "1")["find"]("i")["html"]("&#xe563;");
          $(".head .this-search-select")["remove"]();
        }
      });
      $("body")["on"]("click", ".head .this-search-select span", function () {
        let __earchResult = $(this)["data"]();
        $(".head .this-select")["html"](__earchResult["name"] + "<i class=\"fa\">&#xe563;</i>")["attr"]("data-id", "1");
        $("#search2")["attr"]("action", __earchResult["url"]);
        $(".head .this-search-select")["remove"]();
      });
      $(".head .this-search .ds-sousuo")["click"](function () {
        let thisInputValue = $(".head .this-input")["val"](),
          earch2Action = $("#search2")["attr"]("action");
        if (EC["Empty"](thisInputValue)) {
          event["preventDefault"](), _EC["Pop"]["Msg"](language["48"], "", "error");
        } else {
          if ($(".lang-bnt")["length"] === 1) {
            const transChineseValue = transChinese(thisInputValue);
            $(".head .this-input")["val"](transChineseValue);
            thisInputValue = transChineseValue;
          }
          EC["Records"]["Set"](thisInputValue, earch2Action);
        }
      });
      $(".head .this-input")["click"](function () {
        let _htmlContent = $(".public-list-new")["html"](),
          wapDiyoVodEContent = $(".pop-list-body .wap-diy-vod-e")["html"]();
        $(".head .this-search")["append"]("<div class=\"this-search-get\"><div class=\"box radius\">" + "<div>" + _htmlContent + "</div>" + "<div class=\"wap-diy-vod-e search-hot\">" + wapDiyoVodEContent + "</div>" + "</div></div>");
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
        let ________erverResponse = $(this)["data"]();
        $(".select-name")["html"](________erverResponse["name"] + "<i class=\"fa cor4\">&#xe563;</i>")["attr"]("data-id", "1");
        $("#search")["attr"]("action", ________erverResponse["url"]);
        $(".select-list")["hide"]();
      });
      $(".search-input-sub")["click"](function () {
        let earchInput = $(".search-input")["val"](),
          earchAction = $("#search")["attr"]("action");
        if (EC["Empty"](earchInput)) {
          event["preventDefault"]();
          _EC["Pop"]["Msg"](language["48"], "", "error");
        } else {
          if ($(".lang-bnt")["length"] === 1) {
            const chineseToEnglishSearchResult = transChinese(earchInput);
            $(".search-input")["val"](chineseToEnglishSearchResult);
            earchInput = chineseToEnglishSearchResult;
          }
          EC["Records"]["Set"](earchInput, earchAction);
        }
      });
    }
  },
  "Remaining": function (truncatedTextContent, originalContent, truncatedContentElementId) {
    let contentLengthAdjustment = originalContent - $(truncatedTextContent)["val"]()["length"];
    contentLengthAdjustment < 0 && (contentLengthAdjustment = 0, $(truncatedTextContent)["val"]($(truncatedTextContent)["val"]()["substr"](0, 200)));
    $(truncatedContentElementId)["text"](contentLengthAdjustment);
  },
  "Digg": function () {
    $("body")["on"]("click", ".digg-link", function () {
      let currentDOMElement = $(this);
      if (currentDOMElement["attr"]("data-id")) {
        EC["Ajax"](maccms["path"] + "/index.php/ajax/digg.html?mid=" + currentDOMElement["attr"]("data-mid") + "&id=" + currentDOMElement["attr"]("data-id") + "&type=" + currentDOMElement["attr"]("data-type"), "get", "json", "", function (_____esponse) {
          currentDOMElement["addClass"]("disabled"), Number(_____esponse["code"]) === 1 ? currentDOMElement["attr"]("data-type") === "up" ? currentDOMElement["find"](".digg-num")["html"](_____esponse["data"]["up"]) : currentDOMElement["find"](".digg-num")["html"](_____esponse["data"]["down"]) : _EC["Pop"]["Msg"](_____esponse["msg"]);
        });
      }
    });
  },
  "Gbook": {
    "Login": 0,
    "Verify": 0,
    "Init": function () {
      let internalData = $(".gbook-form")["data"]();
      EC["Gbook"]["Login"] = internalData["login"];
      EC["Gbook"]["Verify"] = internalData["verify"];
      let body = $("body");
      body["on"]("keyup", ".gbook-content", function () {
        EC["Remaining"]($(this), 200, ".gbook_remaining");
      });
      body["on"]("focus", ".gbook-content", function () {
        Number(EC["Gbook"]["Login"]) === 1 && Number(EC["User"]["IsLogin"]) !== 1 && EC["User"]["Login"]();
      });
      body["on"]("click", ".gbook-submit", function () {
        EC["Gbook"]["Submit"]();
      });
    },
    "Show": function (currentPageGBook) {
      EC["Ajax"](maccms["path"] + "/index.php/gbook/index?page=" + currentPageGBook, "post", "json", "", function (gBookResponse) {
        $(".mac_gbook_box")["html"](gBookResponse);
      }, function () {
        $(".mac_gbook_box")["html"](language["49"]);
      });
    },
    "Submit": function () {
      if (EC["Empty"]($(".gbook-content")["val"]())) {
        _EC["Pop"]["Msg"](language["50"], "", "error");
        return ![];
      }
      EC["Ajax"](maccms["path"] + "/index.php/gbook/saveData", "post", "json", $(".gbook-form")["serialize"](), function (gbookResponse) {
        _EC["Pop"]["Msg"](gbookResponse["msg"]);
        Number(gbookResponse["code"]) === 1 ? location["reload"]() : Number(EC["Gbook"]["Verify"]) === 1 && EC["Verify"]["Refresh"]();
      });
    },
    "Tg": function () {
      if (EC["Empty"]($(".tg-content")["val"]())) {
        _EC["Pop"]["Msg"](language["51"], "", "error");
        return ![];
      }
      EC["Ajax"](maccms["path"] + "/index.php/api/tougao", "post", "json", $(".tg-form")["serialize"](), function (______esponse) {
        _EC["Pop"]["Msg"](______esponse["msg"]);
        if (Number(______esponse["code"]) === 1) {
          location["reload"]();
        } else {
          EC["Verify"]["Refresh"]();
        }
      });
    },
    "Report": function (currentReportData) {
      EC["Ajax"](maccms["path"] + "/index.php/gbook/report.html?id=" + currentReportData["id"] + "&name=" + encodeURIComponent(currentReportData["url"] + location["href"]), "post", "json", "", function (_erverResponseData) {
        EC["Pop"]["Show"](_erverResponseData, language["52"], function () {
          let gbookFormData = $(".gbook-form")["data"]();
          EC["Gbook"]["Login"] = gbookFormData["login"];
          EC["Gbook"]["Verify"] = gbookFormData["verify"];
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
      let bodyjQuery = $("body");
      bodyjQuery["on"]("click", ".comment-face-box img", function () {
        let commentContentRef = $(this)["parent"]()["parent"]()["parent"]()["parent"]()["find"](".comment-content");
        $(commentContentRef)["val"]($(commentContentRef)["val"]() + "[em:" + $(this)["attr"]("data-id") + "]");
      });
      bodyjQuery["on"]("click", ".comment-face-panel", function () {
        $(this)["parent"]()["parent"]()["find"](".comment-face-box")["fadeToggle"]();
      });
      bodyjQuery["on"]("click", ".face-close", function () {
        $(".comment-face-box")["hide"]();
      });
      bodyjQuery["on"]("click", ".comment-page", function () {
        EC["Comment"]["Show"]($(this)["attr"]("data-page"));
      });
      bodyjQuery["on"]("keyup", ".comment-content", function () {
        EC["Remaining"]($(this), 200, $(".comment-remaining"));
      });
      bodyjQuery["on"]("focus", ".comment-content", function () {
        Number(EC["Comment"]["Login"]) === 1 && Number(EC["User"]["IsLogin"]) !== 1 && EC["User"]["Login"]();
      });
      bodyjQuery["on"]("click", ".comment-report", function () {
        let currentJQueryElement = $(this);
        $(this)["attr"]("data-id") && EC["Ajax"](maccms["path"] + "/index.php/comment/report.html?id=" + currentJQueryElement["attr"]("data-id"), "get", "json", "", function (commentReportResponse) {
          currentJQueryElement["addClass"]("disabled");
          _EC["Pop"]["Msg"](language["53"], "", "success");
        });
      });
      bodyjQuery["on"]("click", ".comment-reply-button", function () {
        let currentElement = $(this);
        if (currentElement["attr"]("data-id")) {
          let htmlContent = currentElement["html"]();
          $(".comment-reply-form")["remove"]();
          if (htmlContent === language["54"]) {
            return currentElement["html"]("&#xe573;"), ![];
          }
          let commentFormOuterHTML = $(".comment-form")["prop"]("outerHTML"),
            outerHTML = $(commentFormOuterHTML);
          outerHTML["addClass"]("comment-reply-form");
          outerHTML["find"]("input[name=\"comment_pid\"]")["val"](currentElement["attr"]("data-id"));
          currentElement["parent"]()["parent"]()["after"](outerHTML);
          $(".comment-reply-button")["html"]("&#xe573;");
          currentElement["html"](language["54"]);
        }
      });
      bodyjQuery["on"]("click", ".comment-submit", function () {
        let ____currentElement = $(this);
        EC["Comment"]["Submit"](____currentElement);
      });
    },
    "Show": function (_currentPage) {
      let commentContainer = $(".ds-comment");
      commentContainer["length"] > 0 && EC["Ajax"](maccms["path"] + "/index.php/comment/ajax.html?rid=" + commentContainer["attr"]("data-id") + "&mid=" + commentContainer["attr"]("data-mid") + "&page=" + _currentPage, "get", "json", "", function (___erverResponse) {
        $(".ds-comment")["html"](___erverResponse);
        if ($(".lang-bnt")["length"] === 1) {
          zh_tranBody();
        }
      }, function () {
        _EC["Pop"]["Msg"](language["49"], "", "error");
      });
    },
    "Submit": function (ubmitCommentForm) {
      let parentForm = ubmitCommentForm["parents"]("form");
      if ($(parentForm)["find"](".comment-content")["val"]() === "") {
        _EC["Pop"]["Msg"](language["55"], "", "error");
        return ![];
      }
      let commentData = $(".ds-comment")["data"]();
      if (EC["Empty"](commentData["mid"])) {
        _EC["Pop"]["Msg"](language["56"], "", "error");
        return ![];
      }
      if (EC["Empty"](commentData["id"])) {
        _EC["Pop"]["Msg"](language["57"], "", "error");
        return ![];
      }
      EC["Ajax"](maccms["path"] + "/index.php/comment/saveData", "post", "json", $(parentForm)["serialize"]() + "&comment_mid=" + commentData["mid"] + "&comment_rid=" + commentData["id"], function (____erverResponse) {
        _EC["Pop"]["Msg"](____erverResponse["msg"]);
        Number(____erverResponse["code"]) === 1 ? EC["Comment"]["Show"](1) : Number(EC["Comment"]["Verify"]) === 1 && EC["Verify"]["Refresh"]();
      });
    }
  },
  "Verify": {
    "Init": function () {
      EC["Verify"]["Click"]();
      $(".verify-submit")["click"](function () {
        let erifyValue = $("input[name=\"verify\"]")["val"]();
        EC["Ajax"](maccms["path"] + "/index.php/ajax/verify_check?type=" + $(this)["data"]("type") + "&verify=" + erifyValue, "post", "json", "", function (_____erverResponse) {
          if (Number(_____erverResponse["code"]) === 1) {
            location["reload"]();
          } else {
            _EC["Pop"]["Msg"](_____erverResponse["msg"]);
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
      return maccms["path"] + "<img class=\"ds-verify-img\" src=\"" + "/index.php/verify/index.html?\" alt=\"" + language["19"] + "\" title=\"" + language["59"] + "\">";
    }
  },
  "QiAnDao": {
    "Fun": function (commentContent) {
      let jqueryObj = $("#qiAnDao-list"),
        listStructure = "",
        currentSystemDate = new Date(),
        dayOfMonth = new Date(currentSystemDate["getFullYear"](), parseInt(currentSystemDate["getMonth"]()), 1)["getDay"](),
        onthStart = new Date(currentSystemDate["getFullYear"](), parseInt(currentSystemDate["getMonth"]() + 1), 0),
        currentDayMonth = onthStart["getDate"]();
      $(".qiAnDao-bj")["text"](currentSystemDate["getMonth"]() + 1);
      for (let loopVariable = 0; loopVariable < 42; loopVariable++) {
        listStructure += "<li></li>";
      }
      jqueryObj["html"](listStructure);
      let liElements = jqueryObj["find"]("li");
      for (let currentMonthDay = 0; currentMonthDay < currentDayMonth; currentMonthDay++) {
        let onthDay = parseInt(currentMonthDay + 1);
        liElements["eq"](currentMonthDay + dayOfMonth)["html"](onthDay + "<em>" + "</em>")["addClass"](onthDay + "date");
        if (commentContent["length"] > 0) {
          for (let commentContentLength = 0; commentContentLength < commentContent["length"]; commentContentLength++) {
            onthDay === commentContent[commentContentLength] && liElements["eq"](currentMonthDay + dayOfMonth)["addClass"]("nav-dt");
          }
        }
      }
      $(".qiAnDao-con")["after"](currentDayMonth + dayOfMonth + 1 + "<style>#qiAnDao-list li:nth-child(n+" + ") {display: none}</style>")["addClass"]("qiAnDao-show");
      $(currentSystemDate["getDate"]() + ".date" + ":not(.nav-dt)")["addClass"]("able-qiAnDao");
      $(".qiAnDao-top,.able-qiAnDao")["click"](function () {
        EC["Ajax"](maccms["path"] + "/index.php/qian/sign", "get", "json", "", function (______erverResponse) {
          if (Number(______erverResponse["code"]) === 0) {
            _EC["Pop"]["Msg"](______erverResponse["msg"], "", "error");
          } else {
            $(".able-qiAnDao")["addClass"]("nav-dt");
            {
              _EC["Pop"]["Msg"](language["60"] + ______erverResponse["reward"], "", "success");
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
        Number($(".qiAnDao-show")["length"]) === 0 ? ($("#qiAnDao_2,.qiAnDao-top")["hide"](), $("#qiAnDao_1,.qiAnDao-con")["show"](), EC["Ajax"](maccms["path"] + "/index.php/qian/days", "get", "json", "", function (_______erverResponse) {
          Number(_______erverResponse["code"]) === 1 ? (EC["QiAnDao"]["Fun"](_______erverResponse["data"]), setTimeout(function () {
            $("#qiAnDao_2,.qiAnDao-top")["show"]();
            $("#qiAnDao_1")["hide"]();
          }, 1000)) : ($(".qiAnDao-con")["hide"](), _EC["Pop"]["Msg"](_______erverResponse["msg"], "", "error"));
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