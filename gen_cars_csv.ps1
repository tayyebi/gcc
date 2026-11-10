$cars = @(
    # ===== HYBRID / EV (sorted first) =====
    @{slug="byd-song-pro"; model_fa="بی‌وای‌دی سانگ پرو"; model_en="BYD Song Pro"; brand="BYD"; class="کراس‌اوور"; engine="۱.۵ توربو + برقی"; transmission="اتوماتیک"; fuel="Hybrid (PHEV)"; price="۲۲۰۰۰۰۰۰۰۰"; desc="هیبرید پلاگین"}
    @{slug="byd-seal"; model_fa="بی‌وای‌دی سیل"; model_en="BYD Seal"; brand="BYD"; class="سدان لوکس"; engine="برقی (EV)"; transmission="اتوماتیک"; fuel="EV"; price="۳۵۰۰۰۰۰۰۰۰"; desc="برقی تمام الکتریکی"}
    @{slug="toyota-corolla-hybrid"; model_fa="تویوتا کرولا هیبرید"; model_en="Toyota Corolla Hybrid"; brand="Toyota"; class="سدان کامپکت"; engine="۱.۸ هیبرید"; transmission="اتوماتیک CVT"; fuel="Hybrid"; price="۲۵۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="toyota-rav4-hybrid"; model_fa="تویوتا راو ۴ هیبرید"; model_en="Toyota RAV4 Hybrid"; brand="Toyota"; class="کراس‌اوور"; engine="۲.۵ هیبرید"; transmission="اتوماتیک CVT"; fuel="Hybrid"; price="۳۸۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="hyundai-elantra-hybrid"; model_fa="هیوندای النترا هیبرید"; model_en="Hyundai Elantra Hybrid"; brand="Hyundai"; class="سدان کامپکت"; engine="۱.۶ هیبرید"; transmission="اتوماتیک ۶ دنده"; fuel="Hybrid"; price="۲۳۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="hyundai-santa-fe-hybrid"; model_fa="هیوندای سانتافه هیبرید"; model_en="Hyundai Santa Fe Hybrid"; brand="Hyundai"; class="کراس‌اوور"; engine="۱.۶ توربو هیبرید"; transmission="اتوماتیک ۶ دنده"; fuel="Hybrid"; price="۴۲۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="kia-niro"; model_fa="کیا نیرو"; model_en="Kia Niro"; brand="Kia"; class="کراس‌اوور"; engine="۱.۶ هیبرید / EV"; transmission="اتوماتیک ۶ دنده"; fuel="Hybrid/EV"; price="۲۸۰۰۰۰۰۰۰۰"; desc="هیبرید / برقی"}
    @{slug="mg-zs-ev"; model_fa="ام‌جی ZS EV"; model_en="MG ZS EV"; brand="MG"; class="کراس‌اوور"; engine="برقی (EV)"; transmission="اتوماتیک"; fuel="EV"; price="۲۶۰۰۰۰۰۰۰۰"; desc="برقی تمام الکتریکی"}
    @{slug="fownix-tiggo8-pro-hybrid"; model_fa="فونیکس تیگو ۸ پرو هیبرید"; model_en="Fownix Tiggo 8 Pro Hybrid"; brand="Fownix"; class="کراس‌اوور بزرگ"; engine="۱.۶ توربو هیبرید ملایم"; transmission="اتوماتیک ۷ سرعته"; fuel="Mild Hybrid"; price="۲۹۰۰۰۰۰۰۰۰"; desc="مونتاژ مدیران خودرو"}

    # ===== IKCO Domestic =====
    @{slug="samand"; model_fa="سمند"; model_en="Samand"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ EF7 / XU7"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۴۵۰۰۰۰۰۰۰"; desc="اولین خودروی ملی ایران"}
    @{slug="soren"; model_fa="سمند سورن"; model_en="Soren"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ EF7"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۶۲۰۰۰۰۰۰۰"; desc="نسخه فیس‌لیفت سمند"}
    @{slug="dena"; model_fa="دنا"; model_en="Dena"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ EF7"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۷۰۰۰۰۰۰۰۰"; desc="طراحی ملی + موتور EF7"}
    @{slug="dena-plus"; model_fa="دنا پلاس"; model_en="Dena Plus"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ EF7 TC (توربو)"; transmission="دستی ۶ سرعته"; fuel="Gasoline"; price="۹۵۰۰۰۰۰۰۰"; desc="نسخه ارتقاع‌یافته دنا"}
    @{slug="tara"; model_fa="تارا"; model_en="Tara"; brand="IKCO"; class="سدان کامپکت"; engine="۱.۶ TU5"; transmission="دستی / اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۵۸۰۰۰۰۰۰۰"; desc="بر پایه پلتفرم PF1 پژو"}
    @{slug="reera"; model_fa="ریرا"; model_en="Reera"; brand="IKCO"; class="کراس‌اوور کامپکت"; engine="۱.۶ EC5"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۱۰۰۰۰۰۰۰۰"; desc="اولین کراس‌اوور ملی"}
    @{slug="runna"; model_fa="رانا"; model_en="Runna"; brand="IKCO"; class="هاچ‌بک"; engine="۱.۶ TU5"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۵۲۰۰۰۰۰۰۰"; desc="بر پایه پژو ۲۰۶ صندوقدار"}

    # ===== Peugeot License (IKCO) =====
    @{slug="peugeot-206"; model_fa="پژو ۲۰۶ هاچ‌بک"; model_en="Peugeot 206"; brand="IKCO"; class="هاچ‌بک"; engine="۱.۴ TU3 / ۱.۶ TU5"; transmission="دستی / اتوماتیک آل۴"; fuel="Gasoline"; price="۵۵۰۰۰۰۰۰۰"; desc="محبوب‌ترین هاچ‌بک ایران"}
    @{slug="peugeot-206-sd"; model_fa="پژو ۲۰۶ صندوقدار"; model_en="Peugeot 206 SD"; brand="IKCO"; class="سدان کامپکت"; engine="۱.۶ TU5"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۵۷۰۰۰۰۰۰۰"; desc="نسخه سدان ۲۰۶"}
    @{slug="peugeot-207"; model_fa="پژو ۲۰۷"; model_en="Peugeot 207"; brand="IKCO"; class="هاچ‌بک"; engine="۱.۶ TU5"; transmission="دستی / اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۷۸۰۰۰۰۰۰۰"; desc="فیس‌لیفت ۲۰۶ با ظاهر مدرن"}
    @{slug="peugeot-207-mc"; model_fa="پژو ۲۰۷ MC"; model_en="Peugeot 207 MC"; brand="IKCO"; class="سدان کامپکت"; engine="۱.۶ TU5"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۸۲۰۰۰۰۰۰۰"; desc="نسخه سدان ۲۰۷"}
    @{slug="peugeot-405"; model_fa="پژو ۴۰۵"; model_en="Peugeot 405"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ XU7 / ۲.۰"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۴۸۰۰۰۰۰۰۰"; desc="خودروی کلاسیک و بادوام"}
    @{slug="peugeot-pars"; model_fa="پژو پارس"; model_en="Peugeot Pars"; brand="IKCO"; class="سدان متوسط"; engine="۱.۸ XU7"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۵۳۰۰۰۰۰۰۰"; desc="فیس‌لیفت ۴۰۵"}
    @{slug="peugeot-2008"; model_fa="پژو ۲۰۰۸"; model_en="Peugeot 2008"; brand="IKCO"; class="کراس‌اوور"; engine="۱.۶ TU5"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۱۳۵۰۰۰۰۰۰۰"; desc="مونتاژ محدود"}

    # ===== Haima =====
    @{slug="haima-s5"; model_fa="هایما S5"; model_en="Haima S5"; brand="IKCO"; class="کراس‌اوور"; engine="۱.۵ توربو / ۱.۸"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۹۸۰۰۰۰۰۰۰"; desc="کراس‌اوور محبوب"}
    @{slug="haima-s7"; model_fa="هایما S7"; model_en="Haima S7"; brand="IKCO"; class="کراس‌اوور بزرگ"; engine="۱.۸ توربو / ۲.۰"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۱۴۵۰۰۰۰۰۰۰"; desc="SUV خانوادگی"}
    @{slug="haima-m3"; model_fa="هایما M3"; model_en="Haima M3"; brand="IKCO"; class="سدان کامپکت"; engine="۱.۵"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۶۸۰۰۰۰۰۰۰"; desc="سدان اقتصادی"}
    @{slug="haima-8s"; model_fa="هایما ۸S"; model_en="Haima 8S"; brand="IKCO"; class="کراس‌اوور"; engine="۱.۶ توربو"; transmission="اتوماتیک"; fuel="Gasoline"; price="۱۵۵۰۰۰۰۰۰۰"; desc="مدل جدید"}

    # ===== SAIPA Domestic =====
    @{slug="saipa-pride"; model_fa="سایپا ۱۱۱/۱۳۱/۱۳۲"; model_en="SAIPA Pride"; brand="SAIPA"; class="سدان اقتصادی"; engine="۱.۳ M13"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۲۵۰۰۰۰۰۰۰"; desc="قدیمی‌ترین خودروی فعال سایپا"}
    @{slug="saipa-pride-151"; model_fa="سایپا ۱۵۱"; model_en="SAIPA Pride 151"; brand="SAIPA"; class="وانت بار"; engine="۱.۳ M13"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۳۰۰۰۰۰۰۰۰"; desc="نسخه وانت پراید"}
    @{slug="saina"; model_fa="ساینا"; model_en="SAIPA Saina"; brand="SAIPA"; class="سدان اقتصادی"; engine="۱.۵ M15"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۳۸۰۰۰۰۰۰۰"; desc="ارتقاع‌یافته پراید"}
    @{slug="saina-s"; model_fa="ساینا S"; model_en="SAIPA Saina S"; brand="SAIPA"; class="سدان اقتصادی"; engine="۱.۵ M15"; transmission="دستی"; fuel="Gasoline"; price="۴۱۰۰۰۰۰۰۰"; desc="فیس‌لیفت ساینا"}
    @{slug="quick"; model_fa="کوییک"; model_en="SAIPA Quick"; brand="SAIPA"; class="هاچ‌بک"; engine="۱.۵ M15"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۳۹۰۰۰۰۰۰۰"; desc="نسخه هاچ‌بک ساینا"}
    @{slug="quick-r"; model_fa="کوییک R"; model_en="SAIPA Quick R"; brand="SAIPA"; class="هاچ‌بک اسپرت"; engine="۱.۵ M15"; transmission="دستی"; fuel="Gasoline"; price="۴۳۰۰۰۰۰۰۰"; desc="نسخه اسپرت کوییک"}
    @{slug="quick-g"; model_fa="کوییک G"; model_en="SAIPA Quick G"; brand="SAIPA"; class="کراس‌هاچ‌بک"; engine="۱.۵ M15"; transmission="دستی"; fuel="Gasoline"; price="۴۵۰۰۰۰۰۰۰"; desc="با ظاهر کراس‌اوور"}
    @{slug="shahin"; model_fa="شاهین"; model_en="SAIPA Shahin"; brand="SAIPA"; class="سدان کامپکت"; engine="۱.۵ M15 TC (توربو)"; transmission="دستی / اتوماتیک CVT"; fuel="Gasoline"; price="۶۸۰۰۰۰۰۰۰"; desc="جدیدترین سدان سایپا"}
    @{slug="aria"; model_fa="آریا"; model_en="SAIPA Aria"; brand="SAIPA"; class="سدان کامپکت"; engine="۱.۶"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۶۴۰۰۰۰۰۰۰"; desc="پلتفرم جدید سایپا"}

    # ===== Zamyad =====
    @{slug="zamyad-z24"; model_fa="نیسان زامیاد Z24"; model_en="Zamyad Z24"; brand="Zamyad/SAIPA"; class="وانت بار"; engine="۲.۴"; transmission="دستی ۵ سرعته"; fuel="Gasoline"; price="۴۸۰۰۰۰۰۰۰"; desc="وانت کلاسیک ایران"}
    @{slug="padra"; model_fa="پادرا"; model_en="Zamyad Padra"; brand="Zamyad/SAIPA"; class="وانت دوکابین"; engine="۲.۴"; transmission="دستی"; fuel="Gasoline"; price="۸۵۰۰۰۰۰۰۰"; desc="وانت دوکابین مدرن"}
    @{slug="arisan"; model_fa="زامیاد آریسان"; model_en="Zamyad Arisan"; brand="Zamyad/SAIPA"; class="وانت بار"; engine="۱.۸"; transmission="دستی"; fuel="Gasoline"; price="۳۶۰۰۰۰۰۰۰"; desc="وانت سبک اقتصادی"}

    # ===== Chang'an / Chery =====
    @{slug="changan-cs35"; model_fa="چانگان CS35"; model_en="Changan CS35"; brand="Changan/SAIPA"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۱۱۵۰۰۰۰۰۰۰"; desc="کراس‌اوور محبوب"}
    @{slug="changan-cs35-plus"; model_fa="چانگان CS35 Plus"; model_en="Changan CS35 Plus"; brand="Changan/SAIPA"; class="کراس‌اوور"; engine="۱.۴ توربو"; transmission="اتوماتیک ۷ سرعته"; fuel="Gasoline"; price="۱۳۵۰۰۰۰۰۰۰"; desc="نسخه جدیدتر"}
    @{slug="changan-cs55"; model_fa="چانگان CS55"; model_en="Changan CS55"; brand="Changan/SAIPA"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک"; fuel="Gasoline"; price="۱۵۸۰۰۰۰۰۰۰"; desc="SUV بزرگتر"}
    @{slug="changan-eado"; model_fa="چانگان Eado"; model_en="Changan Eado"; brand="Changan/SAIPA"; class="سدان کامپکت"; engine="۱.۶"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۹۸۰۰۰۰۰۰۰"; desc="سدان چینی"}
    @{slug="chery-tiggo8-pro"; model_fa="چری تیگو ۸ پرو"; model_en="Chery Tiggo 8 Pro"; brand="Chery/SAIPA"; class="کراس‌اوور بزرگ"; engine="۱.۶ توربو"; transmission="اتوماتیک ۷ سرعته"; fuel="Gasoline"; price="۲۱۰۰۰۰۰۰۰۰"; desc="SUV لوکس ۷ نفره"}

    # ===== Bahman Group =====
    @{slug="fidelity"; model_fa="فیدلیتی"; model_en="Fidelity (BAIC X55)"; brand="Bahman Group"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۳۸۰۰۰۰۰۰۰"; desc="BAIC X55 مونتاژی"}
    @{slug="dignity"; model_fa="دیگنیتی"; model_en="Dignity (BAIC)"; brand="Bahman Group"; class="سدان لوکس"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۵۵۰۰۰۰۰۰۰"; desc="سدان چینی لوکس"}
    @{slug="kara"; model_fa="کارا"; model_en="Kara (DFSK)"; brand="Bahman Group"; class="وانت بار"; engine="۱.۵"; transmission="دستی"; fuel="Gasoline"; price="۴۲۰۰۰۰۰۰۰"; desc="وانت اقتصادی"}
    @{slug="azad"; model_fa="آزاد"; model_en="Azad (DFSK)"; brand="Bahman Group"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک"; fuel="Gasoline"; price="۱۲۵۰۰۰۰۰۰۰"; desc="SUV چینی"}

    # ===== MVM =====
    @{slug="mvm-x22"; model_fa="MVM X22"; model_en="MVM X22"; brand="MVM (Modiran Khodro)"; class="کراس‌اوور"; engine="۱.۵"; transmission="دستی / CVT"; fuel="Gasoline"; price="۹۲۰۰۰۰۰۰۰"; desc="جک S3 مونتاژی"}
    @{slug="mvm-x33"; model_fa="MVM X33"; model_en="MVM X33"; brand="MVM (Modiran Khodro)"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۱۰۰۰۰۰۰۰۰"; desc="جک S4"}
    @{slug="mvm-x55"; model_fa="MVM X55"; model_en="MVM X55"; brand="MVM (Modiran Khodro)"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۱۴۲۰۰۰۰۰۰۰"; desc="جک S5"}
    @{slug="mvm-530"; model_fa="MVM 530"; model_en="MVM 530"; brand="MVM (Modiran Khodro)"; class="سدان کامپکت"; engine="۱.۵"; transmission="دستی / CVT"; fuel="Gasoline"; price="۷۵۰۰۰۰۰۰۰"; desc="جک J4"}
    @{slug="mvm-550"; model_fa="MVM 550"; model_en="MVM 550"; brand="MVM (Modiran Khodro)"; class="سدان متوسط"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۹۸۰۰۰۰۰۰۰"; desc="جک J5"}
    @{slug="mvm-315"; model_fa="MVM 315"; model_en="MVM 315"; brand="MVM (Modiran Khodro)"; class="هاچ‌بک"; engine="۱.۳"; transmission="دستی"; fuel="Gasoline"; price="۵۲۰۰۰۰۰۰۰"; desc="جک J3"}

    # ===== Kerman Motors =====
    @{slug="jac-j7"; model_fa="جک J7"; model_en="JAC J7"; brand="Kerman Motors"; class="سدان متوسط"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۳۵۰۰۰۰۰۰۰"; desc="سدان چینی"}
    @{slug="jac-s3"; model_fa="جک S3"; model_en="JAC S3"; brand="Kerman Motors"; class="کراس‌اوور"; engine="۱.۵ / ۱.۶"; transmission="دستی / CVT"; fuel="Gasoline"; price="۸۸۰۰۰۰۰۰۰"; desc="SUV کامپکت"}
    @{slug="jac-t8"; model_fa="جک T8"; model_en="JAC T8"; brand="Kerman Motors"; class="وانت دوکابین"; engine="۲.۰ توربو"; transmission="دستی / اتوماتیک"; fuel="Diesel"; price="۱۴۰۰۰۰۰۰۰۰"; desc="وانت اسپرت"}
    @{slug="kmc-k7"; model_fa="کی ام سی K7"; model_en="KMC K7"; brand="Kerman Motors"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک ۷ سرعته"; fuel="Gasoline"; price="۱۵۸۰۰۰۰۰۰۰"; desc="برند جدید کرمان موتور"}
    @{slug="kmc-t8"; model_fa="کی ام سی T8"; model_en="KMC T8"; brand="Kerman Motors"; class="وانت بار"; engine="۲.۰ توربو"; transmission="دستی / اتوماتیک"; fuel="Diesel"; price="۱۵۰۰۰۰۰۰۰۰"; desc="وانت آفرود"}

    # ===== Imported Brands (as single representative models) =====
    @{slug="toyota-land-cruiser"; model_fa="تویوتا لندکروزر"; model_en="Toyota Land Cruiser"; brand="Toyota"; class="SUV بزرگ"; engine="۴.۰ / ۳.۵ توربو"; transmission="اتوماتیک"; fuel="Gasoline"; price="۸۵۰۰۰۰۰۰۰۰"; desc="وارداتی - حضور محدود"}
    @{slug="toyota-hilux"; model_fa="تویوتا هایلوکس"; model_en="Toyota Hilux"; brand="Toyota"; class="وانت دوکابین"; engine="۲.۸ دیزل / ۴.۰"; transmission="اتوماتیک"; fuel="Diesel/Gasoline"; price="۵۵۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="toyota-corolla"; model_fa="تویوتا کرولا"; model_en="Toyota Corolla"; brand="Toyota"; class="سدان کامپکت"; engine="۱.۸ / ۲.۰"; transmission="اتوماتیک CVT"; fuel="Gasoline/Hybrid"; price="۲۲۰۰۰۰۰۰۰۰"; desc="وارداتی - حضور محدود"}
    @{slug="hyundai-santa-fe"; model_fa="هیوندای سانتافه"; model_en="Hyundai Santa Fe"; brand="Hyundai"; class="کراس‌اوور"; engine="۲.۵ / ۱.۶ توربو هیبرید"; transmission="اتوماتیک ۶/۸ دنده"; fuel="Gasoline/Hybrid"; price="۴۸۰۰۰۰۰۰۰۰"; desc="وارداتی محدود"}
    @{slug="hyundai-tucson"; model_fa="هیوندای توسان"; model_en="Hyundai Tucson"; brand="Hyundai"; class="کراس‌اوور"; engine="۲.۰ / ۱.۶ توربو"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۳۵۰۰۰۰۰۰۰۰"; desc="وارداتی محدود"}
    @{slug="hyundai-elantra"; model_fa="هیوندای النترا"; model_en="Hyundai Elantra"; brand="Hyundai"; class="سدان کامپکت"; engine="۲.۰ / ۱.۶"; transmission="اتوماتیک CVT"; fuel="Gasoline/Hybrid"; price="۲۵۰۰۰۰۰۰۰۰"; desc="وارداتی محدود"}
    @{slug="kia-sportage"; model_fa="کیا اسپورتیج"; model_en="Kia Sportage"; brand="Kia"; class="کراس‌اوور"; engine="۲.۰ / ۱.۶ توربو"; transmission="اتوماتیک ۶/۷ دنده"; fuel="Gasoline"; price="۳۸۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="kia-cerato"; model_fa="کیا سراتو"; model_en="Kia Cerato"; brand="Kia"; class="سدان کامپکت"; engine="۲.۰ / ۱.۶"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۲۲۰۰۰۰۰۰۰۰"; desc="وارداتی"}
    @{slug="nissan-patrol"; model_fa="نیسان پاترول"; model_en="Nissan Patrol"; brand="Nissan"; class="SUV بزرگ"; engine="۴.۰ / ۵.۶"; transmission="اتوماتیک ۷ دنده"; fuel="Gasoline"; price="۸۰۰۰۰۰۰۰۰۰"; desc="وارداتی محدود"}
    @{slug="nissan-x-trail"; model_fa="نیسان ایکس‌تریل"; model_en="Nissan X-Trail"; brand="Nissan"; class="کراس‌اوور"; engine="۲.۵ / ۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline/Hybrid"; price="۳۲۰۰۰۰۰۰۰۰"; desc="وارداتی محدود"}
    @{slug="bmw-x5"; model_fa="BMW X5"; model_en="BMW X5"; brand="BMW"; class="SUV لوکس"; engine="۳.۰ توربو / ۴.۴"; transmission="اتوماتیک ۸ دنده"; fuel="Gasoline/Diesel"; price="۱۲۰۰۰۰۰۰۰۰۰"; desc="از طریق نمایندگی رسمی"}
    @{slug="bmw-series-5"; model_fa="BMW سری ۵"; model_en="BMW 5 Series"; brand="BMW"; class="سدان لوکس"; engine="۲.۰ توربو / ۳.۰ توربو"; transmission="اتوماتیک ۸ دنده"; fuel="Gasoline"; price="۸۵۰۰۰۰۰۰۰۰"; desc="از طریق نمایندگی رسمی"}
    @{slug="mercedes-glc"; model_fa="مرسدس بنز GLC"; model_en="Mercedes-Benz GLC"; brand="Mercedes-Benz"; class="کراس‌اوور لوکس"; engine="۲.۰ توربو"; transmission="اتوماتیک ۹ دنده"; fuel="Gasoline/Diesel"; price="۹۵۰۰۰۰۰۰۰۰"; desc="از طریق نمایندگی رسمی"}
    @{slug="mercedes-e-class"; model_fa="مرسدس بنز کلاس E"; model_en="Mercedes-Benz E-Class"; brand="Mercedes-Benz"; class="سدان لوکس"; engine="۲.۰ توربو / ۳.۰"; transmission="اتوماتیک ۹ دنده"; fuel="Gasoline/Diesel"; price="۹۰۰۰۰۰۰۰۰۰"; desc="از طریق نمایندگی رسمی"}
    @{slug="volvo-xc60"; model_fa="ولوو XC60"; model_en="Volvo XC60"; brand="Volvo"; class="کراس‌اوور لوکس"; engine="۲.۰ توربو"; transmission="اتوماتیک ۸ دنده"; fuel="Gasoline/Hybrid"; price="۷۵۰۰۰۰۰۰۰۰"; desc="از طریق نمایندگی رسمی"}
    @{slug="porsche-cayenne"; model_fa="پورشه کاین"; model_en="Porsche Cayenne"; brand="Porsche"; class="SUV لوکس"; engine="۳.۰ توربو / ۴.۰"; transmission="اتوماتیک ۸ دنده"; fuel="Gasoline/Hybrid"; price="۱۴۰۰۰۰۰۰۰۰۰"; desc="حضور محدود"}
    @{slug="mg5"; model_fa="ام‌جی MG5"; model_en="MG5"; brand="MG"; class="سدان کامپکت"; engine="۱.۵"; transmission="دستی / CVT"; fuel="Gasoline"; price="۱۵۰۰۰۰۰۰۰۰"; desc="واردات توسط مگاموتور"}
    @{slug="mg-gt"; model_fa="ام‌جی MG GT"; model_en="MG GT"; brand="MG"; class="سدان اسپرت"; engine="۱.۵ توربو"; transmission="اتوماتیک ۷ سرعته"; fuel="Gasoline"; price="۱۸۰۰۰۰۰۰۰۰"; desc="واردات توسط مگاموتور"}
    @{slug="fownix-tiggo7-pro"; model_fa="فونیکس تیگو ۷ پرو"; model_en="Fownix Tiggo 7 Pro"; brand="Fownix (Chery)"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۷۰۰۰۰۰۰۰۰"; desc="مونتاژ مدیران خودرو"}
    @{slug="fownix-arrizo6"; model_fa="فونیکس آریزو ۶"; model_en="Fownix Arrizo 6"; brand="Fownix (Chery)"; class="سدان کامپکت"; engine="۱.۵ توربو"; transmission="اتوماتیک CVT"; fuel="Gasoline"; price="۱۳۵۰۰۰۰۰۰۰"; desc="مونتاژ مدیران خودرو"}
    @{slug="geely-coolray"; model_fa="جیلی کولری"; model_en="Geely Coolray"; brand="Geely"; class="کراس‌اوور کامپکت"; engine="۱.۵ توربو"; transmission="اتوماتیک ۷ سرعته"; fuel="Gasoline"; price="۲۰۰۰۰۰۰۰۰۰"; desc="واردات توسط گروه آسا"}
    @{slug="bestune-x55"; model_fa="بستون X55"; model_en="Bestune X55"; brand="Bestune (FAW)"; class="کراس‌اوور"; engine="۱.۵ توربو"; transmission="اتوماتیک ۶ دنده"; fuel="Gasoline"; price="۱۴۵۰۰۰۰۰۰۰"; desc="مونتاژ گروه بهمن"}
    @{slug="dongfeng-h30"; model_fa="دانگ‌فنگ H30"; model_en="Dongfeng H30"; brand="Dongfeng"; class="هاچ‌بک"; engine="۱.۶"; transmission="دستی / اتوماتیک"; fuel="Gasoline"; price="۶۸۰۰۰۰۰۰۰"; desc="مونتاژ ایران"}
)

# Sort: hybrids first (by fuel type containing "Hybrid" or "EV"), then by brand, then by model
$sorted = $cars | Sort-Object @{e={if ($_.fuel -match "Hybrid|EV|Mild Hybrid") {0} else {1}}}, brand, model_en

$csvPath = "C:\Users\Asus\Documents\Iran_Cars_List.csv"
$sorted | Select-Object slug, model_fa, model_en, brand, class, engine, transmission, fuel, factory_price_toman, desc |
    Export-Csv -Path $csvPath -Encoding UTF8 -NoTypeInformation

Write-Host "CSV created: $csvPath"
Write-Host "Total cars: $($sorted.Count)"
Write-Host "Hybrids first: $($sorted | Where-Object { $_.fuel -match 'Hybrid|EV|Mild Hybrid' } | Measure-Object | Select-Object -ExpandProperty Count)"
